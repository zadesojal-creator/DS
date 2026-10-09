# DSA Visualizer (Advanced Architecture)

This is a production-ready WebAssembly-powered algorithm visualizer built with **React, TypeScript, Tailwind CSS, Monaco Editor, Pyodide, Framer Motion, and Zustand**.

## Architecture Overview

1. **Python Tracer (`src/sandbox/tracer.py`)**
   This script runs *inside* the browser's Pyodide (WASM) environment. It uses `sys.settrace` to hook into the Python interpreter loop. On every line execution, it performs a micro-garbage-collection sweep to identify all reachable local variables and heap objects, mapping out their pointer references and reference counts.
   
2. **Pyodide Bridge (`src/lib/pyodideRunner.ts`)**
   Loads the WebAssembly Python environment, injects the tracer, executes the user's code, and extracts the serialized JSON Trace Events.

3. **State Management (`src/store/traceStore.ts`)**
   Uses Zustand to manage playback state. Because traces are pure functions of `(events, index)`, the entire UI can step forward, step backward, or jump to any point instantly without re-calculating states.

4. **UI Components (`src/components/`)**
   - **Monaco Editor**: Provides a world-class code editing experience.
   - **VCR Controls**: Maps playback speed (0.5x to 4x) to the `currentIndex` state.
   - **Memory Panel**: Iterates over the `stack` and `heap` payload from the Python tracer, rendering them as interactive DOM elements.

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```

*(Note: Pyodide loads its WASM binaries dynamically from a CDN on first run. Ensure you have an active internet connection when first clicking "Run").*
