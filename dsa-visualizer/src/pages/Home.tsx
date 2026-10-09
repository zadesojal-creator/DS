import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Code2, CheckCircle2 } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-white flex flex-col items-center py-16 px-4">
      
      <div className="text-center max-w-3xl mb-16">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
          Learn Data Structures Visually — Free, No signup, Just open and explore.
        </h1>
        <p className="text-xl text-gray-600">
          The ultimate browser-based educational tool to visualize algorithms step-by-step with full memory and pointer tracking.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 max-w-5xl w-full px-4 mb-16">
        {/* Learn Mode Card */}
        <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-8 rounded-3xl shadow-sm hover:shadow-md transition flex flex-col items-start">
          <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
            <BookOpen size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Learn Mode</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Explore 13+ interactive labs covering everything from Linked Lists and BSTs to Dynamic Programming and Graphs.
          </p>
          <Link to="/learn" className="mt-auto inline-flex items-center justify-center bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition w-full md:w-auto">
            Open Learn →
          </Link>
        </div>

        {/* Code Mode Card */}
        <div className="flex-1 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 p-8 rounded-3xl shadow-sm hover:shadow-md transition flex flex-col items-start">
          <div className="w-16 h-16 bg-purple-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
            <Code2 size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Code Mode</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Paste your own Python code and watch the Pyodide-powered backend trace every memory allocation and pointer in real-time.
          </p>
          <Link to="/trace" className="mt-auto inline-flex items-center justify-center bg-purple-600 text-white font-bold py-3 px-8 rounded-full hover:bg-purple-700 transition w-full md:w-auto">
            Paste Code →
          </Link>
        </div>
      </div>

      {/* Feature Strip */}
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 px-4">
        {[
          "Push/pop a stack",
          "Trace bubble sort",
          "Follow BFS on a graph",
          "Watch BST rotations",
          "See heapify up/down",
          "Detect memory leaks"
        ].map((feature, idx) => (
          <div key={idx} className="flex items-center gap-3 text-gray-700 text-lg font-medium">
            <CheckCircle2 className="text-green-500 flex-shrink-0" size={24} />
            {feature}
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-auto w-full border-t border-gray-100 py-8 flex flex-col items-center text-gray-500">
        <p className="mb-2">No tracking, no cookies, free forever.</p>
        <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-gray-800 font-medium transition">
          View Source on GitHub
        </a>
      </footer>

    </div>
  );
};
