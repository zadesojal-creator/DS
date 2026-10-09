# DSA Visualizer & Manager - Project Report

## 1. Abstract
This project is a comprehensive college-level Data Structures and Algorithms visualizer. It provides interactive, animated simulations of Stack, Queue, Call Stack, and Heap Memory Management. Built using React and Framer Motion, it offers students and instructors a pedagogical tool to understand memory operations, variable scopes, recursion limits (stack overflow), and dynamic allocation fragmentation and leaks.

## 2. Complexity Analysis

### Stack Operations
- **Push**: `O(1)` time, `O(1)` auxiliary space.
- **Pop**: `O(1)` time, `O(1)` auxiliary space.
- **Peek**: `O(1)` time, `O(1)` auxiliary space.
- **IsEmpty/Size**: `O(1)` time, `O(1)` auxiliary space.

### Queue Operations (Linear & Circular)
- **Enqueue**: `O(1)` time, `O(1)` auxiliary space.
- **Dequeue**: `O(1)` time, `O(1)` auxiliary space.

### Heap Memory Allocator (Simulation)
- **Allocate (First Fit)**: `O(N)` where N is number of blocks.
- **Free**: `O(1)` using direct pointer/index access.
- **Garbage Collection (Mark & Sweep)**: `O(V + E)` where V is allocated objects and E is references (simplified in UI to O(N) blocks).

---

## 3. Test Cases

| ID | Module | Scenario | Expected Result | Pass/Fail |
|---|---|---|---|---|
| TC01 | Stack | Push elements beyond `MAX_SIZE` | Trigger `Stack Overflow` error message | PASS |
| TC02 | Stack | Pop from empty stack | Trigger `Stack Underflow` error message | PASS |
| TC03 | Queue | Enqueue beyond `MAX_SIZE` | Trigger `Queue Overflow` error message | PASS |
| TC04 | Memory | Simulate 6 consecutive function calls | Trigger `Stack Overflow` in call stack | PASS |
| TC05 | Memory | Allocate memory when no free blocks left | Trigger `Heap Out of Memory` error | PASS |
| TC06 | Memory | Create Memory Leak | Object allocated without reference; GC collects it | PASS |

---

## 4. Viva / Interview Questions

1. **What is the difference between Call Stack and Heap Memory?**
   *Answer*: The call stack is used for static memory allocation (local variables, function frames) and is managed automatically (LIFO). The heap is used for dynamic memory allocation, and the programmer (or GC) must manage it manually.
   
2. **How does a Stack Overflow happen?**
   *Answer*: It occurs when there is excessive recursion or an infinite loop of function calls, exhausting the fixed size of the call stack memory.

3. **What is a Memory Leak?**
   *Answer*: A memory leak occurs when dynamically allocated memory in the heap is no longer accessible (all pointers/references to it are lost) but it hasn't been deallocated (`free()` or `delete`). This reduces available memory.

4. **Why use a Circular Queue over a Linear Queue?**
   *Answer*: In an array-based linear queue, after a series of enqueues and dequeues, there might be empty space at the front of the array that cannot be reused. A circular queue connects the rear back to the front, reusing that space efficiently.

5. **How does Garbage Collection resolve memory leaks?**
   *Answer*: Modern languages (like Java/JS) use algorithms like Mark-and-Sweep. It traverses all reachable objects from the root (call stack/globals). Any allocated heap memory not marked as reachable is considered garbage and is automatically freed.

---

## 5. Folder Structure
```
dsa-visualizer/
├── src/
│   ├── components/
│   │   ├── ui/ (Shared buttons, controls)
│   │   └── visualizers/ (Stack, Queue, Memory components)
│   ├── pages/ (Home page)
│   ├── store/ (Zustand state management)
│   ├── App.tsx (Routing)
│   ├── main.tsx (Entry point)
│   └── index.css (Tailwind styles)
├── package.json
├── vite.config.ts
├── README.md
└── REPORT.md
```
