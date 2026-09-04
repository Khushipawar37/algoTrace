import type { StudentHelpIntent } from "./types";

const matches = (value: string, patterns: RegExp[]) => patterns.some((pattern) => pattern.test(value));

export function resolveStudentHelpIntent(message: string): StudentHelpIntent {
  const text = message.trim().toLowerCase();
  if (matches(text, [/full (solution|answer|code)/, /complete (solution|code)/, /solve (it|this) for me/, /give me (the )?solution/])) return "REQUEST_FULL_SOLUTION";
  if (matches(text, [/pseudo.?code/, /implementation plan/, /step[- ]by[- ]step/])) return "NEED_PSEUDOCODE";
  if (matches(text, [/help (me )?(implement|code)/, /syntax/, /code (help|fragment)/, /fix (this|my code)/])) return "NEED_CODE_HELP";
  if (matches(text, [/give me (the )?approach/, /which (algorithm|data structure|pattern)/, /algorithmic (approach|pattern)/])) return "NEED_APPROACH";
  if (matches(text, [/explain (the )?concept/, /i don'?t understand/, /why does/, /teach me/])) return "EXPLAIN_CONCEPT";
  if (matches(text, [/another hint/, /more help/, /more concrete/, /stronger hint/, /still stuck/, /try again/])) return "MORE_HELP";
  if (matches(text, [/give me a hint/, /^hint$/, /^help$/, /where (do|should) i start/])) return "INITIAL_HELP";
  return "QUESTION";
}
