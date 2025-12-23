
import React, { useState } from 'react';
import { CalculatorProps } from '../types';
import { useTranslation, Language } from '../utils/i18n';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface Props extends CalculatorProps {
  lang: Language;
}

export const EMICalculator: React.FC<Props> = ({ onCalculate, unitSystem, lang }) => {
  const t = useTranslation(lang);
  const [amount, setAmount] = useState<number>(100000);
  const [rate, setRate] = useState<number>(10);
  const [tenure, setTenure] = useState<number>(12); // months

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();
    
    const monthlyRate = rate / 12 / 100;
    const emi = (amount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1);
    const totalPayment = emi * tenure;
    const totalInterest = totalPayment - amount;

    const data = [
      { name: 'Principal Amount', value: amount },
      { name: 'Total Interest', value: totalInterest },
    ];
    const COLORS = ['#3B82F6', '#F59E0B'];

    const currencySymbol = (lang === 'hi' || lang === 'bn' || lang === 'ur') ? '₹' : (lang === 'fr' || lang === 'es') ? '€' : (lang === 'ja' ? '¥' : '$');

    onCalculate(
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-white dark:bg-slate-700 rounded-lg shadow border-t-4 border-primary">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Monthly EMI</p>
            <p className="text-2xl md:text-3xl font-bold text-primary">{currencySymbol}{emi.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </div>
          <div className="p-4 bg-white dark:bg-slate-700 rounded-lg shadow border-t-4 border-yellow-500">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Interest</p>
            <p className="text-xl font-semibold text-yellow-600 dark:text-yellow-400">{currencySymbol}{totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </div>
          <div className="p-4 bg-white dark:bg-slate-700 rounded-lg shadow border-t-4 border-green-500">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Payment</p>
            <p className="text-xl font-semibold text-green-600 dark:text-green-400">{currencySymbol}{totalPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </div>
        </div>
        
        <div className="h-72 w-full bg-gray-50 dark:bg-slate-800/50 rounded-xl p-4">
           <h4 className="text-center text-sm font-semibold mb-2 text-gray-600 dark:text-gray-300">Principal vs Interest Breakdown</h4>
           <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `${currencySymbol}${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-slate-700">
             <h4 className="font-bold text-gray-800 dark:text-white mb-2">Calculation Method</h4>
             <div className="bg-gray-100 dark:bg-slate-800 p-4 rounded-lg text-sm text-gray-700 dark:text-gray-300 font-mono">
                 E = P × r × (1 + r)^n / ((1 + r)^n - 1)
             </div>
             <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                 <li><strong>P (Principal):</strong> {amount}</li>
                 <li><strong>r (Monthly Rate):</strong> {rate}% / 12 = {(rate/12).toFixed(4)}%</li>
                 <li><strong>n (Months):</strong> {tenure}</li>
             </ul>
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={calculate} className="space-y-6">
      <div className="space-y-2">
        <label className="flex justify-between text-sm font-medium">
            <span>Loan Amount</span>
            <span className="text-primary font-bold">{(lang === 'hi' || lang === 'bn' || lang === 'ur') ? '₹' : (lang === 'fr' || lang === 'es') ? '€' : (lang === 'ja' ? '¥' : '$')}{amount.toLocaleString()}</span>
        </label>
        <input 
          type="range" 
          min="1000" 
          max="10000000" 
          step="1000" 
          value={amount} 
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <input 
          type="number" 
          value={amount} 
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full p-2 text-sm border rounded dark:bg-slate-700 dark:border-slate-600"
        />
      </div>

      <div className="space-y-2">
        <label className="flex justify-between text-sm font-medium">
            <span>Interest Rate (% p.a)</span>
            <span className="text-primary font-bold">{rate}%</span>
        </label>
         <input 
          type="range" 
          min="1" 
          max="30" 
          step="0.1" 
          value={rate} 
          onChange={(e) => setRate(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <input 
          type="number" 
          value={rate} 
          onChange={(e) => setRate(Number(e.target.value))}
          className="w-full p-2 text-sm border rounded dark:bg-slate-700 dark:border-slate-600"
          step="0.1"
        />
      </div>

      <div className="space-y-2">
        <label className="flex justify-between text-sm font-medium">
            <span>Tenure (Months)</span>
            <span className="text-primary font-bold">{tenure} Months ({Math.floor(tenure/12)} Y {tenure%12} M)</span>
        </label>
         <input 
          type="range" 
          min="6" 
          max="360" 
          step="6" 
          value={tenure} 
          onChange={(e) => setTenure(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
        />
         <input 
          type="number" 
          value={tenure} 
          onChange={(e) => setTenure(Number(e.target.value))}
          className="w-full p-2 text-sm border rounded dark:bg-slate-700 dark:border-slate-600"
        />
      </div>

      <button type="submit" className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transform transition hover:-translate-y-1">
        {t.calculate_btn}
      </button>
    </form>
  );
};
