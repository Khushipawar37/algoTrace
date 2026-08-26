"use client";
import { useParams } from "next/navigation";
import { ProblemWorkspaceClient } from "@/components/workspace/problem-workspace-client";
export default function ProblemWorkspacePage(){
  const params=useParams();
  return <ProblemWorkspaceClient slug={(params?.slug as string)||"two-sum"}/>;
}