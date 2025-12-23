
import React, { useState, useEffect } from 'react';
import { CalculatorProps } from '../types';

interface MiscProps extends CalculatorProps {}

// Helper for row display
const ResultRow = ({ label, value }: { label: string, value: string | number }) => (
    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</span>
        <span className="text-lg font-bold font-mono text-primary">{value}</span>
    </div>
);

// --- Age Calculator (Advanced) ---
export const AgeCalculator: React.FC<MiscProps> = ({ onCalculate }) => {
    const [dob, setDob] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const calculate = (e?: React.FormEvent) => {
        if(e) e.preventDefault();
        if(!dob) return;

        const birthDate = new Date(dob);
        const today = new Date();

        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();
        let days = today.getDate() - birthDate.getDate();

        if (days < 0) {
            months--;
            const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            days += prevMonth.getDate();
        }
        if (months < 0) {
            years--;
            months += 12;
        }

        const diffMs = today.getTime() - birthDate.getTime();
        const totalWeeks = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));
        const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
        const totalMinutes = Math.floor(diffMs / (1000 * 60));
        const totalSeconds = Math.floor(diffMs / 1000);

        onCalculate(
            <div className="space-y-6">
                <div className="text-center bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800">
                    <p className="text-sm text-blue-500 uppercase font-bold tracking-widest mb-2">You are</p>
                    <div className="flex flex-wrap justify-center gap-4 text-gray-800 dark:text-white">
                        <div className="flex flex-col"><span className="text-4xl font-extrabold">{years}</span><span className="text-xs uppercase opacity-60">Years</span></div>
                        <div className="flex flex-col"><span className="text-4xl font-extrabold">{months}</span><span className="text-xs uppercase opacity-60">Months</span></div>
                        <div className="flex flex-col"><span className="text-4xl font-extrabold">{days}</span><span className="text-xs uppercase opacity-60">Days</span></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Total Breakdown</h4>
                        <ResultRow label="Total Weeks" value={totalWeeks.toLocaleString()} />
                        <ResultRow label="Total Days" value={totalDays.toLocaleString()} />
                    </div>
                    <div className="space-y-2">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Precision Units</h4>
                        <ResultRow label="Total Hours" value={totalHours.toLocaleString()} />
                        <ResultRow label="Total Minutes" value={totalMinutes.toLocaleString()} />
                        <div className="flex justify-between items-center p-3 bg-primary/5 dark:bg-slate-700 rounded-lg animate-pulse">
                            <span className="text-sm font-medium">Live Seconds</span>
                            <span className="text-lg font-bold font-mono text-primary">{totalSeconds.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <form onSubmit={calculate} className="space-y-4">
            <div>
                <label className="block text-sm font-bold mb-2">Enter Date of Birth</label>
                <input 
                    type="date" 
                    value={dob} 
                    onChange={e => setDob(e.target.value)} 
                    className="w-full p-4 text-lg border rounded-xl dark:bg-slate-700 focus:ring-4 ring-primary/20 outline-none transition-all" 
                    required 
                />
            </div>
            <button type="submit" className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-95">
                Calculate Age
            </button>
        </form>
    );
};

// --- Hyper Scientific Calculator ---
export const HyperScientificCalculator: React.FC<MiscProps> = ({ onCalculate, unitSystem }) => {
    const [calcType, setCalcType] = useState('hydrostatic');
    const [depth, setDepth] = useState(100);
    const [density, setDensity] = useState(1025);

    const constants = { g: 9.80665, c: 299792458, atm: 101325, G: 6.67430e-11 };

    const calculate = (e: React.FormEvent) => {
        e.preventDefault();
        if (calcType === 'hydrostatic') {
            const P_gauge = density * constants.g * depth;
            const P_total = P_gauge + constants.atm;
            const P_atm_units = P_total / constants.atm;
            onCalculate(
                <div className="space-y-4">
                    <h4 className="font-bold text-center border-b pb-2">Hydrostatic Analysis</h4>
                    <ResultRow label="Gauge Pressure (Pa)" value={P_gauge.toExponential(4)} />
                    <ResultRow label="Total Pressure (Pa)" value={P_total.toExponential(4)} />
                    <ResultRow label="Pressure (atm)" value={P_atm_units.toFixed(2)} />
                </div>
            );
        } else if (calcType === 'earth_crust') {
            const km = depth / 1000;
            const temp = 25 + (25 * km);
            const crust_p = 2700 * constants.g * depth;
            onCalculate(
                <div className="space-y-4">
                    <h4 className="font-bold text-center border-b pb-2">Lithospheric Analysis</h4>
                    <ResultRow label="Est. Temp (°C)" value={temp.toFixed(1)} />
                    <ResultRow label="Lithostatic (GPa)" value={(crust_p / 1e9).toFixed(4)} />
                </div>
            );
        }
    };

    return (
        <form onSubmit={calculate} className="space-y-6">
            <div className="flex space-x-2 bg-gray-100 dark:bg-slate-700 p-1 rounded-xl">
                <button type="button" onClick={() => setCalcType('hydrostatic')} className={`flex-1 py-2 text-xs font-bold rounded-lg ${calcType === 'hydrostatic' ? 'bg-primary text-white shadow' : 'text-gray-500'}`}>Hydrostatic</button>
                <button type="button" onClick={() => setCalcType('earth_crust')} className={`flex-1 py-2 text-xs font-bold rounded-lg ${calcType === 'earth_crust' ? 'bg-primary text-white shadow' : 'text-gray-500'}`}>Lithosphere</button>
            </div>
            <input type="number" value={depth} onChange={e => setDepth(Number(e.target.value))} className="w-full p-3 border rounded-xl dark:bg-slate-700" placeholder="Depth" />
            <button type="submit" className="w-full bg-primary text-white py-4 rounded-xl font-bold">Run Analysis</button>
        </form>
    );
};

// --- Other Misc tools implemented ... ---
export const DateDiffCalculator: React.FC<MiscProps> = ({ onCalculate }) => {
    const [d1, setD1] = useState('');
    const [d2, setD2] = useState('');
    const calculate = (e: React.FormEvent) => {
        e.preventDefault();
        const date1 = new Date(d1); const date2 = new Date(d2);
        const diffTime = Math.abs(date2.getTime() - date1.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        onCalculate(<ResultRow label="Days Difference" value={diffDays} />);
    };
    return (
        <form onSubmit={calculate} className="space-y-4">
            <input type="date" value={d1} onChange={e => setD1(e.target.value)} className="w-full p-2 border rounded dark:bg-slate-700" required />
            <input type="date" value={d2} onChange={e => setD2(e.target.value)} className="w-full p-2 border rounded dark:bg-slate-700" required />
            <button type="submit" className="w-full bg-primary text-white p-3 rounded font-bold">Calculate</button>
        </form>
    );
};

export const TimeCalculator: React.FC<MiscProps> = ({ onCalculate }) => {
    const [h1, setH1] = useState(0); const [m1, setM1] = useState(0);
    const [h2, setH2] = useState(0); const [m2, setM2] = useState(0);
    const [op, setOp] = useState('add');
    const calculate = (e: React.FormEvent) => {
        e.preventDefault();
        const t1 = h1 * 60 + m1; const t2 = h2 * 60 + m2;
        const res = op === 'add' ? t1 + t2 : t1 - t2;
        onCalculate(<ResultRow label="Result Time" value={`${Math.floor(Math.abs(res)/60)}h ${Math.abs(res)%60}m`} />);
    };
    return (
        <form onSubmit={calculate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Hours" value={h1} onChange={e => setH1(Number(e.target.value))} className="p-2 border rounded dark:bg-slate-700" />
                <input type="number" placeholder="Mins" value={m1} onChange={e => setM1(Number(e.target.value))} className="p-2 border rounded dark:bg-slate-700" />
            </div>
            <select value={op} onChange={e => setOp(e.target.value)} className="w-full p-2 border rounded dark:bg-slate-700"><option value="add">Add</option><option value="sub">Subtract</option></select>
            <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Hours" value={h2} onChange={e => setH2(Number(e.target.value))} className="p-2 border rounded dark:bg-slate-700" />
                <input type="number" placeholder="Mins" value={m2} onChange={e => setM2(Number(e.target.value))} className="p-2 border rounded dark:bg-slate-700" />
            </div>
            <button type="submit" className="w-full bg-primary text-white p-3 rounded font-bold">Calculate</button>
        </form>
    );
};

export const IPSubnetCalculator: React.FC<MiscProps> = ({ onCalculate }) => {
    const [mask, setMask] = useState(24);
    const calculate = (e: React.FormEvent) => {
        e.preventDefault();
        onCalculate(<ResultRow label="Total Hosts" value={Math.pow(2, 32-mask).toLocaleString()} />);
    };
    return (
        <form onSubmit={calculate} className="space-y-4">
            <input type="number" value={mask} onChange={e => setMask(Number(e.target.value))} className="w-full p-2 border rounded dark:bg-slate-700" placeholder="Prefix (e.g. 24)" />
            <button type="submit" className="w-full bg-primary text-white p-3 rounded font-bold">Calculate</button>
        </form>
    );
};

export const PasswordGenerator: React.FC<MiscProps> = ({ onCalculate }) => {
    const [len, setLen] = useState(16);
    const generate = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        let res = ""; for (let i=0; i<len; i++) res += chars.charAt(Math.floor(Math.random()*chars.length));
        onCalculate(<ResultRow label="Secure Password" value={res} />);
    };
    return (
        <div className="space-y-4">
            <input type="range" min="8" max="64" value={len} onChange={e => setLen(Number(e.target.value))} className="w-full" />
            <button onClick={generate} className="w-full bg-primary text-white p-3 rounded font-bold">Generate</button>
        </div>
    );
};

export const FuelCostCalculator: React.FC<MiscProps> = ({ onCalculate }) => {
    const [dist, setDist] = useState(100); const [eff, setEff] = useState(25); const [price, setPrice] = useState(3.5);
    const calculate = (e: React.FormEvent) => {
        e.preventDefault();
        onCalculate(<ResultRow label="Trip Cost" value={`$${((dist/eff)*price).toFixed(2)}`} />);
    };
    return (
        <form onSubmit={calculate} className="space-y-4">
            <input type="number" placeholder="Distance" value={dist} onChange={e => setDist(Number(e.target.value))} className="w-full p-2 border rounded dark:bg-slate-700" />
            <input type="number" placeholder="Efficiency" value={eff} onChange={e => setEff(Number(e.target.value))} className="w-full p-2 border rounded dark:bg-slate-700" />
            <input type="number" placeholder="Price" value={price} onChange={e => setPrice(Number(e.target.value))} className="w-full p-2 border rounded dark:bg-slate-700" />
            <button type="submit" className="w-full bg-primary text-white p-3 rounded font-bold">Calculate</button>
        </form>
    );
};

export const OhmsLawCalculator: React.FC<MiscProps> = ({ onCalculate }) => {
    const [v, setV] = useState<number|''>(''); const [i, setI] = useState<number|''>('');
    const calculate = (e: React.FormEvent) => {
        e.preventDefault(); if (v && i) onCalculate(<ResultRow label="Resistance" value={`${(v/i).toFixed(2)} Ω`} />);
    };
    return (
        <form onSubmit={calculate} className="space-y-4">
            <input type="number" placeholder="Voltage" value={v} onChange={e => setV(e.target.value===''?'':Number(e.target.value))} className="w-full p-2 border rounded dark:bg-slate-700" />
            <input type="number" placeholder="Current" value={i} onChange={e => setI(e.target.value===''?'':Number(e.target.value))} className="w-full p-2 border rounded dark:bg-slate-700" />
            <button type="submit" className="w-full bg-primary text-white p-3 rounded font-bold">Solve R</button>
        </form>
    );
};

export const ResistorCalculator: React.FC<MiscProps> = ({ onCalculate }) => {
    const [b1, setB1] = useState(1); const [b2, setB2] = useState(0); const [mult, setMult] = useState(100);
    const calculate = (e: React.FormEvent) => { e.preventDefault(); onCalculate(<ResultRow label="Resistance" value={`${(b1*10+b2)*mult} Ω`} />); };
    return (
        <form onSubmit={calculate} className="space-y-4">
            <select value={b1} onChange={e => setB1(Number(e.target.value))} className="w-full p-2 border rounded dark:bg-slate-700"><option value="1">Brown (1)</option><option value="2">Red (2)</option></select>
            <select value={b2} onChange={e => setB2(Number(e.target.value))} className="w-full p-2 border rounded dark:bg-slate-700"><option value="0">Black (0)</option><option value="1">Brown (1)</option></select>
            <button type="submit" className="w-full bg-primary text-white p-3 rounded font-bold">Calculate</button>
        </form>
    );
};

export const LoveCalculator: React.FC<MiscProps> = ({ onCalculate }) => {
    const calculate = (e: React.FormEvent) => { e.preventDefault(); onCalculate(<div className="text-center p-6 text-5xl font-bold text-pink-600">{Math.floor(Math.random()*101)}%</div>); };
    return (<form onSubmit={calculate} className="space-y-4"><input type="text" placeholder="Name 1" className="w-full p-2 border rounded" /><input type="text" placeholder="Name 2" className="w-full p-2 border rounded" /><button type="submit" className="w-full bg-pink-500 text-white p-3 rounded font-bold">Match</button></form>);
};

export const HeatIndexCalculator: React.FC<MiscProps> = ({ onCalculate }) => {
    const [t, setT] = useState(85); const [h, setH] = useState(50);
    const calculate = (e: React.FormEvent) => { e.preventDefault(); onCalculate(<div className="text-center text-4xl font-bold text-orange-600">{(t + 0.55*(h/100)*(t-58)).toFixed(1)}°</div>); };
    return (<form onSubmit={calculate} className="space-y-4"><input type="number" value={t} onChange={e=>setT(Number(e.target.value))} className="w-full p-2 border rounded" /><input type="number" value={h} onChange={e=>setH(Number(e.target.value))} className="w-full p-2 border rounded" /><button type="submit" className="w-full bg-orange-500 text-white p-3 rounded font-bold">Calculate</button></form>);
};
