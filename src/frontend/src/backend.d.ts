import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface NoteListResult {
    notes: Array<NoteListItem>;
    nextCursor?: bigint;
}
export interface NoteResponse {
    id: bigint;
    title: string;
    isUpvotedByMe: boolean;
    content: string;
    upvoteCount: bigint;
    subject: Subject;
    isBookmarkedByMe: boolean;
    createdAt: bigint;
    tags: Array<string>;
    authorName: string;
    description: string;
    author: Principal;
    updatedAt: bigint;
}
export interface NoteListItem {
    id: bigint;
    title: string;
    isUpvotedByMe: boolean;
    upvoteCount: bigint;
    subject: Subject;
    isBookmarkedByMe: boolean;
    createdAt: bigint;
    tags: Array<string>;
    authorName: string;
    description: string;
    author: Principal;
    updatedAt: bigint;
}
export type Result = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: Error_;
};
export interface ProfileWithStats {
    name: string;
    createdAt: bigint;
    noteCount: bigint;
    totalUpvotesReceived: bigint;
}
export type Error_ = {
    __kind__: "FrontendOriginsNotConfigured";
    FrontendOriginsNotConfigured: null;
} | {
    __kind__: "MixedSsoSources";
    MixedSsoSources: {
        otherKeys: Array<string>;
        ssoKeys: Array<string>;
    };
} | {
    __kind__: "Stale";
    Stale: {
        ageNs: bigint;
    };
} | {
    __kind__: "MalformedCandid";
    MalformedCandid: null;
} | {
    __kind__: "AmbiguousAttribute";
    AmbiguousAttribute: {
        field: string;
        sources: Array<string>;
    };
} | {
    __kind__: "NoAttributes";
    NoAttributes: null;
} | {
    __kind__: "UnknownNonce";
    UnknownNonce: null;
} | {
    __kind__: "UntrustedSsoSource";
    UntrustedSsoSource: {
        domain: string;
    };
} | {
    __kind__: "MissingField";
    MissingField: string;
} | {
    __kind__: "FrontendOriginMismatch";
    FrontendOriginMismatch: {
        got: string;
        expected: Array<string>;
    };
};
export interface UserProfile {
    name: string;
    createdAt: bigint;
}
export enum SortBy {
    RecentlyUpdated = "RecentlyUpdated",
    MostUpvoted = "MostUpvoted",
    Newest = "Newest"
}
export enum Subject {
    Art = "Art",
    Economics = "Economics",
    History = "History",
    ComputerScience = "ComputerScience",
    Mathematics = "Mathematics",
    Music = "Music",
    Philosophy = "Philosophy",
    English = "English",
    Science = "Science",
    Other = "Other",
    Languages = "Languages"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    bookmarkNote(id: bigint): Promise<void>;
    createNote(title: string, description: string, content: string, subject: Subject, tags: Array<string>): Promise<bigint>;
    deleteNote(id: bigint): Promise<void>;
    getAllNotes(cursor: bigint | null, limit: bigint, sort: SortBy): Promise<NoteListResult>;
    getBookmarkIds(): Promise<Array<bigint>>;
    getBookmarks(cursor: bigint | null, limit: bigint): Promise<NoteListResult>;
    getCallerUserRole(): Promise<UserRole>;
    getNote(id: bigint): Promise<NoteResponse | null>;
    getNotesBySubject(subject: Subject, cursor: bigint | null, limit: bigint, sort: SortBy): Promise<NoteListResult>;
    getNotesByTag(tag: string, cursor: bigint | null, limit: bigint): Promise<NoteListResult>;
    getPopularTags(limit: bigint): Promise<Array<string>>;
    getProfile(): Promise<UserProfile | null>;
    getSubjectCounts(): Promise<Array<[Subject, bigint]>>;
    getUserNotes(principal: Principal, cursor: bigint | null, limit: bigint): Promise<NoteListResult>;
    getUserProfile(principal: Principal): Promise<ProfileWithStats | null>;
    isCallerAdmin(): Promise<boolean>;
    removeBookmark(id: bigint): Promise<void>;
    removeUpvote(id: bigint): Promise<void>;
    searchNotes(searchQuery: string, subject: Subject | null, cursor: bigint | null, limit: bigint): Promise<NoteListResult>;
    setProfile(name: string): Promise<void>;
    updateNote(id: bigint, title: string, description: string, content: string, subject: Subject, tags: Array<string>): Promise<void>;
    upvoteNote(id: bigint): Promise<void>;
}
