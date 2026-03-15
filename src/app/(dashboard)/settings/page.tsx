"use client";

import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/shared/Badge";
import { UserAvatar } from "@/components/shared/UserAvatar";

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your profile and preferences</p>
      </div>

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
