import test from "node:test";
import assert from "node:assert/strict";
import { Judge0Executor, loadJudge0Config } from "../src/lib/execution/judge0";

test("requires Judge0 base URL", () => {
  assert.throws(() => loadJudge0Config({ JUDGE0_CPP_LANGUAGE_ID: "54" }), /JUDGE0_BASE_URL is required/);
});

test("requires a positive numeric C++ language ID", () => {
  assert.throws(() => loadJudge0Config({ JUDGE0_BASE_URL: "http://localhost:2358", JUDGE0_CPP_LANGUAGE_ID: "cpp" }), /positive integer/);
  assert.throws(() => loadJudge0Config({ JUDGE0_BASE_URL: "http://localhost:2358", JUDGE0_CPP_LANGUAGE_ID: "0" }), /positive integer/);
});

test("normalizes local configuration and treats an empty key as absent", () => {
  assert.deepEqual(loadJudge0Config({ JUDGE0_BASE_URL: "http://localhost:2358/", JUDGE0_CPP_LANGUAGE_ID: "54", JUDGE0_API_KEY: " " }), { baseUrl: "http://localhost:2358", cppLanguageId: 54 });
});

test("sends authentication only when configured", async () => {
  const originalFetch = globalThis.fetch;
  const seen: { headers: HeadersInit; url: string; body: string }[] = [];
  globalThis.fetch = async (input, init) => {
    seen.push({ headers: init?.headers ?? {}, url: String(input), body: String(init?.body ?? "") });
    return new Response(JSON.stringify({ status: { id: 3, description: "Accepted" }, stdout: "b2s=" }), { status: 200, headers: { "Content-Type": "application/json" } });
  };
  try {
    const localResult = await new Judge0Executor({ baseUrl: "http://localhost:2358", cppLanguageId: 54 }).execute({ language: "cpp", sourceCode: "x", stdin: "" });
    await new Judge0Executor({ baseUrl: "https://judge.example", cppLanguageId: 105, apiKey: "secret" }).execute({ language: "cpp", sourceCode: "x", stdin: "" });
    assert.equal(new Headers(seen[0].headers).has("X-Auth-Token"), false);
    assert.equal(new Headers(seen[1].headers).get("X-Auth-Token"), "secret");
    assert.match(seen[0].url, /base64_encoded=true/);
    assert.deepEqual(JSON.parse(seen[0].body), { source_code: "eA==", language_id: 54, stdin: "", cpu_time_limit: 2, memory_limit: 262144, max_file_size: 1024 });
    assert.equal(localResult.stdout, "ok");
  } finally { globalThis.fetch = originalFetch; }
});
