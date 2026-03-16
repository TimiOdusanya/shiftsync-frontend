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
import { SwapRequestCard } from "@/app/(dashboard)/swaps/SwapRequestCard";
import { SwapHistoryCard } from "@/app/(dashboard)/swaps/SwapHistoryCard";
import { SwapListSkeleton } from "@/app/(dashboard)/swaps/SwapsPageSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { RefreshCw } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";

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
  const pendingApproval = data?.pendingApproval ?? [];
  const approvedByMe = data?.approvedByMe ?? [];
  const history = data?.history ?? [];

  return (
    <div className="space-y-8">
      <header className="flex min-w-0 items-start gap-2 sm:gap-3">
        <RefreshCw className="mt-1 h-5 w-5 shrink-0 text-info sm:h-6 sm:w-6" aria-hidden />
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-bold leading-6 tracking-tight text-foreground sm:text-lg">
            Shift swaps
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage incoming and outgoing swap requests
          </p>
        </div>
      </header>

      {canManage && pendingApproval.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pending your approval</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {pendingApproval.map((s) => (
                <SwapRequestCard
                  key={s.id}
                  swap={s}
                  variant="pendingApproval"
                  onApprove={(id) => approveSwap.mutate(id)}
                  onReject={(id) => rejectByManager.mutate({ id })}
                  isApprovePending={approveSwap.isPending}
                  isRejectPending={rejectByManager.isPending}
                />
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {canManage && approvedByMe.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Decisions you made</CardTitle>
            <p className="text-sm font-normal text-muted-foreground">
              Swap requests you have approved
            </p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {approvedByMe.map((s) => (
                <SwapRequestCard key={s.id} swap={s} variant="approvedByMe" />
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {canManage && history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Swap history</CardTitle>
            <p className="text-sm font-normal text-muted-foreground">
              Approved and declined requests in your scope — requester, receiver, and who approved or declined
            </p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {history.map((s) => (
                <SwapHistoryCard key={s.id} swap={s} />
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

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
              description="Swap requests you've initiated will appear here (including accepted, declined, or cancelled)."
            />
          ) : (
            <ul className="space-y-3">
              {initiated.map((s) => (
                <SwapRequestCard
                  key={s.id}
                  swap={s}
                  variant="sent"
                  onCancel={(id) => cancelSwap.mutate(id)}
                  isCancelPending={cancelSwap.isPending}
                />
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
              description="Swap requests from colleagues will appear here (including ones you accepted or declined)."
            />
          ) : (
            <ul className="space-y-3">
              {received.map((s) => (
                <SwapRequestCard
                  key={s.id}
                  swap={s}
                  variant="received"
                  canManage={canManage}
                  onAccept={(id) => acceptSwap.mutate(id)}
                  onDecline={(id) => rejectSwap.mutate({ id })}
                  onApprove={(id) => approveSwap.mutate(id)}
                  onReject={(id) => rejectByManager.mutate({ id })}
                  isAcceptPending={acceptSwap.isPending}
                  isDeclinePending={rejectSwap.isPending}
                  isApprovePending={approveSwap.isPending}
                  isRejectPending={rejectByManager.isPending}
                />
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
