import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Principal } from "@icp-sdk/core/principal";
import { ArrowUp, Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";
import {
  useBookmarkNote,
  useRemoveBookmark,
  useRemoveUpvote,
  useUpvoteNote,
} from "../hooks/useQueries";
import { type Subject, subjectColor, subjectLabel } from "../utils/constants";
import { formatRelativeDate } from "../utils/formatting";

interface NoteData {
  id: bigint;
  author: Principal;
  authorName: string;
  title: string;
  description: string;
  content?: string;
  subject: Subject;
  tags: string[];
  createdAt: bigint;
  upvoteCount: bigint;
  isUpvotedByMe: boolean;
  isBookmarkedByMe: boolean;
}

interface NoteCardProps {
  note: NoteData;
  currentPrincipal: Principal | null;
  onClickNote: (id: bigint) => void;
  onClickAuthor: (principal: Principal) => void;
  onClickTag: (tag: string) => void;
}

export function NoteCard({
  note,
  currentPrincipal,
  onClickNote,
  onClickAuthor,
  onClickTag,
}: NoteCardProps) {
  const isOwnNote = currentPrincipal?.toText() === note.author.toText();
  const { mutate: upvote, isPending: isUpvoting } = useUpvoteNote();
  const { mutate: removeUpvote, isPending: isRemovingUpvote } =
    useRemoveUpvote();
  const { mutate: bookmark, isPending: isBookmarking } = useBookmarkNote();
  const { mutate: removeBookmark, isPending: isRemovingBookmark } =
    useRemoveBookmark();

  const handleUpvoteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOwnNote) return;
    if (note.isUpvotedByMe) {
      removeUpvote(note.id, {
        onError: () => toast.error("Failed to remove upvote"),
      });
    } else {
      upvote(note.id, {
        onError: () => toast.error("Failed to upvote"),
      });
    }
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (note.isBookmarkedByMe) {
      removeBookmark(note.id, {
        onSuccess: () => toast.success("Bookmark removed"),
        onError: () => toast.error("Failed to remove bookmark"),
      });
    } else {
      bookmark(note.id, {
        onSuccess: () => toast.success("Note bookmarked"),
        onError: () => toast.error("Failed to bookmark"),
      });
    }
  };

  const isUpvotePending = isUpvoting || isRemovingUpvote;
  const isBookmarkPending = isBookmarking || isRemovingBookmark;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClickNote(note.id);
    }
  };

  return (
    <button
      type="button"
      tabIndex={0}
      onClick={() => onClickNote(note.id)}
      onKeyDown={handleKeyDown}
      className="group flex flex-col gap-3 p-4 rounded-xl border bg-card hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 shadow-sm text-left"
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className={cn(
            "text-xs font-medium px-2 py-0.5 rounded-full shrink-0",
            subjectColor(note.subject),
          )}
        >
          {subjectLabel(note.subject)}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0 -mr-1 -mt-0.5 text-muted-foreground"
          onClick={handleBookmarkClick}
          disabled={isBookmarkPending}
        >
          {note.isBookmarkedByMe ? (
            <BookmarkCheck className="h-3.5 w-3.5 text-primary" />
          ) : (
            <Bookmark className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>

      <div>
        <h3 className="font-semibold text-sm text-card-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {note.title}
        </h3>
        {note.description ? (
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {note.description}
          </p>
        ) : note.content ? (
          <p className="mt-1 text-xs text-muted-foreground/70 line-clamp-2 leading-relaxed italic">
            {note.content}
          </p>
        ) : null}
      </div>

      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {note.tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs cursor-pointer hover:bg-secondary/80"
              onClick={(e) => {
                e.stopPropagation();
                onClickTag(tag);
              }}
            >
              #{tag}
            </Badge>
          ))}
          {note.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{note.tags.length - 3}
            </Badge>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-0.5 mt-auto">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            className="text-xs text-muted-foreground hover:text-foreground truncate transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onClickAuthor(note.author);
            }}
          >
            {note.authorName}
          </button>
          <span className="text-muted-foreground/40 text-xs">·</span>
          <span className="text-xs text-muted-foreground shrink-0">
            {formatRelativeDate(note.createdAt)}
          </span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-6 px-2 gap-1 text-xs shrink-0",
            note.isUpvotedByMe
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground",
            isOwnNote && "opacity-50 cursor-not-allowed",
          )}
          onClick={handleUpvoteClick}
          disabled={isUpvotePending || isOwnNote}
        >
          <ArrowUp className="h-3 w-3" />
          {Number(note.upvoteCount)}
        </Button>
      </div>
    </button>
  );
}
