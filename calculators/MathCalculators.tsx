
import React, { useState } from 'react';
import { CalculatorProps } from '../types';
import { useTranslation, Language } from '../utils/i18n';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface GenericMathProps extends CalculatorProps {
  lang: Language;
}

const ResultCard = ({ label, value }: { label: string, value: string | number }) => (
    <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg border border-gray-200 dark:border-slate-600">
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">{label}</p>
        <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
    </div>
);

// Helper for detailed steps
const CalculationDetail = ({ formula, method, steps }: { formula: string, method: string, steps?: string[] }) => (
    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-slate-600/50">
        <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
            <svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Calculation Methodology
        </h4>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg space-y-3 text-sm border border-gray-100 dark:border-slate-700">
            <div>
                <span className="font-semibold text-gray-600 dark:text-gray-400">Formula Used:</span>
                <div className="font-mono bg-gray-100 dark:bg-slate-900 p-2 mt-1 rounded text-primary">{formula}</div>
            </div>
            <div>
                <span className="font-semibold text-gray-600 dark:text-gray-400">Method:</span>
                <p className="text-gray-700 dark:text-gray-300 mt-1">{method}</p>
            </div>
            {steps && steps.length > 0 && (
                <div>
                    <span className="font-semibold text-gray-600 dark:text-gray-400">Steps:</span>
                    <ul className="list-decimal list-inside mt-1 space-y-1 text-gray-700 dark:text-gray-300">
                        {steps.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                </div>
            )}
        </div>
    </div>
);

// --- 1. Scientific Calculator v3.0 (Advanced) ---
export const ScientificCalculator: React.FC<GenericMathProps | { inline?: boolean, unitSystem?: string, onCalculate?: any }> = (props) => {
    const [disp, setDisp] = useState('0');
    const [history, setHistory] = useState('');
    const [memory, setMemory] = useState(0);
    const [isRad, setIsRad] = useState(true); // Radians by default
    const [isInv, setIsInv] = useState(false); // Inverse trig
    const [isHyp, setIsHyp] = useState(false); // Hyperbolic
    const [newNumber, setNewNumber] = useState(true); // Flag to clear display on next number

    // Advanced Evaluation Engine
    const evaluate = () => {
        try {
            // Replace visual symbols with math logic
            let expr = disp
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/π/g, 'Math.PI')
                .replace(/e/g, 'Math.E')
                .replace(/\^/g, '**')
                .replace(/√\(/g, 'Math.sqrt(')
                .replace(/ln\(/g, 'Math.log(')
                .replace(/log\(/g, 'Math.log10(');

            const toRad = (x: number) => isRad ? x : x * (Math.PI / 180);
            const toDeg = (x: number) => isRad ? x : x * (180 / Math.PI);

            // Scope for eval
            const scope = {
                Math,
                sin: (x: number) => Math.sin(toRad(x)),
                cos: (x: number) => Math.cos(toRad(x)),
                tan: (x: number) => Math.tan(toRad(x)),
                asin: (x: number) => toDeg(Math.asin(x)),
                acos: (x: number) => toDeg(Math.acos(x)),
                atan: (x: number) => toDeg(Math.atan(x)),
                sinh: Math.sinh,
                cosh: Math.cosh,
                tanh: Math.tanh,
                asinh: Math.asinh,
                acosh: Math.acosh,
                atanh: Math.atanh,
                fact: (n: number): number => n <= 1 ? 1 : n * scope.fact(n - 1),
                cbrt: Math.cbrt,
            };

            // Pre-process factorial (e.g., 5!)
            expr = expr.replace(/(\d+)!/g, 'fact($1)');

            // Evaluate safely
            // eslint-disable-next-line no-new-func
            const func = new Function(...Object.keys(scope), `return ${expr}`);
            const res = func(...Object.values(scope));
            
            // Format
            const resultStr = String(Math.round(res * 10000000000) / 10000000000); 
            
            setHistory(disp + ' =');
            setDisp(resultStr);
            setNewNumber(true);

            if ('onCalculate' in props && props.onCalculate) {
                 props.onCalculate(
                    <div>
                        <ResultCard label="Calculated Result" value={resultStr} />
                        <CalculationDetail 
                            formula={disp}
                            method={`Standard Mathematical Evaluation (PEMDAS). Trigonometric functions processed in ${isRad ? 'Radians' : 'Degrees'}.`}
                            steps={[
                                "1. Parse symbols (×, ÷, π, √) to mathematical constants and operators.",
                                `2. Apply ${isRad ? 'Radian' : 'Degree'} conversion for trigonometric inputs.`,
                                "3. Execute operations following Order of Operations (Parentheses, Exponents, Multiplication/Division, Addition/Subtraction).",
                                "4. Round result to 10 decimal places for precision."
                            ]}
                        />
                    </div>
                 );
            }
        } catch (e) {
            setDisp('Error');
            setNewNumber(true);
        }
    };

    const handleInput = (val: string) => {
        if (disp === 'Error') {
            setDisp(val);
            setNewNumber(false);
            return;
        }
        if (newNumber) {
            setDisp(val);
            setNewNumber(false);
        } else {
            setDisp(prev => prev === '0' ? val : prev + val);
        }
    };

    const handleOp = (op: string) => {
        setDisp(prev => prev + op);
        setNewNumber(false);
    };

    const handleFunc = (fn: string) => {
        const prefix = isInv ? 'a' : '';
        const suffix = isHyp ? 'h' : '';
        const finalFn = `${prefix}${fn}${suffix}(`;
        
        // Special case handling
        if(fn === 'sqrt') { handleInput('√('); return; }
        if(fn === 'ln') { handleInput('ln('); return; }
        if(fn === 'log') { handleInput('log('); return; }
        if(fn === 'fact') { handleOp('!'); return; }
        if(fn === 'inv') { handleOp('1/'); return; } // 1/x

        handleInput(finalFn);
    };

    const clear = () => {
        setDisp('0');
        setHistory('');
        setNewNumber(true);
    };

    const backspace = () => {
        setDisp(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    };

    // Button Component
    const Btn = ({ label, onClick, type = 'num', active = false }: any) => {
        let base = "h-12 sm:h-14 rounded-lg font-semibold text-sm sm:text-lg shadow transition-all active:scale-95 flex items-center justify-center select-none";
        let colors = "bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-600";
        
        if (type === 'op') colors = "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300";
        if (type === 'fn') colors = "bg-gray-100 dark:bg-slate-600/50 text-gray-700 dark:text-gray-300 text-xs sm:text-sm";
        if (type === 'action') colors = "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/30";
        if (type === 'danger') colors = "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300";
        if (active) colors = "bg-primary text-white shadow-inner ring-2 ring-primary/50";

        return <button onClick={onClick} className={`${base} ${colors}`}>{label}</button>;
    };

    return (
        <div className="w-full max-w-2xl mx-auto bg-gray-50 dark:bg-slate-800 p-2 sm:p-6 rounded-3xl shadow-2xl border border-gray-200 dark:border-slate-700">
            {/* Display */}
            <div className="mb-4 bg-[#f0f4f8] dark:bg-[#0f172a] p-4 rounded-xl border-2 border-gray-200 dark:border-slate-600 shadow-inner relative overflow-hidden">
                <div className="absolute top-2 left-3 flex space-x-2 text-[10px] uppercase font-bold text-gray-400 select-none">
                    <span className={isRad ? "text-primary" : ""}>RAD</span>
                    <span className={!isRad ? "text-primary" : ""}>DEG</span>
                </div>
                <div className="h-6 text-right text-gray-500 text-sm font-mono overflow-hidden opacity-70">{history}</div>
                <div className="h-12 text-right text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white font-mono overflow-x-auto whitespace-nowrap scrollbar-hide">
                    {disp}
                </div>
            </div>

            {/* Controls Row */}
            <div className="grid grid-cols-6 gap-2 mb-2">
                <Btn label={isRad ? "Deg" : "Rad"} type="fn" onClick={() => setIsRad(!isRad)} />
                <Btn label="Inv" type="fn" active={isInv} onClick={() => setIsInv(!isInv)} />
                <Btn label="Hyp" type="fn" active={isHyp} onClick={() => setIsHyp(!isHyp)} />
                <Btn label="(" type="fn" onClick={() => handleInput('(')} />
                <Btn label=")" type="fn" onClick={() => handleInput(')')} />
                <Btn label="%" type="fn" onClick={() => handleOp('%')} />
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-6 gap-2">
                {/* Functions Column 1 */}
                <Btn label={isInv ? "sin⁻¹" : "sin"} type="fn" onClick={() => handleFunc('sin')} />
                <Btn label={isInv ? "cos⁻¹" : "cos"} type="fn" onClick={() => handleFunc('cos')} />
                <Btn label={isInv ? "tan⁻¹" : "tan"} type="fn" onClick={() => handleFunc('tan')} />
                <Btn label="x!" type="fn" onClick={() => handleFunc('fact')} />
                <Btn label="AC" type="danger" onClick={clear} />
                <Btn label="⌫" type="danger" onClick={backspace} />

                {/* Functions Column 2 */}
                <Btn label="ln" type="fn" onClick={() => handleFunc('ln')} />
                <Btn label="log" type="fn" onClick={() => handleFunc('log')} />
                <Btn label="1/x" type="fn" onClick={() => handleFunc('inv')} />
                <Btn label="eⁿ" type="fn" onClick={() => handleOp('e^')} />
                <Btn label="x^y" type="fn" onClick={() => handleOp('^')} />
                <Btn label="√" type="fn" onClick={() => handleFunc('sqrt')} />

                {/* Numbers */}
                <Btn label="7" onClick={() => handleInput('7')} />
                <Btn label="8" onClick={() => handleInput('8')} />
                <Btn label="9" onClick={() => handleInput('9')} />
                <Btn label="×" type="op" onClick={() => handleOp('×')} />
                <Btn label="π" type="fn" onClick={() => handleInput('π')} />
                <Btn label="e" type="fn" onClick={() => handleInput('e')} />

                <Btn label="4" onClick={() => handleInput('4')} />
                <Btn label="5" onClick={() => handleInput('5')} />
                <Btn label="6" onClick={() => handleInput('6')} />
                <Btn label="-" type="op" onClick={() => handleOp('-')} />
                <Btn label="MC" type="fn" onClick={() => setMemory(0)} />
                <Btn label="MR" type="fn" onClick={() => handleInput(String(memory))} />

                <Btn label="1" onClick={() => handleInput('1')} />
                <Btn label="2" onClick={() => handleInput('2')} />
                <Btn label="3" onClick={() => handleInput('3')} />
                <Btn label="+" type="op" onClick={() => handleOp('+')} />
                <Btn label="M+" type="fn" onClick={() => setMemory(memory + parseFloat(disp))} />
                <Btn label="M-" type="fn" onClick={() => setMemory(memory - parseFloat(disp))} />

                <Btn label="0" onClick={() => handleInput('0')} />
                <Btn label="." onClick={() => handleInput('.')} />
                <Btn label="EXP" type="fn" onClick={() => handleOp('e+')} />
                <Btn label="=" type="action" onClick={evaluate} />
                <Btn label="Ans" type="fn" onClick={() => {}} /> 
                <Btn label="Rnd" type="fn" onClick={() => handleInput(String(Math.random().toFixed(3)))} />
            </div>
        </div>
    );
};

// --- Percentage Calculator ---
export const PercentageCalculator: React.FC<GenericMathProps> = ({ onCalculate }) => {
    const [val, setVal] = useState(20);
    const [total, setTotal] = useState(100);
    const [mode, setMode] = useState('percentOf'); // percentOf, increase, decrease

    const calculate = (e: React.FormEvent) => {
        e.preventDefault();
        let res = 0;
        let text = '';
        let formula = '';

        if (mode === 'percentOf') {
            res = (val / 100) * total;
            text = `${val}% of ${total} is ${res}`;
            formula = `(${val} / 100) * ${total}`;
        } else if (mode === 'increase') {
            res = total * (1 + val / 100);
            text = `${total} increased by ${val}% is ${res}`;
            formula = `${total} * (1 + ${val}/100)`;
        } else {
            res = total * (1 - val / 100);
            text = `${total} decreased by ${val}% is ${res}`;
            formula = `${total} * (1 - ${val}/100)`;
        }
        onCalculate(
            <div>
                <ResultCard label="Result" value={text} />
                <CalculationDetail 
                    formula={formula}
                    method="Standard Percentage Arithmetic"
                    steps={["1. Convert percentage to decimal (divide by 100)", "2. Multiply by total amount", mode !== 'percentOf' ? "3. Add/Subtract from original total" : ""]}
                />
            </div>
        );
    };

    return (
        <form onSubmit={calculate} className="space-y-4">
            <div className="flex space-x-2">
                <select value={mode} onChange={e => setMode(e.target.value)} className="w-full p-2 border rounded dark:bg-slate-700">
                    <option value="percentOf">What is X% of Y?</option>
                    <option value="increase">Increase Y by X%</option>
                    <option value="decrease">Decrease Y by X%</option>
                </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="X (Percentage)" value={val} onChange={e => setVal(Number(e.target.value))} className="p-2 border rounded dark:bg-slate-700" />
                <input type="number" placeholder="Y (Value)" value={total} onChange={e => setTotal(Number(e.target.value))} className="p-2 border rounded dark:bg-slate-700" />
            </div>
            <button type="submit" className="w-full bg-primary text-white p-3 rounded font-bold hover:bg-blue-700">Calculate</button>
        </form>
    );
};

// --- Compound Interest Calculator ---
export const CompoundInterestCalculator: React.FC<GenericMathProps> = ({ onCalculate }) => {
    const [p, setP] = useState(1000);
    const [r, setR] = useState(5);
    const [t, setT] = useState(10);
    const [n, setN] = useState(12); // compounding frequency

    const calculate = (e: React.FormEvent) => {
        e.preventDefault();
        const amount = p * Math.pow((1 + (r/100)/n), n*t);
        const interest = amount - p;

        onCalculate(
            <div className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <ResultCard label="Total Amount" value={amount.toFixed(2)} />
                    <ResultCard label="Total Interest" value={interest.toFixed(2)} />
                 </div>
                 <CalculationDetail 
                    formula="A = P(1 + r/n)^(nt)"
                    method="Compound Interest Formula"
                    steps={[
                        `P (Principal) = ${p}`,
                        `r (Rate) = ${r/100}`,
                        `n (Frequency) = ${n}`,
                        `t (Time) = ${t}`,
                        "1. Divide annual rate by frequency (r/n)",
                        "2. Add 1 to the result",
                        "3. Raise to the power of (n*t)",
                        "4. Multiply by Principal"
                    ]}
                 />
            </div>
        );
    };

    return (
        <form onSubmit={calculate} className="space-y-4">
            <input type="number" placeholder="Principal (P)" value={p} onChange={e => setP(Number(e.target.value))} className="w-full p-2 border rounded dark:bg-slate-700" />
            <input type="number" placeholder="Rate % (r)" value={r} onChange={e => setR(Number(e.target.value))} className="w-full p-2 border rounded dark:bg-slate-700" />
            <input type="number" placeholder="Time in Years (t)" value={t} onChange={e => setT(Number(e.target.value))} className="w-full p-2 border rounded dark:bg-slate-700" />
            <select value={n} onChange={e => setN(Number(e.target.value))} className="w-full p-2 border rounded dark:bg-slate-700">
                <option value="1">Annually</option>
                <option value="2">Semi-Annually</option>
                <option value="4">Quarterly</option>
                <option value="12">Monthly</option>
                <option value="365">Daily</option>
            </select>
            <button type="submit" className="w-full bg-primary text-white p-3 rounded font-bold hover:bg-blue-700">Calculate</button>
        </form>
    );
};

// --- GPA Calculator ---
export const GPACalculator: React.FC<GenericMathProps> = ({ onCalculate }) => {
    const [courses, setCourses] = useState([{ grade: 4, credits: 3 }]);

    const addCourse = () => setCourses([...courses, { grade: 4, credits: 3 }]);
    const updateCourse = (idx: number, field: string, val: number) => {
        const newCourses = [...courses];
        // @ts-ignore
        newCourses[idx][field] = val;
        setCourses(newCourses);
    };

    const calculate = (e: React.FormEvent) => {
        e.preventDefault();
        let totalPoints = 0;
        let totalCredits = 0;
        courses.forEach(c => {
            totalPoints += c.grade * c.credits;
            totalCredits += c.credits;
        });
        const gpa = totalCredits === 0 ? 0 : totalPoints / totalCredits;
        onCalculate(
            <div>
                <ResultCard label="GPA" value={gpa.toFixed(2)} />
                <CalculationDetail 
                    formula="GPA = Σ(Grade Points × Credits) / Σ(Total Credits)"
                    method="Weighted Average"
                    steps={[
                        `Total Grade Points: ${totalPoints}`,
                        `Total Credits: ${totalCredits}`,
                        `Calculation: ${totalPoints} / ${totalCredits} = ${gpa.toFixed(4)}`
                    ]}
                />
            </div>
        );
    };

    return (
        <form onSubmit={calculate} className="space-y-4">
            {courses.map((c, i) => (
                <div key={i} className="flex space-x-2">
                    <select value={c.grade} onChange={e => updateCourse(i, 'grade', Number(e.target.value))} className="p-2 border rounded dark:bg-slate-700 w-1/2">
                        <option value="4">A (4.0)</option>
                        <option value="3.7">A- (3.7)</option>
                        <option value="3.3">B+ (3.3)</option>
                        <option value="3">B (3.0)</option>
                        <option value="2.7">B- (2.7)</option>
                        <option value="2.3">C+ (2.3)</option>
                        <option value="2">C (2.0)</option>
                        <option value="1">D (1.0)</option>
                        <option value="0">F (0.0)</option>
                    </select>
                    <input type="number" placeholder="Credits" value={c.credits} onChange={e => updateCourse(i, 'credits', Number(e.target.value))} className="p-2 border rounded dark:bg-slate-700 w-1/2" />
                </div>
            ))}
            <button type="button" onClick={addCourse} className="text-sm text-primary underline">+ Add Course</button>
            <button type="submit" className="w-full bg-primary text-white p-3 rounded font-bold hover:bg-blue-700 mt-4">Calculate GPA</button>
        </form>
    );
};

// --- Standard Deviation ---
export const StandardDeviationCalculator: React.FC<GenericMathProps> = ({ onCalculate }) => {
    const [input, setInput] = useState('10, 20, 30, 40, 50');

    const calculate = (e: React.FormEvent) => {
        e.preventDefault();
        const nums = input.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
        if (nums.length === 0) return;

        const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
        const variance = nums.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / nums.length; // Population
        const sd = Math.sqrt(variance);

        onCalculate(
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ResultCard label="Mean" value={mean.toFixed(4)} />
                    <ResultCard label="Variance (Pop)" value={variance.toFixed(4)} />
                    <ResultCard label="Std Dev (Pop)" value={sd.toFixed(4)} />
                </div>
                <CalculationDetail 
                    formula="σ = √[ Σ(x - μ)² / N ]"
                    method="Population Standard Deviation"
                    steps={[
                        `1. Calculate Mean (μ): ${mean}`,
                        "2. Subtract mean from each number and square the result.",
                        "3. Find the mean of those squared differences (Variance).",
                        "4. Take the square root of the Variance."
                    ]}
                />
            </div>
        );
    };

    return (
        <form onSubmit={calculate} className="space-y-4">
            <textarea value={input} onChange={e => setInput(e.target.value)} className="w-full p-2 border rounded dark:bg-slate-700" rows={3} placeholder="Enter numbers separated by commas e.g. 10, 20, 30" />
            <button type="submit" className="w-full bg-primary text-white p-3 rounded font-bold hover:bg-blue-700">Calculate</button>
        </form>
    );
};

// --- Percentile ---
export const PercentileCalculator: React.FC<GenericMathProps> = ({ onCalculate }) => {
    const [input, setInput] = useState('12, 45, 67, 89, 23, 56');
    const [val, setVal] = useState(45);

    const calculate = (e: React.FormEvent) => {
        e.preventDefault();
        const nums = input.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n)).sort((a,b) => a-b);
        const count = nums.filter(n => n < val).length;
        const percentile = (count / nums.length) * 100;
        
        onCalculate(
            <div>
                <ResultCard label={`Percentile Rank of ${val}`} value={`${percentile.toFixed(2)}th Percentile`} />
                <CalculationDetail 
                    formula="P = (B / N) × 100"
                    method="Percentile Rank Formula"
                    steps={[
                        `B (Values below ${val}): ${count}`,
                        `N (Total values): ${nums.length}`,
                        `Calculation: (${count}/${nums.length}) * 100`
                    ]}
                />
            </div>
        );
    };

    return (
        <form onSubmit={calculate} className="space-y-4">
             <textarea value={input} onChange={e => setInput(e.target.value)} className="w-full p-2 border rounded dark:bg-slate-700" rows={3} placeholder="Dataset (comma separated)" />
             <input type="number" placeholder="Value to find percentile for" value={val} onChange={e => setVal(Number(e.target.value))} className="w-full p-2 border rounded dark:bg-slate-700" />
             <button type="submit" className="w-full bg-primary text-white p-3 rounded font-bold hover:bg-blue-700">Calculate</button>
        </form>
    );
};

// --- Mean Mode Median ---
export const MeanMedianModeCalculator: React.FC<GenericMathProps> = ({ onCalculate }) => {
    const [input, setInput] = useState('1, 2, 2, 3, 4, 5, 5, 5, 6');

    const calculate = (e: React.FormEvent) => {
        e.preventDefault();
        const nums = input.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n)).sort((a,b) => a-b);
        
        // Mean
        const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
        
        // Median
        const mid = Math.floor(nums.length / 2);
        const median = nums.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;

        // Mode
        const freq: any = {};
        let maxFreq = 0;
        let mode: number[] = [];
        nums.forEach(n => {
            freq[n] = (freq[n] || 0) + 1;
            if (freq[n] > maxFreq) maxFreq = freq[n];
        });
        for (const k in freq) {
            if (freq[k] === maxFreq) mode.push(Number(k));
        }

        onCalculate(
            <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                    <ResultCard label="Mean" value={mean.toFixed(2)} />
                    <ResultCard label="Median" value={median} />
                    <ResultCard label="Mode" value={mode.join(', ')} />
                </div>
                <CalculationDetail 
                    formula="Statistics Formulas"
                    method="Central Tendency"
                    steps={[
                        "Mean: Sum of all values divided by count.",
                        "Median: Middle value of the sorted dataset.",
                        "Mode: Most frequently occurring value(s)."
                    ]}
                />
            </div>
        );
    };

    return (
        <form onSubmit={calculate} className="space-y-4">
             <textarea value={input} onChange={e => setInput(e.target.value)} className="w-full p-2 border rounded dark:bg-slate-700" rows={3} placeholder="Dataset (comma separated)" />
             <button type="submit" className="w-full bg-primary text-white p-3 rounded font-bold hover:bg-blue-700">Calculate Statistics</button>
        </form>
    );
};

// --- Decimal to Fraction ---
export const DecimalToFractionCalculator: React.FC<GenericMathProps> = ({ onCalculate }) => {
    const [decimal, setDecimal] = useState(0.75);

    const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;

    const calculate = (e: React.FormEvent) => {
        e.preventDefault();
        const len = decimal.toString().includes('.') ? decimal.toString().split('.')[1].length : 0;
        const denominator = Math.pow(10, len);
        const numerator = decimal * denominator;
        const divisor = gcd(numerator, denominator);
        
        onCalculate(
            <div>
                <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <p className="text-3xl font-bold">{numerator / divisor} / {denominator / divisor}</p>
                </div>
                <CalculationDetail 
                    formula={`GCD(${numerator}, ${denominator}) = ${divisor}`}
                    method="Greatest Common Divisor Reduction"
                    steps={[
                        `1. Convert decimal to fraction: ${numerator}/${denominator}`,
                        `2. Find GCD of numerator and denominator: ${divisor}`,
                        `3. Simplify: ${numerator}/${divisor} over ${denominator}/${divisor}`
                    ]}
                />
            </div>
        );
    };

    return (
        <form onSubmit={calculate} className="space-y-4">
            <input type="number" value={decimal} onChange={e => setDecimal(Number(e.target.value))} className="w-full p-2 border rounded dark:bg-slate-700" step="0.0001" />
            <button type="submit" className="w-full bg-primary text-white p-3 rounded font-bold hover:bg-blue-700">Convert</button>
        </form>
    );
};

// --- Algebra (Quadratic) ---
export const AlgebraCalculator: React.FC<GenericMathProps> = ({ onCalculate }) => {
    const [a, setA] = useState(1);
    const [b, setB] = useState(-3);
    const [c, setC] = useState(2);

    const calculate = (e: React.FormEvent) => {
        e.preventDefault();
        const d = b * b - 4 * a * c;
        let res;
        if (d > 0) {
            const x1 = (-b + Math.sqrt(d)) / (2 * a);
            const x2 = (-b - Math.sqrt(d)) / (2 * a);
            res = `x1 = ${x1}, x2 = ${x2}`;
        } else if (d === 0) {
            const x = -b / (2 * a);
            res = `x = ${x}`;
        } else {
            res = "Complex Roots";
        }
        onCalculate(
            <div>
                <ResultCard label="Roots" value={res} />
                <CalculationDetail 
                    formula="x = [-b ± √(b² - 4ac)] / 2a"
                    method="Quadratic Formula"
                    steps={[
                        `Discriminant (Δ) = b² - 4ac = ${d}`,
                        d >= 0 ? "Discriminant is non-negative, real roots exist." : "Discriminant is negative, roots are complex.",
                        "Applied the quadratic formula to solve for x."
                    ]}
                />
            </div>
        );
    };

    return (
        <form onSubmit={calculate} className="space-y-4">
            <p className="text-center font-mono mb-4">ax² + bx + c = 0</p>
            <div className="flex space-x-2">
                <input type="number" placeholder="a" value={a} onChange={e => setA(Number(e.target.value))} className="w-1/3 p-2 border rounded dark:bg-slate-700" />
                <input type="number" placeholder="b" value={b} onChange={e => setB(Number(e.target.value))} className="w-1/3 p-2 border rounded dark:bg-slate-700" />
                <input type="number" placeholder="c" value={c} onChange={e => setC(Number(e.target.value))} className="w-1/3 p-2 border rounded dark:bg-slate-700" />
            </div>
            <button type="submit" className="w-full bg-primary text-white p-3 rounded font-bold hover:bg-blue-700">Solve</button>
        </form>
    );
};

// --- Geometry ---
export const GeometryCalculator: React.FC<GenericMathProps> = ({ onCalculate }) => {
    const [shape, setShape] = useState('circle');
    const [val1, setVal1] = useState(5); // radius or length
    const [val2, setVal2] = useState(5); // width

    const calculate = (e: React.FormEvent) => {
        e.preventDefault();
        let area = 0;
        let perim = 0;
        let formulaA = "";
        let formulaP = "";

        if (shape === 'circle') {
            area = Math.PI * val1 * val1;
            perim = 2 * Math.PI * val1;
            formulaA = "A = πr²";
            formulaP = "C = 2πr";
        } else if (shape === 'rectangle') {
            area = val1 * val2;
            perim = 2 * (val1 + val2);
            formulaA = "A = length × width";
            formulaP = "P = 2(length + width)";
        }
        
        onCalculate(
            <div>
                <div className="grid grid-cols-2 gap-4">
                    <ResultCard label="Area" value={area.toFixed(2)} />
                    <ResultCard label={shape === 'circle' ? "Circumference" : "Perimeter"} value={perim.toFixed(2)} />
                </div>
                <CalculationDetail 
                    formula={`${formulaA}, ${formulaP}`}
                    method={`Geometric formulas for ${shape}`}
                    steps={[
                        `Input values: ${val1} ${shape==='rectangle' ? `x ${val2}` : ''}`,
                        "Substituted values into standard geometric formulas."
                    ]}
                />
            </div>
        );
    };

    return (
        <form onSubmit={calculate} className="space-y-4">
            <select value={shape} onChange={e => setShape(e.target.value)} className="w-full p-2 border rounded dark:bg-slate-700">
                <option value="circle">Circle</option>
                <option value="rectangle">Rectangle</option>
            </select>
            <input type="number" placeholder={shape === 'circle' ? 'Radius' : 'Length'} value={val1} onChange={e => setVal1(Number(e.target.value))} className="w-full p-2 border rounded dark:bg-slate-700" />
            {shape === 'rectangle' && (
                <input type="number" placeholder="Width" value={val2} onChange={e => setVal2(Number(e.target.value))} className="w-full p-2 border rounded dark:bg-slate-700" />
            )}
            <button type="submit" className="w-full bg-primary text-white p-3 rounded font-bold hover:bg-blue-700">Calculate</button>
        </form>
    );
};

// --- Pythagoras ---
export const PythagorasCalculator: React.FC<GenericMathProps> = ({ onCalculate }) => {
    const [a, setA] = useState(3);
    const [b, setB] = useState(4);

    const calculate = (e: React.FormEvent) => {
        e.preventDefault();
        const c = Math.sqrt(a*a + b*b);
        onCalculate(
            <div>
                <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200">
                    <p>Hypotenuse (c)</p>
                    <p className="text-3xl font-bold text-primary">{c.toFixed(4)}</p>
                </div>
                <CalculationDetail 
                    formula="c = √(a² + b²)"
                    method="Pythagorean Theorem"
                    steps={[
                        `a² = ${a}² = ${a*a}`,
                        `b² = ${b}² = ${b*b}`,
                        `Sum = ${a*a + b*b}`,
                        `Square Root of Sum = ${c.toFixed(4)}`
                    ]}
                />
            </div>
        );
    };

    return (
        <form onSubmit={calculate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Side A" value={a} onChange={e => setA(Number(e.target.value))} className="p-2 border rounded dark:bg-slate-700" />
                <input type="number" placeholder="Side B" value={b} onChange={e => setB(Number(e.target.value))} className="p-2 border rounded dark:bg-slate-700" />
            </div>
            <button type="submit" className="w-full bg-primary text-white p-3 rounded font-bold hover:bg-blue-700">Find Hypotenuse</button>
        </form>
    );
};

// --- Matrix ---
export const MatrixCalculator: React.FC<GenericMathProps> = ({ onCalculate }) => {
    const [m, setM] = useState([1, 2, 3, 4]);

    const handleChange = (idx: number, val: number) => {
        const nm = [...m];
        nm[idx] = val;
        setM(nm);
    };

    const calculate = (e: React.FormEvent) => {
        e.preventDefault();
        const det = m[0]*m[3] - m[1]*m[2];
        onCalculate(
            <div>
                <ResultCard label="Determinant" value={det} />
                <CalculationDetail 
                    formula="det(A) = ad - bc"
                    method="2x2 Matrix Determinant"
                    steps={[
                        `Matrix: [[${m[0]}, ${m[1]}], [${m[2]}, ${m[3]}]]`,
                        `a=${m[0]}, b=${m[1]}, c=${m[2]}, d=${m[3]}`,
                        `Calculation: (${m[0]}*${m[3]}) - (${m[1]}*${m[2]}) = ${det}`
                    ]}
                />
            </div>
        );
    };

    return (
        <form onSubmit={calculate} className="space-y-4">
            <p className="text-sm mb-2">2x2 Matrix</p>
            <div className="grid grid-cols-2 gap-2 w-32 mx-auto">
                {m.map((val, i) => (
                    <input key={i} type="number" value={val} onChange={e => handleChange(i, Number(e.target.value))} className="p-2 border text-center rounded dark:bg-slate-700" />
                ))}
            </div>
            <button type="submit" className="w-full bg-primary text-white p-3 rounded font-bold hover:bg-blue-700">Calculate Determinant</button>
        </form>
    );
};

// --- Trigonometry ---
export const TrigonometryCalculator: React.FC<GenericMathProps> = ({ onCalculate }) => {
    const [deg, setDeg] = useState(45);

    const calculate = (e: React.FormEvent) => {
        e.preventDefault();
        const rad = (deg * Math.PI) / 180;
        onCalculate(
            <div>
                <div className="grid grid-cols-3 gap-4 text-center">
                    <ResultCard label="Sin" value={Math.sin(rad).toFixed(4)} />
                    <ResultCard label="Cos" value={Math.cos(rad).toFixed(4)} />
                    <ResultCard label="Tan" value={Math.tan(rad).toFixed(4)} />
                </div>
                <CalculationDetail 
                    formula="f(θ)"
                    method="Trigonometric Ratios"
                    steps={[
                        `Input Angle: ${deg}°`,
                        `Converted to Radians: ${rad.toFixed(4)} rad (θ = deg × π/180)`,
                        "Evaluated Sin, Cos, Tan using standard libraries."
                    ]}
                />
            </div>
        );
    };

    return (
        <form onSubmit={calculate} className="space-y-4">
            <div className="flex items-center space-x-2">
                <label>Angle (Degrees):</label>
                <input type="number" value={deg} onChange={e => setDeg(Number(e.target.value))} className="flex-1 p-2 border rounded dark:bg-slate-700" />
            </div>
            <button type="submit" className="w-full bg-primary text-white p-3 rounded font-bold hover:bg-blue-700">Calculate Ratios</button>
        </form>
    );
};

// --- CGPA Calculator ---
export const CGPACalculator: React.FC<GenericMathProps> = ({ onCalculate }) => {
    const [cgpa, setCgpa] = useState(8.5);

    const calculate = (e: React.FormEvent) => {
        e.preventDefault();
        const percent = cgpa * 9.5;
        onCalculate(
            <div>
                <ResultCard label="Percentage Equivalent" value={`${percent.toFixed(2)}%`} />
                <CalculationDetail 
                    formula="Percentage = CGPA × 9.5"
                    method="Standard Conversion Formula"
                    steps={[
                        "Multiplied CGPA by 9.5 conversion factor.",
                        "This is the standard multiplier used by CBSE and many universities."
                    ]}
                />
            </div>
        );
    };

    return (
        <form onSubmit={calculate} className="space-y-4">
            <input type="number" step="0.01" placeholder="Enter CGPA" value={cgpa} onChange={e => setCgpa(Number(e.target.value))} className="w-full p-2 border rounded dark:bg-slate-700" />
            <p className="text-xs text-gray-500">Formula used: CGPA * 9.5</p>
            <button type="submit" className="w-full bg-primary text-white p-3 rounded font-bold hover:bg-blue-700">Convert to Percentage</button>
        </form>
    );
};

// --- Marks Percentage ---
export const MarksPercentageCalculator: React.FC<GenericMathProps> = ({ onCalculate }) => {
    const [obtained, setObtained] = useState(450);
    const [total, setTotal] = useState(500);

    const calculate = (e: React.FormEvent) => {
        e.preventDefault();
        const pct = (obtained / total) * 100;
        
        const data = [
            { name: 'Obtained', value: obtained },
            { name: 'Lost', value: total - obtained }
        ];

        onCalculate(
            <div className="space-y-4">
                <ResultCard label="Percentage" value={`${pct.toFixed(2)}%`} />
                <div className="h-48 w-full">
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie data={data} dataKey="value" cx="50%" cy="50%" outerRadius={60}>
                                <Cell fill="#3b82f6" />
                                <Cell fill="#e5e7eb" />
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <CalculationDetail 
                    formula="(Obtained / Total) × 100"
                    method="Percentage Calculation"
                    steps={[
                        `1. Divide obtained marks (${obtained}) by total marks (${total}).`,
                        `2. Multiply by 100.`
                    ]}
                />
            </div>
        );
    };

    return (
        <form onSubmit={calculate} className="space-y-4">
            <input type="number" placeholder="Marks Obtained" value={obtained} onChange={e => setObtained(Number(e.target.value))} className="w-full p-2 border rounded dark:bg-slate-700" />
            <input type="number" placeholder="Total Marks" value={total} onChange={e => setTotal(Number(e.target.value))} className="w-full p-2 border rounded dark:bg-slate-700" />
            <button type="submit" className="w-full bg-primary text-white p-3 rounded font-bold hover:bg-blue-700">Calculate</button>
        </form>
    );
};
