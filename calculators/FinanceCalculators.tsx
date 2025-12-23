
import React, { useState } from 'react';
import { CalculatorProps } from '../types';
import { useTranslation, Language } from '../utils/i18n';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

interface GenericFinanceProps extends CalculatorProps {
  lang: Language;
}

const getSymbol = (lang: string) => (lang === 'hi' || lang === 'bn' || lang === 'ur') ? '₹' : (lang === 'fr' || lang === 'es') ? '€' : (lang === 'ja' ? '¥' : '$');
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

const SummaryCard = ({ label, value, colorClass }: { label: string, value: string, colorClass: string }) => (
    <div className={`p-4 rounded-lg bg-white dark:bg-slate-700 shadow border-l-4 ${colorClass}`}>
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">{label}</p>
        <p className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
    </div>
);

const FinanceDetail = ({ formula, note }: { formula: string, note?: string }) => (
    <div className="mt-4 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg text-sm border border-gray-100 dark:border-slate-700">
        <strong>Formula:</strong> <span className="font-mono text-primary ml-1">{formula}</span>
        {note && <p className="mt-1 text-gray-500">{note}</p>}
    </div>
);

// --- ROI Calculator ---
export const ROICalculator: React.FC<GenericFinanceProps> = ({ onCalculate, lang }) => {
  const t = useTranslation(lang);
  const [invested, setInvested] = useState(1000);
  const [returned, setReturned] = useState(1200);

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();
    const profit = returned - invested;
    const roi = (profit / invested) * 100;
    const symbol = getSymbol(lang);
    
    const data = [
        { name: 'Invested', value: invested },
        { name: 'Profit', value: profit > 0 ? profit : 0 }
    ];

    onCalculate(
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
            <SummaryCard label="Total Profit" value={`${symbol}${profit.toFixed(2)}`} colorClass="border-green-500" />
            <SummaryCard label="ROI" value={`${roi.toFixed(2)}%`} colorClass={roi >= 0 ? "border-blue-500" : "border-red-500"} />
        </div>
        <div className="h-64 w-full bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
            <p className="text-center text-sm font-semibold mb-2">Investment Breakdown</p>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        <Cell fill="#94a3b8" />
                        <Cell fill={profit >= 0 ? "#10b981" : "#ef4444"} />
                    </Pie>
                    <Tooltip formatter={(value: number) => `${symbol}${value.toFixed(0)}`} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
        <FinanceDetail formula="ROI = ((Return - Investment) / Investment) × 100" />
      </div>
    );
  };

  return (
    <form onSubmit={calculate} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">{t.label_initial} ({getSymbol(lang)})</label>
        <input type="number" value={invested} onChange={e => setInvested(Number(e.target.value))} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">{t.result_total_value} ({getSymbol(lang)})</label>
        <input type="number" value={returned} onChange={e => setReturned(Number(e.target.value))} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
      </div>
      <button type="submit" className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3 rounded shadow-lg transform transition hover:-translate-y-0.5">{t.calculate_btn}</button>
    </form>
  );
};

// --- GST Calculator ---
export const GSTCalculator: React.FC<GenericFinanceProps> = ({ onCalculate, lang }) => {
  const t = useTranslation(lang);
  const [amount, setAmount] = useState(1000);
  const [rate, setRate] = useState(18);
  const [type, setType] = useState<'exclusive'|'inclusive'>('exclusive');

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();
    let tax = 0;
    let total = 0;
    let net = 0;

    if (type === 'exclusive') {
        tax = (amount * rate) / 100;
        total = amount + tax;
        net = amount;
    } else {
        net = amount * (100 / (100 + rate));
        tax = amount - net;
        total = amount;
    }

    const symbol = getSymbol(lang);
    const data = [
        { name: 'Net Price', value: net },
        { name: 'GST', value: tax }
    ];

    onCalculate(
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SummaryCard label="Net Price" value={`${symbol}${net.toFixed(2)}`} colorClass="border-gray-400" />
            <SummaryCard label="GST Amount" value={`${symbol}${tax.toFixed(2)}`} colorClass="border-orange-500" />
            <SummaryCard label="Total" value={`${symbol}${total.toFixed(2)}`} colorClass="border-primary" />
        </div>
        <div className="h-64 w-full bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={data} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                        <Cell fill="#3b82f6" />
                        <Cell fill="#f97316" />
                    </Pie>
                    <Tooltip formatter={(value: number) => `${symbol}${value.toFixed(2)}`} />
                    <Legend />
                </PieChart>
             </ResponsiveContainer>
        </div>
        <FinanceDetail 
            formula={type === 'exclusive' ? 'Tax = Amount × (Rate/100)' : 'Tax = Amount - (Amount × (100 / (100 + Rate)))'} 
            note={`Calculation Mode: ${type === 'exclusive' ? 'GST Exclusive (Added to amount)' : 'GST Inclusive (Extracted from amount)'}`}
        />
      </div>
    );
  };

  return (
    <form onSubmit={calculate} className="space-y-4">
      <div className="flex space-x-4 mb-2">
          <label className="flex items-center space-x-2 cursor-pointer">
              <input type="radio" checked={type === 'exclusive'} onChange={() => setType('exclusive')} className="text-primary focus:ring-primary" />
              <span>GST Exclusive (Add GST)</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
              <input type="radio" checked={type === 'inclusive'} onChange={() => setType('inclusive')} className="text-primary focus:ring-primary" />
              <span>GST Inclusive (Remove GST)</span>
          </label>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">{t.label_amount} ({getSymbol(lang)})</label>
        <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">{t.label_tax_rate}</label>
        <select value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600">
          <option value="5">5%</option>
          <option value="12">12%</option>
          <option value="18">18%</option>
          <option value="28">28%</option>
          <option value="10">10%</option>
          <option value="0">0% (Exempt)</option>
        </select>
      </div>
      <button type="submit" className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3 rounded shadow-lg">{t.calculate_btn}</button>
    </form>
  );
};

// --- SIP Calculator ---
export const SIPCalculator: React.FC<GenericFinanceProps> = ({ onCalculate, lang }) => {
  const t = useTranslation(lang);
  const [monthly, setMonthly] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();
    const i = rate / 12 / 100;
    const n = years * 12;
    const totalValue = monthly * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const invested = monthly * n;
    const returns = totalValue - invested;
    const symbol = getSymbol(lang);

    const data = [
      { name: 'Invested', value: invested },
      { name: 'Returns', value: returns },
    ];

    onCalculate(
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
           <SummaryCard label="Invested" value={`${symbol}${invested.toLocaleString()}`} colorClass="border-blue-500" />
           <SummaryCard label="Returns" value={`${symbol}${returns.toLocaleString()}`} colorClass="border-green-500" />
           <SummaryCard label="Total Value" value={`${symbol}${totalValue.toLocaleString()}`} colorClass="border-purple-500" />
        </div>
        <div className="h-64 w-full bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
           <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                <Cell fill="#3b82f6" />
                <Cell fill="#10b981" />
              </Pie>
              <Tooltip formatter={(value: number) => `${symbol}${value.toLocaleString()}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <FinanceDetail formula="M = P × ({[1 + i]^n - 1} / i) × (1 + i)" note="Where P is monthly amount, i is periodic rate, n is total months." />
      </div>
    );
  };

  return (
    <form onSubmit={calculate} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">{t.label_monthly_investment} ({getSymbol(lang)})</label>
        <input type="number" value={monthly} onChange={e => setMonthly(Number(e.target.value))} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
        <input type="range" min="500" max="100000" step="500" value={monthly} onChange={e => setMonthly(Number(e.target.value))} className="w-full mt-2 accent-primary" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">{t.label_rate} (Annual %)</label>
        <input type="number" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" step="0.1" />
        <input type="range" min="1" max="30" step="0.5" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full mt-2 accent-primary" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">{t.label_period}</label>
        <input type="number" value={years} onChange={e => setYears(Number(e.target.value))} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
        <input type="range" min="1" max="40" step="1" value={years} onChange={e => setYears(Number(e.target.value))} className="w-full mt-2 accent-primary" />
      </div>
      <button type="submit" className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3 rounded shadow-lg">{t.calculate_btn}</button>
    </form>
  );
};

// --- Discount Calculator ---
export const DiscountCalculator: React.FC<GenericFinanceProps> = ({ onCalculate, lang }) => {
  const t = useTranslation(lang);
  const [price, setPrice] = useState(100);
  const [discount, setDiscount] = useState(20);

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();
    const saved = (price * discount) / 100;
    const final = price - saved;
    const symbol = getSymbol(lang);
    
    const data = [
        { name: 'You Pay', value: final },
        { name: 'You Save', value: saved }
    ];

    onCalculate(
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 text-center">
            <SummaryCard label="Payable" value={`${symbol}${final.toFixed(2)}`} colorClass="border-primary" />
            <SummaryCard label="Saved" value={`${symbol}${saved.toFixed(2)}`} colorClass="border-green-500" />
        </div>
        <div className="h-64 w-full bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={data} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                        <Cell fill="#3b82f6" />
                        <Cell fill="#10b981" />
                    </Pie>
                    <Tooltip formatter={(value: number) => `${symbol}${value.toFixed(2)}`} />
                    <Legend />
                </PieChart>
             </ResponsiveContainer>
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={calculate} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">{t.label_original_price} ({getSymbol(lang)})</label>
        <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Discount (%)</label>
        <input type="number" value={discount} onChange={e => setDiscount(Number(e.target.value))} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
        <input type="range" min="0" max="99" step="1" value={discount} onChange={e => setDiscount(Number(e.target.value))} className="w-full mt-2 accent-primary" />
      </div>
      <button type="submit" className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3 rounded shadow-lg">{t.calculate_btn}</button>
    </form>
  );
};

// --- Inflation Calculator ---
export const InflationCalculator: React.FC<GenericFinanceProps> = ({ onCalculate, lang }) => {
  const t = useTranslation(lang);
  const [amount, setAmount] = useState(10000);
  const [rate, setRate] = useState(6);
  const [years, setYears] = useState(10);

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();
    const futureValue = amount * Math.pow(1 + rate / 100, years);
    const symbol = getSymbol(lang);
    
    // Generate data points for graph
    const data = [];
    for(let i=0; i<=years; i++) {
        data.push({
            year: `Year ${i}`,
            value: Number((amount * Math.pow(1 + rate / 100, i)).toFixed(0))
        });
    }

    onCalculate(
      <div className="text-center space-y-6">
         <div className="p-6 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100">
             <p className="text-gray-600 dark:text-gray-300 mb-2">Future Value needed in {years} years:</p>
             <p className="text-4xl font-extrabold text-red-600 dark:text-red-400">{symbol}{futureValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
             <p className="text-sm text-gray-500 mt-2">To match purchasing power of {symbol}{amount} today</p>
         </div>
         
         <div className="h-64 w-full bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
             <p className="text-sm font-semibold mb-4">Cost Escalation Over Time</p>
             <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={data}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} />
                     <XAxis dataKey="year" hide />
                     <YAxis />
                     <Tooltip formatter={(value: number) => `${symbol}${value.toLocaleString()}`} />
                     <Bar dataKey="value" fill="#ef4444" name="Future Cost" radius={[4, 4, 0, 0]} />
                 </BarChart>
             </ResponsiveContainer>
         </div>
         <FinanceDetail formula="FV = PV × (1 + r)^n" />
      </div>
    );
  };

  return (
    <form onSubmit={calculate} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">{t.label_amount} ({getSymbol(lang)})</label>
        <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">{t.label_inflation_rate}</label>
        <input type="number" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" step="0.1" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">{t.label_period}</label>
        <input type="number" value={years} onChange={e => setYears(Number(e.target.value))} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
        <input type="range" min="1" max="50" step="1" value={years} onChange={e => setYears(Number(e.target.value))} className="w-full mt-2 accent-primary" />
      </div>
      <button type="submit" className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3 rounded shadow-lg">{t.calculate_btn}</button>
    </form>
  );
};

// --- Sales Tax Calculator ---
export const SalesTaxCalculator: React.FC<GenericFinanceProps> = ({ onCalculate, lang }) => {
   const t = useTranslation(lang);
   const [amount, setAmount] = useState(100);
   const [taxRate, setTaxRate] = useState(8);

   const calculate = (e: React.FormEvent) => {
     e.preventDefault();
     const tax = (amount * taxRate) / 100;
     const total = amount + tax;
     const symbol = getSymbol(lang);
     
     const data = [
        { name: 'Base Price', value: amount },
        { name: 'Tax', value: tax }
     ];
 
     onCalculate(
       <div className="space-y-6">
         <div className="grid grid-cols-2 gap-4">
            <SummaryCard label="Tax" value={`${symbol}${tax.toFixed(2)}`} colorClass="border-orange-500" />
            <SummaryCard label="Total" value={`${symbol}${total.toFixed(2)}`} colorClass="border-primary" />
         </div>
         <div className="h-64 w-full bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        <Cell fill="#3b82f6" />
                        <Cell fill="#f97316" />
                    </Pie>
                    <Tooltip formatter={(value: number) => `${symbol}${value.toFixed(2)}`} />
                    <Legend />
                </PieChart>
             </ResponsiveContainer>
         </div>
       </div>
     );
   };
 
   return (
     <form onSubmit={calculate} className="space-y-4">
       <div>
         <label className="block text-sm font-medium mb-1">{t.label_amount} ({getSymbol(lang)})</label>
         <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
       </div>
       <div>
         <label className="block text-sm font-medium mb-1">{t.label_tax_rate}</label>
         <input type="number" value={taxRate} onChange={e => setTaxRate(Number(e.target.value))} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" step="0.01" />
       </div>
       <button type="submit" className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3 rounded shadow-lg">{t.calculate_btn}</button>
     </form>
   );
};
