# AlgoTrace Tutor — Phase 2

## 1. Phase 2 Overview

Phase 2 adds the Student Attempt Analyzer. It inspects the current problem and optional student code and returns validated internal analysis about attempt state, likely approach, completeness, issues, demonstrated concepts, possible knowledge gaps, suspicious regions, estimated complexity, summary, and confidence. It never produces student-facing guidance.

## 2. Responsibility Separation

`Analyzer = what is happening in the attempt`

`Policy = how much guidance may be revealed`

`Tutor = how the permitted guidance is communicated`

The analyzer cannot return or select a hint level. Phase 1 policy remains authoritative even when analysis identifies an optimal pattern.

## 3. Architecture

`Tutor UI → Tutor API → load problem/current code → deterministic pre-analysis → Groq attempt analyzer → validated structured analysis → intent resolver → Phase 1 hint policy → tutor prompt plus compact analysis → Groq tutor → leakage validator → persistence → UI`

Empty or untouched starter code bypasses the analyzer model. Analyzer failure bypasses no Phase 1 behavior; it produces a safe unknown analysis and tutoring continues.

## 4. Analysis Schema

- `attemptState`: `EMPTY`, `STARTED`, `PARTIAL`, `COMPLETE`, or `UNKNOWN`.
- `approachDetected`: concise likely strategy, when supported.
- `codeCompleteness`: normalized value from 0 to 1.
- `issues`: typed (`SYNTAX`, `LOGIC`, `COMPLEXITY`, `EDGE_CASE`, `ALGORITHMIC`, `CONCEPTUAL`, `IMPLEMENTATION`, `UNKNOWN`) with severity, description, and optional evidence.
- `conceptsUnderstood`: concepts demonstrated by the code.
- `possibleKnowledgeGaps`: conservative likely blockers.
- `suspiciousCodeRegions`: optional line bounds and descriptions.
- `estimatedTimeComplexity` and `estimatedSpaceComplexity`: static estimates, not execution facts.
- `summary`: concise internal description.
- `confidence`: normalized value from 0 to 1.

Zod strictly validates output and rejects extra fields, including policy-owned fields such as `hintLevel`.

## 5. Deterministic Heuristics

Without Groq, Phase 2 detects blank/whitespace input, unchanged starter code, placeholder-only bodies, line and character counts, meaningful statement count, nested loops, recursion, sorting, map/set and stack/queue usage, binary-search-like state, and two-pointer-like variables. These signals support semantic analysis and are not treated as definitive diagnoses.

## 6. Groq Analyzer

Non-empty attempts use one JSON-mode Groq completion through the existing server-only provider. The analyzer receives only the problem statement, constraints, up to three public examples, topics, trusted complexity/pattern/common-mistake metadata, language, deterministic signals, and current code. It receives no user identity, tutor conversation, hidden tests, or official solution.

`GROQ_ANALYZER_MODEL` optionally overrides the analyzer model. It falls back to `GROQ_TUTOR_MODEL`, then the provider default `openai/gpt-oss-20b`. The existing API key and 20-second provider timeout are reused.

## 7. Phase 1 Integration

Only a compact structured summary is appended as internal context to the tutor prompt. The prompt explicitly says analysis is diagnostic, may be uncertain, must not be exposed verbatim, and cannot override allowed/forbidden content. Tutor output still passes through the existing validator and one-time retry.

## 8. Files Added

- `src/lib/tutor/analyzer/types.ts`: analyzer contracts.
- `src/lib/tutor/analyzer/schema.ts`: strict Zod schemas and normalization.
- `src/lib/tutor/analyzer/heuristics.ts`: deterministic pre-analysis.
- `src/lib/tutor/analyzer/prompt.ts`: internal analyzer prompt.
- `src/lib/tutor/analyzer/engine.ts`: provider-independent validated analysis and fallback.
- `src/lib/tutor/analyzer/analyzer.ts`: server-only Groq entry point.
- `src/lib/tutor/analyzer/context.ts`: safe compact tutor context.
- `tests/tutor-analyzer.test.ts`: Phase 2 tests.

## 9. Files Modified

- `src/lib/tutor/provider.ts`: optional model override and JSON response mode using the same Groq client path.
- `src/lib/tutor/prompt.ts`: accepts compact attempt analysis while reaffirming Phase 1 policy precedence.
- `src/lib/tutor/tutor-service.ts`: passes analysis to the prompt without changing escalation.
- `src/app/api/tutor/route.ts`: loads relevant metadata, invokes analysis, and supplies its summary.
- `src/components/workspace/TutorChatPanel.tsx`: sends the current workspace language (`cpp`).
- `.env.example`: documents the optional analyzer model override.

## 10. Environment Variables

```env
GROQ_ANALYZER_MODEL=
```

This is optional. No additional API key is needed. If omitted, the existing Groq tutor model and default are reused.

## 11. Database Changes

No schema change or migration is required. Analysis is computed per tutor request and is not persisted, avoiding premature analytics/history tables.

## 12. Manual Steps

No additional manual configuration is required beyond the existing Groq setup. Optionally set `GROQ_ANALYZER_MODEL` if a separate supported model is desired.

## 13. Testing

Run:

```bash
npm test
npm run lint
npm run build
```

Manually verify untouched starter code, nested-loop brute force, a correct-looking approach with a small implementation error, and a partial implementation. Low hint levels must remain Socratic regardless of detected knowledge gaps.

## 14. Known Limitations

- Static analysis cannot authoritatively identify hidden-test failures or prove correctness.
- Execution, compiler, runtime, and failed-test results are not deeply diagnosed.
- Approach and knowledge-gap classifications are probabilistic.
- Heuristics are intentionally lightweight rather than a full AST framework.
- No long-term mastery or student profile is maintained.

## 15. Next Phase

**Phase 3 — Execution and Error Diagnosis Engine**

Phase 3 should combine Judge0/compiler/runtime/public-test information with Phase 2 attempt understanding while continuing to protect hidden tests and defer disclosure decisions to the Phase 1 policy.
