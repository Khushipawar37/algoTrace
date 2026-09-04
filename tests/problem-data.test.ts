import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { problems } from "../data/problems";
import { deterministicIntArrays } from "../data/generators";
import { getReferenceSolution } from "../data/references";
import { validateProblemSeeds } from "../data/problems/validation";
import { canStartExecution, pendingLabel, toggleFocus } from "../src/components/workspace/workspace-ui-state";

test("production catalog has the intended distribution and coverage",()=>{
  assert.equal(problems.length,30);
  assert.deepEqual(Object.fromEntries(["EASY","MEDIUM","HARD"].map(d=>[d,problems.filter(p=>p.difficulty===d).length])),{EASY:10,MEDIUM:17,HARD:3});
  assert.doesNotThrow(()=>validateProblemSeeds(problems));
  for(const p of problems){assert.ok((p.testCases??[]).length>=10);assert.equal(p.guidanceHints?.length,5);assert.ok(p.commonMistakes?.length);}
});
test("fixed seed generators reproduce identical non-duplicate cases",()=>{
 const options={count:12,minLength:2,maxLength:8,minValue:-20,maxValue:20,seed:48291};
 const a=deterministicIntArrays(options),b=deterministicIntArrays(options);
 assert.deepEqual(a,b);assert.equal(new Set(a.map(String)).size,a.length);
});
test("trusted references produce known canonical outputs",()=>{
 assert.equal(getReferenceSolution("two-sum").solve("4\n2 7 11 15\n9"),"0 1");
 assert.equal(getReferenceSolution("merge-intervals").solve("2\n1 4\n4 5"),"1 5");
 assert.equal(getReferenceSolution("minimum-window-substring").solve("ADOBECODEBANC\nABC"),"BANC");
});
test("workspace focus and pending states are deterministic",()=>{
 const state={focused:false,code:"kept",tab:"trace"};
 const focused={...state,focused:toggleFocus(state.focused)};
 const restored={...focused,focused:toggleFocus(focused.focused)};
 assert.equal(focused.focused,true);assert.deepEqual(restored,state);
 assert.equal(pendingLabel("run"),"Running...");assert.equal(pendingLabel("submit"),"Running hidden tests...");
 assert.equal(canStartExecution(null),true);assert.equal(canStartExecution("run"),false);assert.equal(canStartExecution("submit"),false);
});
test("public problem projection excludes private execution assets",async()=>{
 const source=await readFile(new URL("../src/lib/problem-service.ts",import.meta.url),"utf8");
 const publicSelect=source.slice(source.indexOf("export async function getPublicProblem"));
 assert.match(publicSelect,/starterCode:true/);
 assert.doesNotMatch(publicSelect,/driverCode:true|testCases:|referenceSolutions/);
});
