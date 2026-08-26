"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Activity } from "lucide-react";
import { CodeEditorPane } from "./CodeEditorPane";
import { TutorPanel } from "./TutorPanel";
import { TracePanel } from "./TracePanel";

type ProblemDto={slug:string;title:string;difficulty:string;description:string;constraints:string[];topics:string[];examples:{input:string;output:string;explanation?:string|null}[];template:{starterCode:string;language:string;languageVersion:string}|null};
type ResultDto={status?:string;verdict?:string;stdout?:string;stderr?:string;runtimeMs?:number;memoryKb?:number;passedCases?:number;totalCases?:number;error?:{message:string}};
export function ProblemWorkspaceClient({slug}:{slug:string}){
  const [problem,setProblem]=useState<ProblemDto|null>(null),[code,setCode]=useState(""),[input,setInput]=useState(""),[result,setResult]=useState<ResultDto|null>(null),[busy,setBusy]=useState<"run"|"submit"|null>(null),[tab,setTab]=useState<"tutor"|"trace">("tutor");
  useEffect(()=>{fetch(`/api/problems/${encodeURIComponent(slug)}`).then(r=>r.json()).then(({problem:p})=>{setProblem(p);setCode(p?.template?.starterCode??"");setInput(p?.examples?.[0]?.input??"");}).catch(()=>setResult({error:{message:"Unable to load problem."}}));},[slug]);
  async function execute(kind:"run"|"submit"){setBusy(kind);setResult({status:kind==="run"?"Compiling...":"Judging..."});try{const response=await fetch(`/api/problems/${encodeURIComponent(slug)}/${kind}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({language:"cpp",code,...(kind==="run"?{input}:{})})});setResult(await response.json() as ResultDto);}catch{setResult({error:{message:"The execution service could not be reached."}});}finally{setBusy(null);}}
  if(!problem)return <div className="h-screen bg-smoky text-bone grid place-items-center font-mono text-xs">{result?.error?.message??"Loading problem..."}</div>;
  const verdict=result?.verdict??result?.status; const sample=problem.examples.find(e=>e.input.trim()===input.trim());
  return <div className="h-screen bg-smoky text-floral flex flex-col overflow-hidden">
    <header className="h-14 bg-[#171812] border-b border-bone/20 px-6 flex items-center justify-between font-mono text-xs">
      <div className="flex items-center gap-4"><Link href="/problems" className="flex gap-1.5 text-bone/80"><ArrowLeft className="w-4 h-4"/>Problems</Link><span className="text-bone/40">/</span><strong className="font-sans text-sm">{problem.title}</strong><span className="px-2.5 py-0.5 rounded-full border border-bone/30 text-[10px]">{problem.difficulty}</span></div>
      <div className="flex bg-smoky p-1 rounded border border-bone/20"><button onClick={()=>setTab("tutor")} className={`px-3 py-1 rounded ${tab==="tutor"?"bg-bone text-smoky":"text-bone/70"}`}>Tutor</button><button onClick={()=>setTab("trace")} className={`px-3 py-1 rounded flex gap-1 ${tab==="trace"?"bg-bone text-smoky":"text-bone/70"}`}><Activity className="w-3 h-3"/>Trace</button></div>
    </header>
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
      <section className="lg:col-span-4 overflow-y-auto p-6 border-r border-bone/20"><div className="flex flex-wrap gap-2 mb-4">{problem.topics.map(t=><span key={t} className="text-[10px] font-mono border border-bone/30 rounded-full px-2 py-1">{t}</span>)}</div><p className="text-sm leading-6 text-bone/90">{problem.description}</p><h3 className="font-mono text-xs mt-6 mb-3">EXAMPLES</h3>{problem.examples.map((e,i)=><div key={i} className="mb-3 p-3 bg-[#171812] border border-bone/20 rounded font-mono text-xs whitespace-pre-wrap"><div className="text-bone/60">Input</div>{e.input}<div className="text-bone/60 mt-2">Output</div>{e.output}{e.explanation&&<p className="mt-2 text-bone/70">{e.explanation}</p>}</div>)}<h3 className="font-mono text-xs mt-6 mb-2">CONSTRAINTS</h3><ul className="list-disc pl-5 text-xs text-bone/70 space-y-1">{problem.constraints.map(c=><li key={c}>{c}</li>)}</ul></section>
      <section className="lg:col-span-5 min-h-0 flex flex-col"><div className="flex-1 min-h-0"><CodeEditorPane code={code} onChangeCode={setCode} onRun={()=>execute("run")} onSubmit={()=>execute("submit")}/></div><div className="h-56 bg-[#171812] border-t border-bone/20 p-4 overflow-auto font-mono text-xs"><label className="text-bone/60">STDIN</label><textarea value={input} onChange={e=>setInput(e.target.value)} className="mt-1 mb-3 w-full h-16 bg-smoky border border-bone/30 rounded p-2 text-bone"/><div className="text-bone/60">RESULT</div><pre className="whitespace-pre-wrap mt-1">{result?.error?.message??([verdict,result?.stdout&&`Output:\n${result.stdout}`,sample&&`Expected:\n${sample.output}`,result?.stderr&&`Diagnostic:\n${result.stderr}`,result?.passedCases!==undefined&&`${result.passedCases}/${result.totalCases} hidden cases passed`,result?.runtimeMs!==undefined&&`Runtime: ${result.runtimeMs}ms`].filter(Boolean).join("\n\n")||"Run output will appear here.")}</pre></div></section>
      <aside className="lg:col-span-3 overflow-hidden bg-[#171812]">{tab==="tutor"?<TutorPanel/>:<TracePanel/>}</aside>
    </div>
  </div>;
}
