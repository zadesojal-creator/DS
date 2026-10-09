import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Mail } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-white flex flex-col items-center py-16 px-4">
      <div className="max-w-3xl w-full text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
          About DSA Visualizer
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          A completely free, browser-based educational tool to help students visualize Data Structures & Algorithms step-by-step.
        </p>
      </div>

      <div className="max-w-3xl w-full bg-gray-50 border border-gray-200 rounded-2xl p-8 mb-12 shadow-sm text-left">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">How it works</h2>
        <p className="text-gray-700 mb-4 leading-relaxed">
          Unlike traditional visualizers that rely on hardcoded animations, DSA Visualizer runs a real Python 3 environment directly inside your browser using WebAssembly (Pyodide).
        </p>
        <p className="text-gray-700 mb-4 leading-relaxed">
          When you write or generate code, a custom Abstract Syntax Tree (AST) tracer hooks into the Python execution, capturing every variable mutation, function call, and memory allocation frame-by-frame. This trace is then mapped to interactive Framer Motion UI components.
        </p>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Privacy Policy</h2>
        <p className="text-gray-700 leading-relaxed">
          <strong>No tracking, no cookies, no databases.</strong> All code execution happens locally on your machine.
        </p>
      </div>

      <div className="flex gap-6">
        <a href="#" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition font-medium">
          <Github size={20} /> GitHub
        </a>
        <a href="#" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition font-medium">
          <Twitter size={20} /> Twitter
        </a>
        <a href="#" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition font-medium">
          <Mail size={20} /> Contact
        </a>
      </div>
    </div>
  );
};
