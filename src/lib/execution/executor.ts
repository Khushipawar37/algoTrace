import type { CodeExecutor } from "./types";
import { Judge0Executor } from "./judge0";
let executor:CodeExecutor|undefined;
export function getCodeExecutor():CodeExecutor { return executor ??= new Judge0Executor(); }
export function setCodeExecutorForTests(value:CodeExecutor|undefined){executor=value;}
