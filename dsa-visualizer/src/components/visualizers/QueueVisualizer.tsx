import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';

const MAX_SIZE = 8;

export const QueueVisualizer: React.FC = () => {
  const [queue, setQueue] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [activeCodeLine, setActiveCodeLine] = useState<number>(-1);
  const { animationSpeed } = useAppStore();

  const addLog = (msg: string) => setLogs((prev) => [...prev, msg].slice(-10));
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const enqueue = async () => {
    if (!inputValue) return;
    const val = parseInt(inputValue);
    setInputValue('');

    setActiveCodeLine(1); // if (rear == MAX_SIZE - 1)
    await sleep(animationSpeed);
    if (queue.length >= MAX_SIZE) {
      setActiveCodeLine(2); // print("Overflow")
      addLog('Queue Overflow! Cannot enqueue ' + val);
      await sleep(animationSpeed);
      setActiveCodeLine(-1);
      return;
    }

    setActiveCodeLine(4); // queue[++rear] = val;
    setQueue((prev) => [...prev, val]);
    addLog(`Enqueued: ${val}`);
    await sleep(animationSpeed);
    setActiveCodeLine(-1);
  };

  const dequeue = async () => {
    setActiveCodeLine(7); // if (front > rear)
    await sleep(animationSpeed);
    if (queue.length === 0) {
      setActiveCodeLine(8); // print("Underflow")
      addLog('Queue Underflow! Cannot dequeue');
      await sleep(animationSpeed);
      setActiveCodeLine(-1);
      return;
    }

    setActiveCodeLine(10); // val = queue[front++];
    const val = queue[0];
    await sleep(animationSpeed);
    setQueue((prev) => prev.slice(1));
    addLog(`Dequeued: ${val}`);
    setActiveCodeLine(-1);
  };

  const clear = () => {
    setQueue([]);
    addLog('Queue cleared');
  };

  const pseudoCode = `
void enqueue(int val) {
  if (rear == MAX_SIZE - 1) {
    std::cout << "Overflow\\n";
    return;
  }
  queue[++rear] = val;
}

void dequeue() {
  if (front > rear) {
    std::cout << "Underflow\\n";
    return;
  }
  int val = queue[front++];
}
  `.trim().split('\\n');

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-4">Queue Visualizer</h2>
        
        <div className="flex gap-2 mb-6">
          <input 
            type="number" 
            value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)} 
            className="border p-2 rounded w-24"
            placeholder="Val"
          />
          <button onClick={enqueue} className="bg-green-600 text-white px-4 py-2 rounded">Enqueue</button>
          <button onClick={dequeue} className="bg-red-600 text-white px-4 py-2 rounded">Dequeue</button>
          <button onClick={clear} className="bg-gray-600 text-white px-4 py-2 rounded">Clear</button>
        </div>

        <div className="flex items-center border-2 border-l-0 border-r-0 border-gray-400 h-24 w-full bg-gray-50 relative p-2 overflow-hidden overflow-x-auto gap-2">
          <AnimatePresence>
            {queue.map((item, index) => (
              <motion.div
                key={index + '-' + item}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="w-16 h-16 flex-shrink-0 bg-green-500 text-white flex items-center justify-center rounded font-bold shadow"
              >
                {item}
              </motion.div>
            ))}
          </AnimatePresence>
          {queue.length === 0 && <div className="text-gray-400 m-auto">Empty Queue</div>}
        </div>
        <div className="mt-4 flex justify-between text-sm text-gray-500">
          <span>Front</span>
          <span>Rear</span>
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
