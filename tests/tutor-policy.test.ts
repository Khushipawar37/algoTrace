import assert from "node:assert/strict";
import test from "node:test";
import { resolveStudentHelpIntent } from "../src/lib/tutor/intent";
import { determineNextHintLevel } from "../src/lib/tutor/policy";
import { buildTutorSystemPrompt } from "../src/lib/tutor/prompt";
import { validateTutorResponse } from "../src/lib/tutor/validator";
import type { TutorSessionState } from "../src/lib/tutor/types";

const session = (level = 0, hintsGiven = 0): TutorSessionState => ({ problemId: "p", userId: "u", currentHintLevel: level as 0 | 1 | 2 | 3 | 4 | 5 | 6, hintsGiven, studentAskedForMoreHelp: false, fullSolutionUnlocked: false });
test("initial request starts at level zero", () => assert.equal(determineNextHintLevel(session(), resolveStudentHelpIntent("Give me a hint")), 0));
test("more help escalates one level", () => assert.equal(determineNextHintLevel(session(1, 2), resolveStudentHelpIntent("another hint")), 2));
test("explicit intents select policy floors", () => { assert.equal(determineNextHintLevel(session(), resolveStudentHelpIntent("give me the approach")), 3); assert.equal(determineNextHintLevel(session(), resolveStudentHelpIntent("show pseudocode")), 4); assert.equal(determineNextHintLevel(session(), resolveStudentHelpIntent("help me implement this")), 5); });
test("full solution never automatically reaches level six", () => assert.equal(determineNextHintLevel(session(5, 9), resolveStudentHelpIntent("give me the full solution")), 5));
test("normal conversation cannot exceed level five", () => assert.equal(determineNextHintLevel(session(5, 20), "MORE_HELP"), 5));
test("prompt includes current allowed and forbidden rules", () => { const prompt = buildTutorSystemPrompt({ hintLevel: 0, codeProvided: false, problem: { id: "p", title: "Example", description: "Find a value", constraints: ["n > 0"], topics: ["hashing"], guidanceHints: ["remember prior values"] } }); assert.match(prompt, /Allowed:/); assert.match(prompt, /Forbidden:/); assert.match(prompt, /do not pretend/i); assert.match(prompt, /complete solution/i); });
test("validator rejects obvious level-zero solution leakage", () => { const response = "```cpp\nclass Solution { public: int solve(vector<int>& nums) { for (int x : nums) { return x; } return 0; } };\n```"; assert.equal(validateTutorResponse(response, 0).valid, false); });
test("validator rejects named patterns before level three", () => assert.equal(validateTutorResponse("Use a hash map to remember values.", 2).valid, false));
