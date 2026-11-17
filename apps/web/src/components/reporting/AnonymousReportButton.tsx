'use client';

import { useState } from 'react';

interface Props {
  entityType: 'post' | 'user' | 'listing' | 'comment';
  entityId: string;
}

export default function AnonymousReportButton({ entityType, entityId }: Props) {
  const [isReporting, setIsReporting] = useState(false);
  const [reported, setReported] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReport = async () => {
    if (isReporting || reported) return;
    
    setIsReporting(true);
    setError(null);

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityType,
          entityId,
          category: 'other', // Default category for quick-report button
          details: `Anonymous user-reported ${entityType} via quick-report button.`,
          anonymous: true,
        }),
      });

      if (!res.ok) throw new Error('Failed to submit report');
      
      setReported(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsReporting(false);
    }
  };

  if (reported) {
    return (
      <button 
        disabled 
        className="text-xs text-green-600 font-medium px-3 py-1 rounded-full bg-green-50 border border-green-200"
        aria-label="Report submitted successfully"
      >
        ✓ Reported Anonymously
      </button>
    );
  }

  return (
    <div className="relative group">
      <button
        onClick={handleReport}
        disabled={isReporting}
        className={`text-xs font-medium px-3 py-1 rounded-full border transition-all
          ${isReporting 
            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-wait' 
            : 'bg-white text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 active:scale-95'
          }`}
        aria-label={isReporting ? 'Submitting report...' : 'Report anonymously'}
      >
        {isReporting ? 'Reporting...' : '️ Report'}
      </button>
      
      {/* Tooltip for accessibility */}
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-[10px] text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        Submit anonymously. No login required.
      </span>
      
      {error && (
        <p className="absolute top-full left-0 mt-1 text-[10px] text-red-600 bg-red-50 px-2 py-1 rounded border border-red-200">
          {error}
        </p>
      )}
    </div>
  );
}
