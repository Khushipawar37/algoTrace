export type ComparisonMode="EXACT"|"TRIMMED"|"TOKENS"|"UNORDERED"|"CUSTOM";
const lf=(value:string)=>value.replace(/\r\n?/g,"\n");
const trimmed=(value:string)=>lf(value).split("\n").map(line=>line.trimEnd()).join("\n").trim();
export function compareOutput(actual:string,expected:string,mode:ComparisonMode):boolean {
  if(mode==="EXACT") return lf(actual)===lf(expected);
  if(mode==="TOKENS") return trimmed(actual).split(/\s+/).filter(Boolean).join(" ")===trimmed(expected).split(/\s+/).filter(Boolean).join(" ");
  if(mode==="UNORDERED") return trimmed(actual).split(/\s+/).sort().join(" ")===trimmed(expected).split(/\s+/).sort().join(" ");
  if(mode==="CUSTOM") throw new Error("Custom comparator is not configured.");
  return trimmed(actual)===trimmed(expected);
}
export { trimmed as normalizeOutput };
