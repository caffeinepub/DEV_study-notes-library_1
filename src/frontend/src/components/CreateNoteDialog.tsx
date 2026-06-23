import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  Calculator,
  Cpu,
  FlaskConical,
  Landmark,
  Languages,
  Lightbulb,
  Loader2,
  MoreHorizontal,
  Music,
  Palette,
  TrendingUp,
  Type,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCreateNote } from "../hooks/useQueries";
import { ALL_SUBJECTS, type Subject, subjectLabel } from "../utils/constants";

interface CreateNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function CreateNoteDialog({
  open,
  onOpenChange,
}: CreateNoteDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [subject, setSubject] = useState<Subject | null>(null);
  const [tagsInput, setTagsInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { mutate: createNote, isPending } = useCreateNote();

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (nextOpen) {
      setTitle("");
      setDescription("");
      setContent("");
      setSubject(null);
      setTagsInput("");
      setError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !subject) return;
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0)
      .slice(0, 10);
    setError(null);
    createNote(
      {
        title: title.trim(),
        description: description.trim(),
        content: content.trim(),
        subject,
        tags,
      },
      {
        onSuccess: () => {
          toast.success("Note shared!");
          setTitle("");
          setDescription("");
          setContent("");
          setSubject(null);
          setTagsInput("");
          setError(null);
          onOpenChange(false);
        },
        onError: (err: unknown) => {
          setError(
            err instanceof Error ? err.message : "Failed to create note",
          );
        },
      },
    );
  };

  const isValid =
    title.trim().length > 0 && content.trim().length > 0 && !!subject;
  const tags = tagsInput
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter((t) => t.length > 0);
  const tagCount = tags.length;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif">
              Share a Note
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-5 py-6">
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="title">Title</Label>
                <span
                  className={cn(
                    "text-[10px]",
                    title.length > 180
                      ? "text-destructive"
                      : "text-muted-foreground",
                  )}
                >
                  {title.length}/200
                </span>
              </div>
              <Input
                id="title"
                placeholder="e.g. Introduction to Derivatives"
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTitle(e.target.value)
                }
                maxLength={200}
                className="bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/50"
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Select
                value={subject ?? ""}
                onValueChange={(val) => {
                  const found = ALL_SUBJECTS.find((s) => s === val);
                  if (found) setSubject(found);
                }}
              >
                <SelectTrigger
                  id="subject"
                  className="bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/50"
                >
                  <SelectValue placeholder="Choose a subject..." />
                </SelectTrigger>
                <SelectContent>
                  {ALL_SUBJECTS.map((s) => {
                    const label = subjectLabel(s);
                    const Icon = SUBJECT_ICONS[label] || MoreHorizontal;
                    return (
                      <SelectItem key={s} value={s}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                          {label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="description">Description</Label>
                <span
                  className={cn(
                    "text-[10px]",
                    description.length > 450
                      ? "text-destructive"
                      : "text-muted-foreground",
                  )}
                >
                  {description.length}/500
                </span>
              </div>
              <Input
                id="description"
                placeholder="A short summary of what this note covers"
                value={description}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setDescription(e.target.value)
                }
                maxLength={500}
                className="bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/50"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="content">Content</Label>
                <span
                  className={cn(
                    "text-[10px]",
                    content.length > 48000
                      ? "text-destructive"
                      : "text-muted-foreground",
                  )}
                >
                  {content.length.toLocaleString()}/50,000
                </span>
              </div>
              <Textarea
                id="content"
                placeholder="Write your study notes here..."
                value={content}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setContent(e.target.value)
                }
                className="min-h-[300px] resize-y bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/50 font-serif leading-relaxed"
                maxLength={50000}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <span
                  className={cn(
                    "text-[10px]",
                    tagCount > 8 ? "text-destructive" : "text-muted-foreground",
                  )}
                >
                  {tagCount}/10 tags
                </span>
              </div>
              <Input
                id="tags"
                placeholder="e.g. calculus, derivatives, limits"
                value={tagsInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTagsInput(e.target.value)
                }
                className="bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/50"
              />
              {tagCount > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {tags.slice(0, 10).map((t) => (
                    <Badge
                      key={t}
                      variant="secondary"
                      className="text-[10px] py-0 px-2 rounded-full"
                    >
                      #{t}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isValid || isPending || tagCount > 10}
              className="rounded-full px-8"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {isPending ? "Sharing..." : "Share Note"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
