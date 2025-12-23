
import React, { useState, useRef } from 'react';
import { BannerAdPlaceholder } from './BannerAdPlaceholder';
import { ADS_CONFIG } from '../constants';
import { useTranslation, Language } from '../utils/i18n';
// @ts-ignore
import html2canvas from 'html2canvas';

interface CalculatorWrapperProps {
  children: (onCalculate: (res: React.ReactNode) => void) => React.ReactNode;
  lang: Language;
}

export const CalculatorWrapper: React.FC<CalculatorWrapperProps> = ({ children, lang }) => {
  const t = useTranslation(lang);
  const [result, setResult] = useState<React.ReactNode | null>(null);
  const [showAd, setShowAd] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleCalculate = (calculatedResult: React.ReactNode) => {
    setResult(calculatedResult);
    setShowAd(true);
    setShowResult(false);
  };

  const handleAdComplete = () => {
    setShowAd(false);
    setShowResult(true);
    setTimeout(() => {
      document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleDownload = async () => {
    if (!resultRef.current || isDownloading) return;
    
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(resultRef.current, {
        backgroundColor: document.documentElement.classList.contains('dark') ? '#0f172a' : '#f8fafc',
        scale: 2, // Higher quality
        logging: false,
        useCORS: true
      });
      
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `Smart_AI_Calc_Result_${Date.now()}.png`;
      link.click();
    } catch (err) {
      console.error('Failed to export image', err);
      // Fallback to text download if image fails
      const text = resultRef.current.innerText;
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Result_${Date.now()}.txt`;
      a.click();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700">
        {children(handleCalculate)}
      </div>

      {showAd && (
        <BannerAdPlaceholder 
          duration={ADS_CONFIG.loadingTimeMs} 
          onAdComplete={handleAdComplete} 
        />
      )}

      {showResult && result && (
        <div id="result-section" className="animate-fade-in-up">
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-0 rounded-2xl shadow-xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/20">
                    <div className="flex items-center space-x-2">
                        <div className="p-2 bg-primary/10 rounded-full text-primary">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{t.result}</h3>
                    </div>
                    <button 
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="flex items-center space-x-1 text-sm font-semibold text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {isDownloading ? (
                           <svg className="animate-spin h-4 w-4 mr-1" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        ) : (
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        )}
                        <span>{isDownloading ? 'Saving...' : 'Save PNG'}</span>
                    </button>
                </div>
                <div ref={resultRef} className="p-6 bg-white dark:bg-slate-800">
                    {result}
                    <div className="mt-8 pt-4 border-t border-gray-50 dark:border-slate-700 text-[10px] text-gray-400 text-center uppercase tracking-widest">
                        Generated by Smart AI Calculator
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
