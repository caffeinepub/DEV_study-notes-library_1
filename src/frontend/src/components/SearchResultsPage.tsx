import type { Principal } from "@icp-sdk/core/principal";
import type { NavPage } from "../App";
import { PopularTags } from "./PopularTags";
import { QueryResults } from "./QueryResults";
import { TagResults } from "./TagResults";

interface SearchResultsPageProps {
  query: string;
  tag: string | null;
  currentPrincipal: Principal | null;
  onNavigate: (page: NavPage) => void;
}

export function SearchResultsPage({
  query,
  tag,
  currentPrincipal,
  onNavigate,
}: SearchResultsPageProps) {
  return (
    <div className="flex gap-6 h-full">
      <div className="flex-1 min-w-0 px-4 py-6 space-y-5">
        <div>
          <h1 className="text-lg font-bold">
            {tag ? `Tag: #${tag}` : `Search: "${query}"`}
          </h1>
        </div>

        {tag ? (
          <TagResults
            tag={tag}
            currentPrincipal={currentPrincipal}
            onNavigate={onNavigate}
          />
        ) : query ? (
          <QueryResults
            query={query}
            currentPrincipal={currentPrincipal}
            onNavigate={onNavigate}
          />
        ) : (
          <p className="text-muted-foreground text-sm">
            Enter a search term to find notes.
          </p>
        )}
      </div>

      <aside className="hidden lg:block w-56 shrink-0 py-6 pr-4">
        <PopularTags
          onClickTag={(t) => onNavigate({ view: "search", query: "", tag: t })}
        />
      </aside>
    </div>
  );
}
