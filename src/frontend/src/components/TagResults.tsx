import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Principal } from "@icp-sdk/core/principal";
import { SearchX } from "lucide-react";
import type { NavPage } from "../App";
import { useNotesByTag } from "../hooks/useQueries";
import { NoteCard } from "./NoteCard";

interface TagResultsProps {
  tag: string;
  currentPrincipal: Principal | null;
  onNavigate: (page: NavPage) => void;
}

export function TagResults({
  tag,
  currentPrincipal,
  onNavigate,
}: TagResultsProps) {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useNotesByTag(tag);
  const notes = data?.pages.flatMap((p) => p.notes) ?? [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Array.from({ length: 4 }, (_, i) => i).map((n) => (
          <Skeleton key={n} className="h-44 rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError)
    return <p className="text-destructive text-sm">Failed to load results.</p>;

  if (notes.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <SearchX className="h-8 w-8 mx-auto mb-3 opacity-30" />
        <p className="font-medium">No notes with #{tag}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {notes.map((note) => (
          <NoteCard
            key={note.id.toString()}
            note={note}
            currentPrincipal={currentPrincipal}
            onClickNote={(id) => onNavigate({ view: "note", noteId: id })}
            onClickAuthor={(p) =>
              onNavigate({ view: "profile", principal: p.toText() })
            }
            onClickTag={(t) =>
              onNavigate({ view: "search", query: "", tag: t })
            }
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
