export interface TraceEvent {
  step: number;
  line: number;
  event: 'call' | 'line' | 'return' | 'exception';
  func_name: string;
  locals: Record<string, any>;
  globals: Record<string, any>;
  stack: StackFrame[];
  heap: Record<string, HeapObject>;
  stdout: string;
  explanation: string;
}

export interface StackFrame {
  frame_id: string;
  func_name: string;
  line: number;
  locals: Record<string, any>;
  is_current: boolean;
}

export interface HeapObject {
  id: string;
  type: string;
  value: any;
  ref_count: number;
  reachable: boolean;
  pointers: Pointer[];
}

export interface Pointer {
  from_id: string; // "frame_id" or "heap_id"
  to_id: string;
  label: string; // e.g. variable name, or dict key
}

export interface StructureSnapshot {
  inferred_type: 'array' | 'matrix' | 'linked_list' | 'tree' | 'graph' | 'stack' | 'queue' | 'heap' | 'unknown';
  root_id: string;
}
