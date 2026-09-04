# AlgoTrace Tutor — Phase 3

## 1. Phase 3 Overview

Phase 3 adds execution-grounded diagnosis. It consumes existing trusted Run and Submit results, normalizes them into provider-independent evidence, classifies common failures, combines them with Phase 2 static analysis, and supplies a safe diagnosis summary to the tutor. It never executes code itself or produces student-facing guidance.

## 2. Responsibility Separation

- Phase 2 Analyzer = static and semantic understanding of the code.
- Phase 3 Diagnosis = execution-grounded understanding of what happened.
- Phase 1 Policy = how much may be revealed.
- Tutor = communication within those limits.

Neither analyzer nor diagnosis owns `hintLevel`.

## 3. Architecture

`Current code → Phase 2 analysis → trusted matching Run/Submit evidence → Phase 3 diagnosis → Phase 1 policy → tutor prompt → Groq tutor → leakage validator → UI`

Run and Submit continue using the existing Judge0/judge pipeline. They additionally register normalized evidence under an opaque, short-lived reference. `/api/tutor` validates ownership, problem, and code hash; matching persisted submissions are a fallback.

## 4. Execution Context

`ExecutionContext` contains source (`RUN`, `SUBMIT`, `NONE`), normalized outcome, sanitized compiler/runtime output, bounded stdout for Run only, timing/memory, visible or hidden aggregate counts, safe failure signals/categories, and a SHA-256 code hash. Hidden inputs, expected outputs, and actual outputs are excluded.

## 5. Diagnosis Schema

`ExecutionDiagnosis` contains outcome, primary/secondary tutor-oriented categories, summary, typed evidence, likely cause, suspicious code regions, normalized confidence, and safe failure categories. Major categories cover syntax/type/compilation, runtime/access/stack/divide-by-zero, complexity/infinite loop, logic/edge cases/duplicates/boundaries/overflow/state/output format, and unknown.

## 6. Deterministic Classifiers

- Compiler diagnostics identify common syntax and type/signature errors without Groq.
- Runtime signals identify segmentation faults, stack overflow, divide-by-zero, and invalid access conservatively.
- TLE combined with Phase 2 nested-loop/complexity evidence produces high-confidence time-complexity diagnosis.
- Accepted results never invent a bug.
- Partial/wrong answers use aggregate counts and optional safe category labels only.
- Diagnostics are path-sanitized, limited to eight non-empty lines, and capped at 1,200 characters.

## 7. Groq Usage

Deterministic classifications do not call Groq. Only ambiguous runtime or wrong-answer/partial outcomes below the confidence threshold may use one JSON-mode diagnosis call. Its output is strictly validated, must retain the authoritative normalized outcome, and falls back to the deterministic diagnosis on timeout, provider error, malformed JSON, or schema failure.

`GROQ_DIAGNOSIS_MODEL` optionally overrides the model and falls back through `GROQ_ANALYZER_MODEL`, `GROQ_TUTOR_MODEL`, and `openai/gpt-oss-20b`. No additional API key is required.

## 8. Hidden-Test Protection

Submit normalization accepts only verdict, aggregate passed/total counts, timing/memory, sanitized diagnostic text, and optional safe categories. The diagnosis prompt deliberately reconstructs a safe execution object and omits code hashes and Submit stdout. Database lookup never selects test cases, hidden inputs, expected outputs, actual outputs, or failed-test indices. Browser responses remain the existing aggregate submission result plus an opaque reference.

## 9. Stale Result Protection

Run/Submit computes a server-side SHA-256 hash over the submitted student code. Before diagnosis, `/api/tutor` hashes the currently shared code and discards evidence unless hashes match exactly. If code is absent, changed, or the opaque reference is unavailable/expired, the current attempt is treated as `NOT_RUN`. Opaque transient references expire after 30 minutes and are scoped to authenticated user and problem.

## 10. Phase 2 Integration

Static analysis supports but never outranks execution evidence. For example, a trusted TLE plus a nested-loop/O(n²) analysis supports a high-confidence complexity cause; static analysis alone cannot claim a timeout or acceptance.

## 11. Tutor Integration

A compact diagnosis summary enters the tutor system prompt. The prompt explicitly prohibits inventing execution facts or exposing hidden information and repeats that Phase 1 reveal limits are authoritative. Level 0 therefore asks a boundary or repeated-work question rather than exposing a direct correction.

## 12. Files Added

- `src/lib/tutor/diagnosis/types.ts`
- `src/lib/tutor/diagnosis/schema.ts`
- `src/lib/tutor/diagnosis/hash.ts`
- `src/lib/tutor/diagnosis/normalize.ts`
- `src/lib/tutor/diagnosis/classifier.ts`
- `src/lib/tutor/diagnosis/store.ts`
- `src/lib/tutor/diagnosis/engine.ts`
- `src/lib/tutor/diagnosis/prompt.ts`
- `src/lib/tutor/diagnosis/diagnosis-service.ts`
- `src/lib/tutor/diagnosis/context.ts`
- `tests/tutor-diagnosis.test.ts`

## 13. Files Modified

- Run and Submit routes add trusted normalized evidence references without changing Judge0 behavior.
- Workspace and tutor UI forward the opaque latest reference.
- Tutor API validates/refetches matching evidence and invokes diagnosis.
- Tutor prompt/service accept compact diagnosis context without changing policy.
- `.env.example` documents the optional diagnosis model.

## 14. Database Changes

No schema change or migration is required. Existing Submission records provide the durable fallback. Transient Run evidence is deliberately short-lived and in-memory.

## 15. Environment Variables

```env
GROQ_DIAGNOSIS_MODEL=
```

Optional. Existing `GROQ_API_KEY` is reused.

## 16. Manual Steps

No additional manual configuration is required. Optionally set `GROQ_DIAGNOSIS_MODEL`.

## 17. Testing

Run `npm test`, `npm run lint`, and `npm run build`. Automated tests cover compiler syntax, segmentation faults, TLE plus static evidence, partial boundary failures, accepted outcomes, stale hashes, missing evidence, diagnostic sanitization, hidden-test safety, and policy authority. Manual checks should Run/Submit code, ask the tutor, edit code, and confirm the old evidence is no longer used.

## 18. Known Limitations

- Not every wrong answer can be diagnosed conclusively.
- Current hidden tests have no category metadata, so most WA diagnoses are broader logic inferences.
- Transient Run references are process-local and may be unavailable after a server restart or cross-instance request.
- The tutor never automatically executes code.
- Runtime/static inference remains probabilistic for ambiguous failures.

## 19. Next Phase

**Phase 4 — Tutor Decision Engine / Intelligent Intervention Selection**

Phase 4 should use student state, attempt analysis, execution diagnosis, and conversation history to select the best tutoring intervention before response generation while Phase 1 continues enforcing reveal limits.
