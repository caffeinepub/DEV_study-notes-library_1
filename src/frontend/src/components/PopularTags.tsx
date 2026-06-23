import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { usePopularTags } from "../hooks/useQueries";

interface PopularTagsProps {
  onClickTag: (tag: string) => void;
}

export function PopularTags({ onClickTag }: PopularTagsProps) {
  const { data: tags, isLoading, isError } = usePopularTags();

  if (isLoading) {
    return (
      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Popular Tags
        </p>
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: 8 }, (_, i) => i).map((n) => (
            <Skeleton key={n} className="h-5 w-14 rounded-full" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !tags || tags.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        Popular Tags
      </p>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="text-xs cursor-pointer hover:bg-secondary/80 max-w-full truncate"
            title={`#${tag}`}
            onClick={() => onClickTag(tag)}
          >
            #{tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}
