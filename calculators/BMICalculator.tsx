import React, { useState } from 'react';
import { CalculatorProps } from '../types';
import { useTranslation, Language } from '../utils/i18n';

interface Props extends CalculatorProps {
  lang: Language;
}

export const BMICalculator: React.FC<Props> = ({ onCalculate, unitSystem, lang }) => {
  const t = useTranslation(lang);
  const [weight, setWeight] = useState<number>(70); // kg or lbs
  const [height, setHeight] = useState<number>(170); // cm or inches

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();
    
    let bmiValue = 0;
    if (unitSystem === 'metric') {
      // kg / m^2
      bmiValue = weight / Math.pow(height / 100, 2);
    } else {
      // 703 * lbs / in^2
      bmiValue = 703 * weight / Math.pow(height, 2);
    }

    let category = '';
    let colorClass = '';
    if (bmiValue < 18.5) { category = 'Underweight'; colorClass = 'text-blue-500'; }
    else if (bmiValue < 25) { category = 'Normal weight'; colorClass = 'text-green-500'; }
    else if (bmiValue < 30) { category = 'Overweight'; colorClass = 'text-orange-500'; }
    else { category = 'Obese'; colorClass = 'text-red-500'; }

    onCalculate(
      <div className="text-center space-y-4">
        <div className="text-4xl font-bold text-gray-800 dark:text-white">
          BMI: {bmiValue.toFixed(1)}
        </div>
        <div className={`text-xl font-semibold ${colorClass}`}>
          {category}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 mt-4 dark:bg-gray-700">
          <div 
            className="bg-gradient-to-r from-blue-400 via-green-400 to-red-500 h-4 rounded-full" 
            style={{ width: '100%' }}
          >
             <div 
                className="w-1 h-6 bg-black dark:bg-white -mt-1 absolute transition-all duration-500"
                style={{ left: `${Math.min(Math.max((bmiValue / 40) * 100, 0), 100)}%` }} 
             />
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">Scale: 0 - 40+</p>
      </div>
    );
  };

  return (
    <form onSubmit={calculate} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
            Weight ({unitSystem === 'metric' ? 'kg' : 'lbs'})
        </label>
        <input 
          type="number" 
          value={weight} 
          onChange={(e) => setWeight(Number(e.target.value))}
          className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
            Height ({unitSystem === 'metric' ? 'cm' : 'inches'})
        </label>
        <input 
          type="number" 
          value={height} 
          onChange={(e) => setHeight(Number(e.target.value))}
          className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600"
        />
      </div>

      <button type="submit" className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3 rounded transition-colors">
        {t.calculate_btn}
      </button>
    </form>
  );
};
