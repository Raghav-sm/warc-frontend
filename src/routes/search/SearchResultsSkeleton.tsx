import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const SECTIONS = [
  { key: "projects", rows: 3 },
  { key: "tasks", rows: 4 },
  { key: "comments", rows: 3 },
] as const;

export function SearchResultsSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading search results">
      {SECTIONS.map((section) => (
        <Card key={section.key}>
          <CardHeader className="pb-3">
            <Skeleton className="h-5 w-36" />
          </CardHeader>
          <CardContent className="space-y-2">
            {Array.from({ length: section.rows }, (_, index) => (
              <Skeleton key={`${section.key}-${index}`} className="h-12 w-full rounded-md" />
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
