import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Principal } from "@icp-sdk/core/principal";
import { Pencil } from "lucide-react";
import { useState } from "react";
import type { NavPage } from "../App";
import { useProfile, useUserNotes, useUserProfile } from "../hooks/useQueries";
import { formatDate } from "../utils/formatting";
import { EditProfileDialog } from "./EditProfileDialog";
import { NoteCard } from "./NoteCard";

interface ProfilePageProps {
  principalText: string;
  currentPrincipal: Principal | null;
  onNavigate: (page: NavPage) => void;
}

export function ProfilePage({
  principalText,
  currentPrincipal,
  onNavigate,
}: ProfilePageProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);

  let principal: Principal | null = null;
  try {
    principal = Principal.fromText(principalText);
  } catch {
    // invalid principal text
  }

  const {
    data: profileWithStats,
    isLoading: isLoadingProfile,
    isError: isProfileError,
  } = useUserProfile(principal);
  const { data: ownProfile } = useProfile();
  const {
    data: notesData,
    isLoading: isLoadingNotes,
    isError: isNotesError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUserNotes(principal);

  const isOwnProfile = currentPrincipal?.toText() === principalText;
  const notes = notesData?.pages.flatMap((p) => p.notes) ?? [];

  if (isLoadingProfile) {
    return (
      <div className="px-4 py-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-6">
          <Skeleton className="h-12 w-24" />
          <Skeleton className="h-12 w-24" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Array.from({ length: 4 }, (_, i) => i).map((n) => (
            <Skeleton key={n} className="h-44 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isProfileError) {
    return (
      <div className="px-4 py-6">
        <p className="text-destructive text-sm">Failed to load profile.</p>
      </div>
    );
  }

  if (!profileWithStats) {
    return (
      <div className="px-4 py-6">
        <p className="text-sm text-muted-foreground">
          This user hasn't set up their profile yet.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="px-4 py-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">
              {profileWithStats.name}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Joined {formatDate(profileWithStats.createdAt)}
            </p>
          </div>
          {isOwnProfile && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2 w-fit"
              onClick={() => setShowEditDialog(true)}
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit Profile
            </Button>
          )}
        </div>

        <div className="flex items-center gap-8 sm:gap-12">
          <div className="text-left">
            <p className="text-2xl sm:text-3xl font-bold">
              {Number(profileWithStats.noteCount)}
            </p>
            <p className="text-xs text-muted-foreground">Notes shared</p>
          </div>
          <div className="text-left">
            <p className="text-2xl sm:text-3xl font-bold">
              {Number(profileWithStats.totalUpvotesReceived)}
            </p>
            <p className="text-xs text-muted-foreground">Upvotes received</p>
          </div>
        </div>

        <div>
          <h2
            className={cn(
              "text-sm font-semibold mb-3",
              isOwnProfile ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {isOwnProfile ? "Your notes" : `Notes by ${profileWithStats.name}`}
          </h2>

          {isLoadingNotes && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Array.from({ length: 4 }, (_, i) => i).map((n) => (
                <Skeleton key={n} className="h-44 rounded-xl" />
              ))}
            </div>
          )}

          {isNotesError && (
            <p className="text-destructive text-sm">Failed to load notes.</p>
          )}

          {!isLoadingNotes && !isNotesError && notes.length === 0 && (
            <p className="text-sm text-muted-foreground py-6 text-center">
              {isOwnProfile
                ? "You haven't shared any notes yet."
                : "No notes shared yet."}
            </p>
          )}

          {notes.length > 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {notes.map((note) => (
                  <NoteCard
                    key={note.id.toString()}
                    note={note}
                    currentPrincipal={currentPrincipal}
                    onClickNote={(id) =>
                      onNavigate({ view: "note", noteId: id })
                    }
                    onClickAuthor={(p) =>
                      onNavigate({ view: "profile", principal: p.toText() })
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
      </div>

      {isOwnProfile && ownProfile && (
        <EditProfileDialog
          open={showEditDialog}
          currentName={ownProfile.name}
          onOpenChange={setShowEditDialog}
        />
      )}
    </>
  );
}
