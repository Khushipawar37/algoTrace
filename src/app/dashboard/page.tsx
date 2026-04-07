"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ProgressChart = dynamic(
  () => import("@/components/dashboard/progress-chart").then((module) => module.ProgressChart),
  { ssr: false },
);

export default function DashboardPage() {
  return (
    <main className="mx-auto w-full max-w-6xl space-y-4 px-4 py-6 md:px-6">
      <Button asChild variant="ghost">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Longitudinal Progress Dashboard</CardTitle>
          <CardDescription>Weakness trend moving down across recent sessions.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProgressChart />
        </CardContent>
      </Card>
    </main>
  );
}
