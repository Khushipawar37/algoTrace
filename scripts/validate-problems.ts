import { config } from "dotenv";
config({ path: ".env.local" });
config();
import { problems } from "../data/problems";
import { getReferenceSolution } from "../data/references";
import { validateProblemSeeds } from "../data/problems/validation";
import { compareOutput } from "../src/lib/judge/compare-output";
import { Judge0Executor } from "../src/lib/execution/judge0";

async function main() {
  validateProblemSeeds(problems);
  let localCases=0;
  for(const problem of problems){
    const reference=getReferenceSolution(problem.slug);
    for(const test of problem.testCases ?? []){
      const actual=reference.solve(test.input);
      if(!compareOutput(actual,test.output,problem.comparison ?? "TRIMMED")) throw new Error("Reference mismatch: "+problem.slug);
      localCases++;
    }
  }
  console.log("Validated "+problems.length+" definitions and "+localCases+" deterministic expected outputs locally.");
  if(!process.argv.includes("--judge0")) return;
  const smoke=process.argv.includes("--smoke");
  const executor=new Judge0Executor();
  let remoteCases=0;
  for(const problem of problems){
    const template=problem.templates?.find(t=>t.language==="cpp");
    if(!template) throw new Error("Missing C++ template: "+problem.slug);
    const source=template.driverCode.replace("// USER_CODE",getReferenceSolution(problem.slug).cpp);
    const cases=smoke?(problem.testCases ?? []).slice(0,1):(problem.testCases ?? []);
    for(const test of cases){
      const result=await executor.execute({language:"cpp",sourceCode:source,stdin:test.input});
      if(result.status!=="success") throw new Error(problem.slug+": "+result.status+": "+(result.stderr ?? ""));
      if(!compareOutput(result.stdout ?? "",test.output,problem.comparison ?? "TRIMMED")) throw new Error(problem.slug+": Judge0 output mismatch");
      remoteCases++;
    }
    console.log("Judge0 OK: "+problem.slug+" ("+cases.length+" cases)");
  }
  console.log("Judge0 validated "+remoteCases+" executions across "+problems.length+" problems.");
}
main().catch(error=>{console.error(error);process.exitCode=1;});
