import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  code: string;
  onChange: (value: string | undefined) => void;
  activeLine?: number;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, activeLine }) => {
  return (
    <div className="h-full w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <Editor
        height="100%"
        defaultLanguage="python"
        theme="vs-dark"
        value={code}
        onChange={onChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          readOnly: false,
          // We can use decorators to highlight `activeLine` but for brevity we rely on standard Monaco
        }}
      />
    </div>
  );
};
