import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";

config({ path: ".env.local" });
config();

const prisma = new PrismaClient();

async function main() {
  const [total, difficulty, cases] = await Promise.all([
    prisma.problem.count({ where: { isPublished: true } }),
    prisma.problem.groupBy({ by: ["difficulty"], where: { isPublished: true }, _count: { _all: true } }),
    prisma.testCase.groupBy({ by: ["problemId"], _count: { _all: true } }),
  ]);
  const counts = cases.map((item) => item._count._all);
  console.log(JSON.stringify({
    total,
    difficulty: Object.fromEntries(difficulty.map((item) => [item.difficulty, item._count._all])),
    totalTests: counts.reduce((sum, count) => sum + count, 0),
    minTests: Math.min(...counts),
    maxTests: Math.max(...counts),
  }));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(() => prisma.$disconnect());
