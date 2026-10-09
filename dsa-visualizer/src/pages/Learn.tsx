import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CATEGORIES = ['All', 'Linear', 'Trees', 'Graphs', 'Sorting', 'Searching', 'DP', 'Recursion', 'Greedy'];

const LABS = [
  { id: 'stack', name: 'Stack', desc: 'LIFO data structure with push/pop operations.', category: 'Linear', diff: 'Beginner', time: 'O(1)', space: 'O(N)' },
  { id: 'queue', name: 'Queue', desc: 'FIFO queue and Circular variants.', category: 'Linear', diff: 'Beginner', time: 'O(1)', space: 'O(N)' },
  { id: 'linked-list', name: 'Linked List', desc: 'Singly, Doubly, and Circular lists with node pointers.', category: 'Linear', diff: 'Intermediate', time: 'O(N)', space: 'O(N)' },
  { id: 'bst', name: 'BST & AVL', desc: 'Binary Search Tree traversals and rotations.', category: 'Trees', diff: 'Intermediate', time: 'O(log N)', space: 'O(N)' },
  { id: 'heap', name: 'Binary Heap', desc: 'Min/Max Priority Queue with heapify up/down.', category: 'Trees', diff: 'Intermediate', time: 'O(log N)', space: 'O(N)' },
  { id: 'trie', name: 'Trie (Prefix Tree)', desc: 'Character-by-character text searching.', category: 'Trees', diff: 'Advanced', time: 'O(L)', space: 'O(N*L)' },
  { id: 'hash-table', name: 'Hash Table', desc: 'Hashing, collision resolution, and load factors.', category: 'Linear', diff: 'Intermediate', time: 'O(1)', space: 'O(N)' },
  { id: 'graph', name: 'Graph Algorithms', desc: 'BFS, DFS, Dijkstra, MST, and Topological Sort.', category: 'Graphs', diff: 'Advanced', time: 'O(V+E)', space: 'O(V)' },
  { id: 'sort', name: 'Sorting', desc: 'Bubble, Merge, Quick, and Radix Sort algorithms.', category: 'Sorting', diff: 'Beginner', time: 'O(N log N)', space: 'O(1)' },
  { id: 'search', name: 'Searching', desc: 'Linear, Binary, and Interpolation search.', category: 'Searching', diff: 'Beginner', time: 'O(log N)', space: 'O(1)' },
  { id: 'recursion', name: 'Recursion', desc: 'Backtracking, N-Queens, Mazes, and Call Stacks.', category: 'Recursion', diff: 'Intermediate', time: 'O(2^N)', space: 'O(N)' },
  { id: 'dp', name: 'Dynamic Programming', desc: 'Memoization, Tabulation, Knapsack, and LCS.', category: 'DP', diff: 'Advanced', time: 'O(N^2)', space: 'O(N^2)' },
  { id: 'greedy', name: 'Greedy', desc: 'Huffman Coding, Activity Selection.', category: 'Greedy', diff: 'Intermediate', time: 'O(N log N)', space: 'O(N)' },
];

export const Learn: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All');

  const filteredLabs = activeTab === 'All' 
    ? LABS 
    : LABS.filter(lab => lab.category === activeTab);

  const getDiffColor = (diff: string) => {
    if (diff === 'Beginner') return 'bg-green-100 text-green-800';
    if (diff === 'Intermediate') return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Interactive Learning Labs</h1>
        <p className="text-gray-600 text-lg">Master Data Structures and Algorithms with step-by-step visual, memory, and code tracing.</p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${
              activeTab === cat 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Labs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredLabs.map(lab => (
          <Link 
            key={lab.id} 
            to={`/learn/${lab.id}`}
            className="group bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all flex flex-col h-full"
          >
            <div className="flex justify-between items-start mb-3">
              <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600">{lab.name}</h2>
              <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${getDiffColor(lab.diff)}`}>
                {lab.diff}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-6 flex-1">{lab.desc}</p>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex gap-2">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-mono" title="Time Complexity">⏱ {lab.time}</span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-mono" title="Space Complexity">💾 {lab.space}</span>
              </div>
              <span className="text-blue-600 group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
        ))}
      </div>
      
      {filteredLabs.length === 0 && (
        <div className="text-center text-gray-500 py-10">
          No labs found for category: {activeTab}.
        </div>
      )}
    </div>
  );
};
