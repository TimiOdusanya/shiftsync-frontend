"use client";

import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/shared/Badge";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { AvailabilitySection } from "@/features/settings/components/AvailabilitySection";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <header className="flex min-w-0 items-start gap-2 sm:gap-3">
        <Settings className="mt-1 h-5 w-5 shrink-0 text-muted-foreground sm:h-6 sm:w-6" aria-hidden />
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-bold leading-6 tracking-tight text-foreground sm:text-lg">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your profile and preferences</p>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {user && (
            <>
              <div className="flex items-center gap-4">
                <UserAvatar
                  firstName={user.firstName}
                  lastName={user.lastName}
                  size="lg"
                />
                <div>
                  <p className="font-semibold text-foreground">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <div className="mt-1.5">
                    <Badge variant="secondary" className="capitalize">
                      {user.role.toLowerCase()}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>First name</Label>
                  <Input value={user.firstName} readOnly disabled />
                </div>
                <div className="space-y-2">
                  <Label>Last name</Label>
                  <Input value={user.lastName} readOnly disabled />
                </div>
                <div className="space-y-2">
                  <Label>Email address</Label>
                  <Input value={user.email} readOnly disabled />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input value={user.role} readOnly disabled />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <AvailabilitySection />

      <Card>
        <CardHeader>
          <CardTitle>Notification preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            In-app and email notification settings coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
