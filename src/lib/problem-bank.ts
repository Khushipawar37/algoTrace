import type { Problem } from "@/lib/types";
import { striversProblems } from "@/data/strivers-questions";

export const problemBank: Problem[] = striversProblems;

export function getProblemBySlug(slug: string) {
  return problemBank.find((problem) => problem.slug === slug) ?? problemBank[0];
}

export function getProblemById(id: string) {
  return problemBank.find((problem) => problem.id === id) ?? problemBank[0];
}

export function getUniqueTags(): string[] {
  const tags = new Set<string>();
  problemBank.forEach((p) => p.tags.forEach((t) => tags.add(t)));
  return Array.from(tags).sort();
}

export function getUniqueTopics(): string[] {
  const topics = new Set<string>();
  problemBank.forEach((p) => topics.add(p.topic));
  return Array.from(topics).sort();
}
