import assert from "node:assert/strict";
import test from "node:test";
import { extractGroqCompletionText, requireGroqApiKey, TutorProviderConfigurationError } from "../src/lib/tutor/provider-utils";
import { generateValidatedText } from "../src/lib/tutor/generation";

test("missing Groq API key produces a controlled configuration error", () => assert.throws(() => requireGroqApiKey(undefined), TutorProviderConfigurationError));
test("empty Groq completions are rejected", () => assert.throws(() => extractGroqCompletionText({ choices: [{ message: { content: "  " } }] }), /no text/));
test("provider failure retains deterministic service fallback", async () => { const result = await generateValidatedText({ hintLevel: 0, generate: async () => { throw new Error("mock outage"); } }); assert.equal(result.validated, false); assert.match(result.message, /What information/i); });
