import Array "mo:core/Array";
import Char "mo:core/Char";
import List "mo:core/List";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";

actor {
  let accessControlState : AccessControl.AccessControlState;
  include MixinAuthorization(accessControlState, null);

  // Types

  type Subject = {
    #Mathematics;
    #Science;
    #History;
    #English;
    #ComputerScience;
    #Art;
    #Music;
    #Languages;
    #Economics;
    #Philosophy;
    #Other;
  };

  type SortBy = { #Newest; #MostUpvoted; #RecentlyUpdated };

  type UserProfile = {
    name : Text;
    createdAt : Int;
  };

  type Note = {
    id : Nat;
    author : Principal;
    title : Text;
    description : Text;
    content : Text;
    subject : Subject;
    tags : [Text];
    createdAt : Int;
    updatedAt : Int;
  };

  type NoteResponse = {
    id : Nat;
    author : Principal;
    authorName : Text;
    title : Text;
    description : Text;
    content : Text;
    subject : Subject;
    tags : [Text];
    createdAt : Int;
    updatedAt : Int;
    upvoteCount : Nat;
    isUpvotedByMe : Bool;
    isBookmarkedByMe : Bool;
  };

  type NoteListItem = {
    id : Nat;
    author : Principal;
    authorName : Text;
    title : Text;
    description : Text;
    subject : Subject;
    tags : [Text];
    createdAt : Int;
    updatedAt : Int;
    upvoteCount : Nat;
    isUpvotedByMe : Bool;
    isBookmarkedByMe : Bool;
  };

  type NoteListResult = {
    notes : [NoteListItem];
    nextCursor : ?Nat;
  };

  type ProfileWithStats = {
    name : Text;
    createdAt : Int;
    noteCount : Nat;
    totalUpvotesReceived : Nat;
  };

  // State

  let userProfiles : Map.Map<Principal, UserProfile>;
  let notes : Map.Map<Nat, Note>;
  let noteUpvoters : Map.Map<Nat, Map.Map<Principal, ()>>;
  let userBookmarks : Map.Map<Principal, Map.Map<Nat, ()>>;
  let userNoteCounts : Map.Map<Principal, Nat>;
  var nextNoteId : Nat;

  // Helpers

  func requireAuth(caller : Principal) {
    if (caller.isAnonymous()) {
      Runtime.trap("Not authenticated");
    };
  };

  func upvoteCount(noteId : Nat) : Nat {
    switch (noteUpvoters.get(noteId)) {
      case (?m) { m.size() };
      case (null) { 0 };
    };
  };

  func hasUpvoted(noteId : Nat, caller : Principal) : Bool {
    switch (noteUpvoters.get(noteId)) {
      case (?m) { m.get(caller) != null };
      case (null) { false };
    };
  };

  func hasBookmarked(noteId : Nat, caller : Principal) : Bool {
    switch (userBookmarks.get(caller)) {
      case (?m) { m.get(noteId) != null };
      case (null) { false };
    };
  };

  func buildNoteListItem(note : Note, caller : Principal) : NoteListItem {
    let authorName = switch (userProfiles.get(note.author)) {
      case (?p) { p.name };
      case (null) { "Unknown" };
    };
    {
      id = note.id;
      author = note.author;
      authorName;
      title = note.title;
      description = note.description;
      subject = note.subject;
      tags = note.tags;
      createdAt = note.createdAt;
      updatedAt = note.updatedAt;
      upvoteCount = upvoteCount(note.id);
      isUpvotedByMe = if (caller.isAnonymous()) { false } else {
        hasUpvoted(note.id, caller);
      };
      isBookmarkedByMe = if (caller.isAnonymous()) { false } else {
        hasBookmarked(note.id, caller);
      };
    };
  };

  func buildNoteResponse(note : Note, caller : Principal) : NoteResponse {
    let authorName = switch (userProfiles.get(note.author)) {
      case (?p) { p.name };
      case (null) { "Unknown" };
    };
    {
      id = note.id;
      author = note.author;
      authorName;
      title = note.title;
      description = note.description;
      content = note.content;
      subject = note.subject;
      tags = note.tags;
      createdAt = note.createdAt;
      updatedAt = note.updatedAt;
      upvoteCount = upvoteCount(note.id);
      isUpvotedByMe = if (caller.isAnonymous()) { false } else {
        hasUpvoted(note.id, caller);
      };
      isBookmarkedByMe = if (caller.isAnonymous()) { false } else {
        hasBookmarked(note.id, caller);
      };
    };
  };

  func newestFirst(a : Note, b : Note) : { #less; #equal; #greater } {
    if (a.createdAt > b.createdAt) { #less } else if (a.createdAt < b.createdAt) {
      #greater;
    } else { #equal };
  };

  func mostUpvotedFirst(a : Note, b : Note) : { #less; #equal; #greater } {
    let ca = upvoteCount(a.id);
    let cb = upvoteCount(b.id);
    if (ca > cb) { #less } else if (ca < cb) { #greater } else { #equal };
  };

  func recentlyUpdatedFirst(a : Note, b : Note) : { #less; #equal; #greater } {
    if (a.updatedAt > b.updatedAt) { #less } else if (a.updatedAt < b.updatedAt) {
      #greater;
    } else { #equal };
  };

  func sortFn(sort : SortBy) : (Note, Note) -> { #less; #equal; #greater } {
    switch (sort) {
      case (#Newest) { newestFirst };
      case (#MostUpvoted) { mostUpvotedFirst };
      case (#RecentlyUpdated) { recentlyUpdatedFirst };
    };
  };

  func collectAndPaginate(
    filter : Note -> Bool,
    sort : SortBy,
    cursor : ?Nat,
    limit : Nat,
    caller : Principal,
  ) : NoteListResult {
    let safeLimit = if (limit > 100) { 100 } else { limit };
    let list = List.empty<Note>();
    for ((_, note) in notes.entries()) {
      if (filter(note)) {
        list.add(note);
      };
    };
    list.sortInPlace(sortFn(sort));
    let arr = list.toArray();
    let total = arr.size();
    let startIdx = switch (cursor) {
      case (null) { 0 };
      case (?c) { if (c < total) { c } else { total } };
    };
    let endIdx = if (startIdx + safeLimit < total) { startIdx + safeLimit } else {
      total;
    };
    let count = if (endIdx > startIdx) { (endIdx - startIdx : Nat) } else { 0 };
    let slice = Array.tabulate(
      count,
      func(i) {
        buildNoteListItem(arr[startIdx + i], caller);
      },
    );
    let nextCursor = if (endIdx < total) { ?(endIdx) } else { null };
    { notes = slice; nextCursor };
  };

  func charToLower(c : Char) : Char {
    let n = c.toNat32();
    if (n >= 65 and n <= 90) {
      Char.fromNat32(n + 32);
    } else { c };
  };

  func lowerText(t : Text) : Text {
    t.map(charToLower);
  };

  func noteMatchesSearch(note : Note, searchQuery : Text) : Bool {
    let q = lowerText(searchQuery);
    if (q.size() == 0) {
      true;
    } else {
      let titleMatch = lowerText(note.title).contains(#text q);
      let descMatch = lowerText(note.description).contains(#text q);
      var tagMatch = false;
      for (tag in note.tags.vals()) {
        if (lowerText(tag).contains(#text q)) {
          tagMatch := true;
        };
      };
      titleMatch or descMatch or tagMatch;
    };
  };

  func ensureUpvoters(noteId : Nat) : Map.Map<Principal, ()> {
    switch (noteUpvoters.get(noteId)) {
      case (?m) { m };
      case (null) {
        let m = Map.empty<Principal, ()>();
        noteUpvoters.add(noteId, m);
        m;
      };
    };
  };

  func ensureBookmarks(user : Principal) : Map.Map<Nat, ()> {
    switch (userBookmarks.get(user)) {
      case (?m) { m };
      case (null) {
        let m = Map.empty<Nat, ()>();
        userBookmarks.add(user, m);
        m;
      };
    };
  };

  func hasNonWhitespace(t : Text) : Bool {
    var found = false;
    for (c in t.chars()) {
      if (c != ' ' and c != '\t' and c != '\n' and c != '\r') {
        found := true;
      };
    };
    found;
  };

  func validateNote(title : Text, description : Text, content : Text, tags : [Text]) {
    if (title.size() == 0 or title.size() > 200) {
      Runtime.trap("Title must be 1-200 characters");
    };
    if (not hasNonWhitespace(title)) {
      Runtime.trap("Title cannot be blank");
    };
    if (description.size() > 500) {
      Runtime.trap("Description must be 500 characters or fewer");
    };
    if (content.size() == 0 or content.size() > 50000) {
      Runtime.trap("Content must be 1-50000 characters");
    };
    if (not hasNonWhitespace(content)) {
      Runtime.trap("Content cannot be blank");
    };
    if (tags.size() > 10) {
      Runtime.trap("Maximum 10 tags allowed");
    };
    let seenTags : Map.Map<Text, ()> = Map.empty();
    for (tag in tags.vals()) {
      if (tag.size() == 0 or tag.size() > 50) {
        Runtime.trap("Each tag must be 1-50 characters");
      };
      if (not hasNonWhitespace(tag)) {
        Runtime.trap("Tags cannot be blank");
      };
      if (seenTags.get(tag) != null) {
        Runtime.trap("Duplicate tags are not allowed");
      };
      seenTags.add(tag, ());
    };
  };

  // Endpoints

  // Profile

  public query ({ caller }) func getProfile() : async ?UserProfile {
    requireAuth(caller);
    userProfiles.get(caller);
  };

  public shared ({ caller }) func setProfile(name : Text) : async () {
    requireAuth(caller);
    if (name.size() == 0 or name.size() > 100) {
      Runtime.trap("Name must be 1-100 characters");
    };
    if (not hasNonWhitespace(name)) {
      Runtime.trap("Name cannot be blank");
    };
    let now = Time.now();
    switch (userProfiles.get(caller)) {
      case (?existing) {
        userProfiles.add(caller, { name; createdAt = existing.createdAt });
      };
      case (null) {
        userProfiles.add(caller, { name; createdAt = now });
      };
    };
  };

  public query func getUserProfile(principal : Principal) : async ?ProfileWithStats {
    switch (userProfiles.get(principal)) {
      case (null) { null };
      case (?profile) {
        var noteCount = 0;
        var totalUpvotes = 0;
        for ((_, note) in notes.entries()) {
          if (note.author == principal) {
            noteCount += 1;
            totalUpvotes += upvoteCount(note.id);
          };
        };
        ?{
          name = profile.name;
          createdAt = profile.createdAt;
          noteCount;
          totalUpvotesReceived = totalUpvotes;
        };
      };
    };
  };

  // Note CRUD

  public shared ({ caller }) func createNote(
    title : Text,
    description : Text,
    content : Text,
    subject : Subject,
    tags : [Text],
  ) : async Nat {
    requireAuth(caller);
    let normalizedTags = Array.tabulate(tags.size(), func(i) { lowerText(tags[i]) });
    validateNote(title, description, content, normalizedTags);
    let currentCount = switch (userNoteCounts.get(caller)) {
      case (?n) { n };
      case (null) { 0 };
    };
    if (currentCount >= 500) {
      Runtime.trap("Maximum 500 notes per user");
    };
    let now = Time.now();
    let id = nextNoteId;
    nextNoteId += 1;
    notes.add(
      id,
      {
        id;
        author = caller;
        title;
        description;
        content;
        subject;
        tags = normalizedTags;
        createdAt = now;
        updatedAt = now;
      },
    );
    userNoteCounts.add(caller, currentCount + 1);
    id;
  };

  public shared ({ caller }) func updateNote(
    id : Nat,
    title : Text,
    description : Text,
    content : Text,
    subject : Subject,
    tags : [Text],
  ) : async () {
    requireAuth(caller);
    let normalizedTags = Array.tabulate(tags.size(), func(i) { lowerText(tags[i]) });
    validateNote(title, description, content, normalizedTags);
    switch (notes.get(id)) {
      case (null) { Runtime.trap("Note not found") };
      case (?note) {
        if (note.author != caller) {
          Runtime.trap("Not authorized to edit this note");
        };
        notes.add(
          id,
          {
            id = note.id;
            author = note.author;
            title;
            description;
            content;
            subject;
            tags = normalizedTags;
            createdAt = note.createdAt;
            updatedAt = Time.now();
          },
        );
      };
    };
  };

  public shared ({ caller }) func deleteNote(id : Nat) : async () {
    requireAuth(caller);
    switch (notes.get(id)) {
      case (null) { Runtime.trap("Note not found") };
      case (?note) {
        if (note.author != caller) {
          Runtime.trap("Not authorized to delete this note");
        };
        notes.remove(id);
        noteUpvoters.remove(id);
        // Orphaned bookmark entries are filtered lazily in getBookmarks
        switch (userNoteCounts.get(note.author)) {
          case (?n) {
            if (n > 0) { userNoteCounts.add(note.author, (n - 1 : Nat)) };
          };
          case (null) {};
        };
      };
    };
  };

  public query ({ caller }) func getNote(id : Nat) : async ?NoteResponse {
    switch (notes.get(id)) {
      case (null) { null };
      case (?note) { ?buildNoteResponse(note, caller) };
    };
  };

  // Browse

  public query ({ caller }) func getAllNotes(cursor : ?Nat, limit : Nat, sort : SortBy) : async NoteListResult {
    collectAndPaginate(func(_) { true }, sort, cursor, limit, caller);
  };

  public query ({ caller }) func getNotesBySubject(subject : Subject, cursor : ?Nat, limit : Nat, sort : SortBy) : async NoteListResult {
    collectAndPaginate(func(note) { note.subject == subject }, sort, cursor, limit, caller);
  };

  public query ({ caller }) func getUserNotes(principal : Principal, cursor : ?Nat, limit : Nat) : async NoteListResult {
    collectAndPaginate(func(note) { note.author == principal }, #Newest, cursor, limit, caller);
  };

  // Search

  public query ({ caller }) func searchNotes(searchQuery : Text, subject : ?Subject, cursor : ?Nat, limit : Nat) : async NoteListResult {
    collectAndPaginate(
      func(note) {
        let subjectMatch = switch (subject) {
          case (null) { true };
          case (?s) { note.subject == s };
        };
        subjectMatch and noteMatchesSearch(note, searchQuery);
      },
      #Newest,
      cursor,
      limit,
      caller,
    );
  };

  public query ({ caller }) func getNotesByTag(tag : Text, cursor : ?Nat, limit : Nat) : async NoteListResult {
    let tagLower = lowerText(tag);
    collectAndPaginate(
      func(note) {
        var found = false;
        for (t in note.tags.vals()) {
          if (lowerText(t) == tagLower) {
            found := true;
          };
        };
        found;
      },
      #Newest,
      cursor,
      limit,
      caller,
    );
  };

  public query func getPopularTags(limit : Nat) : async [Text] {
    let tagCounts : Map.Map<Text, Nat> = Map.empty();
    for ((_, note) in notes.entries()) {
      for (tag in note.tags.vals()) {
        let lower = lowerText(tag);
        let count = switch (tagCounts.get(lower)) {
          case (?c) { c };
          case (null) { 0 };
        };
        tagCounts.add(lower, count + 1);
      };
    };
    let tagList = List.empty<(Text, Nat)>();
    for ((tag, count) in tagCounts.entries()) {
      tagList.add((tag, count));
    };
    tagList.sortInPlace(
      func(a, b) {
        if (a.1 > b.1) { #less } else if (a.1 < b.1) { #greater } else {
          #equal;
        };
      }
    );
    let arr = tagList.toArray();
    let resultSize = if (limit < arr.size()) { limit } else { arr.size() };
    Array.tabulate(resultSize, func(i) { arr[i].0 });
  };

  // Upvotes

  public shared ({ caller }) func upvoteNote(id : Nat) : async () {
    requireAuth(caller);
    switch (notes.get(id)) {
      case (null) { Runtime.trap("Note not found") };
      case (?note) {
        if (note.author == caller) {
          Runtime.trap("Cannot upvote your own note");
        };
        let upvoters = ensureUpvoters(id);
        upvoters.add(caller, ());
      };
    };
  };

  public shared ({ caller }) func removeUpvote(id : Nat) : async () {
    requireAuth(caller);
    if (notes.get(id) == null) {
      Runtime.trap("Note not found");
    };
    switch (noteUpvoters.get(id)) {
      case (null) { () };
      case (?upvoters) { upvoters.remove(caller) };
    };
  };

  // Bookmarks

  public shared ({ caller }) func bookmarkNote(id : Nat) : async () {
    requireAuth(caller);
    switch (notes.get(id)) {
      case (null) { Runtime.trap("Note not found") };
      case (?_) {
        let bookmarks = ensureBookmarks(caller);
        bookmarks.add(id, ());
      };
    };
  };

  public shared ({ caller }) func removeBookmark(id : Nat) : async () {
    requireAuth(caller);
    switch (userBookmarks.get(caller)) {
      case (null) { () };
      case (?bookmarks) { bookmarks.remove(id) };
    };
  };

  public query ({ caller }) func getBookmarks(cursor : ?Nat, limit : Nat) : async NoteListResult {
    requireAuth(caller);
    let safeLimit = if (limit > 100) { 100 } else { limit };
    let bookmarkedIds = switch (userBookmarks.get(caller)) {
      case (?m) { m };
      case (null) { Map.empty<Nat, ()>() };
    };
    let list = List.empty<Note>();
    for ((id, _) in bookmarkedIds.entries()) {
      switch (notes.get(id)) {
        case (?note) { list.add(note) };
        case (null) {}; // orphaned bookmark — note was deleted
      };
    };
    list.sortInPlace(newestFirst);
    let arr = list.toArray();
    let total = arr.size();
    let startIdx = switch (cursor) {
      case (null) { 0 };
      case (?c) { if (c < total) { c } else { total } };
    };
    let endIdx = if (startIdx + safeLimit < total) { startIdx + safeLimit } else {
      total;
    };
    let count = if (endIdx > startIdx) { (endIdx - startIdx : Nat) } else { 0 };
    let slice = Array.tabulate(
      count,
      func(i) {
        buildNoteListItem(arr[startIdx + i], caller);
      },
    );
    let nextCursor = if (endIdx < total) { ?(endIdx) } else { null };
    { notes = slice; nextCursor };
  };

  public query ({ caller }) func getBookmarkIds() : async [Nat] {
    requireAuth(caller);
    switch (userBookmarks.get(caller)) {
      case (null) { [] };
      case (?bookmarks) {
        let list = List.empty<Nat>();
        for ((id, _) in bookmarks.entries()) {
          list.add(id);
        };
        list.toArray();
      };
    };
  };

  // Subject counts (for filter bar badges)

  public query func getSubjectCounts() : async [(Subject, Nat)] {
    var mathCount = 0;
    var scienceCount = 0;
    var historyCount = 0;
    var englishCount = 0;
    var csCount = 0;
    var artCount = 0;
    var musicCount = 0;
    var langCount = 0;
    var econCount = 0;
    var philoCount = 0;
    var otherCount = 0;
    for ((_, note) in notes.entries()) {
      switch (note.subject) {
        case (#Mathematics) { mathCount += 1 };
        case (#Science) { scienceCount += 1 };
        case (#History) { historyCount += 1 };
        case (#English) { englishCount += 1 };
        case (#ComputerScience) { csCount += 1 };
        case (#Art) { artCount += 1 };
        case (#Music) { musicCount += 1 };
        case (#Languages) { langCount += 1 };
        case (#Economics) { econCount += 1 };
        case (#Philosophy) { philoCount += 1 };
        case (#Other) { otherCount += 1 };
      };
    };
    [
      (#Mathematics, mathCount),
      (#Science, scienceCount),
      (#History, historyCount),
      (#English, englishCount),
      (#ComputerScience, csCount),
      (#Art, artCount),
      (#Music, musicCount),
      (#Languages, langCount),
      (#Economics, econCount),
      (#Philosophy, philoCount),
      (#Other, otherCount),
    ];
  };

};
