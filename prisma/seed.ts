import { PrismaClient } from "@prisma/client";
import { problems } from "../data/problems";

const prisma = new PrismaClient();
const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

async function main() {
  for (const [orderIndex, item] of problems.entries()) {
    await prisma.problem.upsert({
      where: { slug: item.slug },
      update: {
        title:item.title, difficulty:item.difficulty, description:item.description, constraints:item.constraints,
        orderIndex, isPublished:true, outputComparison:item.comparison ?? "TRIMMED",
        expectedTimeComplexity:item.expectedTimeComplexity, expectedSpaceComplexity:item.expectedSpaceComplexity,
        topics:{deleteMany:{},create:item.topics.map(name=>({topic:{connectOrCreate:{where:{slug:slugify(name)},create:{name,slug:slugify(name)}}}}))},
        examples:{deleteMany:{},create:item.examples.map((e,i)=>({...e,orderIndex:i}))},
        templates:{deleteMany:{},create:{language:"cpp",languageVersion:"C++20",starterCode:item.starterCode,driverCode:item.driverCode,functionName:item.functionName}},
        testCases:{deleteMany:{},create:item.tests.map((t,i)=>({input:t.input,expectedOutput:t.output,isHidden:t.hidden ?? true,orderIndex:i}))},
      },
      create:{
        slug:item.slug,title:item.title,difficulty:item.difficulty,description:item.description,constraints:item.constraints,
        orderIndex,isPublished:true,outputComparison:item.comparison ?? "TRIMMED",expectedTimeComplexity:item.expectedTimeComplexity,expectedSpaceComplexity:item.expectedSpaceComplexity,
        topics:{create:item.topics.map(name=>({topic:{connectOrCreate:{where:{slug:slugify(name)},create:{name,slug:slugify(name)}}}}))},
        examples:{create:item.examples.map((e,i)=>({...e,orderIndex:i}))},
        templates:{create:{language:"cpp",languageVersion:"C++20",starterCode:item.starterCode,driverCode:item.driverCode,functionName:item.functionName}},
        testCases:{create:item.tests.map((t,i)=>({input:t.input,expectedOutput:t.output,isHidden:t.hidden ?? true,orderIndex:i}))},
      }
    });
  }
}

main().finally(() => prisma.$disconnect());
