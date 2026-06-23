import Array "mo:core/Array";
import Char "mo:core/Char";
import List "mo:core/List";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";

// Generated initial migration: seeds all stable actor state on a fresh
// install. Actor type definitions are inlined so this frozen chain entry
// does not drift if the actor's types change in a later version.
module {
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

  public func migration(_ : {}) : {
    accessControlState : AccessControl.AccessControlState;
    userProfiles : Map.Map<Principal, UserProfile>;
    notes : Map.Map<Nat, Note>;
    noteUpvoters : Map.Map<Nat, Map.Map<Principal, ()>>;
    userBookmarks : Map.Map<Principal, Map.Map<Nat, ()>>;
    userNoteCounts : Map.Map<Principal, Nat>;
    var nextNoteId : Nat;
  } {
    {
      accessControlState = AccessControl.initState();
      userProfiles = Map.empty();
      notes = Map.empty();
      noteUpvoters = Map.empty();
      userBookmarks = Map.empty();
      userNoteCounts = Map.empty();
      var nextNoteId = 0;
    };
  };
};
