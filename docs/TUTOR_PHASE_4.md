# AlgoTrace Tutor — Phase 4

## 1. Phase 4 Overview

Phase 4 adds a deterministic Tutor Decision Engine. It selects the most useful next pedagogical intervention from the student intent, Phase 2 attempt analysis, Phase 3 execution diagnosis, current hint level, and compact recent decision state. It produces internal structured metadata, not the student-facing response.

## 2. Responsibility Separation

- Analyzer = understand the attempt.
- Diagnosis = understand execution evidence.
- Decision = choose the teaching intervention.
- Policy = enforce the reveal limit.
- Tutor = communicate naturally.

Phase 4 cannot unlock a full solution or override Phase 1.

## 3. Architecture

`Student message/code → Phase 2 analysis → Phase 3 diagnosis → Phase 1 hint-level calculation → Phase 4 deterministic decision constrained by that level → tutor prompt → Groq tutor → response validator`

No additional model call is introduced.

## 4. Tutor Actions

Supported actions are `ASK_REASONING_QUESTION`, `ASK_COMPLEXITY_QUESTION`, `ASK_DRY_RUN`, `POINT_TO_CODE_REGION`, `POINT_TO_FAILURE_TYPE`, `EXPLAIN_CONCEPT`, `COMPARE_ALTERNATIVES`, `GUIDE_EDGE_CASE_REASONING`, `GUIDE_BOUNDARY_REASONING`, `GUIDE_STATE_REASONING`, `GUIDE_COMPLEXITY_IMPROVEMENT`, `PROVIDE_APPROACH_DIRECTION`, `PROVIDE_PSEUDOCODE`, `PROVIDE_CODE_FRAGMENT`, `ASK_STUDENT_TO_TRY_AGAIN`, `ASK_REFLECTION`, `ACKNOWLEDGE_SUCCESS`, `CLARIFY_STUDENT_QUESTION`, and `SAFE_FALLBACK`.

## 5. Decision Rules

Priority is accepted/verified state, compilation blockers, runtime blockers, timeout/complexity, wrong answer/partial correctness, empty attempts, explicit implementation/pseudocode intent, demonstrated-concept implementation bugs, knowledge gaps, partial attempts, then generic clarification/reasoning. Execution evidence outranks static inference. Low-confidence ambiguous failures favor dry runs rather than precise corrections.

## 6. Hint-Level Constraints

- Level 0: questions, dry runs, safe boundary/edge-case/complexity guidance, retry requests, failure-type or region direction without fixes.
- Level 1: adds state reasoning.
- Level 2: adds concept explanation.
- Level 3: adds approach direction and comparison.
- Level 4: adds pseudocode.
- Level 5: adds a narrow code fragment.
- Level 6 remains Phase 1-gated; Phase 4 has no full-solution action.

Success acknowledgement, reflection, clarification, and safe fallback are permitted at every level.

## 7. Decision Downgrading

Every candidate action passes through `constrainAction`. Disallowed concept, approach, pseudocode, or code actions are converted to the strongest safe Socratic or diagnostic alternative. Unknown/forged actions become `SAFE_FALLBACK`.

## 8. Conversation Context

`TutorConversation` stores only `lastTutorAction` and `lastDecisionFocus` in addition to existing Phase 1 state. When the student asks for more help and the candidate repeats the previous action, deterministic escalation selects a different permitted intervention. No transcript analytics or learner profile is introduced.

## 9. Phase 2 Integration

The engine uses attempt state, confidence, demonstrated concepts, issues, knowledge gaps, approach, and suspicious regions. When a student has demonstrated a concept but has an implementation issue, it selects a dry run or code-region focus instead of reteaching that concept.

## 10. Phase 3 Integration

Compile, runtime, TLE, partial/wrong-answer, and accepted outcomes drive higher-priority actions. Boundary, duplicate, complexity, and runtime categories map to targeted pedagogical interventions without exposing hidden evidence.

## 11. Phase 1 Integration

The current Phase 1 hint level is calculated before the final decision is constrained. The prompt includes the decision but explicitly requires policy to win any conflict. Existing leakage validation and full-solution protection remain unchanged.

## 12. Files Added

- `src/lib/tutor/decision/types.ts`
- `src/lib/tutor/decision/schema.ts`
- `src/lib/tutor/decision/rules.ts`
- `src/lib/tutor/decision/engine.ts`
- `src/lib/tutor/decision/context.ts`
- `tests/tutor-decision.test.ts`
- `prisma/migrations/20260905000000_tutor_phase_4_decision_state/migration.sql`

## 13. Files Modified

- `src/app/api/tutor/route.ts`: invokes the decision engine and persists compact recent decision state.
- `src/lib/tutor/prompt.ts`: accepts internal decision context.
- `src/lib/tutor/tutor-service.ts`: forwards the decision to the existing tutor prompt.
- `prisma/schema.prisma`: adds two nullable conversation fields.

## 14. Database Changes

A non-destructive migration adds nullable `lastTutorAction` and `lastDecisionFocus` columns to `TutorConversation`. Existing conversations remain valid.

## 15. Environment Variables

Phase 4 adds no environment variables.

## 16. Manual Steps

```bash
npx prisma migrate deploy
npm run dev
```

No additional environment configuration is required for Phase 4.

## 17. Tests

Run `npm test`, `npm run lint`, and `npm run build`. Tests cover empty attempts, compile/runtime/TLE/partial/accepted decisions, demonstrated concepts, repetition avoidance, action downgrading, Level 5 fragments, Level 6 protection, and an integrated Phase 2 + Phase 3 + Phase 4 + Phase 1 prompt scenario.

## 18. Known Limitations

- The decision engine is rule-based.
- Difficult ambiguous cases may choose a generic intervention.
- Recent state tracks one action/focus rather than a rich action history.
- There is no long-term learner personalization, mastery tracking, or autonomous execution.

## 19. Next Phase

**Phase 5 — Stateful Tutor Orchestration / LangGraph**

Phase 5 can compose the existing Analyzer, Diagnosis, Decision, Policy, and Tutor modules as explicit workflow nodes without rebuilding their responsibilities.
