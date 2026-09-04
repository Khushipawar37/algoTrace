import type { PreAnalysisSignals } from "./types";

const stripComments = (code: string) => code.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "").replace(/#.*$/gm, "");
const normalize = (code: string) => stripComments(code).replace(/\s+/g, "").replace(/(?:TODO|pass|return(?:null|None|-?1|0)?;?)/gi, "");

export function isEmptyAttempt(code: string, starterCode?: string): boolean {
  if (!code.trim()) return true;
  if (starterCode && code.replace(/\s+/g, "") === starterCode.replace(/\s+/g, "")) return true;
  return normalize(code).replace(/[{}();,:]/g, "").length < 12;
}

export function collectPreAnalysisSignals(code: string): PreAnalysisSignals {
  const source = stripComments(code); const loops = [...source.matchAll(/\b(for|while)\s*\(/g)];
  const functionNames = [...source.matchAll(/(?:def|function|(?:int|long|bool|void|string|vector<[^>]+>)\s+)\s*(\w+)\s*\(/g)].map((match) => match[1]);
  return { lineCount: code ? code.split(/\r?\n/).length : 0, characterCount: code.length, meaningfulStatementCount: source.split(/[;\n]/).filter((line) => /[A-Za-z0-9]/.test(line) && !/^\s*[{}]\s*$/.test(line)).length, nestedLoops: loops.length >= 2, recursion: functionNames.some((name) => new RegExp(`\\b${name}\\s*\\(`, "g").test(source.slice(source.indexOf(name) + name.length))), sorting: /\b(sort|sorted)\s*\(/.test(source), mapOrSet: /\b(unordered_)?(?:map|set)\b|\b(Map|Set)\s*[<(]/.test(source), stackOrQueue: /\b(stack|queue|deque|priority_queue)\b/.test(source), binarySearchShape: /\b(left|low|lo)\b[\s\S]*\b(right|high|hi)\b[\s\S]*\b(mid|middle)\b/i.test(source), twoPointerShape: /\b(left|start|i)\b[\s\S]*\b(right|end|j)\b/i.test(source) };
}
