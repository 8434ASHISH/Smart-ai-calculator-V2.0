
import React, { useState } from 'react';
import { CalculatorProps } from '../types';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface HealthProps extends CalculatorProps {
  // Common props if needed
}

// Helper: Input field with Unit conversion logic
const HeightInput = ({ unitSystem, height, setHeight }: any) => {
    const [feet, setFeet] = useState(Math.floor(height / 30.48));
    const [inches, setInches] = useState(Math.round((height % 30.48) / 2.54));

    const updateFromMetric = (cm: number) => {
        setHeight(cm);
        setFeet(Math.floor(cm / 30.48));
        setInches(Math.round((cm % 30.48) / 2.54));
    };

    const updateFromImperial = (f: number, i: number) => {
        setFeet(f);
        setInches(i);
        setHeight((f * 30.48) + (i * 2.54));
    };

    if (unitSystem === 'metric') {
        return (
            <div>
                <label className="block text-sm font-medium mb-1">Height (cm)</label>
                <input type="number" value={Math.round(height)} onChange={e => updateFromMetric(Number(e.target.value))} className="w-full p-2 border rounded dark:bg-slate-700" />
            </div>
        );
    }
    return (
        <div className="grid grid-cols-2 gap-2">
            <div>
                <label className="block text-sm font-medium mb-1">Feet</label>
                <input type="number" value={feet} onChange={e => updateFromImperial(Number(e.target.value), inches)} className="w-full p-2 border rounded dark:bg-slate-700" />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Inches</label>
                <input type="number" value={inches} onChange={e => updateFromImperial(feet, Number(e.target.value))} className="w-full p-2 border rounded dark:bg-slate-700" />
            </div>
        </div>
    );
};

const WeightInput = ({ unitSystem, weight, setWeight }: any) => {
    // Internal weight is always kg
    const displayWeight = unitSystem === 'metric' ? weight : weight * 2.20462;
    
    const handleChange = (val: number) => {
        if (unitSystem === 'metric') setWeight(val);
        else setWeight(val / 2.20462);
    };

    return (
        <div>
            <label className="block text-sm font-medium mb-1">Weight ({unitSystem === 'metric' ? 'kg' : 'lbs'})</label>
            <input 
                type="number" 
                value={Math.round(displayWeight * 10) / 10} 
                onChange={e => handleChange(Number(e.target.value))} 
                className="w-full p-2 border rounded dark:bg-slate-700" 
            />
        </div>
    );
};

// --- BMR Calculator ---
export const BMRCalculator: React.FC<HealthProps> = ({ onCalculate, unitSystem }) => {
    const [age, setAge] = useState(30);
    const [gender, setGender] = useState('male');
    const [weight, setWeight] = useState(70); // kg
    const [height, setHeight] = useState(170); // cm

    const calculate = (e: React.FormEvent) => {
        e.preventDefault();
        // Mifflin-St Jeor Equation
        let bmr = (10 * weight) + (6.25 * height) - (5 * age);
        if (gender === 'male') bmr += 5;
        else bmr -= 161;

        onCalculate(
            <div className="text-center space-y-4">
                <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200">
                    <p className="text-sm uppercase text-gray-500 font-semibold">Basal Metabolic Rate</p>
                    <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{Math.round(bmr)} <span className="text-lg">kcal/day</span></p>
                    <p className="text-xs mt-2 text-gray-600 dark:text-gray-400">Calories burned at complete rest</p>
                </div>
                <div className="text-left bg-gray-100 dark:bg-slate-700 p-4 rounded text-sm">
                    <strong>Formula: Mifflin-St Jeor</strong>
                    <p className="font-mono mt-1 text-xs">P = (10 × weight) + (6.25 × height) - (5 × age) {gender === 'male' ? '+ 5' : '- 161'}</p>
                </div>
            </div>
        );
    };

    return (
        <form onSubmit={calculate} className="space-y-4">
            <div className="flex gap-4">
                <label className="flex items-center space-x-2"><input type="radio" name="g" checked={gender === 'male'} onChange={() => setGender('male')} /> <span>Male</span></label>
                <label className="flex items-center space-x-2"><input type="radio" name="g" checked={gender === 'female'} onChange={() => setGender('female')} /> <span>Female</span></label>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Age" value={age} onChange={e => setAge(Number(e.target.value))} className="p-2 border rounded dark:bg-slate-700" />
                <WeightInput unitSystem={unitSystem} weight={weight} setWeight={setWeight} />
            </div>
            <HeightInput unitSystem={unitSystem} height={height} setHeight={setHeight} />
            <button type="submit" className="w-full bg-primary text-white p-3 rounded font-bold">Calculate BMR</button>
        </form>
    );
};

// --- Body Fat Calculator ---
export const BodyFatCalculator: React.FC<HealthProps> = ({ onCalculate, unitSystem }) => {
    const [gender, setGender] = useState('male');
    const [waist, setWaist] = useState(80); // cm
    const [neck, setNeck] = useState(35); // cm
    const [hip, setHip] = useState(95); // cm (female only)
    const [height, setHeight] = useState(170); // cm

    const calculate = (e: React.FormEvent) => {
        e.preventDefault();
        let bodyFat = 0;
        // US Navy Method
        if (gender === 'male') {
            bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
        } else {
            bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450;
        }
        
        const fatMass = 0; // Not calculating absolute mass for now, just percentage
        const lean = 100 - bodyFat;
        const data = [{ name: 'Fat', value: bodyFat }, { name: 'Lean', value: lean }];

        onCalculate(
            <div className="space-y-4">
                <div className="text-center">
                    <p className="text-4xl font-bold text-gray-800 dark:text-white">{bodyFat.toFixed(1)}%</p>
                    <p className="text-sm text-gray-500">Estimated Body Fat</p>
                </div>
                <div className="h-48">
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie data={data} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={60}>
                                <Cell fill="#f59e0b" />
                                <Cell fill="#10b981" />
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="text-sm bg-gray-50 dark:bg-slate-800 p-3 rounded">
                    <strong>Method:</strong> US Navy Circumference Method
                </div>
            </div>
        );
    };

    // Helper for cm/inch input
    const MeasureInput = ({ label, val, setVal }: any) => {
        const display = unitSystem === 'metric' ? val : val / 2.54;
        return (
            <div>
                <label className="block text-sm font-medium mb-1">{label} ({unitSystem === 'metric' ? 'cm' : 'in'})</label>
                <input 
                    type="number" 
                    value={Math.round(display * 10) / 10} 
                    onChange={e => setVal(unitSystem === 'metric' ? Number(e.target.value) : Number(e.target.value) * 2.54)} 
                    className="w-full p-2 border rounded dark:bg-slate-700" 
                />
            </div>
        )
    }

    return (
        <form onSubmit={calculate} className="space-y-4">
            <div className="flex gap-4">
                <label className="flex items-center space-x-2"><input type="radio" checked={gender === 'male'} onChange={() => setGender('male')} /> <span>Male</span></label>
                <label className="flex items-center space-x-2"><input type="radio" checked={gender === 'female'} onChange={() => setGender('female')} /> <span>Female</span></label>
            </div>
            <HeightInput unitSystem={unitSystem} height={height} setHeight={setHeight} />
            <MeasureInput label="Neck" val={neck} setVal={setNeck} />
            <MeasureInput label="Waist (at navel)" val={waist} setVal={setWaist} />
            {gender === 'female' && <MeasureInput label="Hip (at widest)" val={hip} setVal={setHip} />}
            <button type="submit" className="w-full bg-primary text-white p-3 rounded font-bold">Calculate Body Fat</button>
        </form>
    );
};

// --- Calorie Needs ---
export const CalorieNeedsCalculator: React.FC<HealthProps> = ({ onCalculate, unitSystem }) => {
    const [age, setAge] = useState(30);
    const [gender, setGender] = useState('male');
    const [weight, setWeight] = useState(70);
    const [height, setHeight] = useState(170);
    const [activity, setActivity] = useState(1.2);

    const calculate = (e: React.FormEvent) => {
        e.preventDefault();
        let bmr = (10 * weight) + (6.25 * height) - (5 * age);
        if (gender === 'male') bmr += 5; else bmr -= 161;
        const tdee = bmr * activity;

        const macros = [
            { name: 'Carbs (50%)', value: (tdee * 0.5) / 4 },
            { name: 'Protein (30%)', value: (tdee * 0.3) / 4 },
            { name: 'Fat (20%)', value: (tdee * 0.2) / 9 },
        ];

        onCalculate(
            <div className="space-y-6">
                <div className="text-center bg-orange-50 dark:bg-orange-900/10 p-4 rounded-xl border border-orange-200">
                    <p className="text-gray-500 text-sm font-semibold uppercase">Daily Maintenance Calories</p>
                    <p className="text-3xl font-bold text-orange-600">{Math.round(tdee)} kcal</p>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div className="bg-gray-100 dark:bg-slate-700 p-2 rounded">
                        <p className="font-bold text-blue-500">{Math.round(macros[0].value)}g</p>
                        <p>Carbs</p>
                    </div>
                    <div className="bg-gray-100 dark:bg-slate-700 p-2 rounded">
                        <p className="font-bold text-green-500">{Math.round(macros[1].value)}g</p>
                        <p>Protein</p>
                    </div>
                    <div className="bg-gray-100 dark:bg-slate-700 p-2 rounded">
                        <p className="font-bold text-yellow-500">{Math.round(macros[2].value)}g</p>
                        <p>Fats</p>
                    </div>
                </div>
                <div className="text-xs text-gray-500 text-center">
                    Based on BMR x Activity Level ({activity})
                </div>
            </div>
        );
    };

    return (
        <form onSubmit={calculate} className="space-y-4">
            <div className="flex gap-4">
                <label className="flex items-center space-x-2"><input type="radio" checked={gender === 'male'} onChange={() => setGender('male')} /> <span>Male</span></label>
                <label className="flex items-center space-x-2"><input type="radio" checked={gender === 'female'} onChange={() => setGender('female')} /> <span>Female</span></label>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Age" value={age} onChange={e => setAge(Number(e.target.value))} className="p-2 border rounded dark:bg-slate-700" />
                <WeightInput unitSystem={unitSystem} weight={weight} setWeight={setWeight} />
            </div>
            <HeightInput unitSystem={unitSystem} height={height} setHeight={setHeight} />
            <div>
                <label className="block text-sm font-medium mb-1">Activity Level</label>
                <select value={activity} onChange={e => setActivity(Number(e.target.value))} className="w-full p-2 border rounded dark:bg-slate-700">
                    <option value={1.2}>Sedentary (Office job)</option>
                    <option value={1.375}>Light Exercise (1-2 days/week)</option>
                    <option value={1.55}>Moderate Exercise (3-5 days/week)</option>
                    <option value={1.725}>Heavy Exercise (6-7 days/week)</option>
                    <option value={1.9}>Athlete (2x per day)</option>
                </select>
            </div>
            <button type="submit" className="w-full bg-primary text-white p-3 rounded font-bold">Calculate Needs</button>
        </form>
    );
};

// --- Pregnancy Calculator ---
export const PregnancyCalculator: React.FC<HealthProps> = ({ onCalculate }) => {
    const [lmp, setLmp] = useState('');
    const [cycle, setCycle] = useState(28);

    const calculate = (e: React.FormEvent) => {
        e.preventDefault();
        if(!lmp) return;
        
        const lmpDate = new Date(lmp);
        // Naegele's rule: LMP + 1y - 3m + 7d + adjustment for cycle
        const dueDate = new Date(lmpDate.getTime() + 280 * 24 * 60 * 60 * 1000);
        // Adjust for cycle length difference from 28
        dueDate.setDate(dueDate.getDate() + (cycle - 28));

        onCalculate(
            <div className="text-center space-y-4">
                <div className="p-6 bg-pink-50 dark:bg-pink-900/20 rounded-xl border border-pink-200">
                    <p className="text-sm font-semibold text-gray-500 uppercase">Estimated Due Date</p>
                    <p className="text-3xl font-bold text-pink-600 dark:text-pink-400">{dueDate.toDateString()}</p>
                </div>
                <div className="text-left bg-gray-50 dark:bg-slate-800 p-3 rounded">
                    <strong>Method: Naegele's Rule</strong>
                    <p className="text-sm mt-1">LMP + 280 days + (Cycle Length - 28 days)</p>
                </div>
            </div>
        );
    };

    return (
        <form onSubmit={calculate} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">First Day of Last Period</label>
                <input type="date" value={lmp} onChange={e => setLmp(e.target.value)} className="w-full p-2 border rounded dark:bg-slate-700" required />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Cycle Length (Days)</label>
                <input type="number" value={cycle} onChange={e => setCycle(Number(e.target.value))} className="w-full p-2 border rounded dark:bg-slate-700" />
            </div>
            <button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 text-white p-3 rounded font-bold">Calculate Due Date</button>
        </form>
    );
};

// --- Menstruation Cycle ---
export const MenstruationCalculator: React.FC<HealthProps> = ({ onCalculate }) => {
    const [lastPeriod, setLastPeriod] = useState('');
    const [cycle, setCycle] = useState(28);

    const calculate = (e: React.FormEvent) => {
        e.preventDefault();
        if(!lastPeriod) return;
        const last = new Date(lastPeriod);
        const next = new Date(last.getTime() + cycle * 24 * 60 * 60 * 1000);
        const ovulation = new Date(next.getTime() - 14 * 24 * 60 * 60 * 1000);

        onCalculate(
             <div className="grid grid-cols-1 gap-4">
                <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-lg border-l-4 border-red-500">
                    <p className="text-xs uppercase text-gray-500">Next Period Starts</p>
                    <p className="text-xl font-bold text-red-700 dark:text-red-300">{next.toDateString()}</p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg border-l-4 border-purple-500">
                    <p className="text-xs uppercase text-gray-500">Estimated Ovulation</p>
                    <p className="text-xl font-bold text-purple-700 dark:text-purple-300">{ovulation.toDateString()}</p>
                    <p className="text-xs text-gray-500 mt-1">14 days before next cycle</p>
                </div>
             </div>
        );
    };

    return (
        <form onSubmit={calculate} className="space-y-4">
             <div>
                <label className="block text-sm font-medium mb-1">Start date of last period</label>
                <input type="date" value={lastPeriod} onChange={e => setLastPeriod(e.target.value)} className="w-full p-2 border rounded dark:bg-slate-700" required />
            </div>
             <div>
                <label className="block text-sm font-medium mb-1">Average Cycle Length (Days)</label>
                <input type="number" value={cycle} onChange={e => setCycle(Number(e.target.value))} className="w-full p-2 border rounded dark:bg-slate-700" />
            </div>
            <button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white p-3 rounded font-bold">Predict Cycle</button>
        </form>
    );
};

// --- Pregnancy Weight Gain ---
export const PregnancyWeightGainCalculator: React.FC<HealthProps> = ({ onCalculate, unitSystem }) => {
    const [preWeight, setPreWeight] = useState(60); // kg
    const [height, setHeight] = useState(165); // cm
    const [twins, setTwins] = useState(false);

    const calculate = (e: React.FormEvent) => {
        e.preventDefault();
        const bmi = preWeight / Math.pow(height/100, 2);
        let minGain = 0, maxGain = 0;

        // IOM Guidelines (approximate kg)
        if (twins) {
             if(bmi < 18.5) { minGain = 22; maxGain = 28; } // Not standard IOM for underweight twins, simplified
             else if(bmi < 25) { minGain = 17; maxGain = 25; }
             else if(bmi < 30) { minGain = 14; maxGain = 23; }
             else { minGain = 11; maxGain = 19; }
        } else {
            if(bmi < 18.5) { minGain = 12.5; maxGain = 18; }
            else if(bmi < 25) { minGain = 11.5; maxGain = 16; }
            else if(bmi < 30) { minGain = 7; maxGain = 11.5; }
            else { minGain = 5; maxGain = 9; }
        }

        const unit = unitSystem === 'metric' ? 'kg' : 'lbs';
        const displayMin = unitSystem === 'metric' ? minGain : minGain * 2.20462;
        const displayMax = unitSystem === 'metric' ? maxGain : maxGain * 2.20462;

        onCalculate(
            <div className="space-y-4 text-center">
                <p className="text-gray-600 dark:text-gray-300">Based on your pre-pregnancy BMI of <span className="font-bold">{bmi.toFixed(1)}</span></p>
                <div className="p-6 bg-teal-50 dark:bg-teal-900/20 rounded-xl border border-teal-200">
                    <p className="text-sm font-semibold uppercase text-gray-500">Recommended Gain</p>
                    <p className="text-3xl font-bold text-teal-700 dark:text-teal-400">
                        {displayMin.toFixed(1)} - {displayMax.toFixed(1)} <span className="text-base">{unit}</span>
                    </p>
                </div>
            </div>
        );
    };

    return (
        <form onSubmit={calculate} className="space-y-4">
            <HeightInput unitSystem={unitSystem} height={height} setHeight={setHeight} />
            <WeightInput unitSystem={unitSystem} weight={preWeight} setWeight={setPreWeight} />
            <label className="flex items-center space-x-2">
                <input type="checkbox" checked={twins} onChange={e => setTwins(e.target.checked)} className="w-5 h-5 text-primary rounded" />
                <span>Carrying Twins?</span>
            </label>
            <button type="submit" className="w-full bg-teal-500 hover:bg-teal-600 text-white p-3 rounded font-bold">Calculate Range</button>
        </form>
    );
};

// --- Ideal Weight ---
export const IdealWeightCalculator: React.FC<HealthProps> = ({ onCalculate, unitSystem }) => {
    const [height, setHeight] = useState(170);
    const [gender, setGender] = useState('male');

    const calculate = (e: React.FormEvent) => {
        e.preventDefault();
        // J.D. Robinson Formula (1983)
        // Male: 52 kg + 1.9 kg per inch over 5 feet
        // Female: 49 kg + 1.7 kg per inch over 5 feet
        
        const inchesOver5Ft = (height / 2.54) - 60;
        let ideal = 0;
        
        if (inchesOver5Ft < 0) {
             ideal = gender === 'male' ? 52 : 49; // Fallback for short stature
        } else {
             ideal = gender === 'male' 
                ? 52 + (1.9 * inchesOver5Ft)
                : 49 + (1.7 * inchesOver5Ft);
        }

        const unit = unitSystem === 'metric' ? 'kg' : 'lbs';
        const val = unitSystem === 'metric' ? ideal : ideal * 2.20462;

        onCalculate(
            <div className="text-center">
                <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200">
                    <p className="text-sm font-semibold uppercase text-gray-500">Ideal Body Weight</p>
                    <p className="text-4xl font-bold text-indigo-700 dark:text-indigo-300">
                        {val.toFixed(1)} <span className="text-lg">{unit}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-2">Robinson Formula (1983)</p>
                </div>
            </div>
        );
    };

    return (
         <form onSubmit={calculate} className="space-y-4">
            <div className="flex gap-4">
                <label className="flex items-center space-x-2"><input type="radio" checked={gender === 'male'} onChange={() => setGender('male')} /> <span>Male</span></label>
                <label className="flex items-center space-x-2"><input type="radio" checked={gender === 'female'} onChange={() => setGender('female')} /> <span>Female</span></label>
            </div>
            <HeightInput unitSystem={unitSystem} height={height} setHeight={setHeight} />
            <button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600 text-white p-3 rounded font-bold">Calculate Ideal Weight</button>
        </form>
    );
};

// --- IQ Calculator ---
export const IQCalculator: React.FC<HealthProps> = ({ onCalculate }) => {
    const [mentalAge, setMentalAge] = useState(12);
    const [chronAge, setChronAge] = useState(12);

    const calculate = (e: React.FormEvent) => {
        e.preventDefault();
        const iq = (mentalAge / chronAge) * 100;
        let desc = "Average";
        if (iq > 140) desc = "Genius or near genius";
        else if (iq > 120) desc = "Superior intelligence";
        else if (iq > 110) desc = "Above average";
        else if (iq < 90) desc = "Below average";

        onCalculate(
            <div className="text-center space-y-4">
                <div className="p-6 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl border border-yellow-200">
                    <p className="text-4xl font-bold text-yellow-700 dark:text-yellow-400">{iq.toFixed(0)}</p>
                    <p className="text-lg font-medium text-gray-700 dark:text-gray-300">{desc}</p>
                </div>
                <p className="text-xs text-gray-400 italic">This is a simple ratio estimate (MA/CA * 100). Real IQ tests are complex psychological evaluations.</p>
            </div>
        );
    };

    return (
        <form onSubmit={calculate} className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Calculate ratio IQ based on Mental Age vs Biological Age.</p>
            <div>
                <label className="block text-sm font-medium mb-1">Mental Age (Years)</label>
                <input type="number" value={mentalAge} onChange={e => setMentalAge(Number(e.target.value))} className="w-full p-2 border rounded dark:bg-slate-700" />
            </div>
             <div>
                <label className="block text-sm font-medium mb-1">Chronological Age (Years)</label>
                <input type="number" value={chronAge} onChange={e => setChronAge(Number(e.target.value))} className="w-full p-2 border rounded dark:bg-slate-700" />
            </div>
            <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white p-3 rounded font-bold">Estimate IQ</button>
        </form>
    );
};

// --- Bra Size Calculator ---
export const BraSizeCalculator: React.FC<HealthProps> = ({ onCalculate, unitSystem }) => {
    const [under, setUnder] = useState(30); // inches
    const [bust, setBust] = useState(34); // inches

    const calculate = (e: React.FormEvent) => {
        e.preventDefault();
        // Standard US logic (simplified)
        let band = Math.round(under);
        if(band % 2 !== 0) band += 1;
        else band += 0; // Some systems add 4, modern fitting often uses direct underbust measurement, we'll use a standard fit logic

        const diff = Math.round(bust - under);
        const cups = ['AA','A','B','C','D','DD','E','F','FF','G'];
        const cupIndex = Math.max(0, Math.min(cups.length-1, diff));
        const cup = cups[cupIndex] || '?';

        onCalculate(
            <div className="text-center p-6 bg-pink-50 dark:bg-pink-900/20 rounded-xl border border-pink-200">
                <p className="text-xs font-bold uppercase text-gray-500">Estimated Size</p>
                <p className="text-4xl font-bold text-pink-600">{band}{cup}</p>
                <p className="text-xs mt-2 text-gray-500">US Sizing</p>
            </div>
        );
    };

    return (
        <form onSubmit={calculate} className="space-y-4">
             <div>
                <label className="block text-sm font-medium mb-1">Underbust (Snug) - {unitSystem==='metric'?'cm':'inches'}</label>
                <input type="number" value={under} onChange={e => setUnder(Number(e.target.value))} className="w-full p-2 border rounded dark:bg-slate-700" />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Bust (Fullest) - {unitSystem==='metric'?'cm':'inches'}</label>
                <input type="number" value={bust} onChange={e => setBust(Number(e.target.value))} className="w-full p-2 border rounded dark:bg-slate-700" />
            </div>
            <button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 text-white p-3 rounded font-bold">Calculate Size</button>
        </form>
    );
};

// --- Sleep Calculator ---
export const SleepCalculator: React.FC<HealthProps> = ({ onCalculate }) => {
    const [wakeTime, setWakeTime] = useState('07:00');

    const calculate = (e: React.FormEvent) => {
        e.preventDefault();
        const [h, m] = wakeTime.split(':').map(Number);
        const date = new Date();
        date.setHours(h);
        date.setMinutes(m);

        // Calculate backwards 5 or 6 cycles (90 mins each)
        // 5 cycles = 7.5 hours
        // 6 cycles = 9 hours
        const cycles = [5, 6];
        const times: string[] = [];

        cycles.forEach(c => {
             const d = new Date(date.getTime() - (c * 90 * 60000));
             times.push(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        });

        onCalculate(
            <div className="space-y-4 text-center">
                 <p className="text-sm text-gray-500">To wake up at {wakeTime} feeling refreshed, you should sleep at:</p>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded border border-indigo-200">
                        <p className="text-2xl font-bold text-indigo-700">{times[1]}</p>
                        <p className="text-xs uppercase">9 Hours (6 Cycles)</p>
                    </div>
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded border border-indigo-200">
                        <p className="text-2xl font-bold text-indigo-700">{times[0]}</p>
                        <p className="text-xs uppercase">7.5 Hours (5 Cycles)</p>
                    </div>
                 </div>
            </div>
        );
    };

    return (
        <form onSubmit={calculate} className="space-y-4">
             <div>
                <label className="block text-sm font-medium mb-1">I want to wake up at</label>
                <input type="time" value={wakeTime} onChange={e => setWakeTime(e.target.value)} className="w-full p-2 border rounded dark:bg-slate-700" />
            </div>
            <button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600 text-white p-3 rounded font-bold">Find Bedtime</button>
        </form>
    );
};
