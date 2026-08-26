import { NextResponse } from "next/server";
export const apiError=(message:string,status=400,code="BAD_REQUEST")=>NextResponse.json({error:{code,message}},{status});
