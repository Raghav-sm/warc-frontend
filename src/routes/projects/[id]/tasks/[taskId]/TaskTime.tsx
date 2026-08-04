import { useMutation, useQuery } from "@apollo/client";
import dayjs from "dayjs";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import z from "zod";

import { DataTable } from "@/components/DataTable";
import { DataTableSkeleton } from "@/components/DataTableSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { ErrorAlert } from "@/components/ErrorAlert";
import { FormDialog } from "@/components/FormDialog";
import { Button } from "@/components/ui/button";
import { getGraphQLErrorMessage } from "@/utils/graphql-errors";

import { CREATE_TIME_LOG_MUTATION, TASK_TIME_LOGS_QUERY } from "./task-detail-query";

type TaskTimeProps = {
  taskId: string;
  canEdit?: boolean;
};

type TimeLogNode = {
  id: string;
  userFirstName?: string | null;
  userLastName?: string | null;
  startedAt: string;
  endedAt?: string | null;
  durationMinutes?: number | null;
  note?: string | null;
};

const ManualTimeLogSchema = z.object({
  startedAt: z.string().min(1, "Start time is required"),
  endedAt: z.string().min(1, "End time is required"),
  note: z.string().optional().nullable(),
});

export function formatDurationMinutes(totalMinutes: number): string {
  if (totalMinutes <= 0) return "0m";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

export function TaskTime({ taskId, canEdit = true }: TaskTimeProps) {
  const [manualOpen, setManualOpen] = useState(false);

  const { data, loading, error } = useQuery(TASK_TIME_LOGS_QUERY, {
    variables: { taskId, page: 1, limit: 100 },
    skip: !taskId,
  });

  const [createTimeLog, { loading: creating, error: createError }] = useMutation(CREATE_TIME_LOG_MUTATION, {
    refetchQueries: ["TaskTimeLogs"],
    onCompleted: () => {
      toast.success("Time entry added");
      setManualOpen(false);
    },
    onError: (err) => toast.error(getGraphQLErrorMessage(err) || "Failed to add time entry"),
  });

  const logs = (data?.getTimeLogs?.nodes ?? []) as TimeLogNode[];
  const totalMinutes = data?.getTimeLogs?.totalMinutes ?? 0;

  const columns = [
    {
      label: "User",
      fieldName: "user",
      formatter: (_: unknown, row?: TimeLogNode) => [row?.userFirstName, row?.userLastName].filter(Boolean).join(" ") || "—",
    },
    {
      label: "Started",
      fieldName: "startedAt",
      type: "DATETIME" as const,
    },
    {
      label: "Ended",
      fieldName: "endedAt",
      type: "DATETIME" as const,
    },
    {
      label: "Duration",
      fieldName: "durationMinutes",
      formatter: (value: unknown) => formatDurationMinutes(Number(value) || 0),
    },
    {
      label: "Note",
      fieldName: "note",
      formatter: (value: unknown) => (value ? String(value) : "—"),
    },
  ];

  if (loading && !data) {
    return <DataTableSkeleton columns={columns} />;
  }

  if (error) {
    return <ErrorAlert error={getGraphQLErrorMessage(error)} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-neutral-200 bg-white p-4 shadow-xs">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Time tracked</p>
          <p className="text-2xl font-semibold tabular-nums">{formatDurationMinutes(totalMinutes)}</p>
        </div>
        {canEdit ? (
          <FormDialog
            open={manualOpen}
            onOpenChange={setManualOpen}
            trigger={
              <Button variant="outline">
                <Clock className="size-4" />
                Manual entry
              </Button>
            }
            title="Add time entry"
            description="Record time worked outside the timer."
            schema={ManualTimeLogSchema}
            loading={creating}
            error={createError}
            submitLabel="Add entry"
            onSubmit={async (formData) => {
              const startedAt = dayjs(formData.startedAt).toDate();
              const endedAt = dayjs(formData.endedAt).toDate();
              if (endedAt <= startedAt) {
                toast.error("End time must be after start time");
                return;
              }
              await createTimeLog({
                variables: {
                  taskId,
                  startedAt,
                  endedAt,
                  note: formData.note,
                },
              });
            }}
          >
            {({ FormInput }) => (
              <>
                <FormInput fieldName="startedAt" label="Started at" type="date" required colSpan="full" />
                <FormInput fieldName="endedAt" label="Ended at" type="date" required colSpan="full" />
                <FormInput fieldName="note" label="Note" type="textarea" colSpan="full" />
              </>
            )}
          </FormDialog>
        ) : null}
      </div>

      {logs.length === 0 ? (
        <EmptyState title="No time logged" description="Start the timer or add a manual entry." icon={Clock} />
      ) : (
        <DataTable data={logs} columns={columns} />
      )}
    </div>
  );
}

export function useElapsedSeconds(startedAt: string | null | undefined, active: boolean) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!active || !startedAt) {
      setElapsed(0);
      return;
    }

    const tick = () => {
      setElapsed(Math.max(0, Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000)));
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [active, startedAt]);

  return elapsed;
}

export function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
