"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

export function Progress({ className, value }: { className?: string; value: number }) {
  return (
    <ProgressPrimitive.Root className={cn("relative h-2 overflow-hidden rounded-full bg-muted", className)}>
      <ProgressPrimitive.Indicator
        className="h-full bg-primary transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

