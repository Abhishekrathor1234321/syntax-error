const mongoose = require("mongoose");

/*
  Ek coding question ka structure.
  - difficulty: "easy" | "medium" | "hard" (isi se points decide honge: 10 / 20 / 30)
  - testCases: hidden test cases jinke against code check hoga
  - hint: chhota sa hint, without giving away full solution
  - solution: full reference solution, jo "Show Answer" pe dikhega
*/
const testCaseSchema = new mongoose.Schema(
  {
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    isHidden: { type: Boolean, default: true }, // false wale "Run" ke liye sample dikhte hain
  },
  { _id: false }
);

const codingQuestionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true },
    points: { type: Number, required: true }, // easy:10, medium:20, hard:30
    tags: [{ type: String }], // e.g. ["Arrays", "Two Pointers"]
    description: { type: String, required: true },
    inputFormat: { type: String },
    outputFormat: { type: String },
    constraints: { type: String },
    sampleInput: { type: String },
    sampleOutput: { type: String },
    hint: { type: String },
    solution: {
      explanation: { type: String },
      code: {
        java: { type: String },
        python: { type: String },
        cpp: { type: String },
      },
    },
    testCases: [testCaseSchema],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.models.CodingQuestion || mongoose.model("CodingQuestion", codingQuestionSchema);

/* ------------------------------------------------------------------ */
/*  SAMPLE DATA — seed script me use karo, ya directly DB me insert karo */
/* ------------------------------------------------------------------ */
module.exports.sampleCodingQuestions = [
  {
    title: "Two Sum",
    slug: "two-sum",
    difficulty: "easy",
    points: 10,
    tags: ["Arrays", "Hashing"],
    description:
      "Ek array of integers nums aur ek integer target diya hai. Do aise indices dhoondo jinke numbers ka sum target ke barabar ho. Har input ka bilkul ek hi valid answer hoga.",
    inputFormat: "Pehli line: n (array size) aur target, space se separated.\nDoosri line: n integers, space se separated.",
    outputFormat: "Do indices (0-based), space se separated.",
    constraints: "2 <= n <= 10^4",
    sampleInput: "4 9\n2 7 11 15",
    sampleOutput: "0 1",
    hint: "Har number ko dekhte hue check karo ki (target - current number) pehle dekha hua hai ya nahi. Ek hashmap me index store karte chalo.",
    solution: {
      explanation:
        "Ek hashmap banao jisme number -> index store ho. Har number ke liye dekho ki complement (target - num) hashmap me hai ya nahi. Agar hai to answer mil gaya, warna current number ko hashmap me daal do. Yeh O(n) time me ho jata hai.",
      code: {
        java: "import java.util.*;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt(), target = sc.nextInt();\n    int[] nums = new int[n];\n    for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n    Map<Integer, Integer> seen = new HashMap<>();\n    for (int i = 0; i < n; i++) {\n      int need = target - nums[i];\n      if (seen.containsKey(need)) {\n        System.out.println(seen.get(need) + \" \" + i);\n        return;\n      }\n      seen.put(nums[i], i);\n    }\n  }\n}",
        python:
          "n, target = map(int, input().split())\nnums = list(map(int, input().split()))\nseen = {}\nfor i, num in enumerate(nums):\n    need = target - num\n    if need in seen:\n        print(seen[need], i)\n        break\n    seen[num] = i",
        cpp: "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n  int n, target;\n  cin >> n >> target;\n  vector<int> nums(n);\n  for (auto &x : nums) cin >> x;\n  unordered_map<int,int> seen;\n  for (int i = 0; i < n; i++) {\n    int need = target - nums[i];\n    if (seen.count(need)) { cout << seen[need] << \" \" << i; return 0; }\n    seen[nums[i]] = i;\n  }\n}",
      },
    },
    testCases: [
      { input: "4 9\n2 7 11 15", expectedOutput: "0 1", isHidden: false },
      { input: "3 6\n3 2 4", expectedOutput: "1 2", isHidden: true },
      { input: "2 6\n3 3", expectedOutput: "0 1", isHidden: true },
    ],
  },
  {
    title: "Reverse Words in a String",
    slug: "reverse-words-in-a-string",
    difficulty: "easy",
    points: 10,
    tags: ["Strings"],
    description:
      "Ek sentence diya hai jisme words space se separated hain. Words ka order reverse karke print karo. Extra spaces ko ignore karo.",
    inputFormat: "Ek line: sentence.",
    outputFormat: "Reversed order ka sentence, single space separated.",
    constraints: "1 <= length <= 10^4",
    sampleInput: "the sky is blue",
    sampleOutput: "blue is sky the",
    hint: "String ko space se split karo, resulting list ko reverse karo, phir join kar do.",
    solution: {
      explanation: "Split karke words ka array/list banao, usse reverse karo, phir single space se join karke print karo. Multiple/leading/trailing spaces handle karne ke liye split ke baad empty strings hata do.",
      code: {
        java: "import java.util.*;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    String line = sc.nextLine().trim();\n    String[] words = line.split(\"\\\\s+\");\n    Collections.reverse(Arrays.asList(words));\n    System.out.println(String.join(\" \", words));\n  }\n}",
        python: "words = input().split()\nprint(' '.join(reversed(words)))",
        cpp: "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n  string line, word;\n  vector<string> words;\n  while (cin >> word) words.push_back(word);\n  reverse(words.begin(), words.end());\n  for (int i = 0; i < words.size(); i++) cout << words[i] << (i + 1 < words.size() ? \" \" : \"\");\n}",
      },
    },
    testCases: [
      { input: "the sky is blue", expectedOutput: "blue is sky the", isHidden: false },
      { input: "  hello   world  ", expectedOutput: "world hello", isHidden: true },
    ],
  },
  {
    title: "Longest Substring Without Repeating Characters",
    slug: "longest-substring-without-repeating",
    difficulty: "medium",
    points: 20,
    tags: ["Sliding Window", "Strings"],
    description:
      "Ek string diya hai. Sabse lambi substring ki length nikaalo jisme koi character repeat na ho.",
    inputFormat: "Ek line: string s.",
    outputFormat: "Ek integer: sabse lambi unique-character substring ki length.",
    constraints: "0 <= length <= 5 * 10^4",
    sampleInput: "abcabcbb",
    sampleOutput: "3",
    hint: "Sliding window use karo. Ek set/map me current window ke characters rakho, jab repeat mile to window ka left end aage badhao jab tak repeat hata na jaye.",
    solution: {
      explanation:
        "Do pointers (left, right) se sliding window banao. Ek HashSet me current window ke characters store karo. Jaise hi right pointer par koi character repeat ho, left pointer ko tab tak aage badhao jab tak duplicate hat na jaye. Har step par window size (right-left+1) se max length update karte raho.",
      code: {
        java: "import java.util.*;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    String s = sc.nextLine();\n    Set<Character> set = new HashSet<>();\n    int left = 0, max = 0;\n    for (int right = 0; right < s.length(); right++) {\n      while (set.contains(s.charAt(right))) {\n        set.remove(s.charAt(left));\n        left++;\n      }\n      set.add(s.charAt(right));\n      max = Math.max(max, right - left + 1);\n    }\n    System.out.println(max);\n  }\n}",
        python:
          "s = input()\nseen = set()\nleft = 0\nans = 0\nfor right in range(len(s)):\n    while s[right] in seen:\n        seen.remove(s[left])\n        left += 1\n    seen.add(s[right])\n    ans = max(ans, right - left + 1)\nprint(ans)",
        cpp: "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n  string s; getline(cin, s);\n  unordered_set<char> seen;\n  int left = 0, ans = 0;\n  for (int right = 0; right < (int)s.size(); right++) {\n    while (seen.count(s[right])) { seen.erase(s[left]); left++; }\n    seen.insert(s[right]);\n    ans = max(ans, right - left + 1);\n  }\n  cout << ans;\n}",
      },
    },
    testCases: [
      { input: "abcabcbb", expectedOutput: "3", isHidden: false },
      { input: "bbbbb", expectedOutput: "1", isHidden: true },
      { input: "pwwkew", expectedOutput: "3", isHidden: true },
    ],
  },
  {
    title: "Group Anagrams",
    slug: "group-anagrams",
    difficulty: "medium",
    points: 20,
    tags: ["Hashing", "Strings"],
    description:
      "Strings ka ek array diya hai. Un strings ko groups me daalo jo ek dusre ke anagram hain (same letters, different order).",
    inputFormat: "Pehli line: n.\nDoosri line: n strings space se separated.",
    outputFormat: "Har group ek line par, strings comma se separated, groups kisi bhi order me ho sakte hain.",
    constraints: "1 <= n <= 10^4",
    sampleInput: "6\neat tea tan ate nat bat",
    sampleOutput: "eat,tea,ate\ntan,nat\nbat",
    hint: "Har string ko sort karke ek 'key' bana lo. Same key wali strings ek hi group me aayengi. HashMap<key, List<String>> use karo.",
    solution: {
      explanation:
        "Har word ke characters ko sort karke uska sorted version key ki tarah use karo (jaise 'eat' -> 'aet'). HashMap<String, List<String>> me is key ke against original words ko group karte jao. Aakhir me map ki saari values print kar do.",
      code: {
        java: "// sorted-string ko key bana kar HashMap<String, List<String>> me group karo",
        python:
          "n = int(input())\nwords = input().split()\nfrom collections import defaultdict\ngroups = defaultdict(list)\nfor w in words:\n    key = ''.join(sorted(w))\n    groups[key].append(w)\nfor g in groups.values():\n    print(','.join(g))",
        cpp: "// sorted string ko key bana kar map<string, vector<string>> me group karo",
      },
    },
    testCases: [
      { input: "6\neat tea tan ate nat bat", expectedOutput: "eat,tea,ate\ntan,nat\nbat", isHidden: false },
    ],
  },
  {
    title: "Trapping Rain Water",
    slug: "trapping-rain-water",
    difficulty: "hard",
    points: 30,
    tags: ["Two Pointers", "Dynamic Programming"],
    description:
      "Non-negative integers ka ek array diya hai jo elevation map represent karta hai, har bar ki width 1 hai. Baarish ke baad kitna paani trap ho sakta hai, woh nikaalo.",
    inputFormat: "Pehli line: n.\nDoosri line: n integers (heights).",
    outputFormat: "Ek integer: total trapped water.",
    constraints: "1 <= n <= 2 * 10^4",
    sampleInput: "12\n0 1 0 2 1 0 1 3 2 1 2 1",
    sampleOutput: "6",
    hint: "Har index par trapped water = min(leftMax, rightMax) - height[i], agar yeh positive ho. Do pointers (left, right) se O(n) me solve ho sakta hai bina extra array ke.",
    solution: {
      explanation:
        "Two-pointer approach: left aur right pointer se shuru karo, leftMax aur rightMax track karo. Jo side chhota hai usi ko process karo, kyunki us side ka water sirf apne max se limited hota hai. Har step par water += currentMax - height[pointer].",
      code: {
        java: "// two-pointer approach with leftMax, rightMax",
        python:
          "n = int(input())\nheights = list(map(int, input().split()))\nleft, right = 0, n - 1\nleftMax = rightMax = water = 0\nwhile left < right:\n    if heights[left] < heights[right]:\n        leftMax = max(leftMax, heights[left])\n        water += leftMax - heights[left]\n        left += 1\n    else:\n        rightMax = max(rightMax, heights[right])\n        water += rightMax - heights[right]\n        right -= 1\nprint(water)",
        cpp: "// two-pointer approach with leftMax, rightMax",
      },
    },
    testCases: [
      { input: "12\n0 1 0 2 1 0 1 3 2 1 2 1", expectedOutput: "6", isHidden: false },
    ],
  },
];