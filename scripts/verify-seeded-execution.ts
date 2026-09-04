import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import { getReferenceSolution } from "../data/references";
import { getCodeExecutor } from "../src/lib/execution/executor";
import { judgeSubmission } from "../src/lib/judge/submission-judge";
import { compareOutput } from "../src/lib/judge/compare-output";

config({ path: ".env.local" });
config();
const prisma = new PrismaClient();

async function main() {
  const problem = await prisma.problem.findUniqueOrThrow({
    where: { slug: "two-sum" },
    include: {
      templates: { where: { language: "cpp" }, take: 1 },
      examples: { orderBy: { orderIndex: "asc" }, take: 1 },
      testCases: { where: { isHidden: true }, orderBy: { orderIndex: "asc" } },
    },
  });
  const template = problem.templates[0];
  const example = problem.examples[0];
  const reference = getReferenceSolution(problem.slug);
  const sourceCode = template.driverCode.replace("// USER_CODE", reference.cpp);
  const run = await getCodeExecutor().execute({
    language: "cpp",
    sourceCode,
    stdin: example.input,
    timeoutMs: problem.timeLimitMs,
    memoryLimitMb: problem.memoryLimitMb,
  });
  if (run.status !== "success" || !compareOutput(run.stdout ?? "", example.output, problem.outputComparison)) {
    throw new Error(`Seeded Run verification failed: ${run.status}`);
  }
  const submit = await judgeSubmission({
    driverCode: template.driverCode,
    code: reference.cpp,
    testCases: problem.testCases,
    comparison: problem.outputComparison,
    timeLimitMs: problem.timeLimitMs,
    memoryLimitMb: problem.memoryLimitMb,
  });
  if (submit.verdict !== "ACCEPTED") throw new Error(`Seeded Submit verification failed: ${submit.verdict}`);
  console.log(JSON.stringify({ run: run.status, submit: submit.verdict, passedCases: submit.passedCases }));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(() => prisma.$disconnect());
