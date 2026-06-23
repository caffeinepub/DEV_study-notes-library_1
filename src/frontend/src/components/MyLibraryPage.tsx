import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Principal } from "@icp-sdk/core/principal";
import { BookmarkX } from "lucide-react";
import type { NavPage } from "../App";
import { useBookmarks } from "../hooks/useQueries";
import { NoteCard } from "./NoteCard";

interface MyLibraryPageProps {
  currentPrincipal: Principal | null;
  onNavigate: (page: NavPage) => void;
}

export function MyLibraryPage({
  currentPrincipal,
  onNavigate,
}: MyLibraryPageProps) {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useBookmarks();

  const notes = data?.pages.flatMap((p) => p.notes) ?? [];

  return (
    <div className="px-4 py-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold">My Library</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Notes you've bookmarked
        </p>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }, (_, i) => i).map((n) => (
            <Skeleton key={n} className="h-44 rounded-xl" />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-destructive text-sm">Failed to load bookmarks.</p>
      )}

      {!isLoading && !isError && notes.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <BookmarkX className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No bookmarks yet</p>
          <p className="text-sm mt-1">
            Browse notes and bookmark the ones you want to save.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => onNavigate({ view: "browse" })}
          >
            Browse Notes
          </Button>
        </div>
      )}

      {notes.length > 0 && (
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
                onClickTag={(tag) =>
                  onNavigate({ view: "search", query: "", tag })
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
      )}
    </div>
  );
}
