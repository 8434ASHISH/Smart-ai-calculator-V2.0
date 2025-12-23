
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useParams, useLocation } from 'react-router-dom';
import { CalculatorMeta, UnitSystem } from './types';
import { CALCULATORS, CATEGORIES } from './constants';
import { translations, Language, useTranslation } from './utils/i18n';
import { CalculatorWrapper } from './components/CalculatorWrapper';
import { Dashboard } from './components/Dashboard';
import { EMICalculator } from './calculators/EMICalculator';
import { BMICalculator } from './calculators/BMICalculator';
import { 
    UnitConverterCalculator, LengthCalculator, WeightCalculator, 
    TimeCalculator as UnitTimeCalc, CurrencyCalculator, SIUnitCalculator 
} from './calculators/UnitConverterCalculator';
import { ROICalculator, GSTCalculator, SIPCalculator, DiscountCalculator, InflationCalculator, SalesTaxCalculator } from './calculators/FinanceCalculators';
import { 
    PercentageCalculator, CompoundInterestCalculator, GPACalculator, StandardDeviationCalculator,
    PercentileCalculator, MeanMedianModeCalculator, DecimalToFractionCalculator, ScientificCalculator,
    AlgebraCalculator, GeometryCalculator, PythagorasCalculator, MatrixCalculator, TrigonometryCalculator,
    CGPACalculator, MarksPercentageCalculator
} from './calculators/MathCalculators';
import { 
    BMRCalculator, BodyFatCalculator, CalorieNeedsCalculator, PregnancyCalculator, 
    MenstruationCalculator, PregnancyWeightGainCalculator, IdealWeightCalculator, IQCalculator,
    BraSizeCalculator, SleepCalculator
} from './calculators/HealthCalculators';
import {
    ConcreteCalculator, TileCalculator, RoofingCalculator, MulchCalculator, GravelCalculator, StairCalculator, BTUCalculator
} from './calculators/ConstructionCalculators';
import {
    DateDiffCalculator, TimeCalculator, IPSubnetCalculator, PasswordGenerator, FuelCostCalculator,
    OhmsLawCalculator, ResistorCalculator, LoveCalculator, HeatIndexCalculator, HyperScientificCalculator,
    AgeCalculator
} from './calculators/MiscCalculators'; 
import { articles } from './data/articles';

// ScrollToTop component ensures navigation always starts at top
const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

// Icons
const FinanceIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
const MathIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>;
const HealthIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>;
const UnitIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>;
const ConstructIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>;
const MiscIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg>;

const getCategoryIcon = (id: string) => {
    switch(id) {
        case 'finance': return <FinanceIcon />;
        case 'mathematics': return <MathIcon />;
        case 'health': return <HealthIcon />;
        case 'unit-converter': return <UnitIcon />;
        case 'construction': return <ConstructIcon />;
        default: return <MiscIcon />;
    }
}

const CalculatorCard: React.FC<{ calc: CalculatorMeta }> = ({ calc }) => (
    <Link to={calc.path} className="group bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-slate-700 hover:border-primary/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110">
             {getCategoryIcon(calc.category)}
        </div>
        <div className="relative z-10">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-primary transition-colors">{calc.name} Calculator</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">{calc.description}</p>
            <div className="flex items-center text-primary text-sm font-semibold">
                Launch Tool
                <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </div>
        </div>
    </Link>
);

const Header = ({ lang, setLang, darkMode, setDarkMode }: any) => {
  const t = useTranslation(lang);
  const [search, setSearch] = useState('');

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm border-b dark:border-slate-800 transition-all">
      <div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 group">
           <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
               <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
           </div>
           <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 dark:from-blue-400 dark:to-blue-200">SmartAiCalc</span>
        </Link>
        
        <div className="flex-1 mx-4 max-w-md hidden md:block relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input 
              type="text" 
              placeholder={t.search_placeholder}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-slate-900 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <div className="absolute mt-2 w-full max-w-md bg-white dark:bg-slate-800 shadow-xl rounded-xl overflow-hidden border dark:border-slate-700 z-50 max-h-96 overflow-y-auto">
                {CALCULATORS.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).map(c => (
                  <Link key={c.id} to={c.path} className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700 border-b border-gray-100 dark:border-slate-700 last:border-0" onClick={() => setSearch('')}>
                    <div className="font-semibold">{c.name}</div>
                    <div className="text-xs text-gray-500">{c.category}</div>
                  </Link>
                ))}
              </div>
            )}
        </div>
      </div>
    </header>
  );
};

const CategoryNav = () => (
    <nav className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 overflow-x-auto sticky top-[60px] z-30">
        <div className="container mx-auto px-4">
            <div className="flex space-x-2 py-3">
                <Link to="/" className="px-4 py-2 text-sm font-medium rounded-full bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-primary hover:text-white transition-colors whitespace-nowrap">All</Link>
                {CATEGORIES.map(cat => (
                    <Link 
                        key={cat.id} 
                        to={`/${cat.id}`} 
                        className="flex items-center px-4 py-2 text-sm font-medium rounded-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 hover:border-primary hover:text-primary transition-all whitespace-nowrap"
                    >
                        <span className="mr-2 opacity-70">{getCategoryIcon(cat.id)}</span>
                        {cat.name}
                    </Link>
                ))}
            </div>
        </div>
    </nav>
);

const Footer = ({ lang }: { lang: Language }) => {
  const t = useTranslation(lang);
  return (
    <footer className="bg-slate-900 text-slate-300 py-16 mt-20 border-t border-slate-800">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
        <div className="space-y-4">
          <h3 className="text-white text-2xl font-bold flex items-center justify-center md:justify-start gap-2">
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
            SmartAiCalc
          </h3>
          <p className="text-slate-400 leading-relaxed text-sm">
            Professional calculations for Finance, Engineering, and Health. Bookmark us for instant access.
          </p>
        </div>
        <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Tools</h4>
            <ul className="space-y-2 text-sm">
                <li><Link to="/finance" className="hover:text-primary transition-colors">Finance</Link></li>
                <li><Link to="/mathematics" className="hover:text-primary transition-colors">Mathematics</Link></li>
                <li><Link to="/miscellaneous/hyper-scientific" className="hover:text-primary transition-colors font-bold">Hyper Scientific</Link></li>
            </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4 text-lg">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
          </ul>
        </div>
        <div>
           <h4 className="text-white font-semibold mb-4 text-lg">Support</h4>
           <p className="text-xs mb-4 text-slate-400">Help us grow by sharing this tool with others.</p>
           <button className="bg-primary hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors w-full">Feedback</button>
        </div>
      </div>
      <div className="text-center mt-12 border-t border-slate-800 pt-8 text-slate-500 text-xs">
        {t.footer_text}
      </div>
    </footer>
  );
};

const Home = ({ lang }: { lang: Language }) => {
  const { category } = useParams();
  
  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-screen">
        <CategoryNav />
        {!category && (
            <div className="relative overflow-hidden bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
                <div className="container mx-auto px-4 py-12 md:py-20 relative z-10 text-center">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-slate-900 dark:text-white">
                        Smart <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">AI Calc</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                        Precision engineering and financial tools for professionals. Fast, free, and secure.
                    </p>
                    <div className="max-w-2xl mx-auto">
                        <ScientificCalculator inline={true} lang={lang} />
                    </div>
                </div>
            </div>
        )}

        <div className="container mx-auto px-4 py-12">
            {category ? (
                 <section>
                    <div className="flex items-center space-x-4 mb-8">
                        <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
                             {getCategoryIcon(category)}
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white capitalize">{CATEGORIES.find(c => c.id === category)?.name}</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {CALCULATORS.filter(c => c.category === category).map(calc => (
                             <CalculatorCard key={calc.id} calc={calc} />
                        ))}
                    </div>
                 </section>
            ) : (
                <div className="space-y-16">
                    {CATEGORIES.map(cat => {
                        const catCalcs = CALCULATORS.filter(c => c.category === cat.id);
                        if (catCalcs.length === 0) return null;
                        return (
                            <section key={cat.id} id={cat.id} className="scroll-mt-24">
                                <div className="flex items-center justify-between mb-6 border-b border-gray-100 dark:border-slate-800 pb-4">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-primary opacity-80">{getCategoryIcon(cat.id)}</span>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{cat.name}</h2>
                                    </div>
                                    <Link to={`/${cat.id}`} className="text-sm font-semibold text-primary hover:text-blue-700 flex items-center">
                                        View All
                                    </Link>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {catCalcs.map(calc => (
                                        <CalculatorCard key={calc.id} calc={calc} />
                                    ))}
                                </div>
                            </section>
                        )
                    })}
                </div>
            )}
        </div>
    </div>
  );
};

const CalculatorPage = ({ lang }: { lang: Language }) => {
  const { category, id } = useParams();
  const t = useTranslation(lang);
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');
  
  const meta = CALCULATORS.find(c => c.id === id);
  const article = articles[id || ''] || { title: `${meta?.name} Calculator`, intro: 'Professional analysis tool.', sections: [], faq: [] };

  if (!meta) return <div className="container mx-auto p-8 text-center">Not found</div>;

  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-screen">
        <CategoryNav />
        <div className="container mx-auto px-4 py-8">
            <nav className="text-sm text-gray-500 mb-8 flex items-center space-x-2">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <span>/</span>
                <span className="font-bold text-gray-800 dark:text-gray-200">{meta.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                <div className="lg:col-span-8 space-y-8">
                    <header>
                        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">{article.title}</h1>
                        <p className="text-lg text-slate-600 dark:text-slate-300 border-l-4 border-primary pl-4">{article.intro}</p>
                    </header>

                    {/* KEY={ID} FORCES COMPONENT RESET ON NAVIGATION */}
                    <CalculatorWrapper key={id} lang={lang}>
                        {(onCalculate) => {
                            if (id === 'hyper-scientific') return <HyperScientificCalculator onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;
                            if (id === 'age') return <AgeCalculator onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;
                            
                            // Generic Finance Mapping
                            if (['loan', 'car-loan', 'auto-loan', 'mortgage', 'emi', 'investment', 'amortization', 'saving'].includes(id || '')) {
                                return <EMICalculator onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;
                            }
                            if (id === 'roi') return <ROICalculator onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;
                            if (id === 'gst') return <GSTCalculator onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;
                            if (id === 'sip') return <SIPCalculator onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;
                            if (id === 'discount') return <DiscountCalculator onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;
                            if (id === 'inflation') return <InflationCalculator onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;
                            if (id === 'sales-tax') return <SalesTaxCalculator onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;

                            // Math
                            if (id === 'scientific') return <ScientificCalculator onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;
                            if (id === 'percentage') return <PercentageCalculator onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;
                            if (id === 'compound-interest') return <CompoundInterestCalculator onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;
                            if (id === 'gpa') return <GPACalculator onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;
                            if (id === 'standard-deviation') return <StandardDeviationCalculator onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;
                            if (id === 'percentile') return <PercentileCalculator onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;
                            if (id === 'mean-median-mode') return <MeanMedianModeCalculator onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;
                            if (id === 'decimal-fraction') return <DecimalToFractionCalculator onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;
                            if (id === 'algebra') return <AlgebraCalculator onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;
                            if (id === 'geometry') return <GeometryCalculator onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;
                            if (id === 'pythagoras') return <PythagorasCalculator onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;
                            if (id === 'matrix') return <MatrixCalculator onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;
                            if (id === 'trigonometry') return <TrigonometryCalculator onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;
                            if (id === 'cgpa') return <CGPACalculator onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;
                            if (id === 'marks-percentage') return <MarksPercentageCalculator onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;

                            // Health
                            if (id === 'bmi') return <BMICalculator onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;
                            if (id === 'bmr') return <BMRCalculator onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;
                            if (id === 'body-fat') return <BodyFatCalculator onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;
                            if (id === 'calories') return <CalorieNeedsCalculator onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;
                            if (id === 'pregnancy') return <PregnancyCalculator onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;
                            if (id === 'menstruation') return <MenstruationCalculator onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;
                            if (id === 'pregnancy-weight-gain') return <PregnancyWeightGainCalculator onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;
                            if (id === 'ideal-weight') return <IdealWeightCalculator onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;
                            if (id === 'iq') return <IQCalculator onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;
                            if (id === 'bra-size') return <BraSizeCalculator onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;
                            if (id === 'sleep') return <SleepCalculator onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;

                            // Unit Converter
                            if (id === 'length-converter') return <LengthCalculator onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;
                            if (id === 'weight-converter') return <WeightCalculator onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;
                            if (id === 'time-converter') return <UnitTimeCalc onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;
                            if (id === 'currency-converter') return <CurrencyCalculator onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;
                            if (id === 'si-unit-converter') return <SIUnitCalculator onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;

                            // Construction
                            if (id === 'concrete') return <ConcreteCalculator onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;
                            if (id === 'tile') return <TileCalculator onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;
                            if (id === 'roofing') return <RoofingCalculator onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;
                            if (id === 'mulch') return <MulchCalculator onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;
                            if (id === 'gravel') return <GravelCalculator onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;
                            if (id === 'stair') return <StairCalculator onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;
                            if (id === 'btu') return <BTUCalculator onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;

                            // Misc
                            if (id === 'date-difference') return <DateDiffCalculator onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;
                            if (id === 'time-calculator') return <TimeCalculator onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;
                            if (id === 'ip-subnet') return <IPSubnetCalculator onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;
                            if (id === 'password-generator') return <PasswordGenerator onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;
                            if (id === 'fuel-cost' || id === 'gas-mileage') return <FuelCostCalculator onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;
                            if (id === 'ohms-law') return <OhmsLawCalculator onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;
                            if (id === 'resistor') return <ResistorCalculator onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;
                            if (id === 'love') return <LoveCalculator onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;
                            if (id === 'heat-index' || id === 'wind-chill') return <HeatIndexCalculator onCalculate={onCalculate} unitSystem={unitSystem} lang={lang} />;

                            return <div className="p-8 text-center text-gray-400">Calculator under maintenance...</div>;
                        }}
                    </CalculatorWrapper>

                    {/* Article / FAQ Section */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-slate-700 space-y-10">
                        {article.sections.map((section, idx) => (
                            <section key={idx} className="space-y-4">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white border-b-2 border-primary/20 pb-2">{section.heading}</h2>
                                <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {section.content}
                                </div>
                            </section>
                        ))}
                        
                        {article.faq.length > 0 && (
                            <section className="space-y-6 pt-6 border-t dark:border-slate-700">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
                                <div className="space-y-4">
                                    {article.faq.map((item, idx) => (
                                        <details key={idx} className="group border rounded-xl p-4 bg-gray-50 dark:bg-slate-900/50">
                                            <summary className="font-bold cursor-pointer list-none flex justify-between items-center text-gray-800 dark:text-gray-200">
                                                {item.question}
                                                <span className="transition-transform group-open:rotate-180">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                                </span>
                                            </summary>
                                            <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{item.answer}</p>
                                        </details>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>

                <aside className="lg:col-span-4 space-y-8">
                    <div className="sticky top-24 space-y-8">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow border dark:border-slate-700">
                            <h3 className="font-bold mb-4">Related Tools</h3>
                            <ul className="space-y-3 text-sm">
                                {CALCULATORS.filter(c => c.category === meta.category && c.id !== meta.id).slice(0, 8).map(c => (
                                <li key={c.id}><Link to={c.path} className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary transition-colors p-2 rounded hover:bg-gray-50 dark:hover:bg-slate-700">
                                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                                    {c.name}
                                </Link></li>
                                ))}
                            </ul>
                        </div>
                        <div className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl text-white shadow-xl">
                             <h4 className="font-bold text-lg mb-2">Pro Tool Tip</h4>
                             <p className="text-sm opacity-90 leading-relaxed">Save your result as a PNG to keep track of your calculations for future records.</p>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    </div>
  );
};

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (darkMode) { document.documentElement.classList.add('dark'); localStorage.setItem('theme', 'dark'); }
    else { document.documentElement.classList.remove('dark'); localStorage.setItem('theme', 'light'); }
  }, [darkMode]);

  return (
    <HashRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 transition-colors">
        <Header lang={lang} setLang={setLang} darkMode={darkMode} setDarkMode={setDarkMode} />
        <Dashboard lang={lang} setLang={setLang} darkMode={darkMode} setDarkMode={setDarkMode} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home lang={lang} />} />
            <Route path="/:category" element={<Home lang={lang} />} /> 
            <Route path="/:category/:id" element={<CalculatorPage lang={lang} />} />
          </Routes>
        </main>
        <Footer lang={lang} />
      </div>
    </HashRouter>
  );
}
