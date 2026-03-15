"use client";

import { useSwapRequests } from "@/hooks/useSwapRequests";
import {
  useAcceptSwap,
  useRejectSwap,
  useApproveSwap,
  useRejectSwapByManager,
  useCancelSwap,
} from "@/hooks/useSwapRequests";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusTag } from "@/components/shared/StatusTag";
import { SwapListSkeleton } from "@/app/(dashboard)/swaps/SwapsPageSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { TimezoneDisplay } from "@/components/shared/TimezoneDisplay";
import { formatDate } from "@/lib/utils";
import { usePermissions } from "@/hooks/usePermissions";
import { RefreshCw } from "lucide-react";

export default function SwapsPage() {
  const { data, isLoading } = useSwapRequests();
  const { canManageSchedule: canManage } = usePermissions();
  const acceptSwap = useAcceptSwap();
  const rejectSwap = useRejectSwap();
  const approveSwap = useApproveSwap();
  const rejectByManager = useRejectSwapByManager();
  const cancelSwap = useCancelSwap();

  const initiated = data?.initiated ?? [];
  const received = data?.received ?? [];

  return (
    <div className="space-y-8">
      <header className="flex min-w-0 items-start gap-2 sm:gap-3">
        <RefreshCw className="mt-1 h-5 w-5 shrink-0 text-info sm:h-6 sm:w-6" aria-hidden />
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-bold leading-6 tracking-tight text-foreground sm:text-lg">Shift swaps</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage incoming and outgoing swap requests</p>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Requests I sent</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <SwapListSkeleton />
          ) : initiated.length === 0 ? (
            <EmptyState
              icon={<RefreshCw className="h-5 w-5 text-info" />}
              title="No swap requests sent"
              description="Swap requests you've initiated will appear here."
            />
          ) : (
            <ul className="space-y-3">
              {initiated.map((s) => (
                <li
                  key={s.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/20 p-4 transition-colors hover:bg-muted/40 hover:border-border"
                >
                  <div className="space-y-1 text-sm">
                    <p className="font-medium text-foreground">
                      {s.shift?.skill?.name} @ {s.shift?.location?.name}
                    </p>
                    <p className="text-muted-foreground">
                      <TimezoneDisplay
                        utcDate={s.shift?.startAt ?? ""}
                        timezone={s.shift?.location?.timezone ?? "UTC"}
                      />
                      {" → with "}
                      {s.receiver?.firstName} {s.receiver?.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatDate(s.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusTag type="swap" value={s.status} />
                    {s.status === "PENDING_ACCEPTANCE" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => cancelSwap.mutate(s.id)}
                        loading={cancelSwap.isPending}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Requests I received</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <SwapListSkeleton />
          ) : received.length === 0 ? (
            <EmptyState
              icon={<RefreshCw className="h-5 w-5 text-info" />}
              title="No swap requests received"
              description="Swap requests from colleagues will appear here."
            />
          ) : (
            <ul className="space-y-3">
              {received.map((s) => (
                <li
                  key={s.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/20 p-4 transition-colors hover:bg-muted/40 hover:border-border"
                >
                  <div className="space-y-1 text-sm">
                    <p className="font-medium text-foreground">
                      {s.requester?.firstName} {s.requester?.lastName} wants to swap
                    </p>
                    <p className="text-muted-foreground">
                      {s.shift?.skill?.name} @ {s.shift?.location?.name} —{" "}
                      <TimezoneDisplay
                        utcDate={s.shift?.startAt ?? ""}
                        timezone={s.shift?.location?.timezone ?? "UTC"}
                      />
                    </p>
                    <p className="text-xs text-muted-foreground">{formatDate(s.createdAt)}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusTag type="swap" value={s.status} />
                    {s.status === "PENDING_ACCEPTANCE" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => acceptSwap.mutate(s.id)}
                          loading={acceptSwap.isPending}
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => rejectSwap.mutate({ id: s.id })}
                          disabled={rejectSwap.isPending}
                        >
                          Decline
                        </Button>
                      </>
                    )}
                    {canManage && s.status === "PENDING_APPROVAL" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => approveSwap.mutate(s.id)}
                          loading={approveSwap.isPending}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => rejectByManager.mutate({ id: s.id })}
                          disabled={rejectByManager.isPending}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
