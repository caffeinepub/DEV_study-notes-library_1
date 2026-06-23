import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import {
  BookOpen,
  Bookmark,
  LogOut,
  Menu,
  NotebookPen,
  Plus,
  User,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import type { NavPage } from "../App";
import { CreateNoteDialog } from "./CreateNoteDialog";
import { SearchBar } from "./SearchBar";
import { ThemeToggle } from "./ThemeToggle";

interface AppLayoutProps {
  nav: NavPage;
  onNavigate: (page: NavPage) => void;
  children: ReactNode;
}

const NAV_ITEMS = [
  { id: "browse" as const, icon: BookOpen, label: "Browse" },
  { id: "library" as const, icon: Bookmark, label: "My Library" },
  { id: "profile" as const, icon: User, label: "Profile" },
];

function NavLink({
  icon: Icon,
  label,
  active,
  onClick,
  disabled,
}: {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors",
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        disabled && "opacity-50 cursor-not-allowed",
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {label}
    </button>
  );
}

function SidebarContent({
  nav,
  onNavigate,
  profilePrincipalText,
  onLogout,
  onClose,
}: {
  nav: NavPage;
  onNavigate: (page: NavPage) => void;
  profilePrincipalText: string | undefined;
  onLogout: () => void;
  onClose?: () => void;
}) {
  const handleNav = (page: NavPage) => {
    onNavigate(page);
    onClose?.();
  };

  return (
    <div className="flex flex-col h-full py-4">
      <div className="flex items-center gap-2 px-4 pb-6">
        <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
          <NotebookPen className="w-3.5 h-3.5 text-primary-foreground" />
        </div>
        <span className="font-semibold text-foreground">NoteSwap</span>
      </div>

      <nav className="flex-1 px-2 space-y-1">
        {NAV_ITEMS.map(({ id, icon, label }) => {
          const isActive = nav.view === id;
          return (
            <NavLink
              key={id}
              icon={icon}
              label={label}
              active={isActive}
              disabled={id === "profile" && !profilePrincipalText}
              onClick={() => {
                if (id === "profile" && profilePrincipalText) {
                  handleNav({
                    view: "profile",
                    principal: profilePrincipalText,
                  });
                } else if (id === "browse") {
                  handleNav({ view: "browse" });
                } else if (id === "library") {
                  handleNav({ view: "library" });
                }
              }}
            />
          );
        })}
      </nav>

      <div className="px-2 border-t pt-4">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3 text-muted-foreground"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  );
}

export function AppLayout({ nav, onNavigate, children }: AppLayoutProps) {
  const [showCreateNote, setShowCreateNote] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const { identity, clear } = useInternetIdentity();
  const principalText = identity?.getPrincipal().toText();

  const handleSearch = (query: string) => {
    if (query.trim()) {
      onNavigate({ view: "search", query: query.trim(), tag: null });
    } else if (nav.view === "search") {
      onNavigate({ view: "browse" });
    }
  };

  return (
    <div className="h-dvh flex overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 shrink-0 flex-col border-r bg-card/50 backdrop-blur-md">
        <SidebarContent
          nav={nav}
          onNavigate={onNavigate}
          profilePrincipalText={principalText}
          onLogout={clear}
        />
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="shrink-0 h-14 border-b flex items-center gap-2 sm:gap-3 px-2 sm:px-4 bg-card/50 backdrop-blur-md sticky top-0 z-10">
          {/* Mobile menu */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden shrink-0"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-56 p-0">
              <SidebarContent
                nav={nav}
                onNavigate={onNavigate}
                profilePrincipalText={principalText}
                onLogout={clear}
                onClose={() => setSheetOpen(false)}
              />
            </SheetContent>
          </Sheet>

          <div className="flex-1 min-w-0">
            <SearchBar
              initialValue={nav.view === "search" ? nav.query : ""}
              onSearch={handleSearch}
            />
          </div>

          <ThemeToggle />

          <Button
            size="sm"
            className="gap-2 shrink-0"
            onClick={() => setShowCreateNote(true)}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Note</span>
          </Button>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>

      <CreateNoteDialog
        open={showCreateNote}
        onOpenChange={setShowCreateNote}
      />
    </div>
  );
}
