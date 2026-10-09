import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Share2 } from 'lucide-react';
import { VCRControls } from '../components/player/VCRControls';
import { MemoryPanel } from '../components/memory/MemoryPanel';
import { GenericStructureView } from '../components/structures/GenericStructureView';
import { useTraceStore } from '../store/traceStore';

export const SharedTrace: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setEvents, events, currentIndex } = useTraceStore();
  const currentEvent = events[currentIndex];

  useEffect(() => {
    // In a real implementation, this would fetch from Vercel Edge / Upstash Redis
    // using the `id` parameter. For now, we simulate a missing/expired link.
    const fetchTrace = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setError("Shared trace not found or has expired (24h limit).");
      } catch (e) {
        setError("Failed to load trace.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrace();
  }, [id]);

  if (isLoading) {
    return <div className="min-h-[calc(100vh-64px)] flex items-center justify-center text-gray-500">Loading trace {id}...</div>;
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-red-100 text-center max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">Trace Expired</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/trace" className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition">
            Create New Trace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50">
      <div className="flex justify-between items-center px-4 py-2 bg-white border-b shadow-sm z-10">
        <div className="flex items-center gap-4">
          <Link to="/trace" className="text-gray-500 hover:text-blue-600 transition flex items-center gap-1 text-sm font-medium">
            <ArrowLeft size={16} /> New Trace
          </Link>
          <div className="h-6 w-px bg-gray-300"></div>
          <span className="font-bold text-gray-700">Read-Only Shared Trace</span>
          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded font-mono">ID: {id}</span>
        </div>
        <button className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-sm transition">
          <Share2 size={14} /> Copy Link
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-2/3 flex flex-col p-2 gap-2">
          <div className="h-1/2 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-center relative overflow-hidden">
             <GenericStructureView />
          </div>
          <div className="h-1/2">
             <MemoryPanel />
          </div>
        </div>
        <div className="w-1/3 flex flex-col p-2 gap-2">
          <div className="h-24 bg-blue-50 border border-blue-200 rounded p-2 overflow-y-auto">
            <h4 className="text-xs font-bold text-blue-800 uppercase mb-1">What's Happening</h4>
            <p className="text-sm text-gray-700 font-mono">
              {currentEvent ? currentEvent.explanation : '...'}
            </p>
          </div>
          <div className="flex-1 bg-gray-900 border-t-4 border-gray-700 rounded-lg p-2 overflow-y-auto text-green-400 font-mono text-xs shadow-inner">
            <div className="text-gray-500 mb-1">STDOUT:</div>
            <pre>{currentEvent?.stdout || ''}</pre>
          </div>
        </div>
      </div>
      <div className="h-24">
         <VCRControls />
      </div>
    </div>
  );
};
