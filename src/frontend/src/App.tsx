import { useActor, useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Principal } from "@icp-sdk/core/principal";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import { Toaster } from "sonner";
import { createActor } from "./backend";
import { AppLayout } from "./components/AppLayout";
import { BrowsePage } from "./components/BrowsePage";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LandingPage } from "./components/LandingPage";
import { LoadingScreen } from "./components/LoadingScreen";
import { MyLibraryPage } from "./components/MyLibraryPage";
import { NoteDetail } from "./components/NoteDetail";
import { ProfilePage } from "./components/ProfilePage";
import { ProfileSetupDialog } from "./components/ProfileSetupDialog";
import { SearchResultsPage } from "./components/SearchResultsPage";
import { useProfile } from "./hooks/useQueries";

export type NavPage =
  | { view: "browse" }
  | { view: "note"; noteId: bigint }
  | { view: "library" }
  | { view: "profile"; principal: string }
  | { view: "search"; query: string; tag: string | null };

const App = () => {
  const { identity, isInitializing } = useInternetIdentity();
  const { actor, isFetching: isActorFetching } = useActor(createActor);
  const { data: profile, isLoading: isLoadingProfile } = useProfile();

  const isAuthenticated = !!identity;
  const hasProfile = !!profile;

  const [nav, setNav] = useState<NavPage>({ view: "browse" });

  const currentPrincipal: Principal | null = identity
    ? Principal.fromText(identity.getPrincipal().toText())
    : null;

  const renderContent = () => {
    if (isInitializing) return <LoadingScreen />;
    if (!isAuthenticated) return <LandingPage />;
    if (!actor || isActorFetching || isLoadingProfile) return <LoadingScreen />;

    return (
      <>
        <AppLayout nav={nav} onNavigate={setNav}>
          {nav.view === "browse" && (
            <BrowsePage
              currentPrincipal={currentPrincipal}
              onNavigate={setNav}
            />
          )}
          {nav.view === "note" && (
            <NoteDetail
              noteId={nav.noteId}
              currentPrincipal={currentPrincipal}
              onBack={() => setNav({ view: "browse" })}
              onClickAuthor={(principal) =>
                setNav({ view: "profile", principal: principal.toText() })
              }
              onClickTag={(tag) => setNav({ view: "search", query: "", tag })}
            />
          )}
          {nav.view === "library" && (
            <MyLibraryPage
              currentPrincipal={currentPrincipal}
              onNavigate={setNav}
            />
          )}
          {nav.view === "profile" && (
            <ProfilePage
              principalText={nav.principal}
              currentPrincipal={currentPrincipal}
              onNavigate={setNav}
            />
          )}
          {nav.view === "search" && (
            <SearchResultsPage
              query={nav.query}
              tag={nav.tag}
              currentPrincipal={currentPrincipal}
              onNavigate={setNav}
            />
          )}
        </AppLayout>

        <ProfileSetupDialog open={!hasProfile} />
      </>
    );
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <ErrorBoundary>{renderContent()}</ErrorBoundary>
      <Toaster position="bottom-right" />
    </ThemeProvider>
  );
};

export default App;
