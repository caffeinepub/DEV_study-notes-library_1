import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import {
  ArrowUp,
  BookOpen,
  Bookmark,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Loader2,
  NotebookPen,
  Search,
  Users,
} from "lucide-react";
import { ALL_SUBJECTS, subjectLabel } from "../utils/constants";
import { ThemeToggle } from "./ThemeToggle";

export function LandingPage() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <NotebookPen className="w-4.5 h-4.5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg tracking-tight font-serif">
              NoteSwap
            </span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="container max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border text-[11px] font-medium text-muted-foreground mb-8 animate-fade-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            Now open for the 2026 Academic Year
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.1] font-serif animate-fade-up-delay-1">
            The Digital Archive for <br className="hidden sm:block" />
            <span className="text-primary italic">Scholarly Excellence.</span>
          </h1>

          <p className="mt-8 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-up-delay-2">
            A student-powered library where the best study notes rise to the
            top. Elevate your learning with peer-vetted knowledge across every
            discipline.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up-delay-3">
            <Button
              onClick={() => login()}
              disabled={isLoggingIn}
              size="lg"
              className="rounded-full px-8 h-12 text-base font-medium min-w-[200px]"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Authenticating...
                </>
              ) : (
                "Access the Library"
              )}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-8 h-12 text-base font-medium min-w-[200px]"
              onClick={() => {
                const el = document.getElementById("subjects");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Explore Subjects
            </Button>
          </div>
        </div>
      </section>

      {/* Stats / Community Impact */}
      <section className="py-12 border-y bg-muted/30">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-16">
            <div className="flex flex-col items-center sm:items-start gap-1">
              <div className="flex items-center gap-2 text-primary mb-2">
                <BookOpen className="h-5 w-5" />
                <span className="text-xs font-bold tracking-widest uppercase">
                  Knowledge shared
                </span>
              </div>
              <p className="text-4xl font-bold font-serif tracking-tight">
                12,400+
              </p>
              <p className="text-sm text-muted-foreground">
                Peer-vetted study notes
              </p>
            </div>
            <div className="flex flex-col items-center sm:items-start gap-1">
              <div className="flex items-center gap-2 text-primary mb-2">
                <Users className="h-5 w-5" />
                <span className="text-xs font-bold tracking-widest uppercase">
                  Active scholars
                </span>
              </div>
              <p className="text-4xl font-bold font-serif tracking-tight">
                5,800+
              </p>
              <p className="text-sm text-muted-foreground">
                Students learning together
              </p>
            </div>
            <div className="flex flex-col items-center sm:items-start gap-1">
              <div className="flex items-center gap-2 text-primary mb-2">
                <GraduationCap className="h-5 w-5" />
                <span className="text-xs font-bold tracking-widest uppercase">
                  Subject domains
                </span>
              </div>
              <p className="text-4xl font-bold font-serif tracking-tight">24</p>
              <p className="text-sm text-muted-foreground">
                Academic categories
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Highlights / Collections */}
      <section className="py-24 overflow-hidden">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-12">
            <div className="max-w-xl">
              <h2 className="text-3xl sm:text-4xl font-bold font-serif tracking-tight mb-4">
                Curated Academic Collections.
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Explore deep-dives into specialized disciplines. Our library is
                organized to facilitate mastery through structured, high-density
                study materials.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-2xl border bg-card hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold font-serif mb-3">
                STEM Excellence
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                From Advanced Calculus to Quantum Mechanics. Precision notes for
                the next generation of engineers and scientists.
              </p>
              <div className="flex flex-wrap gap-2 pt-4 border-t">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Calculus
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Physics
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Biology
                </span>
              </div>
            </div>

            <div className="group p-8 rounded-2xl border bg-card hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold font-serif mb-3">
                Humanities & Arts
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Critical analyses of History, Philosophy, and Literature.
                Context-rich notes that foster deep understanding.
              </p>
              <div className="flex flex-wrap gap-2 pt-4 border-t">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Philosophy
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  History
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Arts
                </span>
              </div>
            </div>

            <div className="group p-8 rounded-2xl border bg-card hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 mb-6 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold font-serif mb-3">
                Social Sciences
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                The latest perspectives on Economics, Sociology, and Psychology.
                Structured for clarity and retention.
              </p>
              <div className="flex flex-wrap gap-2 pt-4 border-t">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Economics
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Psychology
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Law
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Scholarly Workflow */}
      <section className="py-16 md:py-24 bg-muted/20 border-y">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
            <div className="flex-1 space-y-8">
              <h2 className="text-3xl sm:text-4xl font-bold font-serif tracking-tight">
                A Unified Path to <br className="hidden sm:block" /> Academic
                Mastery.
              </h2>
              <div className="space-y-10 md:space-y-12">
                <div className="relative pl-12">
                  <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    1
                  </div>
                  <h4 className="font-bold mb-2">Discover</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Browse through thousands of community-vetted notes. Use
                    advanced filters to find exactly what fits your syllabus.
                  </p>
                </div>
                <div className="relative pl-12">
                  <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    2
                  </div>
                  <h4 className="font-bold mb-2">Synthesize</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Save collections to your personal library. Study
                    cross-disciplinary insights and build a comprehensive
                    knowledge base.
                  </p>
                </div>
                <div className="relative pl-12">
                  <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    3
                  </div>
                  <h4 className="font-bold mb-2">Contribute</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Share your own high-quality notes. Help others succeed while
                    building your reputation as a subject matter expert.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1 w-full max-w-md relative">
              <div className="absolute inset-0 bg-primary/5 rounded-3xl -rotate-2 -translate-x-2" />
              <div className="relative p-6 sm:p-8 rounded-3xl border bg-card shadow-2xl space-y-6 flex flex-col justify-center h-full">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                    Trust & Security
                  </div>
                  <h3 className="text-2xl font-bold font-serif tracking-tight">
                    Decentralized Knowledge.
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed italic font-serif">
                    "NoteSwap is built on the Internet Computer, ensuring your
                    contributions are permanent, secure, and truly yours."
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-6 border-t">
                  <div>
                    <p className="font-semibold text-sm">Data Ownership</p>
                    <p className="text-[11px] text-muted-foreground">
                      Your notes stay under your control, always.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">On-Chain Security</p>
                    <p className="text-[11px] text-muted-foreground">
                      Tamper-proof storage for academic integrity.
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <p className="text-[10px] font-medium text-muted-foreground">
                    Verified by Internet Identity
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subjects Grid */}
      <section id="subjects" className="py-16 md:py-24 bg-card border-y">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
            <h2 className="text-3xl font-bold font-serif tracking-tight mb-4">
              Knowledge Domains
            </h2>
            <p className="text-muted-foreground">
              Deep dive into specialized notes across our curated academic
              disciplines.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {ALL_SUBJECTS.map((s) => (
              <div
                key={s}
                className="group p-4 rounded-xl border bg-background hover:border-primary/50 hover:shadow-sm transition-all text-center cursor-default"
              >
                <p className="text-sm font-medium group-hover:text-primary transition-colors">
                  {subjectLabel(s)}
                </p>
              </div>
            ))}
            <div className="p-4 rounded-xl border border-dashed flex items-center justify-center">
              <p className="text-xs text-muted-foreground">And more...</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values / Mission */}
      <section className="py-16 md:py-24 lg:py-32">
        <div className="container max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl sm:text-4xl font-bold font-serif tracking-tight leading-tight">
                Designed for the <br />
                <span className="text-primary">Serious Student.</span>
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">
                      Scholar-Vetted Content
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Every note is part of a peer-review cycle through upvotes
                      and saves.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Search className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Precision Discovery</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Find exactly what you need with advanced tag-based search
                      and subject filtering.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <NotebookPen className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Contribution Rewards</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Build your academic reputation and help fellow students
                      succeed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-primary/5 rounded-3xl -rotate-2 -translate-x-2" />
              <div className="relative p-6 sm:p-8 rounded-3xl border bg-card shadow-2xl space-y-6 flex flex-col justify-center h-full">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                    Trust & Security
                  </div>
                  <h3 className="text-2xl font-bold font-serif tracking-tight">
                    Decentralized Knowledge.
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed italic font-serif">
                    "NoteSwap is built on the Internet Computer, ensuring your
                    contributions are permanent, secure, and truly yours."
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-6 border-t">
                  <div>
                    <p className="font-semibold text-sm">Data Ownership</p>
                    <p className="text-[11px] text-muted-foreground">
                      Your notes stay under your control, always.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">On-Chain Security</p>
                    <p className="text-[11px] text-muted-foreground">
                      Tamper-proof storage for academic integrity.
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <p className="text-[10px] font-medium text-muted-foreground">
                    Verified by Internet Identity
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 border-t">
        <div className="container max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-5xl font-bold font-serif tracking-tight mb-8">
            Ready to study smarter?
          </h2>
          <Button
            onClick={() => login()}
            size="lg"
            className="rounded-full px-10 h-14 text-lg font-medium shadow-xl shadow-primary/20"
          >
            Join the Community
          </Button>
          <p className="mt-6 text-sm text-muted-foreground">
            Built with scholarly care on the Internet Computer.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t bg-muted/20">
        <div className="container max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5 opacity-60">
            <NotebookPen className="w-4 h-4" />
            <span className="font-semibold tracking-tight text-sm">
              NoteSwap
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            &copy; 2026. Built with{" "}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground transition-colors font-medium"
            >
              caffeine.ai
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
