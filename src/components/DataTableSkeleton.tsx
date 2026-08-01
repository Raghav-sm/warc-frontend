import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type DataTableSkeletonProps = {
  columns: number | { label: string }[];
  showIndexColumn?: boolean;
  indexColumnLabel?: string;
  rowCount?: number;
};

const SKELETON_ROW_IDS = [
  "sr1",
  "sr2",
  "sr3",
  "sr4",
  "sr5",
  "sr6",
  "sr7",
  "sr8",
  "sr9",
  "sr10",
  "sr11",
  "sr12",
  "sr13",
  "sr14",
  "sr15",
  "sr16",
] as const;

function resolveColumns(cols: number | { label: string }[]): { label: string }[] {
  if (typeof cols === "number") {
    return Array.from({ length: cols }, (_, i) => ({
      label: `Column ${i + 1}`,
    }));
  }
  return cols;
}

/**
 * Renders a table skeleton matching DataTable layout.
 * Use when loading listing pages to show the table structure while data loads.
 */
export function DataTableSkeleton({
  columns,
  showIndexColumn = false,
  indexColumnLabel = "#",
  rowCount = 8,
}: DataTableSkeletonProps) {
  const displayColumns = showIndexColumn
    ? [{ label: indexColumnLabel }, ...resolveColumns(columns)]
    : resolveColumns(columns);
  const rowIds = SKELETON_ROW_IDS.slice(0, rowCount);

  return (
    <div className="shadow-xs border border-neutral-200 rounded-md bg-white">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {displayColumns.map((c) => (
              <TableHead key={c.label}>{c.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rowIds.map((rowId) => (
            <TableRow key={rowId} className="hover:bg-transparent">
              {displayColumns.map((c) => (
                <TableCell key={`${rowId}-${c.label}`}>
                  <Skeleton className="h-5 w-full max-w-30" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between p-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  );
}
