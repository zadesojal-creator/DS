export interface Operation {
  op: string;
  val?: string | number;
}

export function generatePythonScript(ds: string, operations: Operation[]): string {
  let script = '';
  
  const formatVal = (v: any) => isNaN(Number(v)) ? JSON.stringify(v) : Number(v);

  if (ds === 'stack') {
    script += `stack = []\n`;
    operations.forEach(o => {
      if (o.op === 'push') script += `stack.append(${formatVal(o.val)})\n`;
      if (o.op === 'pop') script += `if len(stack) > 0: stack.pop()\n`;
    });
    script += `print("Stack state:", stack)\n`;
  } 
  else if (ds === 'queue') {
    script += `queue = []\n`;
    operations.forEach(o => {
      if (o.op === 'enqueue') script += `queue.append(${formatVal(o.val)})\n`;
      if (o.op === 'dequeue') script += `if len(queue) > 0: queue.pop(0)\n`;
    });
    script += `print("Queue state:", queue)\n`;
  }
  else {
    // Fallback script
    script += `arr = []\n`;
    operations.forEach(o => {
      if (o.op === 'insert') script += `arr.append(${formatVal(o.val)})\n`;
    });
  }

  return script;
}
