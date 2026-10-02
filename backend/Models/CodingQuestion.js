const mongoose = require("mongoose");

/*
  Structure of a single coding question.
  - topic: "Arrays" | "Strings" | "LinkedList" | etc. (used for sidebar filtering)
  - difficulty: "easy" | "medium" | "hard" (decides points: 10 / 20 / 30)
  - testCases: hidden test cases used to validate the submitted code
  - hint: a small hint, without giving away the full solution
  - solution: full reference solution, shown on "Show Answer"
*/
const testCaseSchema = new mongoose.Schema(
  {
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    isHidden: { type: Boolean, default: true }, // false ones are shown as sample tests on "Run"
  },
  { _id: false }
);

const codingQuestionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },

    // used to group questions by topic in the sidebar
    // (kept as a plain string, not an enum, so new topics can be added without a schema change)
    topic: { type: String, required: true, trim: true },

    difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true },
    points: { type: Number, required: true }, // easy:10, medium:20, hard:30
    tags: [{ type: String }], // e.g. ["Arrays", "Two Pointers"]
    description: { type: String, required: true },
    inputFormat: { type: String },
    outputFormat: { type: String },
    constraints: { type: String },
   samples: [
  {
    input: { type: String, required: true },
    output: { type: String, required: true },
    explanation: { type: String, default: "" },
  },
],
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

// index for fast filtering by topic + difficulty
codingQuestionSchema.index({ topic: 1, difficulty: 1 });

module.exports = mongoose.models.CodingQuestion || mongoose.model("CodingQuestion", codingQuestionSchema);

/* ------------------------------------------------------------------ */
/*  SAMPLE DATA — use in a seed script, or insert directly into the DB */
/* ------------------------------------------------------------------ */
module.exports.sampleCodingQuestions = [
  {
    title: "Two Sum",
    slug: "two-sum",
    topic: "Arrays",
    difficulty: "easy",
    points: 10,
    tags: ["Arrays", "Hashing"],
    description:
      "You are given an array of integers nums and an integer target. Find two indices such that the numbers at those indices add up to target. Each input has exactly one valid answer.",
    inputFormat: "First line: n (array size) and target, space separated.\nSecond line: n integers, space separated.",
    outputFormat: "Two indices (0-based), space separated.",
    constraints: "2 <= n <= 10^4",
    sampleInput: "4 9\n2 7 11 15",
    sampleOutput: "0 1",
    hint: "As you go through each number, check whether (target - current number) has already been seen. Keep storing numbers and their indices in a hashmap.",
    solution: {
      explanation:
        "Build a hashmap that stores number -> index. For each number, check whether its complement (target - num) already exists in the hashmap. If it does, you have your answer; otherwise, add the current number to the hashmap. This runs in O(n) time.",
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
    topic: "Strings",
    difficulty: "easy",
    points: 10,
    tags: ["Strings"],
    description:
      "You are given a sentence made up of words separated by spaces. Print the words in reverse order. Ignore any extra spaces.",
    inputFormat: "One line: the sentence.",
    outputFormat: "The words in reverse order, separated by a single space.",
    constraints: "1 <= length <= 10^4",
    sampleInput: "the sky is blue",
    sampleOutput: "blue is sky the",
    hint: "Split the string by spaces, reverse the resulting list, then join it back together.",
    solution: {
      explanation:
        "Split the sentence into an array/list of words, reverse it, then join it back with a single space and print it. To handle multiple/leading/trailing spaces, drop any empty strings produced by the split.",
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
    topic: "Strings",
    difficulty: "medium",
    points: 20,
    tags: ["Sliding Window", "Strings"],
    description:
      "You are given a string. Find the length of the longest substring that does not contain any repeating characters.",
    inputFormat: "One line: string s.",
    outputFormat: "One integer: the length of the longest substring with unique characters.",
    constraints: "0 <= length <= 5 * 10^4",
    sampleInput: "abcabcbb",
    sampleOutput: "3",
    hint: "Use a sliding window. Keep the characters of the current window in a set/map; when a repeat is found, move the window's left end forward until the repeat is removed.",
    solution: {
      explanation:
        "Use two pointers (left, right) to form a sliding window. Store the characters of the current window in a HashSet. As soon as the character at the right pointer repeats, move the left pointer forward until the duplicate is removed. At every step, update the max length using the window size (right - left + 1).",
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
    topic: "Strings",
    difficulty: "medium",
    points: 20,
    tags: ["Hashing", "Strings"],
    description:
      "You are given an array of strings. Group the strings that are anagrams of each other (same letters, different order).",
    inputFormat: "First line: n.\nSecond line: n strings, space separated.",
    outputFormat: "Each group on its own line, strings comma separated. Groups can be in any order.",
    constraints: "1 <= n <= 10^4",
    sampleInput: "6\neat tea tan ate nat bat",
    sampleOutput: "eat,tea,ate\ntan,nat\nbat",
    hint: "Sort the characters of each string to build a 'key'. Strings with the same key belong to the same group. Use a HashMap<key, List<String>>.",
    solution: {
      explanation:
        "Sort the characters of each word to get a key (e.g. 'eat' -> 'aet'). Use a HashMap<String, List<String>> to group the original words under this key. Finally, print all the values of the map.",
      code: {
        java: "// group by sorted-string key using HashMap<String, List<String>>",
        python:
          "n = int(input())\nwords = input().split()\nfrom collections import defaultdict\ngroups = defaultdict(list)\nfor w in words:\n    key = ''.join(sorted(w))\n    groups[key].append(w)\nfor g in groups.values():\n    print(','.join(g))",
        cpp: "// group by sorted-string key using map<string, vector<string>>",
      },
    },
    testCases: [
      { input: "6\neat tea tan ate nat bat", expectedOutput: "eat,tea,ate\ntan,nat\nbat", isHidden: false },
    ],
  },
  {
    title: "Trapping Rain Water",
    slug: "trapping-rain-water",
    topic: "Two Pointers",
    difficulty: "hard",
    points: 30,
    tags: ["Two Pointers", "Dynamic Programming"],
    description:
      "You are given an array of non-negative integers representing an elevation map, where each bar has a width of 1. Find out how much water it can trap after raining.",
    inputFormat: "First line: n.\nSecond line: n integers (heights).",
    outputFormat: "One integer: total trapped water.",
    constraints: "1 <= n <= 2 * 10^4",
    sampleInput: "12\n0 1 0 2 1 0 1 3 2 1 2 1",
    sampleOutput: "6",
    hint: "At each index, trapped water = min(leftMax, rightMax) - height[i], if that value is positive. This can be solved in O(n) using two pointers (left, right) without an extra array.",
    solution: {
      explanation:
        "Two-pointer approach: start with a left and right pointer, and track leftMax and rightMax. Always process whichever side is smaller, since that side's water is limited only by its own max. At every step, add water += currentMax - height[pointer].",
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