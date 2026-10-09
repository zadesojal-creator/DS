import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimationControls } from '../ui/AnimationControls';
import { useAppStore } from '../../store/useAppStore';

const MAX_SIZE = 8;

export const StackVisualizer: React.FC = () => {
  const [stack, setStack] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [activeCodeLine, setActiveCodeLine] = useState<number>(-1);
  const { animationSpeed, isPaused } = useAppStore();

  const addLog = (msg: string) => setLogs((prev) => [...prev, msg].slice(-10));

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const push = async () => {
    if (!inputValue) return;
    const val = parseInt(inputValue);
    setInputValue('');

    setActiveCodeLine(1); // if (top == MAX_SIZE - 1)
    await sleep(animationSpeed);
    if (stack.length >= MAX_SIZE) {
      setActiveCodeLine(2); // print("Overflow")
      addLog('Stack Overflow! Cannot push ' + val);
      await sleep(animationSpeed);
      setActiveCodeLine(-1);
      return;
    }

    setActiveCodeLine(4); // top++;
    await sleep(animationSpeed);
    setActiveCodeLine(5); // stack[top] = val;
    setStack((prev) => [...prev, val]);
    addLog(`Pushed: ${val}`);
    await sleep(animationSpeed);
    setActiveCodeLine(-1);
  };

  const pop = async () => {
    setActiveCodeLine(7); // if (top == -1)
    await sleep(animationSpeed);
    if (stack.length === 0) {
      setActiveCodeLine(8); // print("Underflow")
      addLog('Stack Underflow! Cannot pop');
      await sleep(animationSpeed);
      setActiveCodeLine(-1);
      return;
    }

    setActiveCodeLine(10); // val = stack[top];
    const val = stack[stack.length - 1];
    await sleep(animationSpeed);
    setActiveCodeLine(11); // top--;
    setStack((prev) => prev.slice(0, -1));
    addLog(`Popped: ${val}`);
    await sleep(animationSpeed);
    setActiveCodeLine(-1);
  };

  const peek = async () => {
    if (stack.length === 0) {
      addLog('Stack is empty. Cannot peek.');
      return;
    }
    const val = stack[stack.length - 1];
    addLog(`Peek: ${val}`);
  };

  const clear = () => {
    setStack([]);
    addLog('Stack cleared');
  };

  const pseudoCode = `
void push(int val) {
  if (top == MAX_SIZE - 1) {
    std::cout << "Overflow\\n";
    return;
  }
  top++;
  stack[top] = val;
}

void pop() {
  if (top == -1) {
    std::cout << "Underflow\\n";
    return;
  }
  int val = stack[top];
  top--;
}
  `.trim().split('\\n');

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-4">Stack Visualizer</h2>
        
        <div className="flex gap-2 mb-6">
          <input 
            type="number" 
            value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)} 
            className="border p-2 rounded w-24"
            placeholder="Val"
          />
          <button onClick={push} className="bg-blue-600 text-white px-4 py-2 rounded">Push</button>
          <button onClick={pop} className="bg-red-600 text-white px-4 py-2 rounded">Pop</button>
          <button onClick={peek} className="bg-green-600 text-white px-4 py-2 rounded">Peek</button>
          <button onClick={clear} className="bg-gray-600 text-white px-4 py-2 rounded">Clear</button>
        </div>

        <div className="flex flex-col items-center justify-end border-2 border-t-0 border-gray-400 w-48 h-80 bg-gray-50 relative p-2 overflow-hidden">
          <AnimatePresence>
            {stack.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="w-full bg-blue-500 text-white text-center py-2 mb-1 rounded font-bold shadow"
              >
                {item}
              </motion.div>
            ))}
          </AnimatePresence>
          {stack.length === 0 && <div className="text-gray-400">Empty Stack</div>}
        </div>
        <div className="mt-4">
          <p>Size: {stack.length} / {MAX_SIZE}</p>
          <p>isEmpty: {stack.length === 0 ? 'true' : 'false'}</p>
        </div>
      </div>

      <div className="w-80">
        <div className="bg-gray-800 text-white p-4 rounded-lg mb-4 text-sm font-mono overflow-x-auto">
          {pseudoCode.map((line, i) => (
            <div key={i} className={`px-2 ${activeCodeLine === i ? 'bg-blue-600' : ''}`}>
              {line}
            </div>
          ))}
        </div>

        <div className="bg-gray-100 p-4 rounded-lg h-64 overflow-y-auto">
          <h3 className="font-bold mb-2">Operation Log</h3>
          <ul className="text-sm space-y-1">
            {logs.map((log, i) => <li key={i} className="border-b pb-1">{log}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
};
