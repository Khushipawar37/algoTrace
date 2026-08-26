import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/server-user";
import { listProblems } from "@/lib/problem-service";
export async function GET(request:Request){const user=await getAuthenticatedUser();const q=new URL(request.url).searchParams;return NextResponse.json({problems:await listProblems({userId:user?.id,search:q.get("search")??undefined,difficulty:q.get("difficulty")??undefined,topic:q.get("topic")??undefined,status:q.get("status")??undefined})});}