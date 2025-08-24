import React from 'react';

interface DebugPanelProps {
  isOpen: boolean;
  events: any[];
  onClose: () => void;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ isOpen, events, onClose }) => {
  if (!isOpen) return null;

  const handleCopy = () => {
    const textToCopy = JSON.stringify(events, null, 2);
    navigator.clipboard.writeText(textToCopy).then(() => {
      alert('Debug log copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy debug log: ', err);
      alert('Failed to copy.');
    });
  };

  return (
    <div className="fixed top-1/2 right-4 transform -translate-y-1/2 bg-gray-900 border border-amber-600 rounded-lg shadow-2xl w-full max-w-md h-[80vh] z-[60] flex flex-col font-mono animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700 flex-shrink-0">
        <h3 className="text-lg font-bold text-amber-400">Debug Event Log</h3>
        <div>
          <button onClick={handleCopy} className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold py-1 px-3 rounded-md transition-colors mr-2">
            Copy All
          </button>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow p-3 overflow-y-auto space-y-3 text-xs">
        {events.length === 0 && (
          <p className="text-gray-500">Waiting for API events...</p>
        )}
        {events.map((event, index) => (
          <div key={index} className="bg-black p-2 rounded">
             <p className="text-cyan-400 text-opacity-70 mb-1">
               {`Event ${index + 1} @ ${new Date(event.timestamp).toLocaleTimeString()}`}
             </p>
            <pre className="text-green-400 whitespace-pre-wrap break-all">
              {JSON.stringify(event.payload, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DebugPanel;
