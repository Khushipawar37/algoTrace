import { NextResponse } from "next/server";

import { isStackServerConfigured, stackServerApp } from "@/stack";

export async function POST(request: Request) {
  if (!isStackServerConfigured || !stackServerApp) {
    return NextResponse.json({ error: "Auth not configured" }, { status: 503 });
  }

  let email = "";
  try {
    const body = (await request.json()) as { email?: string };
    email = (body.email ?? "").trim().toLowerCase();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  try {
    const users = await stackServerApp.listUsers({
      query: email,
      includeRestricted: true,
      includeAnonymous: true,
      limit: 20,
    });

    const user = users.find((item) => item.primaryEmail?.toLowerCase() === email);
    if (!user) {
      return NextResponse.json({ error: "No matching account found." }, { status: 404 });
    }

    if (!user.primaryEmailVerified) {
      await user.update({ primaryEmailVerified: true });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to resolve Google conflict right now." }, { status: 500 });
  }
}
