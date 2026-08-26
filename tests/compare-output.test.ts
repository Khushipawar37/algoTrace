import test from "node:test"; import assert from "node:assert/strict";
import { compareOutput, normalizeOutput } from "../src/lib/judge/compare-output";
test("normalizes CRLF, trailing spaces and blank lines",()=>assert.equal(normalizeOutput("a  \r\n\r\n"),"a"));
test("TRIMMED permits harmless line endings",()=>assert.equal(compareOutput("1 2 \n","1 2","TRIMMED"),true));
test("TOKENS permits whitespace changes",()=>assert.equal(compareOutput("1   2\n3","1 2 3","TOKENS"),true));
test("EXACT retains meaningful whitespace",()=>assert.equal(compareOutput("a\n","a","EXACT"),false));
