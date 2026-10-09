import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, FastForward, RotateCcw, StepForward } from 'lucide-react';
// @ts-ignore
import * as JSInterpreter from 'js-interpreter';

const Interpreter = (JSInterpreter as any).default || JSInterpreter;

interface ScopeState {
  name: string;
  variables: Record<string, string>;
}

export const CustomCodeVisualizer: React.FC = () => {
  const [code, setCode] = useState<string>(
`// Write your ES5 JavaScript code here!
// (Note: use 'var' instead of 'let' or 'const')
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

var result = fibonacci(3);
console.log("Result: " + result);`
  );
  
  const [logs, setLogs] = useState<string[]>([]);
  const [callStack, setCallStack] = useState<ScopeState[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const interpreterRef = useRef<any>(null);
  const runTimeoutRef = useRef<any>(null);
  
  // Use refs to prevent stale closures in setTimeout loops
  const isPausedRef = useRef(false);
  
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  const initInterpreter = (interpreter: any, globalObject: any) => {
    // Add console.log support
    const logWrapper = (str: any) => {
      setLogs(prev => [...prev, String(str)]);
    };
    interpreter.setProperty(globalObject, 'console', interpreter.nativeToPseudo({}));
    interpreter.setProperty(
      interpreter.getProperty(globalObject, 'console'),
      'log',
      interpreter.createNativeFunction(logWrapper)
    );
  };

  const extractStackAndVars = () => {
    if (!interpreterRef.current) return;
    const interp = interpreterRef.current;
    
    // The state stack in JS-Interpreter
    const stateStack = interp.stateStack;
    if (!stateStack) return;

    const parsedStack: ScopeState[] = [];
    
    for (let i = 0; i < stateStack.length; i++) {
      const state = stateStack[i];
      if (state.scope) {
        const scope = state.scope;
        const vars: Record<string, string> = {};
        
        if (scope.properties) {
          const keys = Object.keys(scope.properties);
          keys.forEach(k => {
             if (k !== 'console' && k !== 'NaN' && k !== 'Infinity' && k !== 'Math' && k !== 'undefined') {
                 const val = scope.properties[k];
                 let displayVal = 'undefined';
                 if (val && val.type === 'number') displayVal = String(val.data);
                 else if (val && val.type === 'string') displayVal = `"${val.data}"`;
                 else if (val && val.type === 'boolean') displayVal = String(val.data);
                 else if (val && typeof val === 'object' && val.class === 'Function') displayVal = '[Function]';
                 else if (val && typeof val === 'object') displayVal = '[Object/Array]';
                 else if (val === undefined || val === null) displayVal = String(val);
                 
                 vars[k] = displayVal;
             }
          });
        }
        
        if (Object.keys(vars).length > 0) {
          parsedStack.push({
             name: scope.strict ? 'Strict Scope' : (i === 0 ? 'Global Scope' : 'Function Frame ' + i),
             variables: vars
          });
        }
      }
    }
    
    const uniqueStack = parsedStack.filter((s, idx, arr) => 
      idx === 0 || JSON.stringify(s.variables) !== JSON.stringify(arr[idx-1].variables)
    );

    setCallStack(uniqueStack);
  };

  const startExecution = () => {
    setLogs([]);
    setCallStack([]);
    try {
      interpreterRef.current = new Interpreter(code, initInterpreter);
      setIsRunning(true);
      setIsPaused(true); 
      extractStackAndVars();
    } catch (err: any) {
      setLogs([`Syntax Error: ${err.message}`]);
    }
  };

  const stepExecution = () => {
    if (!interpreterRef.current) return;
    try {
      const hasMore = interpreterRef.current.step();
      extractStackAndVars();
      if (!hasMore) {
        setIsRunning(false);
        setIsPaused(false);
        setLogs(prev => [...prev, "Execution Finished."]);
      }
    } catch (err: any) {
      setLogs(prev => [...prev, `Runtime Error: ${err.message}`]);
      setIsRunning(false);
    }
  };

  const runAll = () => {
    if (!interpreterRef.current) return;
    setIsPaused(false);
    
    const runLoop = () => {
      // Use ref to read latest pause state
      if (!interpreterRef.current || isPausedRef.current) return; 
      
      let hasMore = true;
      try {
        for(let i=0; i<10; i++) {
           hasMore = interpreterRef.current.step();
           if (!hasMore) break;
        }
        extractStackAndVars();
        
        if (hasMore) {
          runTimeoutRef.current = setTimeout(runLoop, 50);
        } else {
          setIsRunning(false);
          setIsPaused(false);
          setLogs(prev => [...prev, "Execution Finished."]);
        }
      } catch (err: any) {
        setLogs(prev => [...prev, `Runtime Error: ${err.message}`]);
        setIsRunning(false);
      }
    };
    
    runLoop();
  };

  const pauseExecution = () => {
    setIsPaused(true);
    if (runTimeoutRef.current) clearTimeout(runTimeoutRef.current);
  };

  const stopExecution = () => {
    setIsRunning(false);
    setIsPaused(false);
    interpreterRef.current = null;
    if (runTimeoutRef.current) clearTimeout(runTimeoutRef.current);
    setCallStack([]);
  };

  // Ensure cleanup on unmount
  useEffect(() => {
    return () => {
      if (runTimeoutRef.current) clearTimeout(runTimeoutRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 min-h-[80vh]">
      <div className="flex-1 flex flex-col bg-white rounded-lg shadow border overflow-hidden">
        <div className="bg-gray-800 text-white p-3 flex justify-between items-center flex-wrap gap-2">
          <h2 className="font-bold">Code Editor (ES5 only)</h2>
          <div className="flex gap-2">
            {!isRunning ? (
              <button onClick={startExecution} className="flex items-center gap-1 bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm">
                <Play size={16}/> Start Trace
              </button>
            ) : (
              <>
                {isPaused ? (
                  <button onClick={runAll} className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm">
                    <FastForward size={16}/> Resume
                  </button>
                ) : (
                  <button onClick={pauseExecution} className="flex items-center gap-1 bg-orange-600 hover:bg-orange-700 px-3 py-1 rounded text-sm">
                    <Pause size={16}/> Pause
                  </button>
                )}
                <button onClick={stepExecution} className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-sm">
                  <StepForward size={16}/> Step
                </button>
                <button onClick={stopExecution} className="flex items-center gap-1 bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm">
                  <RotateCcw size={16}/> Stop
                </button>
              </>
            )}
          </div>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          disabled={isRunning}
          className="flex-1 p-4 font-mono text-sm bg-gray-50 outline-none resize-none disabled:opacity-75 min-h-[250px]"
          spellCheck={false}
        />
        
        <div className="h-48 bg-black text-green-400 font-mono text-sm p-4 overflow-y-auto border-t-4 border-gray-600">
          <div className="text-gray-400 mb-1">Terminal Output:</div>
          {logs.map((log, i) => <div key={i} className={log.includes('Error') ? 'text-red-400' : ''}>&gt; {log}</div>)}
          {logs.length === 0 && <div className="text-gray-600 italic">No output yet...</div>}
        </div>
      </div>

      <div className="w-full lg:w-96 flex flex-col gap-4">
        <div className="bg-white rounded-lg shadow border flex-1 p-4 flex flex-col">
          <h2 className="font-bold text-purple-700 mb-4 border-b pb-2">Backend Scope & Call Stack</h2>
          <p className="text-xs text-gray-500 mb-4">
            Shows active scopes, function frames, and local variables in memory as your code executes.
          </p>
          
          <div className="flex-1 overflow-y-auto flex flex-col-reverse justify-start bg-gray-50 p-2 rounded border border-gray-200 min-h-[300px]">
             {callStack.length === 0 && !isRunning && (
               <div className="m-auto text-gray-400 text-sm text-center">
                 Click "Start Trace" to visualize backend memory allocation.
               </div>
             )}
             
             {callStack.map((scope, idx) => (
               <div key={idx} className="bg-purple-50 border border-purple-200 rounded p-3 mb-3 shadow-sm">
                 <div className="font-bold text-purple-800 text-sm mb-2">{scope.name}</div>
                 <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                   {Object.entries(scope.variables).map(([key, val]) => (
                     <React.Fragment key={key}>
                       <div className="font-mono text-gray-600 font-semibold truncate" title={key}>{key}:</div>
                       <div className="font-mono text-blue-700 truncate" title={val}>{val}</div>
                     </React.Fragment>
                   ))}
                   {Object.keys(scope.variables).length === 0 && (
                     <div className="text-gray-400 italic col-span-2">No variables</div>
                   )}
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};
