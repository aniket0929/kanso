import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="space-y-3">
        <Skeleton className="h-12 w-40" />
        <Skeleton className="h-6 w-96" />
      </div>

      <div className="grid gap-8">
        <div className="rounded-xl border bg-card">
          <div className="p-6 space-y-3 border-b">
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-5 w-full max-w-lg" />
          </div>
          <div className="p-6 space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="grid gap-3">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-64" />
              </div>
            ))}
            <Skeleton className="h-10 w-36" />
          </div>
        </div>
      </div>
    </div>
  );
}
