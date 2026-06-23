import { useActor, useInternetIdentity } from "@caffeineai/core-infrastructure";
import type { Principal } from "@icp-sdk/core/principal";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createActor } from "../backend";
import {
  PAGE_SIZE,
  type SortBy,
  SortOptions,
  type Subject,
} from "../utils/constants";

// Profile queries

export function useProfile() {
  const { actor } = useActor(createActor);
  const { identity } = useInternetIdentity();

  return useQuery({
    queryKey: ["profile", identity?.getPrincipal().toText()],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.getProfile();
      return result ?? null;
    },
    enabled: !!actor && !!identity,
  });
}

export function useSetProfile() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.setProfile(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile", identity?.getPrincipal().toText()],
      });
      queryClient.invalidateQueries({
        queryKey: ["userProfile", identity?.getPrincipal().toText()],
      });
    },
  });
}

export function useUserProfile(principal: Principal | null) {
  const { actor } = useActor(createActor);

  return useQuery({
    queryKey: ["userProfile", principal?.toText()],
    queryFn: async () => {
      if (!actor || !principal) throw new Error("Actor not ready");
      const result = await actor.getUserProfile(principal);
      return result ?? null;
    },
    enabled: !!actor && !!principal,
  });
}

// Note queries

export function useNote(id: bigint | null) {
  const { actor } = useActor(createActor);
  const { identity } = useInternetIdentity();

  return useQuery({
    queryKey: ["note", id?.toString(), identity?.getPrincipal().toText()],
    queryFn: async () => {
      if (!actor || id === null) throw new Error("Actor not ready");
      const result = await actor.getNote(id);
      return result ?? null;
    },
    enabled: !!actor && id !== null,
  });
}

export function useAllNotes(sort: SortBy = SortOptions.Newest, enabled = true) {
  const { actor } = useActor(createActor);
  const { identity } = useInternetIdentity();

  return useInfiniteQuery({
    queryKey: ["allNotes", sort, identity?.getPrincipal().toText()],
    queryFn: async ({ pageParam }: { pageParam: bigint | null }) => {
      if (!actor) throw new Error("Actor not ready");
      return await actor.getAllNotes(pageParam, PAGE_SIZE, sort);
    },
    initialPageParam: null as bigint | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
    enabled: !!actor && !!identity && enabled,
  });
}

export function useNotesBySubject(
  subject: Subject | null,
  sort: SortBy = SortOptions.Newest,
) {
  const { actor } = useActor(createActor);
  const { identity } = useInternetIdentity();

  return useInfiniteQuery({
    queryKey: [
      "notesBySubject",
      subject,
      sort,
      identity?.getPrincipal().toText(),
    ],
    queryFn: async ({ pageParam }: { pageParam: bigint | null }) => {
      if (!actor || !subject) throw new Error("Actor not ready");
      return await actor.getNotesBySubject(subject, pageParam, PAGE_SIZE, sort);
    },
    initialPageParam: null as bigint | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
    enabled: !!actor && !!identity && !!subject,
  });
}

export function useUserNotes(principal: Principal | null) {
  const { actor } = useActor(createActor);
  const { identity } = useInternetIdentity();

  return useInfiniteQuery({
    queryKey: [
      "userNotes",
      principal?.toText(),
      identity?.getPrincipal().toText(),
    ],
    queryFn: async ({ pageParam }: { pageParam: bigint | null }) => {
      if (!actor || !principal) throw new Error("Actor not ready");
      return await actor.getUserNotes(principal, pageParam, PAGE_SIZE);
    },
    initialPageParam: null as bigint | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
    enabled: !!actor && !!principal,
  });
}

export function useSearchNotes(query: string, subject: Subject | null = null) {
  const { actor } = useActor(createActor);
  const { identity } = useInternetIdentity();
  const trimmed = query.trim();

  return useInfiniteQuery({
    queryKey: ["search", trimmed, subject, identity?.getPrincipal().toText()],
    queryFn: async ({ pageParam }: { pageParam: bigint | null }) => {
      if (!actor) throw new Error("Actor not ready");
      return await actor.searchNotes(trimmed, subject, pageParam, PAGE_SIZE);
    },
    initialPageParam: null as bigint | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
    enabled: !!actor && trimmed.length > 0,
  });
}

export function useNotesByTag(tag: string | null) {
  const { actor } = useActor(createActor);
  const { identity } = useInternetIdentity();

  return useInfiniteQuery({
    queryKey: ["notesByTag", tag, identity?.getPrincipal().toText()],
    queryFn: async ({ pageParam }: { pageParam: bigint | null }) => {
      if (!actor || !tag) throw new Error("Actor not ready");
      return await actor.getNotesByTag(tag, pageParam, PAGE_SIZE);
    },
    initialPageParam: null as bigint | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
    enabled: !!actor && !!tag,
  });
}

export function usePopularTags() {
  const { actor } = useActor(createActor);

  return useQuery({
    queryKey: ["popularTags"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return await actor.getPopularTags(20n);
    },
    enabled: !!actor,
    staleTime: 1000 * 60 * 5,
  });
}

export function useSubjectCounts() {
  const { actor } = useActor(createActor);

  return useQuery({
    queryKey: ["subjectCounts"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return await actor.getSubjectCounts();
    },
    enabled: !!actor,
    staleTime: 1000 * 60,
  });
}

export function useBookmarks() {
  const { actor } = useActor(createActor);
  const { identity } = useInternetIdentity();

  return useInfiniteQuery({
    queryKey: ["bookmarks", identity?.getPrincipal().toText()],
    queryFn: async ({ pageParam }: { pageParam: bigint | null }) => {
      if (!actor) throw new Error("Actor not ready");
      return await actor.getBookmarks(pageParam, PAGE_SIZE);
    },
    initialPageParam: null as bigint | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
    enabled: !!actor && !!identity,
  });
}

// Note mutations

export function useCreateNote() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      description,
      content,
      subject,
      tags,
    }: {
      title: string;
      description: string;
      content: string;
      subject: Subject;
      tags: string[];
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return await actor.createNote(title, description, content, subject, tags);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allNotes"] });
      queryClient.invalidateQueries({ queryKey: ["notesBySubject"] });
      queryClient.invalidateQueries({ queryKey: ["userNotes"] });
      queryClient.invalidateQueries({ queryKey: ["subjectCounts"] });
      queryClient.invalidateQueries({ queryKey: ["popularTags"] });
    },
  });
}

export function useUpdateNote() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      title,
      description,
      content,
      subject,
      tags,
    }: {
      id: bigint;
      title: string;
      description: string;
      content: string;
      subject: Subject;
      tags: string[];
    }) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.updateNote(id, title, description, content, subject, tags);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["note", id.toString()] });
      queryClient.invalidateQueries({ queryKey: ["allNotes"] });
      queryClient.invalidateQueries({ queryKey: ["notesBySubject"] });
      queryClient.invalidateQueries({ queryKey: ["userNotes"] });
      queryClient.invalidateQueries({ queryKey: ["popularTags"] });
      queryClient.invalidateQueries({ queryKey: ["subjectCounts"] });
    },
  });
}

export function useDeleteNote() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.deleteNote(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allNotes"] });
      queryClient.invalidateQueries({ queryKey: ["notesBySubject"] });
      queryClient.invalidateQueries({ queryKey: ["userNotes"] });
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["subjectCounts"] });
      queryClient.invalidateQueries({ queryKey: ["search"] });
    },
  });
}

// Upvote mutations

export function useUpvoteNote() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.upvoteNote(id);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["note", id.toString()] });
      queryClient.invalidateQueries({ queryKey: ["allNotes"] });
      queryClient.invalidateQueries({ queryKey: ["notesBySubject"] });
      queryClient.invalidateQueries({ queryKey: ["userNotes"] });
      queryClient.invalidateQueries({ queryKey: ["search"] });
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

export function useRemoveUpvote() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.removeUpvote(id);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["note", id.toString()] });
      queryClient.invalidateQueries({ queryKey: ["allNotes"] });
      queryClient.invalidateQueries({ queryKey: ["notesBySubject"] });
      queryClient.invalidateQueries({ queryKey: ["userNotes"] });
      queryClient.invalidateQueries({ queryKey: ["search"] });
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

// Bookmark mutations

export function useBookmarkNote() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.bookmarkNote(id);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["note", id.toString()] });
      queryClient.invalidateQueries({
        queryKey: ["bookmarks", identity?.getPrincipal().toText()],
      });
      queryClient.invalidateQueries({ queryKey: ["allNotes"] });
      queryClient.invalidateQueries({ queryKey: ["notesBySubject"] });
      queryClient.invalidateQueries({ queryKey: ["userNotes"] });
      queryClient.invalidateQueries({ queryKey: ["search"] });
    },
  });
}

export function useRemoveBookmark() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.removeBookmark(id);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["note", id.toString()] });
      queryClient.invalidateQueries({
        queryKey: ["bookmarks", identity?.getPrincipal().toText()],
      });
      queryClient.invalidateQueries({ queryKey: ["allNotes"] });
      queryClient.invalidateQueries({ queryKey: ["notesBySubject"] });
      queryClient.invalidateQueries({ queryKey: ["userNotes"] });
      queryClient.invalidateQueries({ queryKey: ["search"] });
    },
  });
}
