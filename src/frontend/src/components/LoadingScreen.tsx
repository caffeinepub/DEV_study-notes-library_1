import { Loader2 } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="h-dvh flex items-center justify-center bg-background">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
}
