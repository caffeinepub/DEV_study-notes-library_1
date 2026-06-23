import { SortBy, Subject } from "../backend";
export { Subject, SortBy };

export const Subjects = {
  Mathematics: Subject.Mathematics,
  Science: Subject.Science,
  History: Subject.History,
  English: Subject.English,
  ComputerScience: Subject.ComputerScience,
  Art: Subject.Art,
  Music: Subject.Music,
  Languages: Subject.Languages,
  Economics: Subject.Economics,
  Philosophy: Subject.Philosophy,
  Other: Subject.Other,
} as const;

export const ALL_SUBJECTS = Object.values(Subjects);

export type SubjectKey = keyof typeof Subjects;

export function subjectLabel(subject: Subject): string {
  switch (subject) {
    case Subject.Mathematics:
      return "Math";
    case Subject.Science:
      return "Science";
    case Subject.History:
      return "History";
    case Subject.English:
      return "English";
    case Subject.ComputerScience:
      return "Computer Science";
    case Subject.Art:
      return "Art";
    case Subject.Music:
      return "Music";
    case Subject.Languages:
      return "Languages";
    case Subject.Economics:
      return "Economics";
    case Subject.Philosophy:
      return "Philosophy";
    case Subject.Other:
      return "Other";
  }
}

export function subjectColor(subject: Subject): string {
  switch (subject) {
    case Subject.Mathematics:
      return "bg-indigo-500/10 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300";
    case Subject.Science:
      return "bg-emerald-600/10 text-emerald-700 dark:bg-emerald-600/20 dark:text-emerald-300";
    case Subject.History:
      return "bg-amber-600/10 text-amber-700 dark:bg-amber-600/20 dark:text-amber-300";
    case Subject.English:
      return "bg-rose-600/10 text-rose-700 dark:bg-rose-600/20 dark:text-rose-300";
    case Subject.ComputerScience:
      return "bg-slate-600/10 text-slate-700 dark:bg-slate-600/20 dark:text-slate-300";
    case Subject.Art:
      return "bg-pink-600/10 text-pink-700 dark:bg-pink-600/20 dark:text-pink-300";
    case Subject.Music:
      return "bg-violet-600/10 text-violet-700 dark:bg-violet-600/20 dark:text-violet-300";
    case Subject.Languages:
      return "bg-teal-600/10 text-teal-700 dark:bg-teal-600/20 dark:text-teal-300";
    case Subject.Economics:
      return "bg-orange-600/10 text-orange-700 dark:bg-orange-600/20 dark:text-orange-300";
    case Subject.Philosophy:
      return "bg-cyan-600/10 text-cyan-700 dark:bg-cyan-600/20 dark:text-cyan-300";
    case Subject.Other:
      return "bg-muted text-muted-foreground";
  }
}

export function subjectsEqual(a: Subject, b: Subject): boolean {
  return a === b;
}

export const SortOptions = {
  Newest: SortBy.Newest,
  MostUpvoted: SortBy.MostUpvoted,
  RecentlyUpdated: SortBy.RecentlyUpdated,
} as const;

export function sortLabel(sort: SortBy): string {
  switch (sort) {
    case SortBy.Newest:
      return "Newest";
    case SortBy.MostUpvoted:
      return "Most Upvoted";
    case SortBy.RecentlyUpdated:
      return "Recently Updated";
  }
}

export const PAGE_SIZE = 20n;
