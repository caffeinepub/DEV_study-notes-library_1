import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Principal } from "@icp-sdk/core/principal";
import {
  Calculator,
  Cpu,
  FlaskConical,
  Landmark,
  Languages,
  LayoutGrid,
  Lightbulb,
  MoreHorizontal,
  Music,
  Palette,
  TrendingUp,
  Type,
} from "lucide-react";
import { useState } from "react";
import type { NavPage } from "../App";
import { useSubjectCounts } from "../hooks/useQueries";
import {
  ALL_SUBJECTS,
  type SortBy,
  SortOptions,
  type Subject,
  sortLabel,
  subjectLabel,
} from "../utils/constants";
import { NoteGrid } from "./NoteGrid";
import { PopularTags } from "./PopularTags";

interface BrowsePageProps {
  currentPrincipal: Principal | null;
  onNavigate: (page: NavPage) => void;
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

export function BrowsePage({ currentPrincipal, onNavigate }: BrowsePageProps) {
  const [activeSubject, setActiveSubject] = useState<Subject | null>(null);
  const [sort, setSort] = useState<SortBy>(SortOptions.Newest);
  const { data: subjectCounts } = useSubjectCounts();

  const getCount = (subject: Subject): number => {
    if (!subjectCounts) return 0;
    const entry = subjectCounts.find(([s]) => s === subject);
    return entry ? Number(entry[1]) : 0;
  };

  const totalCount =
    subjectCounts?.reduce((sum, [, count]) => sum + Number(count), 0) ?? 0;

  return (
    <div className="flex gap-6">
      {/* Main content */}
      <div className="flex-1 min-w-0 py-6 space-y-5">
        {/* Subject filter bar */}
        <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm px-4 pb-3">
          <div className="overflow-x-auto pb-2">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <button
                type="button"
                onClick={() => setActiveSubject(null)}
                className={cn(
                  "shrink-0 text-sm px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2",
                  !activeSubject
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
                )}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                All{" "}
                {totalCount > 0 && (
                  <span className="ml-0.5 opacity-70 text-[10px]">
                    ({totalCount})
                  </span>
                )}
              </button>
              {ALL_SUBJECTS.map((subject) => {
                const count = getCount(subject);
                const label = subjectLabel(subject);
                const Icon = SUBJECT_ICONS[label] || MoreHorizontal;
                return (
                  <button
                    type="button"
                    key={subject}
                    onClick={() =>
                      setActiveSubject(
                        activeSubject === subject ? null : subject,
                      )
                    }
                    className={cn(
                      "shrink-0 text-sm px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2",
                      activeSubject === subject
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                    {count > 0 && (
                      <span className="ml-0.5 opacity-70 text-[10px]">
                        ({count})
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sort control */}
        <div className="flex items-center justify-between px-4">
          <p className="text-sm font-medium text-muted-foreground">
            {activeSubject ? subjectLabel(activeSubject) : "All notes"}
          </p>
          <Select
            value={sort}
            onValueChange={(val) => {
              const found = Object.values(SortOptions).find((s) => s === val);
              if (found) setSort(found);
            }}
          >
            <SelectTrigger className="w-44 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(SortOptions).map((s) => (
                <SelectItem key={s} value={s} className="text-xs">
                  {sortLabel(s)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="px-4">
          <NoteGrid
            subject={activeSubject}
            sort={sort}
            currentPrincipal={currentPrincipal}
            onNavigate={onNavigate}
          />
        </div>
      </div>

      {/* Sidebar */}
      <aside className="hidden lg:block w-56 shrink-0 py-6 pr-4">
        <div className="sticky top-6 overflow-y-auto max-h-[calc(100dvh-5rem)]">
          <PopularTags
            onClickTag={(tag) => onNavigate({ view: "search", query: "", tag })}
          />
        </div>
      </aside>
    </div>
  );
}
