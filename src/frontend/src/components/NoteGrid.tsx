import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Principal } from "@icp-sdk/core/principal";
import type { NavPage } from "../App";
import { useAllNotes, useNotesBySubject } from "../hooks/useQueries";
import { subjectLabel } from "../utils/constants";
import type { SortBy, Subject } from "../utils/constants";
import { NoteCard } from "./NoteCard";

interface NoteGridProps {
  subject: Subject | null;
  sort: SortBy;
  currentPrincipal: Principal | null;
  onNavigate: (page: NavPage) => void;
}

export function NoteGrid({
  subject,
  sort,
  currentPrincipal,
  onNavigate,
}: NoteGridProps) {
  const allQuery = useAllNotes(sort, !subject);
  const subjectQuery = useNotesBySubject(subject, sort);

  const query = subject ? subjectQuery : allQuery;
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = query;

  const notes = data?.pages.flatMap((p) => p.notes) ?? [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: 6 }, (_, i) => i).map((n) => (
          <Skeleton key={n} className="h-44 rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <p className="text-destructive text-sm">Failed to load notes.</p>;
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-base font-medium">No notes here yet</p>
        <p className="text-sm mt-1">
          {subject
            ? `Be the first to share a ${subjectLabel(subject)} note!`
            : "Share the first note to get started!"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {notes.map((note) => (
          <NoteCard
            key={note.id.toString()}
            note={note}
            currentPrincipal={currentPrincipal}
            onClickNote={(id) => onNavigate({ view: "note", noteId: id })}
            onClickAuthor={(principal) =>
              onNavigate({ view: "profile", principal: principal.toText() })
            }
            onClickTag={(tag) => onNavigate({ view: "search", query: "", tag })}
          />
        ))}
      </div>
      {hasNextPage && (
        <div className="flex justify-center pt-2">
          <Button
            variant="outline"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? "Loading..." : "Load more"}
          </Button>
        </div>
      )}
    </div>
  );
}
