export const DEMO_SCRIPTS: Record<string, string> = {
  stack: `def stack_demo():
    stack = []
    stack.append(10) # Push
    stack.append(20) # Push
    stack.append(30) # Push
    top = stack.pop() # Pop
    return stack
    
stack_demo()`,

  queue: `def queue_demo():
    queue = []
    queue.append("A") # Enqueue
    queue.append("B") # Enqueue
    queue.append("C") # Enqueue
    first = queue.pop(0) # Dequeue
    return queue

queue_demo()`,

  'linked-list': `def ll_demo():
    head = {"val": 1, "next": None}
    head["next"] = {"val": 2, "next": None}
    head["next"]["next"] = {"val": 3, "next": None}
    
    # Insert at head
    new_head = {"val": 0, "next": head}
    return new_head

ll_demo()`,

  bst: `def bst_demo():
    root = {"val": 10, "left": None, "right": None}
    root["left"] = {"val": 5, "left": None, "right": None}
    root["right"] = {"val": 15, "left": None, "right": None}
    root["left"]["left"] = {"val": 2, "left": None, "right": None}
    return root

bst_demo()`,

  heap: `def heapify(arr, n, i):
    largest = i
    l = 2 * i + 1
    r = 2 * i + 2
    if l < n and arr[i] < arr[l]: largest = l
    if r < n and arr[largest] < arr[r]: largest = r
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)

def build_heap():
    arr = [4, 10, 3, 5, 1]
    n = len(arr)
    for i in range(n//2 - 1, -1, -1):
        heapify(arr, n, i)
    return arr

build_heap()`,

  sort: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                temp = arr[j]
                arr[j] = arr[j+1]
                arr[j+1] = temp

my_list = [5, 1, 4, 2, 8]
bubble_sort(my_list)`,

  recursion: `def fib(n):
    if n <= 1: return n
    return fib(n-1) + fib(n-2)

fib(3)`,

  search: `def binary_search(arr, x):
    l = 0
    r = len(arr) - 1
    while l <= r:
        mid = l + (r - l) // 2
        if arr[mid] == x: return mid
        elif arr[mid] < x: l = mid + 1
        else: r = mid - 1
    return -1

binary_search([2, 3, 4, 10, 40], 10)`,
  
  dp: `def knapsack():
    val = [60, 100, 120]
    wt = [10, 20, 30]
    W = 50
    n = len(val)
    K = [[0 for x in range(W + 1)] for x in range(n + 1)]
    for i in range(n + 1):
        for w in range(W + 1):
            if i == 0 or w == 0:
                K[i][w] = 0
            elif wt[i-1] <= w:
                K[i][w] = max(val[i-1] + K[i-1][w-wt[i-1]], K[i-1][w])
            else:
                K[i][w] = K[i-1][w]
    return K[n][W]
knapsack()`,

  graph: `def bfs(graph, start):
    visited = []
    queue = [start]
    while queue:
        node = queue.pop(0)
        if node not in visited:
            visited.append(node)
            queue.extend(graph[node])
    return visited

graph = {'A': ['B', 'C'], 'B': ['A', 'D', 'E'], 'C': ['A', 'F'], 'D': ['B'], 'E': ['B', 'F'], 'F': ['C', 'E']}
bfs(graph, 'A')`,

  'hash-table': `def hash_demo():
    table = {}
    table["apple"] = 1
    table["banana"] = 2
    table["cherry"] = 3
    del table["banana"]
    return table
hash_demo()`,

  trie: `def trie_demo():
    trie = {}
    word = "hello"
    curr = trie
    for char in word:
        if char not in curr:
            curr[char] = {}
        curr = curr[char]
    curr["*"] = True
    return trie
trie_demo()`,

  greedy: `def activity_selection():
    start = [1, 3, 0, 5, 8, 5]
    finish = [2, 4, 6, 7, 9, 9]
    n = len(start)
    i = 0
    selected = [i]
    for j in range(n):
        if start[j] >= finish[i]:
            selected.append(j)
            i = j
    return selected
activity_selection()`
};
