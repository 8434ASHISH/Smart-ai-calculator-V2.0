import React, { useState, useEffect } from 'react';

interface BannerAdProps {
  onAdComplete?: () => void;
  duration?: number;
}

export const BannerAdPlaceholder: React.FC<BannerAdProps> = ({ onAdComplete, duration = 2000 }) => {
  const [timeLeft, setTimeLeft] = useState(duration / 1000);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (onAdComplete) onAdComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 0.5);
    }, 500);

    return () => clearInterval(timer);
  }, [timeLeft, onAdComplete]);

  return (
    <div className="w-full my-6 p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-slate-800 rounded-lg flex flex-col items-center justify-center min-h-[250px] animate-pulse">
      <div className="flex items-center space-x-2 text-xs text-gray-500 uppercase tracking-widest mb-2 w-full justify-between px-4">
        <span>Advertisement</span>
        <span className="cursor-help underline" title="We show ads to keep this tool free.">Why am I seeing this?</span>
      </div>
      
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-gray-400">Sponsored Content Placeholder</h3>
        <p className="text-sm text-gray-500">Your results will appear in {Math.ceil(timeLeft)} seconds...</p>
      </div>

      <div className="mt-4 w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500 transition-all duration-500 ease-linear"
          style={{ width: `${((duration/1000 - timeLeft) / (duration/1000)) * 100}%` }}
        />
      </div>
    </div>
  );
};
