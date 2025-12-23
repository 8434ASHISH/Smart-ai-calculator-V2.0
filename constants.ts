
import { CalculatorMeta, CurrencyRate } from './types';

export const CATEGORIES = [
  { id: 'finance', name: 'Finance' },
  { id: 'mathematics', name: 'Mathematics' },
  { id: 'health', name: 'Health' },
  { id: 'unit-converter', name: 'Unit Converter' },
  { id: 'construction', name: 'Construction & Home' },
  { id: 'miscellaneous', name: 'Miscellaneous' },
];

export const CURRENCY_RATES: Record<string, CurrencyRate> = {
  USD: { code: 'USD', rateToUSD: 1, symbol: '$' },
  INR: { code: 'INR', rateToUSD: 0.012, symbol: '₹' },
  EUR: { code: 'EUR', rateToUSD: 1.08, symbol: '€' },
  GBP: { code: 'GBP', rateToUSD: 1.26, symbol: '£' },
  JPY: { code: 'JPY', rateToUSD: 0.0067, symbol: '¥' },
  AUD: { code: 'AUD', rateToUSD: 0.65, symbol: 'A$' },
  CAD: { code: 'CAD', rateToUSD: 0.74, symbol: 'C$' },
  CNY: { code: 'CNY', rateToUSD: 0.14, symbol: '¥' },
  RUB: { code: 'RUB', rateToUSD: 0.011, symbol: '₽' },
  AED: { code: 'AED', rateToUSD: 0.27, symbol: 'د.إ' },
  SGD: { code: 'SGD', rateToUSD: 0.74, symbol: 'S$' },
};

export const CALCULATORS: CalculatorMeta[] = [
  // Finance
  { id: 'loan', name: 'Loan', category: 'finance', description: 'Calculate monthly payments for any loan.', path: '/finance/loan' },
  { id: 'car-loan', name: 'Car Loan', category: 'finance', description: 'Estimate monthly car payments.', path: '/finance/car-loan' },
  { id: 'auto-loan', name: 'Auto Loan', category: 'finance', description: 'Calculate your auto loan EMI.', path: '/finance/auto-loan' },
  { id: 'mortgage', name: 'Mortgage', category: 'finance', description: 'Calculate mortgage payments for your home.', path: '/finance/mortgage' },
  { id: 'roi', name: 'ROI', category: 'finance', description: 'Calculate Return on Investment percentage.', path: '/finance/roi' },
  { id: 'saving', name: 'Saving', category: 'finance', description: 'Project your savings growth over time.', path: '/finance/saving' },
  { id: 'gst', name: 'GST', category: 'finance', description: 'Calculate Goods and Services Tax.', path: '/finance/gst' },
  { id: 'discount', name: 'Discount', category: 'finance', description: 'Calculate final price after discount.', path: '/finance/discount' },
  { id: 'emi', name: 'EMI', category: 'finance', description: 'Calculate Equated Monthly Installment.', path: '/finance/emi' },
  { id: 'sip', name: 'SIP', category: 'finance', description: 'Calculate returns on Systematic Investment Plans.', path: '/finance/sip' },
  { id: 'investment', name: 'Investment', category: 'finance', description: 'Plan your future investments.', path: '/finance/investment' },
  { id: 'amortization', name: 'Amortization', category: 'finance', description: 'View loan amortization schedules.', path: '/finance/amortization' },
  { id: 'inflation', name: 'Inflation', category: 'finance', description: 'Calculate the effect of inflation on money.', path: '/finance/inflation' },
  { id: 'sales-tax', name: 'Sales Tax', category: 'finance', description: 'Calculate sales tax for retail purchases.', path: '/finance/sales-tax' },

  // Mathematics
  { id: 'percentage', name: 'Percentage', category: 'mathematics', description: 'Calculate percentages, increases, and decreases.', path: '/mathematics/percentage' },
  { id: 'compound-interest', name: 'Compound Interest', category: 'mathematics', description: 'Calculate compound interest with variable frequencies.', path: '/mathematics/compound-interest' },
  { id: 'gpa', name: 'GPA', category: 'mathematics', description: 'Calculate Grade Point Average from grades and credits.', path: '/mathematics/gpa' },
  { id: 'standard-deviation', name: 'Standard Deviation', category: 'mathematics', description: 'Compute SD, Variance, and Mean of a dataset.', path: '/mathematics/standard-deviation' },
  { id: 'percentile', name: 'Percentile', category: 'mathematics', description: 'Find the percentile rank of a value in a dataset.', path: '/mathematics/percentile' },
  { id: 'mean-median-mode', name: 'Mean Mode Median', category: 'mathematics', description: 'Calculate central tendency statistics.', path: '/mathematics/mean-median-mode' },
  { id: 'decimal-fraction', name: 'Decimal to Fraction', category: 'mathematics', description: 'Convert decimal numbers to simplified fractions.', path: '/mathematics/decimal-fraction' },
  { id: 'scientific', name: 'Scientific', category: 'mathematics', description: 'Advanced calculator with trig, logs, and exponents.', path: '/mathematics/scientific' },
  { id: 'algebra', name: 'Algebra', category: 'mathematics', description: 'Solve linear and quadratic equations.', path: '/mathematics/algebra' },
  { id: 'geometry', name: 'Geometry', category: 'mathematics', description: 'Calculate Area, Perimeter, and Volume of shapes.', path: '/mathematics/geometry' },
  { id: 'pythagoras', name: 'Pythagoras Theorem', category: 'mathematics', description: 'Find the missing side of a right-angled triangle.', path: '/mathematics/pythagoras' },
  { id: 'matrix', name: 'Matrix', category: 'mathematics', description: 'Perform Matrix addition, multiplication, and determinants.', path: '/mathematics/matrix' },
  { id: 'trigonometry', name: 'Trigonometry', category: 'mathematics', description: 'Solve triangles using Sine and Cosine rules.', path: '/mathematics/trigonometry' },
  { id: 'cgpa', name: 'CGPA', category: 'mathematics', description: 'Convert CGPA to percentage and vice-versa.', path: '/mathematics/cgpa' },
  { id: 'marks-percentage', name: 'Marks Percentage', category: 'mathematics', description: 'Calculate percentage from obtained total marks.', path: '/mathematics/marks-percentage' },

  // Health
  { id: 'bmi', name: 'BMI', category: 'health', description: 'Calculate Body Mass Index to understand health risks.', path: '/health/bmi' },
  { id: 'bmr', name: 'BMR', category: 'health', description: 'Basal Metabolic Rate - Calories burned at rest.', path: '/health/bmr' },
  { id: 'body-fat', name: 'Body Fat', category: 'health', description: 'Estimate body fat percentage based on measurements.', path: '/health/body-fat' },
  { id: 'calories', name: 'Calorie Needs', category: 'health', description: 'Calculate daily calorie needs for weight loss/gain.', path: '/health/calories' },
  { id: 'pregnancy', name: 'Pregnancy Due Date', category: 'health', description: 'Calculate estimated due date from LMP.', path: '/health/pregnancy' },
  { id: 'menstruation', name: 'Menstruation Cycle', category: 'health', description: 'Predict next period and ovulation dates.', path: '/health/menstruation' },
  { id: 'pregnancy-weight-gain', name: 'Pregnancy Weight Gain', category: 'health', description: 'Track recommended weight gain during pregnancy.', path: '/health/pregnancy-weight-gain' },
  { id: 'ideal-weight', name: 'Ideal Body Weight', category: 'health', description: 'Find your ideal weight based on height and frame.', path: '/health/ideal-weight' },
  { id: 'iq', name: 'IQ Estimate', category: 'health', description: 'Estimate IQ based on mental and chronological age.', path: '/health/iq' },
  { id: 'bra-size', name: 'Bra Size', category: 'health', description: 'Calculate bra size from band and bust measurements.', path: '/health/bra-size' },
  { id: 'sleep', name: 'Sleep Calculator', category: 'health', description: 'Find the best times to go to sleep or wake up.', path: '/health/sleep' },
  
  // Unit Converter
  { id: 'length-converter', name: 'Length Converter', category: 'unit-converter', description: 'Convert between mm, cm, m, km, inch, feet, yards, and miles.', path: '/unit-converter/length-converter' },
  { id: 'weight-converter', name: 'Weight Converter', category: 'unit-converter', description: 'Convert Grams, Kilograms, Pounds, Ounces, and Stones.', path: '/unit-converter/weight-converter' },
  { id: 'time-converter', name: 'Time Converter', category: 'unit-converter', description: 'Convert Milliseconds, Seconds, Minutes, Hours, Days, Weeks, Years.', path: '/unit-converter/time-converter' },
  { id: 'currency-converter', name: 'Currency Converter', category: 'unit-converter', description: 'Convert between major world currencies (USD, INR, EUR, GBP, etc.).', path: '/unit-converter/currency-converter' },
  { id: 'si-unit-converter', name: 'SI Unit Converter', category: 'unit-converter', description: 'Scientific converter for Energy, Power, Pressure, Speed, Area, and Volume.', path: '/unit-converter/si-unit-converter' },

  // Construction
  { id: 'concrete', name: 'Concrete', category: 'construction', description: 'Estimate concrete bags and volume for slabs/footings.', path: '/construction/concrete' },
  { id: 'tile', name: 'Tile', category: 'construction', description: 'Calculate number of tiles needed for a floor/wall.', path: '/construction/tile' },
  { id: 'roofing', name: 'Roofing', category: 'construction', description: 'Estimate shingles needed for roof area.', path: '/construction/roofing' },
  { id: 'mulch', name: 'Mulch', category: 'construction', description: 'Calculate cubic yards of mulch for landscaping.', path: '/construction/mulch' },
  { id: 'gravel', name: 'Gravel', category: 'construction', description: 'Estimate tons of gravel required for driveways.', path: '/construction/gravel' },
  { id: 'stair', name: 'Stair', category: 'construction', description: 'Calculate rise, run, and number of steps.', path: '/construction/stair' },
  { id: 'btu', name: 'BTU', category: 'construction', description: 'Calculate air conditioner size for a room.', path: '/construction/btu' },
  
  // Misc
  { id: 'hyper-scientific', name: 'Hyper Scientific', category: 'miscellaneous', description: 'Advanced depth and lithospheric analysis for professional engineering.', path: '/miscellaneous/hyper-scientific' },
  { id: 'age', name: 'Age', category: 'miscellaneous', description: 'Calculate precise age from date of birth.', path: '/miscellaneous/age' },
  { id: 'date-difference', name: 'Date Difference', category: 'miscellaneous', description: 'Calculate days between two dates.', path: '/miscellaneous/date-difference' },
  { id: 'time-calculator', name: 'Time Calculator', category: 'miscellaneous', description: 'Add or subtract hours and minutes.', path: '/miscellaneous/time-calculator' },
  { id: 'ip-subnet', name: 'IP Subnet', category: 'miscellaneous', description: 'CIDR calculator for network subnetting.', path: '/miscellaneous/ip-subnet' },
  { id: 'password-generator', name: 'Password Generator', category: 'miscellaneous', description: 'Generate secure random passwords.', path: '/miscellaneous/password-generator' },
  { id: 'fuel-cost', name: 'Fuel Cost', category: 'miscellaneous', description: 'Calculate trip cost based on distance and MPG.', path: '/miscellaneous/fuel-cost' },
  { id: 'gas-mileage', name: 'Gas Mileage', category: 'miscellaneous', description: 'Calculate MPG from odometer readings.', path: '/miscellaneous/gas-mileage' },
  { id: 'ohms-law', name: 'Ohm\'s Law', category: 'miscellaneous', description: 'Calculate Voltage, Current, or Resistance.', path: '/miscellaneous/ohms-law' },
  { id: 'resistor', name: 'Resistor Color Code', category: 'miscellaneous', description: 'Decode 4-band resistor colors.', path: '/miscellaneous/resistor' },
  { id: 'voltage-drop', name: 'Voltage Drop', category: 'miscellaneous', description: 'Calculate voltage drop in wires.', path: '/miscellaneous/voltage-drop' },
  { id: 'bandwidth', name: 'Bandwidth', category: 'miscellaneous', description: 'Calculate download time for files.', path: '/miscellaneous/bandwidth' },
  { id: 'love', name: 'Love Calculator', category: 'miscellaneous', description: 'Check compatibility based on names (Fun).', path: '/miscellaneous/love' },
  { id: 'dice', name: 'Dice Roller', category: 'miscellaneous', description: 'Simulate rolling dice.', path: '/miscellaneous/dice' },
  { id: 'roman-numeral', name: 'Roman Numeral', category: 'miscellaneous', description: 'Convert numbers to Roman numerals.', path: '/miscellaneous/roman-numeral' },
  { id: 'heat-index', name: 'Heat Index', category: 'miscellaneous', description: 'Calculate "feels like" temp from humidity.', path: '/miscellaneous/heat-index' },
  { id: 'wind-chill', name: 'Wind Chill', category: 'miscellaneous', description: 'Calculate "feels like" temp from wind.', path: '/miscellaneous/wind-chill' },
  { id: 'tip', name: 'Tip Calculator', category: 'miscellaneous', description: 'Calculate gratuity and split bills.', path: '/miscellaneous/tip' },
];

export const ADS_CONFIG = {
  loadingTimeMs: 2000,
};
