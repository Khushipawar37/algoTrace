import type { ProblemSeed } from "./types";

const prelude = `#include <bits/stdc++.h>\nusing namespace std;\n\n// USER_CODE\n\n`;
const readVector = `int n; cin >> n; vector<int> a(n); for(int &x:a) cin >> x;`;
const printVector = `for(size_t i=0;i<ans.size();++i){if(i) cout<<' '; cout<<ans[i];}`;
const vectorProblem = (main: string) => prelude + `int main(){ios::sync_with_stdio(false);cin.tie(nullptr);${readVector}${main}}`;

export const problems: ProblemSeed[] = [
  {
    title:"Two Sum", slug:"two-sum", difficulty:"EASY", topics:["Arrays","Hashing"],
    description:"Given an integer array and a target, return the zero-based indices of two distinct elements whose sum is the target. Exactly one answer exists.",
    constraints:["2 <= n <= 100000","-10^9 <= values, target <= 10^9"],
    examples:[{input:"4\n2 7 11 15\n9",output:"0 1",explanation:"2 + 7 equals 9."},{input:"3\n3 2 4\n6",output:"1 2"}],
    starterCode:`class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your solution here\n        return {};\n    }\n};`,
    driverCode:vectorProblem(`int target;cin>>target;Solution s;auto ans=s.twoSum(a,target);${printVector}return 0;`), functionName:"twoSum",
    tests:[{input:"2\n3 3\n6",output:"0 1"},{input:"5\n-4 -1 0 5 9\n5",output:"0 4"},{input:"4\n10 20 30 40\n70",output:"2 3"},{input:"3\n0 4 3\n0",output:"0 0",hidden:false},{input:"6\n1 8 2 7 3 6\n9",output:"0 1"}], comparison:"TOKENS", expectedTimeComplexity:"O(n)", expectedSpaceComplexity:"O(n)"
  },
  {
    title:"Binary Search", slug:"binary-search", difficulty:"EASY", topics:["Arrays","Binary Search"],
    description:"Given an ascending sorted array and a target, return its index, or -1 when it is absent.", constraints:["1 <= n <= 100000","Array is sorted in ascending order"],
    examples:[{input:"6\n-1 0 3 5 9 12\n9",output:"4"},{input:"6\n-1 0 3 5 9 12\n2",output:"-1"}],
    starterCode:`class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        return -1;\n    }\n};`, driverCode:vectorProblem(`int target;cin>>target;Solution s;cout<<s.search(a,target);return 0;`), functionName:"search",
    tests:[{input:"1\n5\n5",output:"0"},{input:"1\n5\n-1",output:"-1"},{input:"5\n1 2 3 4 5\n1",output:"0"},{input:"5\n1 2 3 4 5\n5",output:"4"},{input:"7\n-9 -3 0 2 8 11 20\n8",output:"4"}], expectedTimeComplexity:"O(log n)", expectedSpaceComplexity:"O(1)"
  },
  {
    title:"Valid Parentheses", slug:"valid-parentheses", difficulty:"EASY", topics:["Stack","Strings"], description:"Determine whether every bracket in the string is closed by the matching type in the correct order.", constraints:["1 <= length <= 100000","Input contains only ()[]{}"],
    examples:[{input:"()[]{}",output:"true"},{input:"([)]",output:"false"}], starterCode:`class Solution {\npublic:\n    bool isValid(string s) {\n        return false;\n    }\n};`, driverCode:prelude+`int main(){string x;cin>>x;Solution s;cout<<(s.isValid(x)?"true":"false");}`, functionName:"isValid",
    tests:[{input:"()",output:"true"},{input:"(",output:"false"},{input:"{[]}",output:"true"},{input:"]",output:"false"},{input:"(([]){})",output:"true"}], expectedTimeComplexity:"O(n)", expectedSpaceComplexity:"O(n)"
  },
  {
    title:"Longest Substring Without Repeating Characters", slug:"longest-substring-without-repeating-characters", difficulty:"MEDIUM", topics:["Strings","Sliding Window","Hashing"], description:"Return the maximum length of a contiguous substring containing no repeated character.", constraints:["0 <= length <= 100000","The string is a single input line"],
    examples:[{input:"abcabcbb",output:"3"},{input:"bbbbb",output:"1"}], starterCode:`class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        return 0;\n    }\n};`, driverCode:prelude+`int main(){string x;getline(cin,x);Solution s;cout<<s.lengthOfLongestSubstring(x);}`, functionName:"lengthOfLongestSubstring",
    tests:[{input:"",output:"0"},{input:"a",output:"1"},{input:"pwwkew",output:"3"},{input:"abba",output:"2"},{input:"abcdef",output:"6"}], expectedTimeComplexity:"O(n)", expectedSpaceComplexity:"O(character set)"
  },
  {
    title:"Merge Intervals", slug:"merge-intervals", difficulty:"MEDIUM", topics:["Arrays","Sorting","Intervals"], description:"Merge all overlapping closed intervals and return the non-overlapping intervals ordered by start.", constraints:["1 <= n <= 10000","start <= end"],
    examples:[{input:"4\n1 3\n2 6\n8 10\n15 18",output:"1 6\n8 10\n15 18"},{input:"2\n1 4\n4 5",output:"1 5"}], starterCode:`class Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        return {};\n    }\n};`, driverCode:prelude+`int main(){int n;cin>>n;vector<vector<int>> a(n,vector<int>(2));for(auto&v:a)cin>>v[0]>>v[1];Solution s;auto ans=s.merge(a);for(auto&v:ans)cout<<v[0]<<' '<<v[1]<<'\\n';}`, functionName:"merge",
    tests:[{input:"1\n1 2",output:"1 2"},{input:"3\n1 10\n2 3\n4 8",output:"1 10"},{input:"3\n-5 -1\n0 2\n2 4",output:"-5 -1\n0 4"},{input:"3\n1 2\n3 4\n5 6",output:"1 2\n3 4\n5 6"},{input:"2\n1 4\n0 5",output:"0 5"}], comparison:"TOKENS", expectedTimeComplexity:"O(n log n)"
  },
  {
    title:"Maximum Subarray", slug:"maximum-subarray", difficulty:"MEDIUM", topics:["Arrays","Dynamic Programming"], description:"Find the largest possible sum of a non-empty contiguous subarray.", constraints:["1 <= n <= 100000"],
    examples:[{input:"9\n-2 1 -3 4 -1 2 1 -5 4",output:"6"},{input:"1\n-1",output:"-1"}], starterCode:`class Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        return 0;\n    }\n};`, driverCode:vectorProblem(`Solution s;cout<<s.maxSubArray(a);return 0;`), functionName:"maxSubArray",
    tests:[{input:"1\n5",output:"5"},{input:"4\n-8 -3 -6 -2",output:"-2"},{input:"5\n1 2 3 4 5",output:"15"},{input:"6\n5 -10 6 7 -20 4",output:"13"},{input:"3\n0 0 0",output:"0"}], expectedTimeComplexity:"O(n)", expectedSpaceComplexity:"O(1)"
  },
  {
    title:"Best Time to Buy and Sell Stock", slug:"best-time-to-buy-and-sell-stock", difficulty:"EASY", topics:["Arrays","Greedy"], description:"Choose one day to buy and a later day to sell. Return the greatest profit, or zero if no profitable trade exists.", constraints:["1 <= n <= 100000","0 <= price <= 10^9"],
    examples:[{input:"6\n7 1 5 3 6 4",output:"5"},{input:"5\n7 6 4 3 1",output:"0"}], starterCode:`class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        return 0;\n    }\n};`, driverCode:vectorProblem(`Solution s;cout<<s.maxProfit(a);return 0;`), functionName:"maxProfit",
    tests:[{input:"1\n5",output:"0"},{input:"2\n1 9",output:"8"},{input:"5\n9 7 4 3 1",output:"0"},{input:"6\n2 4 1 8 3 10",output:"9"},{input:"4\n3 3 3 3",output:"0"}], expectedTimeComplexity:"O(n)", expectedSpaceComplexity:"O(1)"
  },
  {
    title:"Reverse String", slug:"reverse-string", difficulty:"EASY", topics:["Strings","Two Pointers"], description:"Reverse the supplied string and return the result.", constraints:["0 <= length <= 100000"], examples:[{input:"hello",output:"olleh"},{input:"AlgoTrace",output:"ecarToglA"}],
    starterCode:`class Solution {\npublic:\n    string reverseString(string s) {\n        return s;\n    }\n};`, driverCode:prelude+`int main(){string x;getline(cin,x);Solution s;cout<<s.reverseString(x);}`, functionName:"reverseString",
    tests:[{input:"",output:""},{input:"a",output:"a"},{input:"abba",output:"abba"},{input:"12345",output:"54321"},{input:"a b",output:"b a"}], expectedTimeComplexity:"O(n)"
  },
  {
    title:"Search a 2D Matrix", slug:"search-a-2d-matrix", difficulty:"MEDIUM", topics:["Matrix","Binary Search"], description:"Rows are sorted and each row starts after the previous row ends. Return whether the target occurs in the matrix.", constraints:["1 <= rows, columns","Total cells <= 100000"],
    examples:[{input:"3 4\n1 3 5 7\n10 11 16 20\n23 30 34 60\n3",output:"true"},{input:"1 2\n1 3\n2",output:"false"}], starterCode:`class Solution {\npublic:\n    bool searchMatrix(vector<vector<int>>& matrix, int target) {\n        return false;\n    }\n};`, driverCode:prelude+`int main(){int r,c;cin>>r>>c;vector<vector<int>> a(r,vector<int>(c));for(auto&row:a)for(int&x:row)cin>>x;int target;cin>>target;Solution s;cout<<(s.searchMatrix(a,target)?"true":"false");}`, functionName:"searchMatrix",
    tests:[{input:"1 1\n5\n5",output:"true"},{input:"1 1\n5\n4",output:"false"},{input:"2 3\n-5 -2 0\n3 8 10\n-5",output:"true"},{input:"2 2\n1 2\n4 5\n3",output:"false"},{input:"3 1\n1\n2\n3\n3",output:"true"}], expectedTimeComplexity:"O(log(rows * columns))"
  },
  {
    title:"Factorial", slug:"factorial", difficulty:"EASY", topics:["Recursion","Math"], description:"Return n factorial. Use a 64-bit integer; the input range guarantees the result fits.", constraints:["0 <= n <= 20"], examples:[{input:"5",output:"120"},{input:"0",output:"1"}],
    starterCode:`class Solution {\npublic:\n    long long factorial(int n) {\n        return 1;\n    }\n};`, driverCode:prelude+`int main(){int n;cin>>n;Solution s;cout<<s.factorial(n);}`, functionName:"factorial",
    tests:[{input:"0",output:"1"},{input:"1",output:"1"},{input:"2",output:"2"},{input:"10",output:"3628800"},{input:"20",output:"2432902008176640000"}], expectedTimeComplexity:"O(n)"
  }
];
