import sys
import gc
import json
import inspect
from io import StringIO

class Tracer:
    def __init__(self, max_steps=5000):
        self.max_steps = max_steps
        self.step_count = 0
        self.events = []
        self.output = StringIO()
        self.original_stdout = sys.stdout
        
    def start(self):
        sys.stdout = self.output
        sys.settrace(self.trace_dispatch)
        
    def stop(self):
        sys.settrace(None)
        sys.stdout = self.original_stdout
        
    def trace_dispatch(self, frame, event, arg):
        # Ignore our own internal modules and standard library
        if frame.f_code.co_filename.startswith('<frozen') or 'pyodide' in frame.f_code.co_filename or 'tracer.py' in frame.f_code.co_filename:
            return self.trace_dispatch
            
        self.step_count += 1
        if self.step_count > self.max_steps:
            raise TimeoutError("Maximum execution steps exceeded.")
            
        trace_event = self.capture_state(frame, event, arg)
        self.events.append(trace_event)
        
        return self.trace_dispatch
        
    def capture_state(self, frame, event, arg):
        # 1. Capture Stack
        stack = []
        curr = frame
        while curr and not (curr.f_code.co_filename.startswith('<frozen') or 'pyodide' in curr.f_code.co_filename):
            locals_copy = self.serialize_dict(curr.f_locals)
            stack.append({
                'frame_id': str(id(curr)),
                'func_name': curr.f_code.co_name,
                'line': curr.f_lineno,
                'locals': locals_copy,
                'is_current': curr == frame
            })
            curr = curr.f_back
        stack.reverse()
        
        # 2. Capture Heap (Simplified for Web performance)
        # In a real heavy implementation, we would do a full BFS from roots.
        # Here we just track objects in the locals.
        heap = {}
        roots = []
        for f in stack:
            for k, v in f['locals'].items():
                if isinstance(v, dict) and '__id' in v:
                    roots.append(v['__id'])
                    
        # Find all trackable objects from gc
        for obj in gc.get_objects():
            if type(obj) in [list, dict, set]:
                obj_id = str(id(obj))
                heap[obj_id] = {
                    'id': obj_id,
                    'type': type(obj).__name__,
                    'value': self.serialize_val(obj, shallow=True),
                    'ref_count': sys.getrefcount(obj) - 1,
                    'reachable': True, # Simplified
                    'pointers': []
                }
                
        # Connect pointers
        for obj in gc.get_objects():
            if type(obj) in [list, dict, set]:
                obj_id = str(id(obj))
                if type(obj) == list:
                    for i, item in enumerate(obj):
                        if type(item) in [list, dict, set]:
                            heap[obj_id]['pointers'].append({
                                'from_id': obj_id,
                                'to_id': str(id(item)),
                                'label': str(i)
                            })
                            
        explanation = f"Executing line {frame.f_lineno}"
        if event == 'call':
            explanation = f"Calling function {frame.f_code.co_name}"
        elif event == 'return':
            explanation = f"Returning from {frame.f_code.co_name}"

        return {
            'step': self.step_count,
            'line': frame.f_lineno,
            'event': event,
            'func_name': frame.f_code.co_name,
            'locals': self.serialize_dict(frame.f_locals),
            'stack': stack,
            'heap': heap,
            'stdout': self.output.getvalue(),
            'explanation': explanation
        }

    def serialize_dict(self, d):
        res = {}
        for k, v in d.items():
            if not k.startswith('__'):
                res[k] = self.serialize_val(v)
        return res
        
    def serialize_val(self, v, shallow=False):
        if type(v) in [int, float, str, bool, type(None)]:
            return v
        if type(v) in [list, dict, set]:
            if shallow:
                return f"<{type(v).__name__} size={len(v)}>"
            return {"__id": str(id(v))}
        return str(v)

def run_code(code_string):
    tracer = Tracer()
    try:
        tracer.start()
        # Compile and run
        compiled = compile(code_string, '<user_code>', 'exec')
        exec(compiled, {})
    except Exception as e:
        tracer.events.append({
            'step': tracer.step_count + 1,
            'line': 0,
            'event': 'exception',
            'func_name': '',
            'locals': {},
            'stack': [],
            'heap': {},
            'stdout': tracer.output.getvalue(),
            'explanation': f"Exception: {str(e)}"
        })
    finally:
        tracer.stop()
        
    return json.dumps(tracer.events)
