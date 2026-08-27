import type { CodeExecutor, ExecutionRequest, ExecutionResult } from "./types";

type Judge0Response = { status?: { id: number; description: string }; stdout?: string | null; stderr?: string | null; compile_output?: string | null; time?: string | null; memory?: number | null };
export interface Judge0Config { baseUrl: string; cppLanguageId: number; apiKey?: string }

const encodeBase64 = (value: string) => Buffer.from(value, "utf8").toString("base64");
const decodeBase64 = (value?: string | null) => value ? Buffer.from(value, "base64").toString("utf8") : undefined;

export function loadJudge0Config(env: Readonly<Record<string, string | undefined>> = process.env): Judge0Config {
  const rawBaseUrl = env.JUDGE0_BASE_URL?.trim();
  if (!rawBaseUrl) throw new Error("JUDGE0_BASE_URL is required.");
  let url: URL;
  try { url = new URL(rawBaseUrl); } catch { throw new Error("JUDGE0_BASE_URL must be a valid absolute URL."); }
  if (!["http:", "https:"].includes(url.protocol)) throw new Error("JUDGE0_BASE_URL must use http or https.");
  const rawLanguageId = env.JUDGE0_CPP_LANGUAGE_ID?.trim();
  if (!rawLanguageId || !/^\d+$/.test(rawLanguageId)) throw new Error("JUDGE0_CPP_LANGUAGE_ID must be a positive integer.");
  const cppLanguageId = Number(rawLanguageId);
  if (!Number.isSafeInteger(cppLanguageId) || cppLanguageId <= 0) throw new Error("JUDGE0_CPP_LANGUAGE_ID must be a positive integer.");
  const apiKey = env.JUDGE0_API_KEY?.trim() || undefined;
  return { baseUrl: url.toString().replace(/\/$/, ""), cppLanguageId, ...(apiKey ? { apiKey } : {}) };
}

export class Judge0Executor implements CodeExecutor {
  constructor(private readonly config: Judge0Config = loadJudge0Config()) {}
  async execute(request: ExecutionRequest): Promise<ExecutionResult> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), Math.max((request.timeoutMs ?? 2000) + 10000, 15000));
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (this.config.apiKey) headers["X-Auth-Token"] = this.config.apiKey;
      const response = await fetch(`${this.config.baseUrl}/submissions?base64_encoded=true&wait=true`, { method: "POST", signal: controller.signal, headers, body: JSON.stringify({ source_code: encodeBase64(request.sourceCode), language_id: this.config.cppLanguageId, stdin: encodeBase64(request.stdin), cpu_time_limit: (request.timeoutMs ?? 2000) / 1000, memory_limit: (request.memoryLimitMb ?? 256) * 1024, max_file_size: 1024 }) });
      if (!response.ok) return { status: "internal_error", stderr: "Execution provider is unavailable." };
      const data = await response.json() as Judge0Response; const id = data.status?.id ?? 0;
      const status: ExecutionResult["status"] = id === 3 ? "success" : id === 6 ? "compile_error" : id === 5 ? "timeout" : id === 12 ? "memory_limit" : id >= 7 && id <= 12 ? "runtime_error" : "internal_error";
      return { status, stdout: decodeBase64(data.stdout), stderr: decodeBase64(data.compile_output) ?? decodeBase64(data.stderr), runtimeMs: data.time ? Math.round(Number(data.time) * 1000) : undefined, memoryKb: data.memory ?? undefined };
    } catch (error) { return { status: error instanceof DOMException && error.name === "AbortError" ? "timeout" : "internal_error", stderr: "Execution provider request failed." }; }
    finally { clearTimeout(timer); }
  }
}