import { NextResponse } from "next/server";

import { isStackServerConfigured, stackServerApp } from "@/stack";

export async function DELETE() {
  if (!isStackServerConfigured || !stackServerApp) {
    return NextResponse.json({ error: "Auth not configured" }, { status: 503 });
  }

  const user = await stackServerApp.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await user.delete();
  return NextResponse.json({ ok: true });
}

