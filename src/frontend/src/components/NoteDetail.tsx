import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Principal } from "@icp-sdk/core/principal";
import {
  ArrowLeft,
  ArrowUp,
  Bookmark,
  BookmarkCheck,
  Calculator,
  Calendar,
  Cpu,
  FlaskConical,
  Landmark,
  Languages,
  Lightbulb,
  Loader2,
  MoreHorizontal,
  MoreVertical,
  Music,
  Palette,
  Pencil,
  Trash2,
  TrendingUp,
  Type,
  User as UserIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useBookmarkNote,
  useDeleteNote,
  useNote,
  useRemoveBookmark,
  useRemoveUpvote,
  useUpvoteNote,
} from "../hooks/useQueries";
import { subjectColor, subjectLabel } from "../utils/constants";
import { formatDateWithTime } from "../utils/formatting";
import { EditNoteDialog } from "./EditNoteDialog";

interface NoteDetailProps {
  noteId: bigint;
  currentPrincipal: Principal | null;
  onBack: () => void;
  onClickAuthor: (principal: Principal) => void;
  onClickTag: (tag: string) => void;
}

const SUBJECT_ICONS: Record<string, React.ElementType> = {
  Math: Calculator,
  Science: FlaskConical,
  History: Landmark,
  English: Type,
  "Computer Science": Cpu,
  Art: Palette,
  Music: Music,
  Languages: Languages,
  Economics: TrendingUp,
  Philosophy: Lightbulb,
  Other: MoreHorizontal,
};

export function NoteDetail({
  noteId,
  currentPrincipal,
  onBack,
  onClickAuthor,
  onClickTag,
}: NoteDetailProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const { data: note, isLoading, isError } = useNote(noteId);
  const { mutate: upvote, isPending: isUpvoting } = useUpvoteNote();
  const { mutate: removeUpvote, isPending: isRemovingUpvote } =
    useRemoveUpvote();
  const { mutate: bookmark, isPending: isBookmarking } = useBookmarkNote();
  const { mutate: removeBookmark, isPending: isRemovingBookmark } =
    useRemoveBookmark();
  const { mutate: deleteNote, isPending: isDeleting } = useDeleteNote();

  const isOwnNote = note && currentPrincipal?.toText() === note.author.toText();
  const isUpvotePending = isUpvoting || isRemovingUpvote;
  const isBookmarkPending = isBookmarking || isRemovingBookmark;

  const handleUpvote = () => {
    if (!note || isOwnNote) return;
    if (note.isUpvotedByMe) {
      removeUpvote(noteId, {
        onError: () => toast.error("Failed to remove upvote"),
      });
    } else {
      upvote(noteId, { onError: () => toast.error("Failed to upvote") });
    }
  };

  const handleBookmark = () => {
    if (!note) return;
    if (note.isBookmarkedByMe) {
      removeBookmark(noteId, {
        onSuccess: () => toast.success("Bookmark removed"),
        onError: () => toast.error("Failed to remove bookmark"),
      });
    } else {
      bookmark(noteId, {
        onSuccess: () => toast.success("Note bookmarked"),
        onError: () => toast.error("Failed to bookmark"),
      });
    }
  };

  const handleDelete = () => {
    deleteNote(noteId, {
      onSuccess: () => {
        toast.success("Note deleted");
        setShowDeleteDialog(false);
        onBack();
      },
      onError: () => toast.error("Failed to delete note"),
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-full" />
          <div className="flex gap-4 pt-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !note) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="mb-4 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to browse
        </Button>
        <div className="text-center py-20 border rounded-2xl bg-muted/10">
          <p className="text-destructive font-medium">Failed to load note.</p>
          <p className="text-sm text-muted-foreground mt-1">
            This note may have been deleted or is currently unavailable.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-10">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="group gap-2 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to browse
          </Button>
          {isOwnNote && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit note
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete note
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="space-y-6">
          <div className="flex flex-col gap-4">
            <div
              className={cn(
                "inline-flex items-center gap-2 w-fit px-3 py-1 rounded-full text-xs font-medium ring-1 ring-inset",
                subjectColor(note.subject)
                  .replace("bg-", "ring-")
                  .replace("/10", "/20"),
              )}
            >
              {(() => {
                const label = subjectLabel(note.subject);
                const Icon = SUBJECT_ICONS[label] || MoreHorizontal;
                return <Icon className="h-3 w-3" />;
              })()}
              {subjectLabel(note.subject)}
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-foreground leading-[1.15] font-serif tracking-tight">
              {note.title}
            </h1>
          </div>

          {note.description && (
            <p className="text-muted-foreground text-lg sm:text-xl leading-relaxed italic font-serif border-l-4 border-muted pl-6 py-1">
              {note.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-muted">
            <button
              type="button"
              className="flex items-center gap-3 group"
              onClick={() => onClickAuthor(note.author)}
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <UserIcon className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  {note.authorName}
                </p>
                <p className="text-xs text-muted-foreground">Contributor</p>
              </div>
            </button>

            <div className="flex items-center gap-3 text-muted-foreground ml-auto sm:ml-0">
              <Calendar className="h-4 w-4" />
              <div className="text-left">
                <p className="text-xs font-medium text-foreground">Published</p>
                <p className="text-[11px]">
                  {formatDateWithTime(note.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div className="whitespace-pre-wrap rounded-2xl border bg-card p-5 sm:p-10 text-lg leading-relaxed font-serif shadow-sm selection:bg-primary/10 overflow-x-auto">
            {note.content}
          </div>
        </div>

        <div className="space-y-6 pt-4 border-t border-muted">
          {note.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {note.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="px-3 py-1 text-xs rounded-full cursor-pointer hover:bg-secondary/80 transition-colors"
                  onClick={() => onClickTag(tag)}
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3">
            <Button
              variant="outline"
              size="lg"
              className={cn(
                "rounded-full px-6 gap-2 transition-all flex-1 xs:flex-none justify-center",
                note.isUpvotedByMe &&
                  "border-primary text-primary bg-primary/5",
                isOwnNote && "opacity-50 cursor-not-allowed",
              )}
              onClick={handleUpvote}
              disabled={isUpvotePending || !!isOwnNote}
            >
              <ArrowUp
                className={cn(
                  "h-4 w-4 transition-transform",
                  note.isUpvotedByMe && "-translate-y-0.5",
                )}
              />
              <span className="font-semibold">{Number(note.upvoteCount)}</span>
              <span>
                {Number(note.upvoteCount) === 1 ? "Upvote" : "Upvotes"}
              </span>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className={cn(
                "rounded-full px-6 gap-2 transition-all flex-1 xs:flex-none justify-center",
                note.isBookmarkedByMe &&
                  "border-primary text-primary bg-primary/5",
              )}
              onClick={handleBookmark}
              disabled={isBookmarkPending}
            >
              {note.isBookmarkedByMe ? (
                <BookmarkCheck className="h-4 w-4" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
              <span>{note.isBookmarkedByMe ? "Bookmarked" : "Bookmark"}</span>
            </Button>
          </div>
        </div>
      </div>

      <EditNoteDialog
        note={note}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this note?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The note will be permanently removed
              from the library.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} className="rounded-full">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
