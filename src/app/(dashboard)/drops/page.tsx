"use client";

import { useOpenDrops, useMyDrops, usePendingApprovalDrops } from "@/hooks/useDrops";
import { useClaimDrop, useApproveDrop, useRejectDrop, useCancelDrop } from "@/hooks/useDrops";
import { useLocations } from "@/hooks/useLocations";
import { useLocationFilter } from "@/store/location-filter-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusTag } from "@/components/shared/StatusTag";
import { TimezoneDisplay } from "@/components/shared/TimezoneDisplay";
import { MyDropsCardSkeleton, OpenDropsCardSkeleton } from "@/app/(dashboard)/drops/DropsPageSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import { usePermissions } from "@/hooks/usePermissions";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, UserCheck } from "lucide-react";
import type { DropRequest } from "@/types";

function PendingApprovalItem({
  drop,
  onApprove,
  onReject,
  isApproving,
  isRejecting,
}: {
  drop: DropRequest;
  onApprove: () => void;
  onReject: () => void;
  isApproving: boolean;
  isRejecting: boolean;
}) {
  const claimer = drop.pickup?.user;
  const claimerName = claimer
    ? `${claimer.firstName} ${claimer.lastName}`
    : "Someone";

  return (
    <li className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/20 p-4 transition-colors hover:bg-muted/40 hover:border-border">
      <div className="space-y-1 text-sm">
        <p className="font-medium text-foreground">
          {drop.shift?.skill?.name} @ {drop.shift?.location?.name}
        </p>
        <p className="text-muted-foreground">
          <TimezoneDisplay
            utcDate={drop.shift?.startAt ?? ""}
            timezone={drop.shift?.location?.timezone ?? "UTC"}
          />
          {" — Dropped by "}
          {drop.user?.firstName} {drop.user?.lastName}
          {", claimed by "}
          {claimerName}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={onApprove} loading={isApproving}>
          Approve
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onReject}
          disabled={isRejecting}
        >
          Reject
        </Button>
      </div>
    </li>
  );
}

export default function DropsPage() {
  const { user: currentUser } = useAuth();
  const { locationId, setLocationId } = useLocationFilter();
  const { data: locations = [] } = useLocations();
  const { data: openDrops = [], isLoading: openLoading } = useOpenDrops(locationId || undefined);
  const { data: myDrops = [], isLoading: myLoading } = useMyDrops();
  const { canManageSchedule: canManage } = usePermissions();
  const { data: pendingApproval = [], isLoading: pendingLoading } = usePendingApprovalDrops(
    locationId || undefined,
    !!canManage
  );
  const claimDrop = useClaimDrop();
  const cancelDrop = useCancelDrop();
  const approveDrop = useApproveDrop();
  const rejectDrop = useRejectDrop();

  return (
    <div className="space-y-8">
      <header className="flex min-w-0 items-start gap-2 sm:gap-3">
        <LogOut className="mt-1 h-5 w-5 shrink-0 text-info sm:h-6 sm:w-6" aria-hidden />
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-bold leading-6 tracking-tight text-foreground sm:text-lg">Drop requests</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage shift drops and open claims</p>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">My drop requests</CardTitle>
        </CardHeader>
        <CardContent>
          {myLoading ? (
            <MyDropsCardSkeleton />
          ) : myDrops.length === 0 ? (
            <EmptyState
              icon={<LogOut className="h-5 w-5 text-info" />}
              title="No drop requests"
              description="Shifts you've dropped will appear here."
            />
          ) : (
            <ul className="space-y-3">
              {myDrops.map((d) => (
                <li
                  key={d.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/20 p-4 transition-colors hover:bg-muted/40 hover:border-border"
                >
                  <div className="space-y-1 text-sm">
                    <p className="font-medium text-foreground">
                      {d.shift?.skill?.name} @ {d.shift?.location?.name}
                    </p>
                    <p className="text-muted-foreground">
                      <TimezoneDisplay
                        utcDate={d.shift?.startAt ?? ""}
                        timezone={d.shift?.location?.timezone ?? "UTC"}
                      />
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Expires {formatDate(d.expiresAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusTag type="drop" value={d.status} />
                    {d.status === "OPEN" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => cancelDrop.mutate(d.id)}
                        disabled={cancelDrop.isPending}
                      >
                        Withdraw
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {canManage && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-info" aria-hidden />
              Pending your approval
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingLoading ? (
              <OpenDropsCardSkeleton />
            ) : pendingApproval.length === 0 ? (
              <EmptyState
                icon={<UserCheck className="h-5 w-5 text-info" />}
                title="No drops pending approval"
                description="When staff claim dropped shifts, they will appear here for you to approve or reject."
              />
            ) : (
              <ul className="space-y-3">
                {pendingApproval.map((d) => (
                  <PendingApprovalItem
                    key={d.id}
                    drop={d}
                    onApprove={() => approveDrop.mutate(d.id)}
                    onReject={() => rejectDrop.mutate(d.id)}
                    isApproving={approveDrop.isPending}
                    isRejecting={rejectDrop.isPending}
                  />
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg">Open shifts to claim</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              {canManage
                ? "Only staff can claim; use Pending your approval to approve or reject claims."
                : "You can claim shifts you’re certified for (location and skill)."}
            </p>
          </div>
          <div className="w-44">
            <Select
              value={locationId || "__all__"}
              onValueChange={(v) => setLocationId(v === "__all__" ? "" : v)}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="All locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">All locations</SelectItem>
                {locations.map((loc) => (
                  <SelectItem key={loc.id} value={loc.id}>
                    {loc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {openLoading ? (
            <OpenDropsCardSkeleton />
          ) : openDrops.length === 0 ? (
            <EmptyState
              icon={<LogOut className="h-5 w-5 text-info" />}
              title="No open shifts to claim"
              description="Dropped shifts available for claiming will appear here."
            />
          ) : (
            <ul className="space-y-3">
              {openDrops.map((d) => (
                <li
                  key={d.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/20 p-4 transition-colors hover:bg-muted/40 hover:border-border"
                >
                  <div className="space-y-1 text-sm">
                    <p className="font-medium text-foreground">
                      {d.shift?.skill?.name} @ {d.shift?.location?.name}
                    </p>
                    <p className="text-muted-foreground">
                      <TimezoneDisplay
                        utcDate={d.shift?.startAt ?? ""}
                        timezone={d.shift?.location?.timezone ?? "UTC"}
                      />
                      {" — Dropped by "}
                      {d.user?.firstName} {d.user?.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Expires {formatDate(d.expiresAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusTag type="drop" value={d.status} />
                    {d.status === "OPEN" && !canManage && d.userId !== currentUser?.id && (
                      <Button
                        size="sm"
                        onClick={() => claimDrop.mutate(d.id)}
                        loading={claimDrop.isPending}
                      >
                        Claim
                      </Button>
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
