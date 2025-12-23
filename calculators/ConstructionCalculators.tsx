
import React, { useState } from 'react';
import { CalculatorProps } from '../types';

interface ConstProps extends CalculatorProps {}

// Helper for dimensions
const DimInput = ({ label, val, setVal }: { label: string, val: number, setVal: (n: number) => void }) => (
    <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{label}</label>
        <input 
            type="number" 
            value={val} 
            onChange={e => setVal(Number(e.target.value))} 
            className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" 
        />
    </div>
);

// --- Concrete Calculator ---
export const ConcreteCalculator: React.FC<ConstProps> = ({ onCalculate, unitSystem }) => {
    const [len, setLen] = useState(10); // ft or m
    const [wid, setWid] = useState(10);
    const [depth, setDepth] = useState(4); // inches or cm

    const calculate = (e: React.FormEvent) => {
        e.preventDefault();
        let volCuFt = 0;
        let volCuYd = 0;
        let bags60 = 0;
        let bags80 = 0;

        if (unitSystem === 'metric') {
             // inputs: m, m, cm
             const volM3 = len * wid * (depth / 100);
             volCuYd = volM3 * 1.30795;
             volCuFt = volM3 * 35.3147;
        } else {
             // inputs: ft, ft, in
             volCuFt = len * wid * (depth / 12);
             volCuYd = volCuFt / 27;
        }

        // Approx: 1 cu ft concrete = 145 lbs. 
        // 60lb bags per cu ft = 145/60 = 2.41
        // 80lb bags per cu ft = 145/80 = 1.81
        bags60 = Math.ceil(volCuFt * 2.42);
        bags80 = Math.ceil(volCuFt * 1.82);

        onCalculate(
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-gray-100 dark:bg-slate-700 p-4 rounded">
                        <p className="text-xs text-gray-500 uppercase">Volume</p>
                        <p className="text-2xl font-bold">{volCuYd.toFixed(2)}</p>
                        <p className="text-sm">Cubic Yards</p>
                    </div>
                    <div className="bg-gray-100 dark:bg-slate-700 p-4 rounded">
                        <p className="text-xs text-gray-500 uppercase">Volume</p>
                        <p className="text-2xl font-bold">{volCuFt.toFixed(2)}</p>
                        <p className="text-sm">Cubic Feet</p>
                    </div>
                </div>
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 rounded">
                    <p className="font-semibold mb-2">Pre-mix Bags Needed:</p>
                    <div className="flex justify-between">
                        <span>60 lb (27kg) bags:</span>
                        <span className="font-bold">{bags60}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>80 lb (36kg) bags:</span>
                        <span className="font-bold">{bags80}</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <form onSubmit={calculate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <DimInput label={`Length (${unitSystem==='metric'?'m':'ft'})`} val={len} setVal={setLen} />
                <DimInput label={`Width (${unitSystem==='metric'?'m':'ft'})`} val={wid} setVal={setWid} />
            </div>
            <DimInput label={`Depth/Thick (${unitSystem==='metric'?'cm':'in'})`} val={depth} setVal={setDepth} />
            <button type="submit" className="w-full bg-primary text-white p-3 rounded font-bold">Calculate Concrete</button>
        </form>
    );
};

// --- Tile Calculator ---
export const TileCalculator: React.FC<ConstProps> = ({ onCalculate, unitSystem }) => {
    const [roomLen, setRoomLen] = useState(12);
    const [roomWid, setRoomWid] = useState(10);
    const [tileLen, setTileLen] = useState(12); // in or cm
    const [tileWid, setTileWid] = useState(12); // in or cm
    const [waste, setWaste] = useState(10); // %

    const calculate = (e: React.FormEvent) => {
        e.preventDefault();
        let roomArea = roomLen * roomWid; // sq ft or sq m
        let tileArea = (tileLen * tileWid); 
        
        // Normalize tile area to same unit as room area
        if (unitSystem === 'metric') {
            // Room: m^2, Tile: cm^2 -> div by 10000
            tileArea = tileArea / 10000;
        } else {
            // Room: ft^2, Tile: in^2 -> div by 144
            tileArea = tileArea / 144;
        }

        const rawTiles = roomArea / tileArea;
        const totalTiles = Math.ceil(rawTiles * (1 + waste/100));
        
        onCalculate(
            <div className="text-center space-y-4">
                <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200">
                    <p className="text-xs text-gray-500 uppercase font-semibold">Total Tiles Needed</p>
                    <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{totalTiles}</p>
                    <p className="text-sm text-gray-400 mt-2">Includes {waste}% waste buffer</p>
                </div>
                <p className="text-sm">Total Area to Cover: {roomArea.toFixed(2)} {unitSystem === 'metric' ? 'm²' : 'sq ft'}</p>
            </div>
        );
    };

    return (
        <form onSubmit={calculate} className="space-y-4">
            <p className="font-semibold text-gray-700 dark:text-gray-300 border-b pb-2">Room Dimensions</p>
            <div className="grid grid-cols-2 gap-4">
                <DimInput label={`Length (${unitSystem==='metric'?'m':'ft'})`} val={roomLen} setVal={setRoomLen} />
                <DimInput label={`Width (${unitSystem==='metric'?'m':'ft'})`} val={roomWid} setVal={setRoomWid} />
            </div>
            <p className="font-semibold text-gray-700 dark:text-gray-300 border-b pb-2 mt-4">Tile Dimensions</p>
            <div className="grid grid-cols-2 gap-4">
                <DimInput label={`Length (${unitSystem==='metric'?'cm':'in'})`} val={tileLen} setVal={setTileLen} />
                <DimInput label={`Width (${unitSystem==='metric'?'cm':'in'})`} val={tileWid} setVal={setTileWid} />
            </div>
            <DimInput label="Waste % (Breakage/Cuts)" val={waste} setVal={setWaste} />
            <button type="submit" className="w-full bg-primary text-white p-3 rounded font-bold">Calculate Tiles</button>
        </form>
    );
};

// --- Roofing Calculator ---
export const RoofingCalculator: React.FC<ConstProps> = ({ onCalculate, unitSystem }) => {
    const [area, setArea] = useState(2000); // sq ft or m2

    const calculate = (e: React.FormEvent) => {
        e.preventDefault();
        let squares = 0;
        let bundles = 0;

        if (unitSystem === 'metric') {
            // 1 square = 9.29 m2
            squares = area / 9.29;
        } else {
            // 1 square = 100 sq ft
            squares = area / 100;
        }

        // Typ 3 bundles per square
        bundles = Math.ceil(squares * 3);

        onCalculate(
            <div className="text-center space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-100 dark:bg-slate-700 p-4 rounded">
                        <p className="text-xs text-gray-500 uppercase">Squares</p>
                        <p className="text-2xl font-bold">{squares.toFixed(1)}</p>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded border border-orange-200">
                        <p className="text-xs text-gray-500 uppercase">Bundles Needed</p>
                        <p className="text-2xl font-bold text-orange-600">{bundles}</p>
                    </div>
                </div>
                <p className="text-xs text-gray-400">Standard 3-tab shingles (3 bundles/square)</p>
            </div>
        );
    };

    return (
        <form onSubmit={calculate} className="space-y-4">
             <DimInput label={`Roof Area (${unitSystem==='metric'?'m²':'sq ft'})`} val={area} setVal={setArea} />
             <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white p-3 rounded font-bold">Calculate Materials</button>
        </form>
    );
};

// --- Mulch/Gravel Calculator ---
export const MulchCalculator: React.FC<ConstProps> = ({ onCalculate, unitSystem }) => {
    const [len, setLen] = useState(20);
    const [wid, setWid] = useState(5);
    const [depth, setDepth] = useState(3); // inches or cm

    const calculate = (e: React.FormEvent) => {
        e.preventDefault();
        let cuYards = 0;
        
        if (unitSystem === 'metric') {
            // m * m * m = m3 -> cu yards
            const m3 = len * wid * (depth / 100);
            cuYards = m3 * 1.30795;
        } else {
            // ft * ft * (in/12) = cu ft -> div 27 = cu yards
            cuYards = (len * wid * (depth / 12)) / 27;
        }

        onCalculate(
            <div className="text-center space-y-4">
                <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200">
                    <p className="text-xs text-gray-500 uppercase font-semibold">Mulch Needed</p>
                    <p className="text-4xl font-bold text-green-700 dark:text-green-400">{cuYards.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">Cubic Yards</p>
                </div>
                <p className="text-sm">For {len*wid} {unitSystem==='metric'?'m²':'sq ft'} at {depth}{unitSystem==='metric'?'cm':'"'} depth</p>
            </div>
        );
    };

    return (
        <form onSubmit={calculate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <DimInput label={`Length (${unitSystem==='metric'?'m':'ft'})`} val={len} setVal={setLen} />
                <DimInput label={`Width (${unitSystem==='metric'?'m':'ft'})`} val={wid} setVal={setWid} />
            </div>
            <DimInput label={`Depth (${unitSystem==='metric'?'cm':'in'})`} val={depth} setVal={setDepth} />
            <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded font-bold">Calculate Mulch</button>
        </form>
    );
};

export const GravelCalculator: React.FC<ConstProps> = ({ onCalculate, unitSystem }) => {
    const [len, setLen] = useState(50);
    const [wid, setWid] = useState(10);
    const [depth, setDepth] = useState(4); // inches or cm

    const calculate = (e: React.FormEvent) => {
        e.preventDefault();
        let cuYards = 0;
        
        if (unitSystem === 'metric') {
            const m3 = len * wid * (depth / 100);
            cuYards = m3 * 1.30795;
        } else {
            cuYards = (len * wid * (depth / 12)) / 27;
        }

        // Approx 1.4 tons per cu yard for gravel
        const tons = cuYards * 1.4;

        onCalculate(
            <div className="text-center space-y-4">
                <div className="grid grid-cols-2 gap-4">
                     <div className="bg-gray-100 dark:bg-slate-700 p-4 rounded">
                        <p className="text-xs text-gray-500 uppercase">Volume</p>
                        <p className="text-2xl font-bold">{cuYards.toFixed(2)}</p>
                        <p className="text-sm">Cubic Yards</p>
                    </div>
                    <div className="bg-stone-100 dark:bg-stone-900/40 p-4 rounded border border-stone-300">
                        <p className="text-xs text-gray-500 uppercase">Weight</p>
                        <p className="text-2xl font-bold text-stone-700 dark:text-stone-300">{tons.toFixed(2)}</p>
                        <p className="text-sm">Tons</p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <form onSubmit={calculate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <DimInput label={`Length (${unitSystem==='metric'?'m':'ft'})`} val={len} setVal={setLen} />
                <DimInput label={`Width (${unitSystem==='metric'?'m':'ft'})`} val={wid} setVal={setWid} />
            </div>
            <DimInput label={`Depth (${unitSystem==='metric'?'cm':'in'})`} val={depth} setVal={setDepth} />
            <button type="submit" className="w-full bg-stone-600 hover:bg-stone-700 text-white p-3 rounded font-bold">Calculate Gravel</button>
        </form>
    );
};

// --- Stairs ---
export const StairCalculator: React.FC<ConstProps> = ({ onCalculate, unitSystem }) => {
    const [rise, setRise] = useState(108); // Total height (in or cm)
    
    const calculate = (e: React.FormEvent) => {
        e.preventDefault();
        // Ideal rise per step: 7 inches or ~18 cm
        const idealRise = unitSystem === 'metric' ? 18 : 7;
        
        const numSteps = Math.round(rise / idealRise);
        const actualRise = rise / numSteps;
        
        // Ideal run: 10-11 inches or ~25-28 cm
        const run = unitSystem === 'metric' ? 25 : 10;
        const totalRun = run * (numSteps - 1);

        onCalculate(
            <div className="text-center space-y-4">
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded border border-indigo-200">
                    <p className="text-4xl font-bold text-indigo-700 dark:text-indigo-400">{numSteps}</p>
                    <p className="text-sm text-gray-500 uppercase">Steps Needed</p>
                </div>
                <div className="text-left space-y-2 text-sm">
                    <p><strong>Step Rise:</strong> {actualRise.toFixed(2)} {unitSystem==='metric'?'cm':'in'}</p>
                    <p><strong>Step Run:</strong> {run} {unitSystem==='metric'?'cm':'in'}</p>
                    <p><strong>Total Stringer Run:</strong> {totalRun} {unitSystem==='metric'?'cm':'in'}</p>
                </div>
            </div>
        );
    };

    return (
        <form onSubmit={calculate} className="space-y-4">
            <DimInput label={`Total Rise (Height) (${unitSystem==='metric'?'cm':'in'})`} val={rise} setVal={setRise} />
            <button type="submit" className="w-full bg-primary text-white p-3 rounded font-bold">Calculate Stairs</button>
        </form>
    );
};

// --- BTU ---
export const BTUCalculator: React.FC<ConstProps> = ({ onCalculate, unitSystem }) => {
    const [area, setArea] = useState(250); // sq ft or m2
    const [people, setPeople] = useState(2);
    const [sun, setSun] = useState('normal');

    const calculate = (e: React.FormEvent) => {
        e.preventDefault();
        // Base: 20 BTU per sq ft
        let baseBTU = 0;
        if (unitSystem === 'metric') {
            // m2 -> sq ft approx * 10.76
            baseBTU = (area * 10.764) * 20;
        } else {
            baseBTU = area * 20;
        }

        if (sun === 'shady') baseBTU *= 0.9;
        if (sun === 'sunny') baseBTU *= 1.1;

        // Add 600 BTU per person over 2
        if (people > 2) baseBTU += (people - 2) * 600;

        onCalculate(
            <div className="text-center space-y-4">
                <div className="p-6 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl border border-cyan-200">
                     <p className="text-xs text-gray-500 uppercase font-semibold">Recommended Capacity</p>
                     <p className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">{Math.ceil(baseBTU/500)*500} BTU</p>
                </div>
            </div>
        );
    };

    return (
        <form onSubmit={calculate} className="space-y-4">
            <DimInput label={`Room Area (${unitSystem==='metric'?'m²':'sq ft'})`} val={area} setVal={setArea} />
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Occupants</label>
                <input type="number" value={people} onChange={e => setPeople(Number(e.target.value))} className="w-full p-2 border rounded dark:bg-slate-700" />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Sun Exposure</label>
                <select value={sun} onChange={e => setSun(e.target.value)} className="w-full p-2 border rounded dark:bg-slate-700">
                    <option value="shady">Shady</option>
                    <option value="normal">Normal</option>
                    <option value="sunny">Sunny</option>
                </select>
            </div>
            <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white p-3 rounded font-bold">Calculate BTU</button>
        </form>
    );
};
