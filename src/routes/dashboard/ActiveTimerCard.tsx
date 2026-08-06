import { useMutation } from "@apollo/client";
import { Clock } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatElapsed, useElapsedSeconds } from "@/routes/projects/[id]/tasks/[taskId]/TaskTime";
import { getGraphQLErrorMessage } from "@/utils/graphql-errors";

import { DASHBOARD_STOP_TIMER } from "./dashboard-query";

const cardClasses = "h-full w-full border border-neutral-200 bg-white shadow-xs p-0 rounded-md overflow-hidden";

type ActiveTimer = {
  id: string;
  taskId: string;
  taskTitle: string;
  projectId: string;
  projectName: string;
  startedAt: string;
};

type ActiveTimerCardProps = {
  timer: ActiveTimer;
};

export function ActiveTimerCard({ timer }: ActiveTimerCardProps) {
  const navigate = useNavigate();
  const elapsedSeconds = useElapsedSeconds(timer.startedAt, true);

  const [stopTimer, { loading }] = useMutation(DASHBOARD_STOP_TIMER, {
    refetchQueries: ["DashboardOverview"],
    onCompleted: () => toast.success("Timer stopped"),
    onError: (err) => toast.error(getGraphQLErrorMessage(err) || "Failed to stop timer"),
  });

  return (
    <Card className={cardClasses}>
      <CardContent className="px-4 py-3">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="size-4 text-primary" />
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Active timer</span>
        </div>
        <p className="font-medium truncate">{timer.taskTitle}</p>
        <p className="text-xs text-muted-foreground truncate mb-3">{timer.projectName}</p>
        <p className="text-2xl font-semibold tabular-nums mb-3">{formatElapsed(elapsedSeconds)}</p>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" loading={loading} onClick={() => void stopTimer()}>
            Stop
          </Button>
          <Button size="sm" onClick={() => navigate(`/projects/${timer.projectId}/tasks/${timer.taskId}`)}>
            Open task
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
