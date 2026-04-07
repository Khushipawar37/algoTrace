import type { Problem } from "@/lib/types";

export const problemBank: Problem[] = [
  {
    id: "p1",
    title: "Two Sum with Constraints",
    slug: "two-sum-constraints",
    tier: "Easy",
    topic: "Arrays, Hashing",
    weaknessAreas: ["approachFinding", "dataStructureSelection", "logicalErrors"],
    prompt:
      "Given an array of integers and a target value, return indices of two numbers that add to target. Handle duplicate values safely.",
    hints: [
      "What data structure gives O(1) average lookup while iterating once?",
      "Store values you've seen and check complement on each step.",
      "Use a map<number, index>, and return as soon as complement exists.",
    ],
    starterCode: {
      javascript:
        "function twoSum(nums, target) {\n  // TODO\n}\n\nconsole.log(twoSum([2,7,11,15], 9));",
      python:
        "def two_sum(nums, target):\n    # TODO\n    pass\n\nprint(two_sum([2,7,11,15], 9))",
      cpp:
        "#include <bits/stdc++.h>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    // TODO\n}\n",
      java:
        "import java.util.*;\n\nclass Solution {\n  public int[] twoSum(int[] nums, int target) {\n    // TODO\n    return new int[]{-1, -1};\n  }\n}",
    },
  },
  {
    id: "p2",
    title: "Longest Substring Without Repeat",
    slug: "longest-substring",
    tier: "Medium",
    topic: "Sliding Window",
    weaknessAreas: ["optimizationThinking", "edgeCaseDetection", "timeManagement"],
    prompt:
      "Return the length of the longest substring without repeating characters.",
    hints: [
      "Brute force checks all substrings. Can you keep a moving valid window?",
      "Track last seen index and move left boundary only forward.",
      "Use a hashmap of char->index, window length is right-left+1.",
    ],
    starterCode: {
      javascript:
        "function lengthOfLongestSubstring(s) {\n  // TODO\n}\n\nconsole.log(lengthOfLongestSubstring('abcabcbb'));",
      python:
        "def length_of_longest_substring(s):\n    # TODO\n    pass\n\nprint(length_of_longest_substring('abcabcbb'))",
      cpp:
        "#include <bits/stdc++.h>\nusing namespace std;\n\nint lengthOfLongestSubstring(string s) {\n    // TODO\n}\n",
      java:
        "import java.util.*;\n\nclass Solution {\n  public int lengthOfLongestSubstring(String s) {\n    // TODO\n    return 0;\n  }\n}",
    },
  },
];

export function getProblemBySlug(slug: string) {
  return problemBank.find((problem) => problem.slug === slug) ?? problemBank[0];
}

