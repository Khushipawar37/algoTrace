import { advancedReferenceSolutions } from "./advanced";
export type ReferenceSolution = {
  solve(input: string): string;
  cpp: string;
};

const nums = (input: string) => (input.match(/-?\d+/g) ?? []).map(Number);
const tokens = (input: string) => input.trim().split(/\s+/).filter(Boolean);
const vec = (values: number[]) => values.join(" ");

function numericReference(name: string, body: (a: number[]) => string, cpp: string): ReferenceSolution {
  return { solve: (input) => body(nums(input)), cpp: `class Solution { public: ${cpp} };` };
}

export const referenceSolutions: Record<string, ReferenceSolution> = {
  ...advancedReferenceSolutions,
  "two-sum": numericReference("twoSum", (x) => { const n=x[0], a=x.slice(1,n+1), t=x[n+1], seen=new Map<number,number>(); for(let i=0;i<n;i++){const j=seen.get(t-a[i]);if(j!==undefined)return `${j} ${i}`;seen.set(a[i],i);}return ""; }, `vector<int> twoSum(vector<int>& a,int t){unordered_map<int,int>m;for(int i=0;i<(int)a.size();i++){if(m.count(t-a[i]))return {m[t-a[i]],i};m[a[i]]=i;}return {};}`),
  "binary-search": numericReference("search", (x) => { const n=x[0],a=x.slice(1,n+1),t=x[n+1]; let l=0,r=n-1;while(l<=r){const m=(l+r)>>1;if(a[m]===t)return String(m);a[m]<t?l=m+1:r=m-1;}return "-1"; }, `int search(vector<int>&a,int t){int l=0,r=a.size()-1;while(l<=r){int m=l+(r-l)/2;if(a[m]==t)return m;if(a[m]<t)l=m+1;else r=m-1;}return -1;}`),
  "valid-parentheses": { solve(input){const st:string[]=[];const pairs:Record<string,string>={")":"(","]":"[","}":"{"};for(const c of input.trim()){if("([{".includes(c))st.push(c);else if(st.pop()!==pairs[c])return "false";}return st.length?"false":"true";}, cpp:`class Solution { public: bool isValid(string s){stack<char>q;for(char c:s){if(c=='('||c=='['||c=='{')q.push(c);else{if(q.empty())return false;char x=q.top();q.pop();if((c==')'&&x!='(')||(c==']'&&x!='[')||(c=='}'&&x!='{'))return false;}}return q.empty();} };`},
  "best-time-to-buy-and-sell-stock": numericReference("maxProfit", (x)=>{const a=x.slice(1,x[0]+1);let low=Infinity,best=0;for(const v of a){low=Math.min(low,v);best=Math.max(best,v-low);}return String(best);}, `int maxProfit(vector<int>&a){int low=INT_MAX,best=0;for(int x:a){low=min(low,x);best=max(best,x-low);}return best;}`),
  "reverse-string": {solve:(input)=>[...input.replace(/\r?\n$/,"")].reverse().join(""),cpp:`class Solution { public: string reverseString(string s){reverse(s.begin(),s.end());return s;} };`},
  factorial: numericReference("factorial",(x)=>{let r=BigInt(1);for(let i=BigInt(2);i<=BigInt(x[0]);i++)r*=i;return String(r);},`long long factorial(int n){long long r=1;for(int i=2;i<=n;i++)r*=i;return r;}`),
  "move-zeroes": numericReference("moveZeroes",(x)=>{const a=x.slice(1,x[0]+1),b=a.filter(v=>v!==0);return vec(b.concat(Array(a.length-b.length).fill(0)));},`vector<int> moveZeroes(vector<int>a){int j=0;for(int x:a)if(x)a[j++]=x;while(j<(int)a.size())a[j++]=0;return a;}`),
  "valid-palindrome": {solve(input){const s=input.toLowerCase().replace(/[^a-z0-9]/g,"");return String(s===[...s].reverse().join(""));},cpp:`class Solution { public: bool isPalindrome(string s){int l=0,r=s.size()-1;while(l<r){while(l<r&&!isalnum((unsigned char)s[l]))l++;while(l<r&&!isalnum((unsigned char)s[r]))r--;if(tolower(s[l++])!=tolower(s[r--]))return false;}return true;} };`},
  "first-occurrence": {solve(input){const [haystack="",needle=""]=input.replace(/\r/g,"").split("\n");return String(haystack.indexOf(needle));},cpp:`class Solution { public: int strStr(string h,string n){return h.find(n)==string::npos?-1:(int)h.find(n);} };`},
  "max-consecutive-ones": numericReference("findMaxConsecutiveOnes",(x)=>{let b=0,c=0;for(const v of x.slice(1,x[0]+1)){c=v?c+1:0;b=Math.max(b,c);}return String(b);},`int findMaxConsecutiveOnes(vector<int>&a){int b=0,c=0;for(int x:a){c=x?c+1:0;b=max(b,c);}return b;}`),
  "maximum-subarray": numericReference("maxSubArray",(x)=>{const a=x.slice(1,x[0]+1);let cur=a[0],best=a[0];for(const v of a.slice(1)){cur=Math.max(v,cur+v);best=Math.max(best,cur);}return String(best);},`int maxSubArray(vector<int>&a){int cur=a[0],best=a[0];for(int i=1;i<(int)a.size();i++){cur=max(a[i],cur+a[i]);best=max(best,cur);}return best;}`),
  "longest-substring-without-repeating-characters": {solve(input){const s=input.replace(/\r?\n$/,"");let l=0,b=0;const at=new Map<string,number>();for(let r=0;r<s.length;r++){l=Math.max(l,(at.get(s[r])??-1)+1);at.set(s[r],r);b=Math.max(b,r-l+1);}return String(b);},cpp:`class Solution { public: int lengthOfLongestSubstring(string s){vector<int>at(256,-1);int l=0,b=0;for(int r=0;r<(int)s.size();r++){l=max(l,at[(unsigned char)s[r]]+1);at[(unsigned char)s[r]]=r;b=max(b,r-l+1);}return b;} };`},
  "container-most-water": numericReference("maxArea",(x)=>{const a=x.slice(1,x[0]+1);let l=0,r=a.length-1,b=0;while(l<r){b=Math.max(b,Math.min(a[l],a[r])*(r-l));a[l]<a[r]?l++:r--;}return String(b);},`long long maxArea(vector<int>&a){int l=0,r=a.size()-1;long long b=0;while(l<r){b=max(b,1LL*min(a[l],a[r])*(r-l));if(a[l]<a[r])l++;else r--;}return b;}`),
  "minimum-size-subarray-sum": numericReference("minSubArrayLen",(x)=>{const t=x[0],n=x[1],a=x.slice(2,2+n);let l=0,sum=0,b=n+1;for(let r=0;r<n;r++){sum+=a[r];while(sum>=t){b=Math.min(b,r-l+1);sum-=a[l++];}}return String(b===n+1?0:b);},`int minSubArrayLen(int t,vector<int>&a){int l=0,sum=0,b=a.size()+1;for(int r=0;r<(int)a.size();r++){sum+=a[r];while(sum>=t){b=min(b,r-l+1);sum-=a[l++];}}return b==(int)a.size()+1?0:b;}`),
  "daily-temperatures": numericReference("dailyTemperatures",(x)=>{const a=x.slice(1,x[0]+1),ans=Array(a.length).fill(0),st:number[]=[];for(let i=0;i<a.length;i++){while(st.length&&a[st.at(-1)!]<a[i]){const j=st.pop()!;ans[j]=i-j;}st.push(i);}return vec(ans);},`vector<int> dailyTemperatures(vector<int>&a){vector<int>ans(a.size()),st;for(int i=0;i<(int)a.size();i++){while(!st.empty()&&a[st.back()]<a[i]){int j=st.back();st.pop_back();ans[j]=i-j;}st.push_back(i);}return ans;}`),
  "product-except-self": numericReference("productExceptSelf",(x)=>{const a=x.slice(1,x[0]+1),ans=Array(a.length).fill(1);let p=1;for(let i=0;i<a.length;i++){ans[i]=p;p*=a[i];}p=1;for(let i=a.length-1;i>=0;i--){ans[i]*=p;p*=a[i];}return vec(ans);},`vector<long long> productExceptSelf(vector<int>&a){vector<long long>r(a.size(),1);long long p=1;for(int i=0;i<(int)a.size();i++){r[i]=p;p*=a[i];}p=1;for(int i=a.size()-1;i>=0;i--){r[i]*=p;p*=a[i];}return r;}`),
  "next-greater-circular": numericReference("nextGreaterElements",(x)=>{const a=x.slice(1,x[0]+1),n=a.length,ans=Array(n).fill(-1),st:number[]=[];for(let i=0;i<2*n;i++){while(st.length&&a[st.at(-1)!]<a[i%n])ans[st.pop()!]=a[i%n];if(i<n)st.push(i);}return vec(ans);},`vector<int> nextGreaterElements(vector<int>&a){int n=a.size();vector<int>r(n,-1),st;for(int i=0;i<2*n;i++){while(!st.empty()&&a[st.back()]<a[i%n]){r[st.back()]=a[i%n];st.pop_back();}if(i<n)st.push_back(i);}return r;}`),
  "evaluate-postfix": {solve(input){const t=tokens(input);const n=Number(t.shift()),st:number[]=[];for(const s of t.slice(0,n)){if(!"+-*/".includes(s)||s.length>1)st.push(Number(s));else{const b=st.pop()!,a=st.pop()!;st.push(s==="+"?a+b:s==="-"?a-b:s==="*"?a*b:Math.trunc(a/b));}}return String(st[0]);},cpp:`class Solution { public: int evalRPN(vector<string>&t){stack<int>s;for(auto x:t){if(x.size()>1||isdigit(x[0]))s.push(stoi(x));else{int b=s.top();s.pop();int a=s.top();s.pop();s.push(x=="+"?a+b:x=="-"?a-b:x=="*"?a*b:a/b);}}return s.top();} };`},
  "search-rotated-array": numericReference("search",(x)=>{const n=x[0],a=x.slice(1,n+1),t=x[n+1];return String(a.indexOf(t));},`int search(vector<int>&a,int t){int l=0,r=a.size()-1;while(l<=r){int m=(l+r)/2;if(a[m]==t)return m;if(a[l]<=a[m]){if(a[l]<=t&&t<a[m])r=m-1;else l=m+1;}else{if(a[m]<t&&t<=a[r])l=m+1;else r=m-1;}}return -1;}`),
  "search-a-2d-matrix": numericReference("searchMatrix",(x)=>{const r=x[0],c=x[1],a=x.slice(2,2+r*c),t=x[2+r*c];return String(a.includes(t));},`bool searchMatrix(vector<vector<int>>&a,int t){int r=a.size(),c=a[0].size(),l=0,h=r*c-1;while(l<=h){int m=(l+h)/2,x=a[m/c][m%c];if(x==t)return true;if(x<t)l=m+1;else h=m-1;}return false;}`),
};

export function getReferenceSolution(slug: string) {
  const reference = referenceSolutions[slug];
  if (!reference) throw new Error(`Missing reference solution: ${slug}`);
  return reference;
}
