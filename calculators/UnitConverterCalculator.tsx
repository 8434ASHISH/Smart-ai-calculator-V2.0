
import React, { useState, useEffect } from 'react';
import { CalculatorProps } from '../types';
import { useTranslation, Language } from '../utils/i18n';
import { CURRENCY_RATES } from '../constants';

interface Props extends CalculatorProps {
  lang: Language;
}

// --- Data Definitions ---

// Conversion Factors relative to Base unit
const LENGTH_UNITS: Record<string, number> = {
    // Base: meter
    'Meter (m)': 1,
    'Kilometer (km)': 1000,
    'Centimeter (cm)': 0.01,
    'Millimeter (mm)': 0.001,
    'Micrometer (µm)': 0.000001,
    'Nanometer (nm)': 0.000000001,
    'Mile (mi)': 1609.344,
    'Yard (yd)': 0.9144,
    'Foot (ft)': 0.3048,
    'Inch (in)': 0.0254,
    'Nautical Mile': 1852
};

const WEIGHT_UNITS: Record<string, number> = {
    // Base: kilogram
    'Kilogram (kg)': 1,
    'Gram (g)': 0.001,
    'Milligram (mg)': 0.000001,
    'Metric Ton (t)': 1000,
    'Pound (lbs)': 0.45359237,
    'Ounce (oz)': 0.0283495231,
    'Stone (st)': 6.35029318,
    'Carat': 0.0002
};

const TIME_UNITS: Record<string, number> = {
    // Base: second
    'Second (s)': 1,
    'Millisecond (ms)': 0.001,
    'Microsecond (µs)': 0.000001,
    'Minute (min)': 60,
    'Hour (h)': 3600,
    'Day (d)': 86400,
    'Week (wk)': 604800,
    'Month (avg)': 2628000, // 30.44 days
    'Year (y)': 31536000 // 365 days
};

// SI Types
const SI_DATA = {
    Energy: {
        // Base: Joule
        'Joule (J)': 1,
        'Kilojoule (kJ)': 1000,
        'Gram Calorie': 4.184,
        'Kilo Calorie (kcal)': 4184,
        'Watt Hour (Wh)': 3600,
        'Kilowatt Hour (kWh)': 3600000,
        'Electronvolt (eV)': 1.60218e-19,
        'British Thermal Unit (BTU)': 1055.06
    },
    Power: {
        // Base: Watt
        'Watt (W)': 1,
        'Kilowatt (kW)': 1000,
        'Megawatt (MW)': 1000000,
        'Horsepower (hp, metric)': 735.499,
        'Horsepower (hp, mechanical)': 745.7
    },
    Pressure: {
        // Base: Pascal
        'Pascal (Pa)': 1,
        'Kilopascal (kPa)': 1000,
        'Bar': 100000,
        'PSI (lbf/in²)': 6894.76,
        'Standard Atmosphere (atm)': 101325,
        'Torr': 133.322
    },
    Speed: {
        // Base: m/s
        'Meter per second (m/s)': 1,
        'Kilometer per hour (km/h)': 0.277778,
        'Mile per hour (mph)': 0.44704,
        'Knot (kn)': 0.514444,
        'Speed of Light (c)': 299792458
    },
    Area: {
        // Base: sq meter
        'Square Meter (m²)': 1,
        'Square Kilometer (km²)': 1000000,
        'Square Foot (ft²)': 0.092903,
        'Square Inch (in²)': 0.00064516,
        'Acre': 4046.86,
        'Hectare': 10000
    },
    Volume: {
        // Base: Liter
        'Liter (L)': 1,
        'Milliliter (mL)': 0.001,
        'Cubic Meter (m³)': 1000,
        'Gallon (US)': 3.78541,
        'Gallon (UK)': 4.54609,
        'Fluid Ounce (US)': 0.0295735,
        'Cup (US)': 0.236588
    }
};

// --- Generic Component ---

interface GenericConverterProps extends Props {
    title: string;
    units: Record<string, number>;
}

const GenericUnitConverter: React.FC<GenericConverterProps> = ({ onCalculate, units }) => {
    const unitKeys = Object.keys(units);
    const [val, setVal] = useState<number>(1);
    const [from, setFrom] = useState<string>(unitKeys[0]);
    const [to, setTo] = useState<string>(unitKeys[1] || unitKeys[0]);

    const calculate = (e: React.FormEvent) => {
        e.preventDefault();
        // Convert 'from' to Base
        const baseVal = val * units[from];
        // Convert Base to 'to'
        const result = baseVal / units[to];

        // Format result: if very small or very large, use scientific notation, else generic
        let displayRes = result.toString();
        if (result !== 0 && (Math.abs(result) < 0.0001 || Math.abs(result) > 10000000)) {
            displayRes = result.toExponential(4);
        } else {
            displayRes = parseFloat(result.toFixed(6)).toString(); // Remove trailing zeros
        }

        onCalculate(
            <div className="text-center space-y-2">
                <p className="text-lg text-gray-500">{val} {from} =</p>
                <p className="text-4xl font-bold text-primary break-all">{displayRes}</p>
                <p className="text-lg text-gray-500">{to}</p>
            </div>
        );
    };

    return (
        <form onSubmit={calculate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">From</label>
                    <input 
                        type="number" 
                        value={val} 
                        onChange={e => setVal(Number(e.target.value))} 
                        className="w-full p-3 border rounded-xl dark:bg-slate-700 dark:border-slate-600 text-lg shadow-sm" 
                    />
                    <select 
                        value={from} 
                        onChange={e => setFrom(e.target.value)} 
                        className="w-full p-3 border rounded-xl dark:bg-slate-700 dark:border-slate-600 bg-gray-50 dark:bg-slate-800"
                    >
                        {unitKeys.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">To</label>
                    <div className="p-3 bg-gray-100 dark:bg-slate-800 rounded-xl text-lg text-gray-500 mb-2 truncate border border-transparent">
                        ?
                    </div>
                    <select 
                        value={to} 
                        onChange={e => setTo(e.target.value)} 
                        className="w-full p-3 border rounded-xl dark:bg-slate-700 dark:border-slate-600 bg-gray-50 dark:bg-slate-800"
                    >
                        {unitKeys.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                </div>
            </div>
            <button type="submit" className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-95">
                Convert
            </button>
        </form>
    );
};

// --- Exported Components ---

export const LengthCalculator: React.FC<Props> = (props) => <GenericUnitConverter {...props} title="Length" units={LENGTH_UNITS} />;
export const WeightCalculator: React.FC<Props> = (props) => <GenericUnitConverter {...props} title="Weight" units={WEIGHT_UNITS} />;
export const TimeCalculator: React.FC<Props> = (props) => <GenericUnitConverter {...props} title="Time" units={TIME_UNITS} />;

export const SIUnitCalculator: React.FC<Props> = (props) => {
    const [category, setCategory] = useState<keyof typeof SI_DATA>('Energy');
    
    return (
        <div className="space-y-6">
            <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-hide">
                {Object.keys(SI_DATA).map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setCategory(cat as any)}
                        className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                            category === cat 
                            ? 'bg-primary text-white shadow-md' 
                            : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-50'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
            <GenericUnitConverter {...props} title={category} units={SI_DATA[category]} />
        </div>
    );
};

export const CurrencyCalculator: React.FC<Props> = ({ onCalculate }) => {
    const [amount, setAmount] = useState(1);
    const [from, setFrom] = useState('USD');
    const [to, setTo] = useState('EUR');

    const currencies = Object.keys(CURRENCY_RATES);

    const calculate = (e: React.FormEvent) => {
        e.preventDefault();
        // Convert to USD base then to target
        const fromRate = CURRENCY_RATES[from].rateToUSD; // 1 Unit = X USD
        const toRate = CURRENCY_RATES[to].rateToUSD;
        
        // Value in USD = amount * fromRate
        // Value in Target = (amount * fromRate) / toRate
        const res = (amount * fromRate) / toRate;
        
        onCalculate(
            <div className="text-center space-y-2">
                 <p className="text-lg text-gray-500">{CURRENCY_RATES[from].symbol}{amount} {from} =</p>
                 <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                    {CURRENCY_RATES[to].symbol}{res.toFixed(2)}
                 </p>
                 <p className="text-lg text-gray-500">{to}</p>
                 <p className="text-xs text-gray-400 mt-2">Rates are approximate and for reference only.</p>
            </div>
        );
    };

    return (
        <form onSubmit={calculate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                     <label className="block text-sm font-medium mb-1">Amount</label>
                     <input 
                        type="number" 
                        value={amount} 
                        onChange={e => setAmount(Number(e.target.value))} 
                        className="w-full p-3 border rounded-xl dark:bg-slate-700 dark:border-slate-600" 
                     />
                </div>
                <div>
                     <label className="block text-sm font-medium mb-1">From</label>
                     <select 
                        value={from} 
                        onChange={e => setFrom(e.target.value)} 
                        className="w-full p-3 border rounded-xl dark:bg-slate-700 dark:border-slate-600"
                     >
                        {currencies.map(c => <option key={c} value={c}>{c} ({CURRENCY_RATES[c].symbol})</option>)}
                     </select>
                </div>
                <div>
                     <label className="block text-sm font-medium mb-1">To</label>
                     <select 
                        value={to} 
                        onChange={e => setTo(e.target.value)} 
                        className="w-full p-3 border rounded-xl dark:bg-slate-700 dark:border-slate-600"
                     >
                        {currencies.map(c => <option key={c} value={c}>{c} ({CURRENCY_RATES[c].symbol})</option>)}
                     </select>
                </div>
            </div>
            <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg">
                Convert Currency
            </button>
        </form>
    );
};

// Default export for generic catch-all if needed, though specific are preferred
export const UnitConverterCalculator: React.FC<Props> = (props) => <LengthCalculator {...props} />;
