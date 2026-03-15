"use client";

import { useState } from "react";
import { useOpenDrops, useMyDrops } from "@/hooks/useDrops";
import { useClaimDrop, useApproveDrop, useRejectDrop } from "@/hooks/useDrops";
import { useLocations } from "@/hooks/useLocations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusTag } from "@/components/shared/StatusTag";
import { TimezoneDisplay } from "@/components/shared/TimezoneDisplay";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { LogOut } from "lucide-react";

export default function DropsPage() {
  const [locationId, setLocationId] = useState<string>("");
  const { data: locations = [] } = useLocations();
  const { data: openDrops = [], isLoading: openLoading } = useOpenDrops(locationId || undefined);
  const { data: myDrops = [], isLoading: myLoading } = useMyDrops();
  const claimDrop = useClaimDrop();
  const approveDrop = useApproveDrop();
  const rejectDrop = useRejectDrop();
  const { user } = useAuth();
  const canManage = user?.role === "ADMIN" || user?.role === "MANAGER";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Drop requests</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage shift drops and open claims</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">My drop requests</CardTitle>
        </CardHeader>
        <CardContent>
          {myLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3.5 w-56" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              ))}
            </div>
          ) : myDrops.length === 0 ? (
            <EmptyState
              icon={<LogOut className="h-5 w-5" />}
              title="No drop requests"
              description="Shifts you've dropped will appear here."
            />
          ) : (
            <ul className="space-y-3">
              {myDrops.map((d) => (
                <li
                  key={d.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-4"
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
                  <StatusTag type="drop" value={d.status} />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle className="text-lg">Open shifts to claim</CardTitle>
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
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3.5 w-64" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                  <Skeleton className="h-9 w-16 rounded-lg" />
                </div>
              ))}
            </div>
          ) : openDrops.length === 0 ? (
            <EmptyState
              icon={<LogOut className="h-5 w-5" />}
              title="No open shifts to claim"
              description="Dropped shifts available for claiming will appear here."
            />
          ) : (
            <ul className="space-y-3">
              {openDrops.map((d) => (
                <li
                  key={d.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-4"
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
                    {d.status === "OPEN" && (
                      <Button
                        size="sm"
                        onClick={() => claimDrop.mutate(d.id)}
                        loading={claimDrop.isPending}
                      >
                        Claim
                      </Button>
                    )}
                    {canManage && d.status === "CLAIMED_PENDING_APPROVAL" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => approveDrop.mutate(d.id)}
                          loading={approveDrop.isPending}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => rejectDrop.mutate(d.id)}
                          disabled={rejectDrop.isPending}
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
