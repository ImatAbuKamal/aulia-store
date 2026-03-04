import { cn } from "@/lib/utils";

export function Loader({ className }: { className?: string }) {
  return <div className={cn("loading", className)}></div>;
}
