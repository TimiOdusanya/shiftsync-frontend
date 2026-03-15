"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatHours } from "@/lib/utils";
import type { FairnessScore } from "@/types";

export interface FairnessCardProps {
  score: FairnessScore;
  userName?: string;
}

export function FairnessCard({ score, userName }: FairnessCardProps) {
  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle className="text-base">{userName ?? score.userId}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        <p>Total: {formatHours(score.totalHours)}</p>
        <p>Premium: {formatHours(score.premiumHours)}</p>
        <p>Score: {(score.score * 100).toFixed(0)}%</p>
        {(score.desiredMin != null || score.desiredMax != null) && (
          <p className="text-muted-foreground">
            Desired: {score.desiredMin ?? "—"} – {score.desiredMax ?? "—"} h
          </p>
        )}
      </CardContent>
    </Card>
  );
}
