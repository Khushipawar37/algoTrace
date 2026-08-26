import type { OutputComparison } from "@prisma/client";
import { getCodeExecutor } from "@/lib/execution/executor";
import { compareOutput } from "./compare-output";

export type JudgeVerdict="ACCEPTED"|"WRONG_ANSWER"|"COMPILATION_ERROR"|"RUNTIME_ERROR"|"TIME_LIMIT_EXCEEDED"|"MEMORY_LIMIT_EXCEEDED"|"INTERNAL_ERROR";
export async function judgeSubmission(input:{driverCode:string;code:string;testCases:{input:string;expectedOutput:string}[];comparison:OutputComparison;timeLimitMs:number;memoryLimitMb:number}) {
  if(!input.driverCode.includes("// USER_CODE")) return {verdict:"INTERNAL_ERROR" as JudgeVerdict,passedCases:0,totalCases:input.testCases.length,diagnostic:"Invalid problem template."};
  const sourceCode=input.driverCode.replace("// USER_CODE",input.code); let passedCases=0,runtimeMs=0,memoryKb=0;
  for(const [index,test] of input.testCases.entries()){
    const result=await getCodeExecutor().execute({language:"cpp",sourceCode,stdin:test.input,timeoutMs:input.timeLimitMs,memoryLimitMb:input.memoryLimitMb});
    runtimeMs=Math.max(runtimeMs,result.runtimeMs??0); memoryKb=Math.max(memoryKb,result.memoryKb??0);
    if(result.status!=="success") { const map={compile_error:"COMPILATION_ERROR",runtime_error:"RUNTIME_ERROR",timeout:"TIME_LIMIT_EXCEEDED",memory_limit:"MEMORY_LIMIT_EXCEEDED",internal_error:"INTERNAL_ERROR"} as const; return {verdict:map[result.status],passedCases,totalCases:input.testCases.length,failedTestIndex:index,runtimeMs,memoryKb,diagnostic:(result.stderr??"").slice(0,4000)}; }
    if(!compareOutput(result.stdout??"",test.expectedOutput,input.comparison)) return {verdict:"WRONG_ANSWER" as JudgeVerdict,passedCases,totalCases:input.testCases.length,failedTestIndex:index,runtimeMs,memoryKb};
    passedCases++;
  }
  return {verdict:"ACCEPTED" as JudgeVerdict,passedCases,totalCases:input.testCases.length,runtimeMs,memoryKb};
}
