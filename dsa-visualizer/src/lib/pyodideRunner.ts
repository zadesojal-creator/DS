import type { TraceEvent } from './traceSchema';
import tracerScript from '../sandbox/tracer.py?raw';

declare global {
  interface Window {
    loadPyodide: (config: any) => Promise<any>;
  }
}

let pyodide: any = null;

export async function initPyodide() {
  if (!pyodide) {
    if (!window.loadPyodide) {
      // Inject pyodide script
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }
    pyodide = await window.loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/',
    });
    // Load tracer definitions into global python scope
    pyodide.runPython(tracerScript);
  }
  return pyodide;
}

export async function runPythonCode(code: string): Promise<TraceEvent[]> {
  const py = await initPyodide();
  
  // Expose code to pyodide
  py.globals.set('user_code_string', code);
  
  const runnerCode = `
events_json = run_code(user_code_string)
events_json
  `;
  
  const resultJson = py.runPython(runnerCode);
  const events: TraceEvent[] = JSON.parse(resultJson);
  return events;
}
