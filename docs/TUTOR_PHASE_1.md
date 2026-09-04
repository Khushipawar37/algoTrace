# AlgoTrace Tutor — Phase 1

## 1. Phase 1 Overview

Phase 1 implements a deterministic tutoring-policy foundation: typed hint levels, intent recognition, controlled escalation, centralized prompting, a server-only provider, response leakage checks, minimal conversation persistence, and a working tutor chat in the problem workspace. It intentionally does not perform deep code analysis or execution diagnosis.

## 2. Architecture

`Tutor UI → POST /api/tutor → Intent Resolver → Hint Escalation Policy → Prompt Builder → Tutor Service → Groq → Response Validator → TutorConversation/TutorMessage persistence → UI`

The client never supplies a hint level, user ID, or solution-unlock flag. A provider violation is retried once with stricter instructions; provider failure or a second violation produces a safe deterministic response.

## 3. Files Added

- `src/lib/tutor/types.ts`: policy, intent, session, problem, and response types.
- `src/lib/tutor/constants.ts`: the seven centralized hint policies and size limits.
- `src/lib/tutor/intent.ts`: deterministic Phase 1 intent resolver.
- `src/lib/tutor/policy.ts`: server-owned escalation rules.
- `src/lib/tutor/prompt.ts`: centralized AlgoTrace Tutor system prompt.
- `src/lib/tutor/provider.ts`: server-only Groq adapter with timeout.
- `src/lib/tutor/tutor-service.ts`: structured orchestration, retry, and fallback.
- `src/lib/tutor/validator.ts`: deterministic solution-leakage checks.
- `src/app/api/tutor/route.ts`: authenticated, validated tutor endpoint.
- `src/components/workspace/TutorChatPanel.tsx`: live tutor chat and quick actions.
- `prisma/migrations/20260904000000_tutor_phase_1/migration.sql`: minimal session/message storage.
- `tests/tutor-policy.test.ts`: policy, prompt, intent, and validator tests.

## 4. Files Modified

- `src/components/workspace/problem-workspace-client.tsx`: supplies the active problem and current code to the live tutor panel. Run and submit behavior is unchanged.

The older `/api/coach`, `dsa-tutor.tsx`, and heuristic files remain for the separate legacy `/workspace` screen; they are not in the production `/problems/[slug]` tutor path.

## 5. Tutor Hint Levels

- Level 0: Socratic questions only; no pattern names, pseudocode, or code.
- Level 1: points to repeated work, boundaries, state, or duplicate handling without implementation steps.
- Level 2: teaches the missing concept indirectly without naming the final pattern.
- Level 3: may name an algorithmic pattern or data structure, but gives no complete plan or code.
- Level 4: may provide steps, invariants, and pseudocode, but no copy-pasteable solution.
- Level 5: may provide a short, relevant fragment or syntax correction, but no complete solution.
- Level 6: represents a full solution and requires explicit access. Phase 1 never unlocks or selects it automatically.

## 6. Tutor Session State

The database stores the authenticated user, problem, current/previous hint level, hint count, whether more help was requested, the locked full-solution flag, timestamps, and user/tutor messages. Student code is sent only when opted in and is not stored; only a `codeIncluded` boolean is recorded.

## 7. API

`POST /api/tutor`

Request: `{ "problemId": "two-sum", "message": "Give me a hint", "code": "optional", "sessionId": "optional" }`

Response: `{ "message": "...", "hintLevel": 0, "intent": "INITIAL_HELP", "sessionId": "...", "nextSuggestedAction": "..." }`

Errors include invalid input (400), unauthenticated access (401), unknown problems or invalid/foreign sessions (404), and a generic tutor-unavailable response (500). Messages are limited to 2,000 characters and code to 30,000 characters.

## 8. LLM Configuration

```env
GROQ_API_KEY=
GROQ_TUTOR_MODEL=
```

The Phase 1 tutor uses Groq through the official `groq-sdk`. `GROQ_API_KEY` is required. `GROQ_TUTOR_MODEL` is optional and defaults to `openai/gpt-oss-20b`, a current Groq production model selected for instruction following, code understanding, and low-latency development. Requests use a 20-second timeout, low temperature, and a 500-token completion cap. Provider failures, timeouts, empty responses, and policy violations retain the existing retry and deterministic safe-fallback behavior. Secrets remain server-side; never use a `NEXT_PUBLIC_` prefix.

## 9. Database Changes

The migration adds `TutorConversation`, `TutorMessage`, and `TutorMessageRole`, with cascade relations to `Problem` and indexed conversation history. It is non-destructive. The API uses typed parameterized SQL so the existing generated Prisma client does not require regeneration for these isolated Phase 1 tables.

## 10. Manual Steps Required

After pulling, run the standard install and add `GROQ_API_KEY` to the server environment. `GROQ_TUTOR_MODEL` may be omitted to use the default. Apply the Phase 1 database migration separately only if it was not already deployed.

```bash
npm install
npm run dev
```


## 11. Testing

Run `npm test`, `npm run lint`, and `npm run build`.

Manual expectations:

- “Give me a hint” → Socratic Level 0.
- “Another hint” → one-level escalation.
- “I don't understand the concept” → conceptual Level 2 or the current higher level.
- “Give me the approach” → at least Level 3.
- “Show pseudocode” → Level 4.
- “Help me implement it” → Level 5 with only a narrow fragment.
- “Give me the full solution” → no solution; offers stronger gated guidance.

## 12. Known Limitations

Intent recognition and leakage validation are deterministic first passes. The tutor does not deeply analyze code, consume Judge0 diagnostics or hidden cases, maintain concept mastery, or build a long-term student profile. The current Phase 1 provider is Groq; safe fallback guidance is used when it is unavailable.

## 13. Next Phase

**Phase 2 — Student Attempt Analyzer**

It should add structured understanding of a student's current reasoning and code attempt so the policy can target the precise misconception without adding execution-tool orchestration yet.
