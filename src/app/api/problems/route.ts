import { NextResponse } from "next/server";

import { problemBank } from "@/lib/problem-bank";

export async function GET() {
  return NextResponse.json({ problems: problemBank });
}

