export type ExecutionStatus = "success" | "compile_error" | "runtime_error" | "timeout" | "memory_limit" | "internal_error";
export interface ExecutionRequest { language: string; sourceCode: string; stdin: string; timeoutMs?: number; memoryLimitMb?: number }
export interface ExecutionResult { status: ExecutionStatus; stdout?: string; stderr?: string; runtimeMs?: number; memoryKb?: number }
export interface CodeExecutor { execute(request: ExecutionRequest): Promise<ExecutionResult> }
