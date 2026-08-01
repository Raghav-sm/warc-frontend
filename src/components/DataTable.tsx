import type { ApolloError } from "@apollo/client";
import dayjs from "dayjs";
import { type FC, type ReactNode, useState } from "react";

import { Loader } from "@/components/LoadingIndicator";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { cn } from "@/utils/classnames";

/** React-style bivariant callback so typed formatters remain assignable. */
type BivariantCallback<Args extends unknown[], R> = {
  bivarianceHack(...args: Args): R;
}["bivarianceHack"];

export type DataTableRow = Record<string, unknown> & { id?: string | number };

export interface Column<T extends DataTableRow = DataTableRow> {
  label: string;
  fieldName: string;
  type?:
    | "DATE"
    | "DATETIME"
    | "STRING"
    | "CURRENCY"
    | "IMAGE"
    | "NUMBER"
    | "BOOLEAN"
    | "SELECT"
    | "FILE"
    | "INDEX"
    | "ACTIONS";
  formatter?: BivariantCallback<[value: unknown, row?: T], ReactNode>;
  fallbackValue?: ReactNode | BivariantCallback<[value: unknown, row?: T], ReactNode>;
}

const DataTableHead: FC<{
  columns: Column[];
  isSelected: boolean;
  onSelectAll: (value: boolean) => void;
}> = ({ columns }) => (
  <TableHeader>
    <TableRow className="hover:bg-transparent">
      {columns.map((c: Column) => (
        <TableHead key={c.fieldName + c.label}>
          {c.type === "SELECT"
            ? // <Checkbox
              //   size="small"
              //   sx={{
              //     height: '24px',
              //     width: '24px',
              //   }}
              //   value={isSelected}
              //   onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSelectAll(e.target.checked)}
              // />
              null
            : c.label}
        </TableHead>
      ))}
    </TableRow>
  </TableHeader>
);

const DataTableCell: FC<{
  value: unknown;
  row?: DataTableRow;
  type?: Column["type"];
  formatter?: Column["formatter"];
  fallbackValue?: Column["fallbackValue"];
  onSelect?: (value: boolean) => void;
}> = ({ value, row, type, formatter, fallbackValue }) => {
  const fallback = fallbackValue ? (
    typeof fallbackValue === "function" ? (
      fallbackValue(value, row)
    ) : (
      fallbackValue
    )
  ) : (
    <span className="text-muted-foreground">—</span>
  );

  const useFallback = value === undefined || value === null;

  switch (type) {
    case "INDEX":
      return <TableCell className="text-muted-foreground">{value as ReactNode}</TableCell>;
    case "SELECT":
      return (
        <TableCell onClick={(e: React.MouseEvent) => e.stopPropagation()}>
          {/* <Checkbox
            size="small"
            sx={{
              height: '24px',
              width: '24px',
            }}
            checked={value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSelect(e.target.checked)}
          /> */}
        </TableCell>
      );
    case "CURRENCY":
      return (
        <TableCell>
          {useFallback ? fallback : `₹ ${typeof value === "number" ? value.toLocaleString("en-IN") : String(value)}`}
        </TableCell>
      );
    case "DATE":
      return (
        <TableCell align="left">
          {useFallback ? fallback : dayjs(value as string | number | Date).format("D MMMM YYYY")}
        </TableCell>
      );
    case "DATETIME":
      return (
        <TableCell align="left">
          {useFallback ? fallback : dayjs(value as string | number | Date).format("h:mm A, D MMM YYYY")}
        </TableCell>
      );
    case "IMAGE":
      return (
        <TableCell>
          <div
            style={{
              backgroundImage: `url("${String(value)}")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "cover",
              border: "1px solid #d4d4d4",
              height: "36px",
              width: "36px",
              margin: "8px",
              borderRadius: "4px",
            }}
          />
        </TableCell>
      );
    case "NUMBER":
      return <TableCell>{useFallback ? fallback : (value as ReactNode)}</TableCell>;
    case "BOOLEAN":
      return <TableCell>{useFallback ? fallback : value ? "TRUE" : "FALSE"}</TableCell>;
    case "FILE":
      return (
        <TableCell>
          <a
            href={String(value)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 hover:underline"
          >
            View File
          </a>
        </TableCell>
      );
    case "ACTIONS":
      return <TableCell>{formatter ? formatter(value, row) : null}</TableCell>;
    default:
      if (formatter) {
        return <TableCell>{formatter(value, row)}</TableCell>;
      }
      return <TableCell>{useFallback ? fallback : (value as ReactNode)}</TableCell>;
  }
};

function DataTable<T extends DataTableRow>({
  data,
  columns,
  showIndexColumn = false,
  indexColumnLabel = "#",
  filterLoading = false,
  onClick,
  onSelect,
  rowClassName,
  pagination,
}: {
  data: T[];
  columns: Column[];
  showIndexColumn?: boolean;
  indexColumnLabel?: string;
  filterLoading?: boolean;
  onClick?: BivariantCallback<[dataItem: T], void>;
  bulkSelectActions?: {
    label: string;
    icon?: ReactNode;
    action: (selectedItems: unknown[]) => Promise<unknown>;
    loading?: boolean;
    error?: ApolloError;
  }[];
  onSelect?: (selectedItems: unknown[]) => void;
  rowClassName?: BivariantCallback<[row: T], string | undefined>;
  pagination?: {
    onLoadMore: () => void;
    totalCount?: number | null;
    hasNextPage?: boolean | null;
    loading: boolean;
  };
}) {
  const [selectedItems, setSelectedItems] = useState<unknown[]>([]);

  const displayColumns = showIndexColumn
    ? [
        {
          label: indexColumnLabel,
          fieldName: "__index__",
          type: "INDEX" as const,
        },
        ...columns,
      ]
    : columns;

  function getValueByFieldName(fieldName: string, obj: unknown): unknown {
    // Example: fieldName "group.name" looks for obj[group][name]
    if (!fieldName) return obj;
    return fieldName.split(".").reduce<unknown>((acc, curr) => {
      if (acc == null || typeof acc !== "object") return null;
      return (acc as Record<string, unknown>)[curr];
    }, obj);
  }

  function updateSelectedItems(items: unknown[]) {
    setSelectedItems(items);
    if (onSelect) {
      onSelect(items);
    }
  }

  return (
    <>
      <div className="shadow-xs border border-neutral-200 rounded-md bg-white">
        <Table>
          <DataTableHead
            columns={displayColumns}
            isSelected={selectedItems.length > 0}
            onSelectAll={(checked) => {
              if (!checked) {
                updateSelectedItems([]);
                return;
              }
              updateSelectedItems(
                data.map((item) => getValueByFieldName(displayColumns[showIndexColumn ? 1 : 0].fieldName, item)),
              );
            }}
          />
          <TableBody>
            {filterLoading ? (
              <TableRow>
                <TableCell colSpan={displayColumns.length}>
                  <div className="h-16 w-full flex items-center justify-center">
                    <Loader />
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={displayColumns.length} className="h-16 text-center text-muted-foreground">
                  No results found
                </TableCell>
              </TableRow>
            ) : (
              data.map((d, rowIndex) => (
                <TableRow
                  onClick={() => onClick?.(d)}
                  tabIndex={-1}
                  key={d.id}
                  className={cn(onClick ? "cursor-pointer hover:bg-neutral-50" : "hover:bg-transparent", rowClassName?.(d))}
                >
                  {displayColumns.map((c) => (
                    <DataTableCell
                      key={c.fieldName + c.label}
                      type={c.type}
                      formatter={c.formatter}
                      fallbackValue={c.fallbackValue}
                      row={d}
                      value={
                        c.type === "INDEX"
                          ? rowIndex + 1
                          : c.type === "ACTIONS"
                            ? d
                            : c.type === "SELECT"
                              ? selectedItems.includes(getValueByFieldName(c.fieldName, d))
                              : getValueByFieldName(c.fieldName, d)
                      }
                      onSelect={(checked) => {
                        const fieldValue = getValueByFieldName(c.fieldName, d);
                        const newItems = checked
                          ? [...selectedItems, fieldValue]
                          : selectedItems.filter((item) => item !== fieldValue);
                        updateSelectedItems(newItems);
                      }}
                    />
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {!filterLoading && pagination ? (
        <div className="flex items-center justify-between p-2">
          {pagination.totalCount ? (
            <p className="text-sm text-muted-foreground">
              Showing {data.length} of {pagination.totalCount}
            </p>
          ) : null}
          {pagination.onLoadMore && pagination.hasNextPage && (
            <Button loading={pagination.loading} onClick={pagination.onLoadMore} variant="outline">
              Load More
            </Button>
          )}
        </div>
      ) : null}
    </>
  );
}

export { DataTable };
