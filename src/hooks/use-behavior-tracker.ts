"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { BehavioralEvent, BehavioralEventType } from "@/lib/types";

interface TrackerConfig {
  sessionId: string;
  userId: string;
  onLongPause?: () => void;
}

export function useBehaviorTracker({
  sessionId,
  userId,
  onLongPause,
}: TrackerConfig) {
  const [events, setEvents] = useState<BehavioralEvent[]>([]);
  const lastActivityRef = useRef(Date.now());
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);

  const track = useCallback(
    (type: BehavioralEventType, metadata?: Record<string, unknown>) => {
      const event: BehavioralEvent = {
        sessionId,
        userId,
        type,
        timestamp: Date.now(),
        metadata,
      };
      lastActivityRef.current = Date.now();
      setEvents((prev) => [...prev, event]);
    },
    [sessionId, userId],
  );

  useEffect(() => {
    pauseTimerRef.current = setInterval(() => {
      const idleMs = Date.now() - lastActivityRef.current;
      if (idleMs > 35000) {
        track("long_pause", { idleMs });
        onLongPause?.();
        lastActivityRef.current = Date.now();
      }
    }, 4000);

    return () => {
      if (pauseTimerRef.current) clearInterval(pauseTimerRef.current);
    };
  }, [onLongPause, track]);

  return { events, track, setEvents };
}
