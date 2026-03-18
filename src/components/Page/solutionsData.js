export const solutions = {
  1: {
    tc: "O(n)", sc: "O(n)",
    java: `Map<Integer, Integer> map = new HashMap<>();
for (int i = 0; i < nums.length; i++) {
  int diff = target - nums[i];
  if (map.containsKey(diff)) return new int[]{map.get(diff), i};
  map.put(nums[i], i);
}`,
    cpp: `unordered_map<int,int> mp;
for(int i = 0; i < nums.size(); i++){
  int diff = target - nums[i];
  if(mp.count(diff)) return {mp[diff], i};
  mp[nums[i]] = i;
}`,
    python: `seen = {}
for i, num in enumerate(nums):
    diff = target - num
    if diff in seen:
        return [seen[diff], i]
    seen[num] = i`
  },
  2: {
    tc: "O(n)", sc: "O(1)",
    java: `int min = Integer.MAX_VALUE, profit = 0;
for (int price : prices) {
  min = Math.min(min, price);
  profit = Math.max(profit, price - min);
}
return profit;`,
    cpp: `int minPrice = INT_MAX, profit = 0;
for(int price : prices){
  minPrice = min(minPrice, price);
  profit = max(profit, price - minPrice);
}
return profit;`,
    python: `min_price, profit = float('inf'), 0
for price in prices:
    min_price = min(min_price, price)
    profit = max(profit, price - min_price)
return profit`
  },
  3: {
    tc: "O(m+n)", sc: "O(1)",
    java: `int i = m-1, j = n-1, k = m+n-1;
while(j >= 0)
  nums1[k--] = (i>=0 && nums1[i]>nums2[j]) ? nums1[i--] : nums2[j--];`,
    cpp: `int i=m-1, j=n-1, k=m+n-1;
while(j>=0)
  nums1[k--] = (i>=0 && nums1[i]>nums2[j]) ? nums1[i--] : nums2[j--];`,
    python: `i, j, k = m-1, n-1, m+n-1
while j >= 0:
    if i >= 0 and nums1[i] > nums2[j]:
        nums1[k] = nums1[i]; i -= 1
    else:
        nums1[k] = nums2[j]; j -= 1
    k -= 1`
  },
  4: {
    tc: "O(n)", sc: "O(n)",
    java: `Set<Integer> set = new HashSet<>();
for (int num : nums)
  if (!set.add(num)) return true;
return false;`,
    cpp: `unordered_set<int> s;
for(int n : nums){
  if(s.count(n)) return true;
  s.insert(n);
}
return false;`,
    python: `return len(nums) != len(set(nums))`
  },
  5: {
    tc: "O(n)", sc: "O(n)",
    java: `int n = nums.length;
int[] res = new int[n];
res[0] = 1;
for(int i=1; i<n; i++) res[i] = res[i-1]*nums[i-1];
int right = 1;
for(int i=n-1; i>=0; i--){
  res[i] *= right;
  right *= nums[i];
}
return res;`,
    cpp: `int n = nums.size();
vector<int> res(n,1);
for(int i=1;i<n;i++) res[i]=res[i-1]*nums[i-1];
int right=1;
for(int i=n-1;i>=0;i--){res[i]*=right; right*=nums[i];}
return res;`,
    python: `n = len(nums)
res = [1] * n
for i in range(1, n): res[i] = res[i-1] * nums[i-1]
right = 1
for i in range(n-1, -1, -1):
    res[i] *= right
    right *= nums[i]
return res`
  },
  6: {
    tc: "O(n)", sc: "O(1)",
    java: `int max = nums[0], curr = nums[0];
for(int i=1; i<nums.length; i++){
  curr = Math.max(nums[i], curr+nums[i]);
  max = Math.max(max, curr);
}
return max;`,
    cpp: `int maxSum = nums[0], curr = nums[0];
for(int i=1;i<nums.size();i++){
  curr = max(nums[i], curr+nums[i]);
  maxSum = max(maxSum, curr);
}
return maxSum;`,
    python: `curr = max_sum = nums[0]
for num in nums[1:]:
    curr = max(num, curr + num)
    max_sum = max(max_sum, curr)
return max_sum`
  },
  7: {
    tc: "O(n²)", sc: "O(1)",
    java: `Arrays.sort(nums);
for(int i=0; i<nums.length-2; i++){
  if(i>0 && nums[i]==nums[i-1]) continue;
  int l=i+1, r=nums.length-1;
  while(l<r){
    int sum=nums[i]+nums[l]+nums[r];
    if(sum==0) list.add(Arrays.asList(nums[i],nums[l++],nums[r--]));
    else if(sum<0) l++;
    else r--;
  }
}`,
    cpp: `sort(nums.begin(),nums.end());
for(int i=0;i<nums.size()-2;i++){
  if(i>0 && nums[i]==nums[i-1]) continue;
  int l=i+1,r=nums.size()-1;
  while(l<r){
    int s=nums[i]+nums[l]+nums[r];
    if(s==0){res.push_back({nums[i],nums[l++],nums[r--]});}
    else if(s<0) l++;
    else r--;
  }
}`,
    python: `nums.sort()
res = []
for i in range(len(nums)-2):
    if i > 0 and nums[i] == nums[i-1]: continue
    l, r = i+1, len(nums)-1
    while l < r:
        s = nums[i]+nums[l]+nums[r]
        if s == 0: res.append([nums[i],nums[l],nums[r]]); l+=1; r-=1
        elif s < 0: l+=1
        else: r-=1
return res`
  },
  8: {
    tc: "O(n log n)", sc: "O(n)",
    java: `Arrays.sort(intervals,(a,b)->a[0]-b[0]);
List<int[]> res = new ArrayList<>();
int[] curr = intervals[0];
for(int i=1;i<intervals.length;i++){
  if(curr[1]>=intervals[i][0]) curr[1]=Math.max(curr[1],intervals[i][1]);
  else{res.add(curr); curr=intervals[i];}
}
res.add(curr);
return res.toArray(new int[res.size()][]);`,
    cpp: `sort(intervals.begin(),intervals.end());
vector<vector<int>> res;
res.push_back(intervals[0]);
for(auto& iv:intervals){
  if(res.back()[1]>=iv[0]) res.back()[1]=max(res.back()[1],iv[1]);
  else res.push_back(iv);
}
return res;`,
    python: `intervals.sort()
res = [intervals[0]]
for s, e in intervals[1:]:
    if res[-1][1] >= s: res[-1][1] = max(res[-1][1], e)
    else: res.append([s, e])
return res`
  },
  9: {
    tc: "O(n)", sc: "O(1)",
    java: `int l=0, r=height.length-1, max=0;
while(l<r){
  max=Math.max(max,(r-l)*Math.min(height[l],height[r]));
  if(height[l]<height[r]) l++;
  else r--;
}
return max;`,
    cpp: `int l=0,r=height.size()-1,res=0;
while(l<r){
  res=max(res,(r-l)*min(height[l],height[r]));
  if(height[l]<height[r]) l++;
  else r--;
}
return res;`,
    python: `l, r, res = 0, len(height)-1, 0
while l < r:
    res = max(res, (r-l) * min(height[l], height[r]))
    if height[l] < height[r]: l += 1
    else: r -= 1
return res`
  },
  10: {
    tc: "O(n²)", sc: "O(1)",
    java: `for(int i=0;i<n;i++)
  for(int j=i;j<n;j++) swap(i,j,j,i);
for(int i=0;i<n;i++)
  for(int j=0,k=n-1;j<k;j++,k--) swap(i,j,i,k);`,
    cpp: `for(int i=0;i<n;i++)
  for(int j=i;j<n;j++) swap(matrix[i][j],matrix[j][i]);
for(int i=0;i<n;i++)
  reverse(matrix[i].begin(),matrix[i].end());`,
    python: `n = len(matrix)
for i in range(n):
    for j in range(i, n):
        matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
for row in matrix:
    row.reverse()`
  },
  11: {
    tc: "O(n)", sc: "O(n)",
    java: `Stack<Character> st = new Stack<>();
for(char c : s.toCharArray()){
  if(c=='('||c=='{'||c=='[') st.push(c);
  else if(st.isEmpty()||(c==')'&&st.pop()!='(')||(c=='}'&&st.pop()!='{')||(c==']'&&st.pop()!='[')) return false;
}
return st.isEmpty();`,
    cpp: `stack<char> st;
for(char c:s){
  if(c=='('||c=='{'||c=='[') st.push(c);
  else{
    if(st.empty()) return false;
    char t=st.top(); st.pop();
    if((c==')'&&t!='(')||(c=='}'&&t!='{')||(c==']'&&t!='[')) return false;
  }
}
return st.empty();`,
    python: `stack = []
mapping = {')':'(', '}':'{', ']':'['}
for c in s:
    if c in '({[': stack.append(c)
    elif not stack or stack[-1] != mapping[c]: return False
    else: stack.pop()
return not stack`
  },
  12: {
    tc: "O(n)", sc: "O(1)",
    java: `int i=0, j=s.length()-1;
while(i<j){
  while(i<j&&!Character.isLetterOrDigit(s.charAt(i))) i++;
  while(i<j&&!Character.isLetterOrDigit(s.charAt(j))) j--;
  if(Character.toLowerCase(s.charAt(i++))!=Character.toLowerCase(s.charAt(j--))) return false;
}
return true;`,
    cpp: `int i=0,j=s.size()-1;
while(i<j){
  while(i<j&&!isalnum(s[i])) i++;
  while(i<j&&!isalnum(s[j])) j--;
  if(tolower(s[i++])!=tolower(s[j--])) return false;
}
return true;`,
    python: `s = ''.join(c.lower() for c in s if c.isalnum())
return s == s[::-1]`
  },
  13: {
    tc: "O(n)", sc: "O(1)",
    java: `int[] freq=new int[26];
for(char c:s.toCharArray()) freq[c-'a']++;
for(char c:t.toCharArray()) freq[c-'a']--;
for(int f:freq) if(f!=0) return false;
return true;`,
    cpp: `vector<int> freq(26,0);
for(char c:s) freq[c-'a']++;
for(char c:t) freq[c-'a']--;
for(int f:freq) if(f!=0) return false;
return true;`,
    python: `from collections import Counter
return Counter(s) == Counter(t)`
  },
  14: {
    tc: "O(n·k·log k)", sc: "O(n·k)",
    java: `Map<String,List<String>> map=new HashMap<>();
for(String str:strs){
  char[] arr=str.toCharArray();
  Arrays.sort(arr);
  String key=new String(arr);
  map.computeIfAbsent(key,k->new ArrayList<>()).add(str);
}
return new ArrayList<>(map.values());`,
    cpp: `unordered_map<string,vector<string>> mp;
for(auto& s:strs){
  string key=s; sort(key.begin(),key.end());
  mp[key].push_back(s);
}
vector<vector<string>> res;
for(auto& p:mp) res.push_back(p.second);
return res;`,
    python: `from collections import defaultdict
mp = defaultdict(list)
for s in strs:
    mp[tuple(sorted(s))].append(s)
return list(mp.values())`
  },
  15: {
    tc: "O(n²)", sc: "O(1)",
    java: `int start=0,end=0;
for(int i=0;i<s.length();i++){
  int len=Math.max(expand(s,i,i),expand(s,i,i+1));
  if(len>end-start){start=i-(len-1)/2; end=i+len/2;}
}
return s.substring(start,end+1);`,
    cpp: `string res="";
for(int i=0;i<s.size();i++){
  for(int l=i,r=i;l>=0&&r<s.size()&&s[l]==s[r];l--,r++)
    if(r-l+1>res.size()) res=s.substr(l,r-l+1);
  for(int l=i,r=i+1;l>=0&&r<s.size()&&s[l]==s[r];l--,r++)
    if(r-l+1>res.size()) res=s.substr(l,r-l+1);
}
return res;`,
    python: `def expand(l, r):
    while l>=0 and r<len(s) and s[l]==s[r]: l-=1; r+=1
    return s[l+1:r]
res=""
for i in range(len(s)):
    res=max(expand(i,i),expand(i,i+1),res,key=len)
return res`
  },
  16: {
    tc: "O(n)", sc: "O(k)",
    java: `Map<Character,Integer> need=new HashMap<>(),window=new HashMap<>();
for(char c:t.toCharArray()) need.put(c,need.getOrDefault(c,0)+1);
int have=0,need_=need.size(),l=0,minLen=Integer.MAX_VALUE,start=0;
for(int r=0;r<s.length();r++){
  char c=s.charAt(r);
  window.put(c,window.getOrDefault(c,0)+1);
  if(need.containsKey(c)&&window.get(c).equals(need.get(c))) have++;
  while(have==need_){
    if(r-l+1<minLen){minLen=r-l+1;start=l;}
    char d=s.charAt(l++);
    window.put(d,window.get(d)-1);
    if(need.containsKey(d)&&window.get(d)<need.get(d)) have--;
  }
}
return minLen==Integer.MAX_VALUE?"":s.substring(start,start+minLen);`,
    cpp: `unordered_map<char,int> need,window;
for(char c:t) need[c]++;
int have=0,need_=need.size(),l=0,minLen=INT_MAX,start=0;
for(int r=0;r<s.size();r++){
  window[s[r]]++;
  if(need.count(s[r])&&window[s[r]]==need[s[r]]) have++;
  while(have==need_){
    if(r-l+1<minLen){minLen=r-l+1;start=l;}
    if(need.count(s[l])&&--window[s[l]]<need[s[l]]) have--;
    l++;
  }
}
return minLen==INT_MAX?"":s.substr(start,minLen);`,
    python: `from collections import Counter
need=Counter(t); window={}
have=required=len(need); l=0; res=(float('inf'),0,0)
for r,c in enumerate(s):
    window[c]=window.get(c,0)+1
    if c in need and window[c]==need[c]: have-=1
    while have==0:
        if r-l+1<res[0]: res=(r-l+1,l,r)
        window[s[l]]-=1
        if s[l] in need and window[s[l]]<need[s[l]]: have+=1
        l+=1
return "" if res[0]==float('inf') else s[res[1]:res[2]+1]`
  },
  17: {
    tc: "O(n)", sc: "O(1)",
    java: `for(int i=0;i<=haystack.length()-needle.length();i++)
  if(haystack.substring(i,i+needle.length()).equals(needle)) return i;
return -1;`,
    cpp: `for(int i=0;i<=haystack.size()-needle.size();i++)
  if(haystack.substr(i,needle.size())==needle) return i;
return -1;`,
    python: `return haystack.find(needle)`
  },
  18: {
    tc: "O(n)", sc: "O(1)",
    java: `int i=0,idx=0;
while(i<chars.length){
  char c=chars[i]; int count=0;
  while(i<chars.length&&chars[i]==c){i++;count++;}
  chars[idx++]=c;
  if(count>1) for(char ch:String.valueOf(count).toCharArray()) chars[idx++]=ch;
}
return idx;`,
    cpp: `int i=0,idx=0;
while(i<chars.size()){
  char c=chars[i]; int cnt=0;
  while(i<chars.size()&&chars[i]==c){i++;cnt++;}
  chars[idx++]=c;
  if(cnt>1){string s=to_string(cnt); for(char ch:s) chars[idx++]=ch;}
}
return idx;`,
    python: `i=idx=0
while i<len(chars):
    c=chars[i]; cnt=0
    while i<len(chars) and chars[i]==c: i+=1; cnt+=1
    chars[idx]=c; idx+=1
    if cnt>1:
        for ch in str(cnt): chars[idx]=ch; idx+=1
return idx`
  },
  19: {
    tc: "O(n·m)", sc: "O(1)",
    java: `String prefix=strs[0];
for(int i=1;i<strs.length;i++)
  while(!strs[i].startsWith(prefix)){
    prefix=prefix.substring(0,prefix.length()-1);
    if(prefix.isEmpty()) return "";
  }
return prefix;`,
    cpp: `string prefix=strs[0];
for(auto& s:strs)
  while(s.find(prefix)!=0){
    prefix=prefix.substr(0,prefix.size()-1);
    if(prefix.empty()) return "";
  }
return prefix;`,
    python: `prefix=strs[0]
for s in strs[1:]:
    while not s.startswith(prefix):
        prefix=prefix[:-1]
        if not prefix: return ""
return prefix`
  },
  20: {
    tc: "O(n)", sc: "O(n)",
    java: `String str=s+s;
return str.substring(1,str.length()-1).contains(s);`,
    cpp: `string str=s+s;
return str.substr(1,str.size()-2).find(s)!=string::npos;`,
    python: `return s in (s+s)[1:-1]`
  },
  21: {
    tc: "O(n)", sc: "O(1)",
    java: `ListNode prev=null,curr=head;
while(curr!=null){
  ListNode next=curr.next;
  curr.next=prev; prev=curr; curr=next;
}
return prev;`,
    cpp: `ListNode *prev=nullptr,*curr=head;
while(curr){
  ListNode* next=curr->next;
  curr->next=prev; prev=curr; curr=next;
}
return prev;`,
    python: `prev=None; curr=head
while curr:
    nxt=curr.next; curr.next=prev; prev=curr; curr=nxt
return prev`
  },
  22: {
    tc: "O(m+n)", sc: "O(1)",
    java: `ListNode dummy=new ListNode(0),tail=dummy;
while(l1!=null&&l2!=null){
  if(l1.val<l2.val){tail.next=l1;l1=l1.next;}
  else{tail.next=l2;l2=l2.next;}
  tail=tail.next;
}
tail.next=(l1!=null)?l1:l2;
return dummy.next;`,
    cpp: `ListNode dummy(0); ListNode* tail=&dummy;
while(l1&&l2){
  if(l1->val<l2->val){tail->next=l1;l1=l1->next;}
  else{tail->next=l2;l2=l2->next;}
  tail=tail->next;
}
tail->next=l1?l1:l2;
return dummy.next;`,
    python: `dummy=ListNode(0); tail=dummy
while l1 and l2:
    if l1.val<l2.val: tail.next=l1; l1=l1.next
    else: tail.next=l2; l2=l2.next
    tail=tail.next
tail.next=l1 or l2
return dummy.next`
  },
  23: {
    tc: "O(n)", sc: "O(1)",
    java: `ListNode dummy=new ListNode(0);
dummy.next=head;
ListNode fast=dummy,slow=dummy;
for(int i=0;i<=n;i++) fast=fast.next;
while(fast!=null){fast=fast.next;slow=slow.next;}
slow.next=slow.next.next;
return dummy.next;`,
    cpp: `ListNode dummy(0); dummy.next=head;
ListNode *fast=&dummy,*slow=&dummy;
for(int i=0;i<=n;i++) fast=fast->next;
while(fast){fast=fast->next;slow=slow->next;}
slow->next=slow->next->next;
return dummy.next;`,
    python: `dummy=ListNode(0); dummy.next=head
fast=slow=dummy
for _ in range(n+1): fast=fast.next
while fast: fast=fast.next; slow=slow.next
slow.next=slow.next.next
return dummy.next`
  },
  24: {
    tc: "O(n)", sc: "O(1)",
    java: `ListNode slow=head,fast=head;
while(fast!=null&&fast.next!=null){
  slow=slow.next; fast=fast.next.next;
  if(slow==fast) return true;
}
return false;`,
    cpp: `ListNode *slow=head,*fast=head;
while(fast&&fast->next){
  slow=slow->next; fast=fast->next->next;
  if(slow==fast) return true;
}
return false;`,
    python: `slow=fast=head
while fast and fast.next:
    slow=slow.next; fast=fast.next.next
    if slow==fast: return True
return False`
  },
  25: {
    tc: "O(m+n)", sc: "O(m+n)",
    java: `ListNode dummy=new ListNode(0),curr=dummy;
int carry=0;
while(l1!=null||l2!=null||carry!=0){
  int sum=carry;
  if(l1!=null){sum+=l1.val;l1=l1.next;}
  if(l2!=null){sum+=l2.val;l2=l2.next;}
  carry=sum/10;
  curr.next=new ListNode(sum%10);
  curr=curr.next;
}
return dummy.next;`,
    cpp: `ListNode dummy(0); ListNode* curr=&dummy; int carry=0;
while(l1||l2||carry){
  int sum=carry;
  if(l1){sum+=l1->val;l1=l1->next;}
  if(l2){sum+=l2->val;l2=l2->next;}
  carry=sum/10;
  curr->next=new ListNode(sum%10);
  curr=curr->next;
}
return dummy.next;`,
    python: `dummy=ListNode(0); curr=dummy; carry=0
while l1 or l2 or carry:
    s=carry
    if l1: s+=l1.val; l1=l1.next
    if l2: s+=l2.val; l2=l2.next
    carry,val=divmod(s,10)
    curr.next=ListNode(val); curr=curr.next
return dummy.next`
  },
  26: {
    tc: "O(m+n)", sc: "O(1)",
    java: `ListNode a=headA,b=headB;
while(a!=b){
  a=(a==null)?headB:a.next;
  b=(b==null)?headA:b.next;
}
return a;`,
    cpp: `ListNode *a=headA,*b=headB;
while(a!=b){
  a=a?a->next:headB;
  b=b?b->next:headA;
}
return a;`,
    python: `a,b=headA,headB
while a!=b:
    a=a.next if a else headB
    b=b.next if b else headA
return a`
  },
  27: {
    tc: "O(n)", sc: "O(1)",
    java: `ListNode slow=head,fast=head;
while(fast!=null&&fast.next!=null){slow=slow.next;fast=fast.next.next;}
ListNode prev=null,curr=slow;
while(curr!=null){ListNode next=curr.next;curr.next=prev;prev=curr;curr=next;}
ListNode left=head,right=prev;
while(right!=null){if(left.val!=right.val) return false;left=left.next;right=right.next;}
return true;`,
    cpp: `ListNode *slow=head,*fast=head;
while(fast&&fast->next){slow=slow->next;fast=fast->next->next;}
ListNode *prev=nullptr,*curr=slow;
while(curr){ListNode* next=curr->next;curr->next=prev;prev=curr;curr=next;}
while(prev){if(head->val!=prev->val) return false;head=head->next;prev=prev->next;}
return true;`,
    python: `slow=fast=head
while fast and fast.next: slow=slow.next;fast=fast.next.next
prev=None; curr=slow
while curr: nxt=curr.next;curr.next=prev;prev=curr;curr=nxt
l,r=head,prev
while r:
    if l.val!=r.val: return False
    l=l.next;r=r.next
return True`
  },
  28: {
    tc: "O(n)", sc: "O(1)",
    java: `ListNode dummy=new ListNode(0); dummy.next=head;
ListNode pre=dummy,end=dummy;
while(true){
  for(int i=0;i<k&&end!=null;i++) end=end.next;
  if(end==null) break;
  ListNode start=pre.next,next=end.next;
  end.next=null; pre.next=reverse(start); start.next=next;
  pre=start; end=pre;
}
return dummy.next;`,
    cpp: `// Similar approach with reverse helper
ListNode* reverseKGroup(ListNode* head, int k){
  ListNode dummy(0); dummy.next=head;
  ListNode *pre=&dummy,*end=&dummy;
  while(true){
    for(int i=0;i<k&&end;i++) end=end->next;
    if(!end) break;
    ListNode *start=pre->next,*nxt=end->next;
    end->next=nullptr; pre->next=reverse(start); start->next=nxt;
    pre=start; end=pre;
  }
  return dummy.next;
}`,
    python: `dummy=ListNode(0); dummy.next=head
pre=end=dummy
while True:
    for _ in range(k):
        end=end.next
        if not end: return dummy.next
    start=pre.next; nxt=end.next
    end.next=None
    pre.next=reverse(start)
    start.next=nxt; pre=start; end=pre
return dummy.next`
  },
  29: {
    tc: "O(1) amortized", sc: "O(n)",
    java: `Stack<Integer> input=new Stack<>(),output=new Stack<>();
void push(int x){input.push(x);}
int pop(){if(output.isEmpty()) while(!input.isEmpty()) output.push(input.pop()); return output.pop();}
int peek(){if(output.isEmpty()) while(!input.isEmpty()) output.push(input.pop()); return output.peek();}
boolean empty(){return input.isEmpty()&&output.isEmpty();}`,
    cpp: `stack<int> in,out;
void push(int x){in.push(x);}
int pop(){if(out.empty()) while(!in.empty()){out.push(in.top());in.pop();} int t=out.top();out.pop();return t;}
int peek(){if(out.empty()) while(!in.empty()){out.push(in.top());in.pop();} return out.top();}
bool empty(){return in.empty()&&out.empty();}`,
    python: `def __init__(self): self.inp=[]; self.out=[]
def push(self,x): self.inp.append(x)
def pop(self):
    if not self.out:
        while self.inp: self.out.append(self.inp.pop())
    return self.out.pop()
def peek(self):
    if not self.out:
        while self.inp: self.out.append(self.inp.pop())
    return self.out[-1]
def empty(self): return not self.inp and not self.out`
  },
  30: {
    tc: "O(n)", sc: "O(n)",
    java: `Queue<Integer> q=new LinkedList<>();
void push(int x){q.add(x);for(int i=0;i<q.size()-1;i++) q.add(q.remove());}
int pop(){return q.remove();}
int top(){return q.peek();}
boolean empty(){return q.isEmpty();}`,
    cpp: `queue<int> q;
void push(int x){q.push(x);for(int i=0;i<q.size()-1;i++){q.push(q.front());q.pop();}}
int pop(){int t=q.front();q.pop();return t;}
int top(){return q.front();}
bool empty(){return q.empty();}`,
    python: `from collections import deque
def __init__(self): self.q=deque()
def push(self,x):
    self.q.append(x)
    for _ in range(len(self.q)-1): self.q.append(self.q.popleft())
def pop(self): return self.q.popleft()
def top(self): return self.q[0]
def empty(self): return not self.q`
  },
  31: {
    tc: "O(1)", sc: "O(n)",
    java: `Stack<Integer> st=new Stack<>(),minSt=new Stack<>();
void push(int x){st.push(x);if(minSt.isEmpty()||x<=minSt.peek()) minSt.push(x);}
void pop(){if(st.pop().equals(minSt.peek())) minSt.pop();}
int top(){return st.peek();}
int getMin(){return minSt.peek();}`,
    cpp: `stack<int> st,minSt;
void push(int x){st.push(x);if(minSt.empty()||x<=minSt.top()) minSt.push(x);}
void pop(){if(st.top()==minSt.top()) minSt.pop();st.pop();}
int top(){return st.top();}
int getMin(){return minSt.top();}`,
    python: `def __init__(self): self.st=[]; self.minSt=[]
def push(self,x):
    self.st.append(x)
    if not self.minSt or x<=self.minSt[-1]: self.minSt.append(x)
def pop(self):
    if self.st[-1]==self.minSt[-1]: self.minSt.pop()
    return self.st.pop()
def top(self): return self.st[-1]
def getMin(self): return self.minSt[-1]`
  },
  32: {
    tc: "O(n)", sc: "O(n)",
    java: `int[] res=new int[temps.length];
Stack<Integer> st=new Stack<>();
for(int i=0;i<temps.length;i++){
  while(!st.isEmpty()&&temps[i]>temps[st.peek()]){int idx=st.pop();res[idx]=i-idx;}
  st.push(i);
}
return res;`,
    cpp: `vector<int> res(temps.size(),0);
stack<int> st;
for(int i=0;i<temps.size();i++){
  while(!st.empty()&&temps[i]>temps[st.top()]){res[st.top()]=i-st.top();st.pop();}
  st.push(i);
}
return res;`,
    python: `res=[0]*len(temperatures); st=[]
for i,t in enumerate(temperatures):
    while st and temperatures[st[-1]]<t:
        j=st.pop(); res[j]=i-j
    st.append(i)
return res`
  },
  33: {
    tc: "O(n)", sc: "O(n)",
    java: `Stack<Integer> st=new Stack<>();
for(String t:tokens){
  if("+-*/".contains(t)){int b=st.pop(),a=st.pop();
    switch(t){case"+":st.push(a+b);break;case"-":st.push(a-b);break;case"*":st.push(a*b);break;case"/":st.push(a/b);}}
  else st.push(Integer.parseInt(t));
}
return st.pop();`,
    cpp: `stack<int> st;
for(auto& t:tokens){
  if(t=="+"||t=="-"||t=="*"||t=="/"){int b=st.top();st.pop();int a=st.top();st.pop();
    if(t=="+") st.push(a+b); else if(t=="-") st.push(a-b); else if(t=="*") st.push(a*b); else st.push(a/b);}
  else st.push(stoi(t));
}
return st.top();`,
    python: `st=[]
for t in tokens:
    if t in '+-*/':
        b,a=st.pop(),st.pop()
        if t=='+': st.append(a+b)
        elif t=='-': st.append(a-b)
        elif t=='*': st.append(a*b)
        else: st.append(int(a/b))
    else: st.append(int(t))
return st[-1]`
  },
  34: {
    tc: "O(n)", sc: "O(n)",
    java: `Map<Integer,Integer> map=new HashMap<>();
Stack<Integer> st=new Stack<>();
for(int n:nums2){while(!st.isEmpty()&&st.peek()<n) map.put(st.pop(),n);st.push(n);}
for(int i=0;i<nums1.length;i++) nums1[i]=map.getOrDefault(nums1[i],-1);
return nums1;`,
    cpp: `unordered_map<int,int> mp; stack<int> st;
for(int n:nums2){while(!st.empty()&&st.top()<n){mp[st.top()]=n;st.pop();}st.push(n);}
for(int i=0;i<nums1.size();i++) nums1[i]=mp.count(nums1[i])?mp[nums1[i]]:-1;
return nums1;`,
    python: `mp={}; st=[]
for n in nums2:
    while st and st[-1]<n: mp[st.pop()]=n
    st.append(n)
return [mp.get(n,-1) for n in nums1]`
  },
  35: {
    tc: "O(n)", sc: "O(n)",
    java: `int n=nums.length;
int[] res=new int[n];
Arrays.fill(res,-1);
Stack<Integer> st=new Stack<>();
for(int i=0;i<2*n;i++){
  int num=nums[i%n];
  while(!st.isEmpty()&&nums[st.peek()]<num) res[st.pop()]=num;
  if(i<n) st.push(i);
}
return res;`,
    cpp: `int n=nums.size();
vector<int> res(n,-1); stack<int> st;
for(int i=0;i<2*n;i++){
  while(!st.empty()&&nums[st.top()]<nums[i%n]){res[st.top()]=nums[i%n];st.pop();}
  if(i<n) st.push(i);
}
return res;`,
    python: `n=len(nums); res=[-1]*n; st=[]
for i in range(2*n):
    while st and nums[st[-1]]<nums[i%n]: res[st.pop()]=nums[i%n]
    if i<n: st.append(i)
return res`
  },
  36: {
    tc: "O(1)", sc: "O(k)",
    java: `int[] q; int front=0,rear=-1,size=0,cap;
MyCircularQueue(int k){q=new int[k];cap=k;}
boolean enQueue(int val){if(isFull()) return false;rear=(rear+1)%cap;q[rear]=val;size++;return true;}
boolean deQueue(){if(isEmpty()) return false;front=(front+1)%cap;size--;return true;}
int Front(){return isEmpty()?-1:q[front];}
int Rear(){return isEmpty()?-1:q[rear];}
boolean isEmpty(){return size==0;}
boolean isFull(){return size==cap;}`,
    cpp: `vector<int> q; int front=0,rear=-1,sz=0,cap;
MyCircularQueue(int k):q(k),cap(k){}
bool enQueue(int v){if(isFull())return false;rear=(rear+1)%cap;q[rear]=v;sz++;return true;}
bool deQueue(){if(isEmpty())return false;front=(front+1)%cap;sz--;return true;}
int Front(){return isEmpty()?-1:q[front];}
int Rear(){return isEmpty()?-1:q[rear];}
bool isEmpty(){return sz==0;}
bool isFull(){return sz==cap;}`,
    python: `def __init__(self,k): self.q=[0]*k;self.front=0;self.rear=-1;self.sz=0;self.cap=k
def enQueue(self,v):
    if self.isFull(): return False
    self.rear=(self.rear+1)%self.cap; self.q[self.rear]=v; self.sz+=1; return True
def deQueue(self):
    if self.isEmpty(): return False
    self.front=(self.front+1)%self.cap; self.sz-=1; return True
def Front(self): return -1 if self.isEmpty() else self.q[self.front]
def Rear(self): return -1 if self.isEmpty() else self.q[self.rear]
def isEmpty(self): return self.sz==0
def isFull(self): return self.sz==self.cap`
  },
  37: {
    tc: "O(log n)", sc: "O(1)",
    java: `int l=0,r=nums.length-1;
while(l<=r){int mid=l+(r-l)/2;if(nums[mid]==target) return mid;else if(nums[mid]<target) l=mid+1;else r=mid-1;}
return -1;`,
    cpp: `int l=0,r=nums.size()-1;
while(l<=r){int m=l+(r-l)/2;if(nums[m]==target) return m;else if(nums[m]<target) l=m+1;else r=m-1;}
return -1;`,
    python: `l,r=0,len(nums)-1
while l<=r:
    m=(l+r)//2
    if nums[m]==target: return m
    elif nums[m]<target: l=m+1
    else: r=m-1
return -1`
  },
  38: {
    tc: "O(log n)", sc: "O(1)",
    java: `int[] searchRange(int[] nums,int target){return new int[]{first(nums,target),last(nums,target)};}
int first(int[] a,int t){int l=0,r=a.length-1,ans=-1;while(l<=r){int m=l+(r-l)/2;if(a[m]>=t) r=m-1;else l=m+1;if(a[m]==t) ans=m;}return ans;}
int last(int[] a,int t){int l=0,r=a.length-1,ans=-1;while(l<=r){int m=l+(r-l)/2;if(a[m]<=t) l=m+1;else r=m-1;if(a[m]==t) ans=m;}return ans;}`,
    cpp: `int first(vector<int>&a,int t){int l=0,r=a.size()-1,ans=-1;while(l<=r){int m=l+(r-l)/2;if(a[m]==t)ans=m;if(a[m]<t)l=m+1;else r=m-1;}return ans;}
int last(vector<int>&a,int t){int l=0,r=a.size()-1,ans=-1;while(l<=r){int m=l+(r-l)/2;if(a[m]==t)ans=m;if(a[m]<=t)l=m+1;else r=m-1;}return ans;}
vector<int> searchRange(vector<int>&nums,int t){return{first(nums,t),last(nums,t)};}`,
    python: `def first(t):
    l,r,ans=0,len(nums)-1,-1
    while l<=r:
        m=(l+r)//2
        if nums[m]==t: ans=m
        if nums[m]<t: l=m+1
        else: r=m-1
    return ans
return [first(target), -first(-target) if first(target)!=-1 else -1]`
  },
  39: {
    tc: "O(m×n)", sc: "O(1)",
    java: `boolean searchMatrix(int[][] mat,int target){int m=mat.length,n=mat[0].length,l=0,r=m*n-1;while(l<=r){int mid=l+(r-l)/2,val=mat[mid/n][mid%n];if(val==target) return true;else if(val<target) l=mid+1;else r=mid-1;}return false;}`,
    cpp: `bool searchMatrix(vector<vector<int>>&mat,int target){int m=mat.size(),n=mat[0].size(),l=0,r=m*n-1;while(l<=r){int mid=l+(r-l)/2,val=mat[mid/n][mid%n];if(val==target) return true;else if(val<target) l=mid+1;else r=mid-1;}return false;}`,
    python: `m,n=len(matrix),len(matrix[0]); l,r=0,m*n-1
while l<=r:
    mid=(l+r)//2; val=matrix[mid//n][mid%n]
    if val==target: return True
    elif val<target: l=mid+1
    else: r=mid-1
return False`
  },
  40: {
    tc: "O(log n)", sc: "O(1)",
    java: `int l=0,r=nums.length-1;while(l<=r){int m=l+(r-l)/2;if(nums[m]==target) return m;if(nums[l]<=nums[m]){if(target>=nums[l]&&target<nums[m]) r=m-1;else l=m+1;}else{if(target>nums[m]&&target<=nums[r]) l=m+1;else r=m-1;}}return -1;`,
    cpp: `int l=0,r=nums.size()-1;while(l<=r){int m=l+(r-l)/2;if(nums[m]==target) return m;if(nums[l]<=nums[m]){if(target>=nums[l]&&target<nums[m]) r=m-1;else l=m+1;}else{if(target>nums[m]&&target<=nums[r]) l=m+1;else r=m-1;}}return -1;`,
    python: `l,r=0,len(nums)-1
while l<=r:
    m=(l+r)//2
    if nums[m]==target: return m
    if nums[l]<=nums[m]:
        if nums[l]<=target<nums[m]: r=m-1
        else: l=m+1
    else:
        if nums[m]<target<=nums[r]: l=m+1
        else: r=m-1
return -1`
  },
  41: {
    tc: "O(log n)", sc: "O(1)",
    java: `boolean search(int[] nums,int target){int l=0,r=nums.length-1;while(l<=r){int m=l+(r-l)/2;if(nums[m]==target) return true;if(nums[l]==nums[m]&&nums[m]==nums[r]){l++;r--;}else if(nums[l]<=nums[m]){if(target>=nums[l]&&target<nums[m]) r=m-1;else l=m+1;}else{if(target>nums[m]&&target<=nums[r]) l=m+1;else r=m-1;}}return false;}`,
    cpp: `bool search(vector<int>&nums,int target){int l=0,r=nums.size()-1;while(l<=r){int m=l+(r-l)/2;if(nums[m]==target) return true;if(nums[l]==nums[m]&&nums[m]==nums[r]){l++;r--;}else if(nums[l]<=nums[m]){if(target>=nums[l]&&target<nums[m]) r=m-1;else l=m+1;}else{if(target>nums[m]&&target<=nums[r]) l=m+1;else r=m-1;}}return false;}`,
    python: `l,r=0,len(nums)-1
while l<=r:
    m=(l+r)//2
    if nums[m]==target: return True
    if nums[l]==nums[m]==nums[r]: l+=1;r-=1
    elif nums[l]<=nums[m]:
        if nums[l]<=target<nums[m]: r=m-1
        else: l=m+1
    else:
        if nums[m]<target<=nums[r]: l=m+1
        else: r=m-1
return False`
  },
  42: {
    tc: "O(log n)", sc: "O(1)",
    java: `int l=0,r=nums.length-1;while(l<r){int m=l+(r-l)/2;if(nums[m]>nums[m+1]) r=m;else l=m+1;}return l;`,
    cpp: `int l=0,r=nums.size()-1;while(l<r){int m=l+(r-l)/2;if(nums[m]>nums[m+1]) r=m;else l=m+1;}return l;`,
    python: `l,r=0,len(nums)-1
while l<r:
    m=(l+r)//2
    if nums[m]>nums[m+1]: r=m
    else: l=m+1
return l`
  },
  43: {
    tc: "O(n)", sc: "O(h)",
    java: `int maxDepth(TreeNode root){return root==null?0:1+Math.max(maxDepth(root.left),maxDepth(root.right));}`,
    cpp: `int maxDepth(TreeNode* root){return root==nullptr?0:1+max(maxDepth(root->left),maxDepth(root->right));}`,
    python: `def maxDepth(root):
    return 0 if not root else 1+max(maxDepth(root.left),maxDepth(root.right))`
  },
  44: {
    tc: "O(n)", sc: "O(h)",
    java: `boolean isSameTree(TreeNode p,TreeNode q){if(p==null&&q==null) return true;if(p==null||q==null||p.val!=q.val) return false;return isSameTree(p.left,q.left)&&isSameTree(p.right,q.right);}`,
    cpp: `bool isSameTree(TreeNode* p,TreeNode* q){if(!p&&!q) return true;if(!p||!q||p->val!=q->val) return false;return isSameTree(p->left,q->left)&&isSameTree(p->right,q->right);}`,
    python: `def isSameTree(p,q):
    if not p and not q: return True
    if not p or not q or p.val!=q.val: return False
    return isSameTree(p.left,q.left) and isSameTree(p.right,q.right)`
  },
  45: {
    tc: "O(n)", sc: "O(h)",
    java: `boolean isSymmetric(TreeNode root){return root==null||isMirror(root.left,root.right);}
boolean isMirror(TreeNode a,TreeNode b){if(a==null&&b==null) return true;if(a==null||b==null||a.val!=b.val) return false;return isMirror(a.left,b.right)&&isMirror(a.right,b.left);}`,
    cpp: `bool isMirror(TreeNode* a,TreeNode* b){if(!a&&!b) return true;if(!a||!b||a->val!=b->val) return false;return isMirror(a->left,b->right)&&isMirror(a->right,b->left);}
bool isSymmetric(TreeNode* root){return !root||isMirror(root->left,root->right);}`,
    python: `def isMirror(a,b):
    if not a and not b: return True
    if not a or not b or a.val!=b.val: return False
    return isMirror(a.left,b.right) and isMirror(a.right,b.left)
return not root or isMirror(root.left,root.right)`
  },
  46: {
    tc: "O(n)", sc: "O(n)",
    java: `void preorder(TreeNode root,List<Integer> res){if(root==null) return;res.add(root.val);preorder(root.left,res);preorder(root.right,res);}`,
    cpp: `void preorder(TreeNode* root,vector<int>& res){if(!root) return;res.push_back(root->val);preorder(root->left,res);preorder(root->right,res);}`,
    python: `def preorder(root,res=[]):
    if not root: return
    res.append(root.val); preorder(root.left,res); preorder(root.right,res)
    return res`
  },
  47: {
    tc: "O(n)", sc: "O(n)",
    java: `void inorder(TreeNode root,List<Integer> res){if(root==null) return;inorder(root.left,res);res.add(root.val);inorder(root.right,res);}`,
    cpp: `void inorder(TreeNode* root,vector<int>& res){if(!root) return;inorder(root->left,res);res.push_back(root->val);inorder(root->right,res);}`,
    python: `def inorder(root,res=[]):
    if not root: return
    inorder(root.left,res); res.append(root.val); inorder(root.right,res)
    return res`
  },
  48: {
    tc: "O(n)", sc: "O(n)",
    java: `void postorder(TreeNode root,List<Integer> res){if(root==null) return;postorder(root.left,res);postorder(root.right,res);res.add(root.val);}`,
    cpp: `void postorder(TreeNode* root,vector<int>& res){if(!root) return;postorder(root->left,res);postorder(root->right,res);res.push_back(root->val);}`,
    python: `def postorder(root,res=[]):
    if not root: return
    postorder(root.left,res); postorder(root.right,res); res.append(root.val)
    return res`
  },
  49: {
    tc: "O(n)", sc: "O(n)",
    java: `List<List<Integer>> levelOrder(TreeNode root){List<List<Integer>> res=new ArrayList<>();if(root==null) return res;Queue<TreeNode> q=new LinkedList<>();q.add(root);while(!q.isEmpty()){int size=q.size();List<Integer> level=new ArrayList<>();for(int i=0;i<size;i++){TreeNode node=q.poll();level.add(node.val);if(node.left!=null) q.add(node.left);if(node.right!=null) q.add(node.right);}res.add(level);}return res;}`,
    cpp: `vector<vector<int>> levelOrder(TreeNode* root){vector<vector<int>> res;if(!root) return res;queue<TreeNode*> q;q.push(root);while(!q.empty()){int sz=q.size();vector<int> level;for(int i=0;i<sz;i++){TreeNode* node=q.front();q.pop();level.push_back(node->val);if(node->left) q.push(node->left);if(node->right) q.push(node->right);}res.push_back(level);}return res;}`,
    python: `from collections import deque
if not root: return []
res=[]; q=deque([root])
while q:
    level=[]
    for _ in range(len(q)):
        node=q.popleft(); level.append(node.val)
        if node.left: q.append(node.left)
        if node.right: q.append(node.right)
    res.append(level)
return res`
  },
  50: {
    tc: "O(n)", sc: "O(h)",
    java: `boolean isBalanced(TreeNode root){return height(root)!=-1;}
int height(TreeNode node){if(node==null) return 0;int l=height(node.left),r=height(node.right);if(l==-1||r==-1||Math.abs(l-r)>1) return -1;return 1+Math.max(l,r);}`,
    cpp: `int height(TreeNode* node){if(!node) return 0;int l=height(node->left),r=height(node->right);if(l==-1||r==-1||abs(l-r)>1) return -1;return 1+max(l,r);}
bool isBalanced(TreeNode* root){return height(root)!=-1;}`,
    python: `def height(node):
    if not node: return 0
    l,r=height(node.left),height(node.right)
    if l==-1 or r==-1 or abs(l-r)>1: return -1
    return 1+max(l,r)
return height(root)!=-1`
  },
  51: {
    tc: "O(2^n)", sc: "O(n)",
    java: `void backtrack(int[] nums,int target,int start,List<Integer> curr,List<List<Integer>> res){if(target==0){res.add(new ArrayList<>(curr));return;}if(target<0) return;for(int i=start;i<nums.length;i++){curr.add(nums[i]);backtrack(nums,target-nums[i],i,curr,res);curr.remove(curr.size()-1);}}`,
    cpp: `void bt(vector<int>&nums,int target,int start,vector<int>&curr,vector<vector<int>>&res){if(target==0){res.push_back(curr);return;}for(int i=start;i<nums.size()&&nums[i]<=target;i++){curr.push_back(nums[i]);bt(nums,target-nums[i],i,curr,res);curr.pop_back();}}`,
    python: `def bt(start,curr,target):
    if target==0: res.append(curr[:]); return
    for i in range(start,len(candidates)):
        if candidates[i]>target: break
        curr.append(candidates[i]); bt(i,curr,target-candidates[i]); curr.pop()
candidates.sort(); res=[]; bt(0,[],target); return res`
  },
  52: {
    tc: "O(n!)", sc: "O(n)",
    java: `void backtrack(int[] nums,List<Integer> curr,boolean[] used,List<List<Integer>> res){if(curr.size()==nums.length){res.add(new ArrayList<>(curr));return;}for(int i=0;i<nums.length;i++){if(used[i]) continue;used[i]=true;curr.add(nums[i]);backtrack(nums,curr,used,res);curr.remove(curr.size()-1);used[i]=false;}}`,
    cpp: `void bt(vector<int>&nums,vector<int>&curr,vector<bool>&used,vector<vector<int>>&res){if(curr.size()==nums.size()){res.push_back(curr);return;}for(int i=0;i<nums.size();i++){if(used[i]) continue;used[i]=true;curr.push_back(nums[i]);bt(nums,curr,used,res);curr.pop_back();used[i]=false;}}`,
    python: `def bt(curr,used):
    if len(curr)==len(nums): res.append(curr[:]); return
    for i in range(len(nums)):
        if used[i]: continue
        used[i]=True; curr.append(nums[i]); bt(curr,used); curr.pop(); used[i]=False
res=[]; bt([],[False]*len(nums)); return res`
  },
  53: {
    tc: "O(2^n)", sc: "O(n)",
    java: `void backtrack(int[] nums,int start,List<Integer> curr,List<List<Integer>> res){res.add(new ArrayList<>(curr));for(int i=start;i<nums.length;i++){curr.add(nums[i]);backtrack(nums,i+1,curr,res);curr.remove(curr.size()-1);}}`,
    cpp: `void bt(vector<int>&nums,int start,vector<int>&curr,vector<vector<int>>&res){res.push_back(curr);for(int i=start;i<nums.size();i++){curr.push_back(nums[i]);bt(nums,i+1,curr,res);curr.pop_back();}}`,
    python: `def bt(start,curr):
    res.append(curr[:])
    for i in range(start,len(nums)):
        curr.append(nums[i]); bt(i+1,curr); curr.pop()
res=[]; bt(0,[]); return res`
  },
  54: {
    tc: "O(n!)", sc: "O(n²)",
    java: `void solve(int n,int row,char[][] board,List<List<String>> res,boolean[] col,boolean[] d1,boolean[] d2){if(row==n){List<String> sol=new ArrayList<>();for(char[] r:board) sol.add(new String(r));res.add(sol);return;}for(int c=0;c<n;c++){if(col[c]||d1[row-c+n]||d2[row+c]) continue;board[row][c]='Q';col[c]=d1[row-c+n]=d2[row+c]=true;solve(n,row+1,board,res,col,d1,d2);board[row][c]='.';col[c]=d1[row-c+n]=d2[row+c]=false;}}`,
    cpp: `void solve(int n,int row,vector<string>&board,vector<vector<string>>&res,vector<bool>&col,vector<bool>&d1,vector<bool>&d2){if(row==n){res.push_back(board);return;}for(int c=0;c<n;c++){if(col[c]||d1[row-c+n]||d2[row+c]) continue;board[row][c]='Q';col[c]=d1[row-c+n]=d2[row+c]=true;solve(n,row+1,board,res,col,d1,d2);board[row][c]='.';col[c]=d1[row-c+n]=d2[row+c]=false;}}`,
    python: `def bt(row,cols,d1,d2):
    if row==n: res.append(["."*i+"Q"+"."*(n-i-1) for i in queens]); return
    for c in range(n):
        if c in cols or row-c in d1 or row+c in d2: continue
        queens.append(c);cols.add(c);d1.add(row-c);d2.add(row+c)
        bt(row+1,cols,d1,d2)
        queens.pop();cols.remove(c);d1.remove(row-c);d2.remove(row+c)
res=[];queens=[];bt(0,set(),set(),set());return res`
  },
  55: {
    tc: "O(4^n)", sc: "O(n)",
    java: `void backtrack(String digits,int idx,StringBuilder curr,List<String> res,String[] map){if(idx==digits.length()){res.add(curr.toString());return;}for(char c:map[digits.charAt(idx)-'0'].toCharArray()){curr.append(c);backtrack(digits,idx+1,curr,res,map);curr.deleteCharAt(curr.length()-1);}}`,
    cpp: `vector<string> phone={"","","abc","def","ghi","jkl","mno","pqrs","tuv","wxyz"};
void bt(string&digits,int i,string&curr,vector<string>&res){if(i==digits.size()){res.push_back(curr);return;}for(char c:phone[digits[i]-'0']){curr+=c;bt(digits,i+1,curr,res);curr.pop_back();}}`,
    python: `phone={"2":"abc","3":"def","4":"ghi","5":"jkl","6":"mno","7":"pqrs","8":"tuv","9":"wxyz"}
def bt(i,curr):
    if i==len(digits): res.append(curr); return
    for c in phone[digits[i]]: bt(i+1,curr+c)
res=[]; bt(0,""); return res`
  },
  56: {
    tc: "O(2^n)", sc: "O(n)",
    java: `void backtrack(int[] nums,int start,List<Integer> curr,List<List<Integer>> res){res.add(new ArrayList<>(curr));for(int i=start;i<nums.length;i++){if(i>start&&nums[i]==nums[i-1]) continue;curr.add(nums[i]);backtrack(nums,i+1,curr,res);curr.remove(curr.size()-1);}}`,
    cpp: `void bt(vector<int>&nums,int start,vector<int>&curr,vector<vector<int>>&res){res.push_back(curr);for(int i=start;i<nums.size();i++){if(i>start&&nums[i]==nums[i-1]) continue;curr.push_back(nums[i]);bt(nums,i+1,curr,res);curr.pop_back();}}`,
    python: `def bt(start,curr):
    res.append(curr[:])
    for i in range(start,len(nums)):
        if i>start and nums[i]==nums[i-1]: continue
        curr.append(nums[i]); bt(i+1,curr); curr.pop()
nums.sort(); res=[]; bt(0,[]); return res`
  },
  57: {
    tc: "O(9^m)", sc: "O(1)",
    java: `boolean solve(char[][] board){for(int r=0;r<9;r++)for(int c=0;c<9;c++)if(board[r][c]=='.'){for(char ch='1';ch<='9';ch++)if(isValid(board,r,c,ch)){board[r][c]=ch;if(solve(board)) return true;board[r][c]='.';}return false;}return true;}
boolean isValid(char[][] b,int r,int c,char ch){for(int i=0;i<9;i++) if(b[r][i]==ch||b[i][c]==ch||b[3*(r/3)+i/3][3*(c/3)+i%3]==ch) return false;return true;}`,
    cpp: `bool isValid(vector<vector<char>>&b,int r,int c,char ch){for(int i=0;i<9;i++) if(b[r][i]==ch||b[i][c]==ch||b[3*(r/3)+i/3][3*(c/3)+i%3]==ch) return false;return true;}
bool solve(vector<vector<char>>&board){for(int r=0;r<9;r++)for(int c=0;c<9;c++)if(board[r][c]=='.'){for(char ch='1';ch<='9';ch++)if(isValid(board,r,c,ch)){board[r][c]=ch;if(solve(board)) return true;board[r][c]='.';}return false;}return true;}`,
    python: `def isValid(r,c,ch):
    for i in range(9):
        if board[r][i]==ch or board[i][c]==ch or board[3*(r//3)+i//3][3*(c//3)+i%3]==ch: return False
    return True
def solve():
    for r in range(9):
        for c in range(9):
            if board[r][c]=='.':
                for ch in '123456789':
                    if isValid(r,c,ch): board[r][c]=ch
                    if solve(): return True
                    board[r][c]='.'
                return False
    return True
solve()`
  },
  58: {
    tc: "O(n)", sc: "O(1)",
    java: `int climbStairs(int n){if(n<=2) return n;int a=1,b=2;for(int i=3;i<=n;i++){int c=a+b;a=b;b=c;}return b;}`,
    cpp: `int climbStairs(int n){if(n<=2) return n;int a=1,b=2;for(int i=3;i<=n;i++){int c=a+b;a=b;b=c;}return b;}`,
    python: `a,b=1,2
for _ in range(n-2): a,b=b,a+b
return b if n>=2 else n`
  },
  59: {
    tc: "O(n)", sc: "O(1)",
    java: `int rob(int[] nums){int prev=0,curr=0;for(int n:nums){int temp=Math.max(curr,prev+n);prev=curr;curr=temp;}return curr;}`,
    cpp: `int rob(vector<int>&nums){int prev=0,curr=0;for(int n:nums){int t=max(curr,prev+n);prev=curr;curr=t;}return curr;}`,
    python: `prev=curr=0
for n in nums: prev,curr=curr,max(curr,prev+n)
return curr`
  },
  60: {
    tc: "O(n×amount)", sc: "O(amount)",
    java: `int coinChange(int[] coins,int amount){int[] dp=new int[amount+1];Arrays.fill(dp,amount+1);dp[0]=0;for(int c:coins) for(int i=c;i<=amount;i++) dp[i]=Math.min(dp[i],dp[i-c]+1);return dp[amount]>amount?-1:dp[amount];}`,
    cpp: `int coinChange(vector<int>&coins,int amount){vector<int> dp(amount+1,amount+1);dp[0]=0;for(int c:coins) for(int i=c;i<=amount;i++) dp[i]=min(dp[i],dp[i-c]+1);return dp[amount]>amount?-1:dp[amount];}`,
    python: `dp=[float('inf')]*(amount+1); dp[0]=0
for c in coins:
    for i in range(c,amount+1): dp[i]=min(dp[i],dp[i-c]+1)
return dp[amount] if dp[amount]!=float('inf') else -1`
  },
  61: {
    tc: "O(n²)", sc: "O(n)",
    java: `int lengthOfLIS(int[] nums){int[] dp=new int[nums.length];Arrays.fill(dp,1);int res=1;for(int i=1;i<nums.length;i++){for(int j=0;j<i;j++) if(nums[i]>nums[j]) dp[i]=Math.max(dp[i],dp[j]+1);for(int x:dp) res=Math.max(res,x);}return res;}`,
    cpp: `int lengthOfLIS(vector<int>&nums){int n=nums.size();vector<int> dp(n,1);int res=1;for(int i=1;i<n;i++){for(int j=0;j<i;j++) if(nums[i]>nums[j]) dp[i]=max(dp[i],dp[j]+1);res=max(res,dp[i]);}return res;}`,
    python: `dp=[1]*len(nums)
for i in range(1,len(nums)):
    for j in range(i):
        if nums[i]>nums[j]: dp[i]=max(dp[i],dp[j]+1)
return max(dp)`
  },
  62: {
    tc: "O(m×n)", sc: "O(m×n)",
    java: `int longestCommonSubsequence(String a,String b){int m=a.length(),n=b.length();int[][] dp=new int[m+1][n+1];for(int i=1;i<=m;i++) for(int j=1;j<=n;j++) dp[i][j]=a.charAt(i-1)==b.charAt(j-1)?dp[i-1][j-1]+1:Math.max(dp[i-1][j],dp[i][j-1]);return dp[m][n];}`,
    cpp: `int longestCommonSubsequence(string a,string b){int m=a.size(),n=b.size();vector<vector<int>> dp(m+1,vector<int>(n+1,0));for(int i=1;i<=m;i++) for(int j=1;j<=n;j++) dp[i][j]=a[i-1]==b[j-1]?dp[i-1][j-1]+1:max(dp[i-1][j],dp[i][j-1]);return dp[m][n];}`,
    python: `m,n=len(text1),len(text2)
dp=[[0]*(n+1) for _ in range(m+1)]
for i in range(1,m+1):
    for j in range(1,n+1):
        dp[i][j]=dp[i-1][j-1]+1 if text1[i-1]==text2[j-1] else max(dp[i-1][j],dp[i][j-1])
return dp[m][n]`
  },
  63: {
    tc: "O(m×n)", sc: "O(m×n)",
    java: `int uniquePaths(int m,int n){int[][] dp=new int[m][n];for(int i=0;i<m;i++) dp[i][0]=1;for(int j=0;j<n;j++) dp[0][j]=1;for(int i=1;i<m;i++) for(int j=1;j<n;j++) dp[i][j]=dp[i-1][j]+dp[i][j-1];return dp[m-1][n-1];}`,
    cpp: `int uniquePaths(int m,int n){vector<vector<int>> dp(m,vector<int>(n,1));for(int i=1;i<m;i++) for(int j=1;j<n;j++) dp[i][j]=dp[i-1][j]+dp[i][j-1];return dp[m-1][n-1];}`,
    python: `dp=[[1]*n for _ in range(m)]
for i in range(1,m):
    for j in range(1,n): dp[i][j]=dp[i-1][j]+dp[i][j-1]
return dp[m-1][n-1]`
  },
  64: {
    tc: "O(n²)", sc: "O(1)",
    java: `String longestPalindrome(String s){int start=0,end=0;for(int i=0;i<s.length();i++){int len=Math.max(expand(s,i,i),expand(s,i,i+1));if(len>end-start){start=i-(len-1)/2;end=i+len/2;}}return s.substring(start,end+1);}`,
    cpp: `string longestPalindrome(string s){string res="";for(int i=0;i<s.size();i++){for(int l=i,r=i;l>=0&&r<s.size()&&s[l]==s[r];l--,r++) if(r-l+1>res.size()) res=s.substr(l,r-l+1);for(int l=i,r=i+1;l>=0&&r<s.size()&&s[l]==s[r];l--,r++) if(r-l+1>res.size()) res=s.substr(l,r-l+1);}return res;}`,
    python: `def expand(l,r):
    while l>=0 and r<len(s) and s[l]==s[r]: l-=1;r+=1
    return s[l+1:r]
res=""
for i in range(len(s)): res=max(expand(i,i),expand(i,i+1),res,key=len)
return res`
  },
  65: {
    tc: "O(m×n)", sc: "O(m×n)",
    java: `int findLength(int[] A,int[] B){int m=A.length,n=B.length,res=0;int[][] dp=new int[m+1][n+1];for(int i=1;i<=m;i++) for(int j=1;j<=n;j++) if(A[i-1]==B[j-1]){dp[i][j]=dp[i-1][j-1]+1;res=Math.max(res,dp[i][j]);}return res;}`,
    cpp: `int findLength(vector<int>&A,vector<int>&B){int m=A.size(),n=B.size(),res=0;vector<vector<int>> dp(m+1,vector<int>(n+1,0));for(int i=1;i<=m;i++) for(int j=1;j<=n;j++) if(A[i-1]==B[j-1]){dp[i][j]=dp[i-1][j-1]+1;res=max(res,dp[i][j]);}return res;}`,
    python: `m,n=len(nums1),len(nums2); res=0
dp=[[0]*(n+1) for _ in range(m+1)]
for i in range(1,m+1):
    for j in range(1,n+1):
        if nums1[i-1]==nums2[j-1]: dp[i][j]=dp[i-1][j-1]+1; res=max(res,dp[i][j])
return res`
  },
  66: {
    tc: "O(n×sum)", sc: "O(sum)",
    java: `boolean canPartition(int[] nums){int sum=0;for(int n:nums) sum+=n;if(sum%2!=0) return false;int target=sum/2;boolean[] dp=new boolean[target+1];dp[0]=true;for(int n:nums) for(int j=target;j>=n;j--) dp[j]=dp[j]||dp[j-n];return dp[target];}`,
    cpp: `bool canPartition(vector<int>&nums){int sum=0;for(int n:nums) sum+=n;if(sum%2) return false;int t=sum/2;vector<bool> dp(t+1,false);dp[0]=true;for(int n:nums) for(int j=t;j>=n;j--) dp[j]=dp[j]||dp[j-n];return dp[t];}`,
    python: `total=sum(nums)
if total%2: return False
target=total//2; dp=[False]*(target+1); dp[0]=True
for n in nums:
    for j in range(target,n-1,-1): dp[j]=dp[j] or dp[j-n]
return dp[target]`
  },
  67: {
    tc: "O(n)", sc: "O(1)",
    java: `int maxSubArray(int[] nums){int curr=nums[0],max=nums[0];for(int i=1;i<nums.length;i++){curr=Math.max(nums[i],curr+nums[i]);max=Math.max(max,curr);}return max;}`,
    cpp: `int maxSubArray(vector<int>&nums){int curr=nums[0],res=nums[0];for(int i=1;i<nums.size();i++){curr=max(nums[i],curr+nums[i]);res=max(res,curr);}return res;}`,
    python: `curr=res=nums[0]
for n in nums[1:]: curr=max(n,curr+n);res=max(res,curr)
return res`
  },
  68: {
    tc: "O(n)", sc: "O(n)",
    java: `Node cloneGraph(Node node){if(node==null) return null;Map<Node,Node> map=new HashMap<>();return dfs(node,map);}
Node dfs(Node node,Map<Node,Node> map){if(map.containsKey(node)) return map.get(node);Node copy=new Node(node.val);map.put(node,copy);for(Node nei:node.neighbors) copy.neighbors.add(dfs(nei,map));return copy;}`,
    cpp: `unordered_map<Node*,Node*> mp;
Node* cloneGraph(Node* node){if(!node) return nullptr;if(mp.count(node)) return mp[node];Node* copy=new Node(node->val);mp[node]=copy;for(auto nei:node->neighbors) copy->neighbors.push_back(cloneGraph(nei));return copy;}`,
    python: `if not node: return None
mp={}
def dfs(n):
    if n in mp: return mp[n]
    copy=Node(n.val); mp[n]=copy
    for nei in n.neighbors: copy.neighbors.append(dfs(nei))
    return copy
return dfs(node)`
  },
  69: {
    tc: "O(m×n)", sc: "O(m×n)",
    java: `int numIslands(char[][] grid){int count=0;for(int i=0;i<grid.length;i++) for(int j=0;j<grid[0].length;j++) if(grid[i][j]=='1'){dfs(grid,i,j);count++;}return count;}
void dfs(char[][] g,int i,int j){if(i<0||j<0||i>=g.length||j>=g[0].length||g[i][j]=='0') return;g[i][j]='0';dfs(g,i+1,j);dfs(g,i-1,j);dfs(g,i,j+1);dfs(g,i,j-1);}`,
    cpp: `void dfs(vector<vector<char>>&g,int i,int j){if(i<0||j<0||i>=g.size()||j>=g[0].size()||g[i][j]=='0') return;g[i][j]='0';dfs(g,i+1,j);dfs(g,i-1,j);dfs(g,i,j+1);dfs(g,i,j-1);}
int numIslands(vector<vector<char>>&grid){int cnt=0;for(int i=0;i<grid.size();i++) for(int j=0;j<grid[0].size();j++) if(grid[i][j]=='1'){dfs(grid,i,j);cnt++;}return cnt;}`,
    python: `def dfs(i,j):
    if i<0 or j<0 or i>=len(grid) or j>=len(grid[0]) or grid[i][j]=='0': return
    grid[i][j]='0'; dfs(i+1,j);dfs(i-1,j);dfs(i,j+1);dfs(i,j-1)
cnt=0
for i in range(len(grid)):
    for j in range(len(grid[0])):
        if grid[i][j]=='1': dfs(i,j);cnt+=1
return cnt`
  },
  70: {
    tc: "O(V+E)", sc: "O(V+E)",
    java: `boolean canFinish(int num,int[][] pre){List<List<Integer>> g=new ArrayList<>();int[] indeg=new int[num];for(int i=0;i<num;i++) g.add(new ArrayList<>());for(int[] p:pre){g.get(p[1]).add(p[0]);indeg[p[0]]++;}Queue<Integer> q=new LinkedList<>();for(int i=0;i<num;i++) if(indeg[i]==0) q.add(i);int done=0;while(!q.isEmpty()){int cur=q.poll();done++;for(int nei:g.get(cur)) if(--indeg[nei]==0) q.add(nei);}return done==num;}`,
    cpp: `bool canFinish(int n,vector<vector<int>>&pre){vector<vector<int>> g(n);vector<int> indeg(n,0);for(auto&p:pre){g[p[1]].push_back(p[0]);indeg[p[0]]++;}queue<int> q;for(int i=0;i<n;i++) if(!indeg[i]) q.push(i);int done=0;while(!q.empty()){int cur=q.front();q.pop();done++;for(int nei:g[cur]) if(--indeg[nei]==0) q.push(nei);}return done==n;}`,
    python: `from collections import deque
g=[[] for _ in range(numCourses)]; indeg=[0]*numCourses
for a,b in prerequisites: g[b].append(a);indeg[a]+=1
q=deque(i for i in range(numCourses) if not indeg[i]); done=0
while q:
    cur=q.popleft();done+=1
    for nei in g[cur]:
        indeg[nei]-=1
        if not indeg[nei]: q.append(nei)
return done==numCourses`
  },
  71: {
    tc: "O(V+E)", sc: "O(V)",
    java: `boolean isBipartite(int[][] g){int n=g.length;int[] color=new int[n];for(int i=0;i<n;i++) if(color[i]==0&&!dfs(g,i,1,color)) return false;return true;}
boolean dfs(int[][] g,int i,int c,int[] color){if(color[i]!=0) return color[i]==c;color[i]=c;for(int nei:g[i]) if(!dfs(g,nei,-c,color)) return false;return true;}`,
    cpp: `bool dfs(vector<vector<int>>&g,int i,int c,vector<int>&color){if(color[i]) return color[i]==c;color[i]=c;for(int nei:g[i]) if(!dfs(g,nei,-c,color)) return false;return true;}
bool isBipartite(vector<vector<int>>&g){int n=g.size();vector<int> color(n,0);for(int i=0;i<n;i++) if(!color[i]&&!dfs(g,i,1,color)) return false;return true;}`,
    python: `color=[0]*len(graph)
def dfs(i,c):
    if color[i]: return color[i]==c
    color[i]=c
    return all(dfs(nei,-c) for nei in graph[i])
return all(color[i] or dfs(i,1) for i in range(len(graph)))`
  },
  72: {
    tc: "O(m×n)", sc: "O(m×n)",
    java: `int orangesRotting(int[][] g){int m=g.length,n=g[0].length,fresh=0,time=0;Queue<int[]> q=new LinkedList<>();for(int i=0;i<m;i++) for(int j=0;j<n;j++){if(g[i][j]==2) q.add(new int[]{i,j});if(g[i][j]==1) fresh++;}int[][] dirs={{1,0},{-1,0},{0,1},{0,-1}};while(!q.isEmpty()&&fresh>0){for(int s=q.size();s>0;s--){int[] cur=q.poll();for(int[] d:dirs){int x=cur[0]+d[0],y=cur[1]+d[1];if(x<0||y<0||x>=m||y>=n||g[x][y]!=1) continue;g[x][y]=2;fresh--;q.add(new int[]{x,y});}}time++;}return fresh==0?time:-1;}`,
    cpp: `int orangesRotting(vector<vector<int>>&g){int m=g.size(),n=g[0].size(),fresh=0,time=0;queue<pair<int,int>> q;for(int i=0;i<m;i++) for(int j=0;j<n;j++){if(g[i][j]==2) q.push({i,j});if(g[i][j]==1) fresh++;}vector<pair<int,int>> dirs={{1,0},{-1,0},{0,1},{0,-1}};while(!q.empty()&&fresh){int sz=q.size();while(sz--){auto[x,y]=q.front();q.pop();for(auto[dx,dy]:dirs){int nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=m||ny>=n||g[nx][ny]!=1) continue;g[nx][ny]=2;fresh--;q.push({nx,ny});}}time++;}return fresh?-1:time;}`,
    python: `from collections import deque
m,n=len(grid),len(grid[0]); fresh=0; q=deque()
for i in range(m):
    for j in range(n):
        if grid[i][j]==2: q.append((i,j))
        elif grid[i][j]==1: fresh+=1
time=0
while q and fresh:
    for _ in range(len(q)):
        x,y=q.popleft()
        for dx,dy in [(1,0),(-1,0),(0,1),(0,-1)]:
            nx,ny=x+dx,y+dy
            if 0<=nx<m and 0<=ny<n and grid[nx][ny]==1:
                grid[nx][ny]=2; fresh-=1; q.append((nx,ny))
    time+=1
return time if not fresh else -1`
  },
  73: {
    tc: "O(V+E)", sc: "O(V+E)",
    java: `int countComponents(int n,int[][] edges){List<List<Integer>> g=new ArrayList<>();for(int i=0;i<n;i++) g.add(new ArrayList<>());for(int[] e:edges){g.get(e[0]).add(e[1]);g.get(e[1]).add(e[0]);}boolean[] vis=new boolean[n];int count=0;for(int i=0;i<n;i++) if(!vis[i]){dfs(g,i,vis);count++;}return count;}
void dfs(List<List<Integer>> g,int i,boolean[] vis){if(vis[i]) return;vis[i]=true;for(int nei:g.get(i)) dfs(g,nei,vis);}`,
    cpp: `int countComponents(int n,vector<vector<int>>&edges){vector<vector<int>> g(n);for(auto&e:edges){g[e[0]].push_back(e[1]);g[e[1]].push_back(e[0]);}vector<bool> vis(n,false);int cnt=0;function<void(int)> dfs=[&](int i){if(vis[i]) return;vis[i]=true;for(int nei:g[i]) dfs(nei);};for(int i=0;i<n;i++) if(!vis[i]){dfs(i);cnt++;}return cnt;}`,
    python: `g=[[] for _ in range(n)]
for a,b in edges: g[a].append(b);g[b].append(a)
vis=set()
def dfs(i):
    if i in vis: return
    vis.add(i)
    for nei in g[i]: dfs(nei)
cnt=0
for i in range(n):
    if i not in vis: dfs(i);cnt+=1
return cnt`
  },
  74: {
    tc: "O(n)", sc: "O(1)",
    java: `int singleNumber(int[] nums){int res=0;for(int n:nums) res^=n;return res;}`,
    cpp: `int singleNumber(vector<int>&nums){int res=0;for(int n:nums) res^=n;return res;}`,
    python: `res=0
for n in nums: res^=n
return res`
  },
  75: {
    tc: "O(32)", sc: "O(1)",
    java: `int reverseBits(int n){int res=0;for(int i=0;i<32;i++){res=(res<<1)|(n&1);n>>>=1;}return res;}`,
    cpp: `uint32_t reverseBits(uint32_t n){uint32_t res=0;for(int i=0;i<32;i++){res=(res<<1)|(n&1);n>>=1;}return res;}`,
    python: `res=0
for _ in range(32): res=(res<<1)|(n&1); n>>=1
return res`
  },
  76: {
    tc: "O(32)", sc: "O(1)",
    java: `int hammingWeight(int n){int count=0;while(n!=0){count+=n&1;n>>>=1;}return count;}`,
    cpp: `int hammingWeight(uint32_t n){int cnt=0;while(n){cnt+=n&1;n>>=1;}return cnt;}`,
    python: `return bin(n).count('1')`
  },
  77: {
    tc: "O(n)", sc: "O(1)",
    java: `int missingNumber(int[] nums){int res=nums.length;for(int i=0;i<nums.length;i++) res^=i^nums[i];return res;}`,
    cpp: `int missingNumber(vector<int>&nums){int res=nums.size();for(int i=0;i<nums.size();i++) res^=i^nums[i];return res;}`,
    python: `return len(nums)*(len(nums)+1)//2 - sum(nums)`
  },
};