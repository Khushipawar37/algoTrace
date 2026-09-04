import { PrismaClient } from "@prisma/client";
import { problems } from "../data/problems";
import { validateProblemSeeds } from "../data/problems/validation";

const prisma = new PrismaClient();
const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

async function main() {
  validateProblemSeeds(problems);
  for (const [orderIndex, item] of problems.entries()) {
    const shared = {
      title:item.title,difficulty:item.difficulty,description:item.description,constraints:item.constraints,
      orderIndex,isPublished:true,outputComparison:item.comparison ?? "TRIMMED" as const,
      expectedTimeComplexity:item.expectedTimeComplexity,expectedSpaceComplexity:item.expectedSpaceComplexity,
      canonicalPatterns:[item.primaryPattern!,...(item.secondaryPatterns ?? [])],
      prerequisiteTopics:item.prerequisiteTopics ?? [],commonMistakes:item.commonMistakes ?? [],
      guidanceHints:item.guidanceHints ?? []
    };
    const topics = item.topics.map(name=>({topic:{connectOrCreate:{where:{slug:slugify(name)},create:{name,slug:slugify(name)}}}}));
    const examples = item.examples.map((example,index)=>({...example,orderIndex:index}));
    const templates = (item.templates ?? []).map(template=>({...template}));
    const testCases = (item.testCases ?? []).map((test,index)=>({input:test.input,expectedOutput:test.output,isHidden:test.hidden ?? true,orderIndex:index}));
    await prisma.problem.upsert({
      where:{slug:item.slug},
      update:{...shared,
        topics:{deleteMany:{},create:topics},examples:{deleteMany:{},create:examples},
        templates:{deleteMany:{},create:templates},testCases:{deleteMany:{},create:testCases}
      },
      create:{slug:item.slug,...shared,
        topics:{create:topics},examples:{create:examples},templates:{create:templates},testCases:{create:testCases}
      }
    });
  }
  console.log(`Seeded ${problems.length} problems without deleting submissions or progress.`);
}

main().catch(error=>{console.error(error);process.exitCode=1;}).finally(()=>prisma.$disconnect());
