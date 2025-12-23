
import React, { useState, useEffect } from 'react';
import { useTranslation, Language } from '../utils/i18n';

interface DashboardProps {
    lang: Language;
    setLang: (l: Language) => void;
    darkMode: boolean;
    setDarkMode: (d: boolean) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ lang, setLang, darkMode, setDarkMode }) => {
    const t = useTranslation(lang);
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [showNameModal, setShowNameModal] = useState(false);
    const [tempName, setTempName] = useState('');

    useEffect(() => {
        const savedName = localStorage.getItem('userName');
        if (savedName) {
            setName(savedName);
        } else {
            // Slight delay to not block initial render
            setTimeout(() => setShowNameModal(true), 1000);
        }
    }, []);

    const handleSaveName = () => {
        if (tempName.trim()) {
            localStorage.setItem('userName', tempName.trim());
            setName(tempName.trim());
            setShowNameModal(false);
        }
    };

    return (
        <>
            {/* Dashboard Toggle Button (Floating or Fixed Top Right) */}
            <div className="fixed top-20 right-4 z-40 md:top-4 md:right-32">
                 <button 
                    onClick={() => setIsOpen(true)}
                    className="flex items-center space-x-2 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-full shadow-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all"
                 >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                        {name ? name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="text-sm font-medium hidden sm:block">{name || t.welcome}</span>
                 </button>
            </div>

            {/* Name Input Modal */}
            {showNameModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-fade-in-up">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t.welcome}!</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">{t.enter_name_prompt}</p>
                        <input 
                            type="text" 
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            className="w-full p-3 border rounded-xl dark:bg-slate-700 dark:border-slate-600 mb-4 focus:ring-2 focus:ring-primary outline-none transition-all"
                            placeholder="Your Name"
                            autoFocus
                        />
                        <button 
                            onClick={handleSaveName}
                            className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-transform active:scale-95"
                        >
                            {t.save}
                        </button>
                    </div>
                </div>
            )}

            {/* Slide-out Dashboard */}
            {isOpen && (
                <>
                    <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
                    <div className="fixed inset-y-0 right-0 z-50 w-80 bg-white dark:bg-slate-900 shadow-2xl transform transition-transform duration-300 ease-out border-l dark:border-slate-800 flex flex-col">
                        
                        <div className="p-6 border-b dark:border-slate-800 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t.dashboard}</h2>
                            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        <div className="p-6 flex-1 overflow-y-auto space-y-8">
                            {/* User Profile */}
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                    {name ? name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.welcome},</p>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate max-w-[150px]">{name || 'Guest'}</h3>
                                </div>
                            </div>

                            {/* Settings */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t.settings}</h4>
                                
                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-xl">
                                    <span className="text-sm font-medium">{t.toggle_theme}</span>
                                    <button onClick={() => setDarkMode(!darkMode)} className="text-2xl">
                                        {darkMode ? '🌙' : '🌞'}
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">{t.language}</label>
                                    <select 
                                        value={lang} 
                                        onChange={(e) => setLang(e.target.value as Language)} 
                                        className="w-full p-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700 bg-gray-50 dark:text-white"
                                    >
                                        <option value="en">🇺🇸 English</option>
                                        <option value="hi">🇮🇳 हिन्दी</option>
                                        <option value="bn">🇧🇩 বাংলা</option>
                                        <option value="ur">🇵🇰 اردو</option>
                                        <option value="es">🇪🇸 Español</option>
                                        <option value="fr">🇫🇷 Français</option>
                                        <option value="ja">🇯🇵 日本語</option>
                                    </select>
                                </div>
                            </div>

                            {/* Buy Me A Coffee */}
                            <div className="pt-6 border-t dark:border-slate-800">
                                <a 
                                    href="https://buymeacoffee.com/8434ashishb" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="block w-full"
                                >
                                    <div className="bg-[#FFDD00] hover:bg-[#FFDD00]/90 text-black font-bold py-4 px-6 rounded-xl shadow-lg transform transition hover:-translate-y-1 flex items-center justify-center space-x-2">
                                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M20.216 6.415l-.132-.666c-.119-.596-.387-1.142-.777-1.583-.39-.441-.887-.773-1.439-.96l-.185-.06C16.543 2.768 14.88 2.5 13.208 2.5c-2.43 0-4.83.565-6.99 1.583-.43.203-.84.453-1.22.748-.61.47-1.12 1.05-1.5 1.73-.38.68-.61 1.43-.67 2.2l-.01.12c-.01.13-.01.27-.01.4v.05c0 3.44 1.35 6.48 3.53 8.65 1.58 1.57 3.59 2.65 5.76 3.1v1.6H9.66c-.55 0-1 .45-1 1s.45 1 1 1h8.67c.55 0 1-.45 1-1s-.45-1-1-1h-2.47v-1.6c1.94-.4 3.76-1.32 5.25-2.65 2.18-1.95 3.48-4.74 3.55-7.75.03-1.3-.23-2.58-.77-3.76zM4.936 8.525c.03-.43.16-.84.38-1.21.22-.37.52-.69.88-.93.36-.24.77-.41 1.2-.5.18-.04.37-.06.55-.06h.02c.98 0 1.95.12 2.89.36l.22.06c.49.13.99.23 1.5.29v7.9c-2.38-.1-4.63-.8-6.53-2.02-.73-.47-1.17-1.28-1.11-2.15.01-.58.01-1.16.01-1.74zm13.11 3.5c-.86 1.83-2.31 3.35-4.14 4.34-1.83 1-3.9 1.38-5.91 1.09V6.44c1.19-.15 2.39-.23 3.6-.23 1.15 0 2.29.07 3.43.21l.16.02c.49.06.97.16 1.43.31.42.14.8.36 1.13.65.33.29.59.65.76 1.05.17.41.26.85.26 1.31-.01 1.76-.26 3.49-.72 5.26z"/>
                                        </svg>
                                        <span>{t.buy_coffee}</span>
                                    </div>
                                </a>
                                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
                                    Support the developer to keep this tool free and ad-light.
                                </p>
                            </div>

                        </div>
                    </div>
                </>
            )}
        </>
    );
};
