import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { getPublicProblem } from "@/lib/problem-service";
export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) { const problem = await getPublicProblem((await params).slug); return problem ? NextResponse.json({ problem }) : apiError("Problem not found.", 404, "NOT_FOUND"); }
