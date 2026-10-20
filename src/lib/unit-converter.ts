export interface PhysicalUnit { symbol: string; name: string; factor: number; offset?: number }
export interface UnitCategory { name: string; units: PhysicalUnit[] }
const units = (rows: [string, string, number, number?][]): PhysicalUnit[] => rows.map(([symbol, name, factor, offset]) => ({ symbol, name, factor, ...(offset === undefined ? {} : { offset }) }));
export const UNIT_CATEGORIES: UnitCategory[] = [
    { name: "Length", units: units([["m", "Metre", 1], ["mm", "Millimetre", .001], ["cm", "Centimetre", .01], ["km", "Kilometre", 1000], ["µm", "Micrometre", 1e-6], ["nm", "Nanometre", 1e-9], ["in", "Inch", .0254], ["ft", "International foot", .3048], ["yd", "Yard", .9144], ["mi", "International mile", 1609.344], ["nmi", "Nautical mile", 1852]]) },
    { name: "Mass", units: units([["kg", "Kilogram", 1], ["g", "Gram", .001], ["mg", "Milligram", 1e-6], ["µg", "Microgram", 1e-9], ["t", "Metric tonne", 1000], ["lb", "Avoirdupois pound", .45359237], ["oz", "Avoirdupois ounce", .028349523125], ["st", "Stone", 6.35029318], ["ton US", "US short ton", 907.18474], ["ton UK", "Imperial long ton", 1016.0469088]]) },
    { name: "Temperature", units: units([["K", "Kelvin", 1], ["°C", "Celsius", 1, 273.15], ["°F", "Fahrenheit", 5 / 9, 459.67], ["°R", "Rankine", 5 / 9]]) },
    { name: "Time", units: units([["s", "Second", 1], ["ms", "Millisecond", .001], ["µs", "Microsecond", 1e-6], ["ns", "Nanosecond", 1e-9], ["min", "Minute", 60], ["h", "Hour", 3600], ["d", "Day (24 hours)", 86400], ["wk", "Week", 604800]]) },
    { name: "Area", units: units([["m²", "Square metre", 1], ["mm²", "Square millimetre", 1e-6], ["cm²", "Square centimetre", .0001], ["km²", "Square kilometre", 1e6], ["ha", "Hectare", 10000], ["acre", "International acre", 4046.8564224], ["ft²", "Square foot", .09290304], ["in²", "Square inch", .00064516]]) },
    { name: "Volume", units: units([["m³", "Cubic metre", 1], ["L", "Litre", .001], ["mL", "Millilitre", 1e-6], ["cm³", "Cubic centimetre", 1e-6], ["ft³", "Cubic foot", .028316846592], ["in³", "Cubic inch", .000016387064], ["gal US", "US liquid gallon", .003785411784], ["gal UK", "Imperial gallon", .00454609], ["fl oz US", "US fluid ounce", .0000295735295625], ["fl oz UK", "Imperial fluid ounce", .0000284130625]]) },
    { name: "Speed", units: units([["m/s", "Metres per second", 1], ["km/h", "Kilometres per hour", 1 / 3.6], ["mph", "Miles per hour", .44704], ["kn", "Knot", 1852 / 3600], ["ft/s", "Feet per second", .3048], ["cm/s", "Centimetres per second", .01]]) },
    { name: "Acceleration", units: units([["m/s²", "Metres per second squared", 1], ["ft/s²", "Feet per second squared", .3048], ["g₀", "Standard gravity", 9.80665], ["Gal", "Galileo", .01]]) },
    { name: "Force", units: units([["N", "Newton", 1], ["kN", "Kilonewton", 1000], ["mN", "Millinewton", .001], ["dyn", "Dyne", 1e-5], ["lbf", "Pound-force", 4.4482216152605], ["kgf", "Kilogram-force", 9.80665], ["ozf", "Ounce-force", .27801385095378125]]) },
    { name: "Pressure", units: units([["Pa", "Pascal", 1], ["kPa", "Kilopascal", 1000], ["MPa", "Megapascal", 1e6], ["bar", "Bar", 1e5], ["mbar", "Millibar", 100], ["atm", "Standard atmosphere", 101325], ["Torr", "Torr", 101325 / 760], ["psi", "Pound-force per square inch", 6894.757293168361], ["psf", "Pound-force per square foot", 47.88025898033584]]) },
    { name: "Energy", units: units([["J", "Joule", 1], ["kJ", "Kilojoule", 1000], ["MJ", "Megajoule", 1e6], ["Wh", "Watt-hour", 3600], ["kWh", "Kilowatt-hour", 3.6e6], ["cal th", "Thermochemical calorie", 4.184], ["kcal th", "Thermochemical kilocalorie", 4184], ["BTU IT", "International Table BTU", 1055.05585262], ["eV", "Electronvolt", 1.602176634e-19], ["ft·lbf", "Foot-pound force", 1.3558179483314004]]) },
    { name: "Power", units: units([["W", "Watt", 1], ["mW", "Milliwatt", .001], ["kW", "Kilowatt", 1000], ["MW", "Megawatt", 1e6], ["hp", "Mechanical horsepower", 745.6998715822702], ["PS", "Metric horsepower", 735.49875], ["BTU IT/h", "BTU IT per hour", 1055.05585262 / 3600]]) },
    { name: "Frequency", units: units([["Hz", "Hertz", 1], ["kHz", "Kilohertz", 1e3], ["MHz", "Megahertz", 1e6], ["GHz", "Gigahertz", 1e9], ["rpm", "Revolutions per minute", 1 / 60]]) },
    { name: "Angle", units: units([["rad", "Radian", 1], ["°", "Degree", Math.PI / 180], ["gon", "Gradian", Math.PI / 200], ["turn", "Full turn", 2 * Math.PI], ["arcmin", "Arcminute", Math.PI / 10800], ["arcsec", "Arcsecond", Math.PI / 648000]]) },
    { name: "Torque", units: units([["N·m", "Newton-metre", 1], ["N·cm", "Newton-centimetre", .01], ["lbf·ft", "Pound-force foot", 1.3558179483314004], ["lbf·in", "Pound-force inch", .1129848290276167], ["kgf·m", "Kilogram-force metre", 9.80665]]) },
    { name: "Density", units: units([["kg/m³", "Kilograms per cubic metre", 1], ["g/cm³", "Grams per cubic centimetre", 1000], ["g/L", "Grams per litre", 1], ["lb/ft³", "Pounds per cubic foot", .45359237 / .028316846592], ["lb/gal US", "Pounds per US gallon", .45359237 / .003785411784]]) },
    { name: "Dynamic viscosity", units: units([["Pa·s", "Pascal-second", 1], ["mPa·s", "Millipascal-second", .001], ["P", "Poise", .1], ["cP", "Centipoise", .001], ["µPa·s", "Micropascal-second", 1e-6]]) },
    { name: "Kinematic viscosity", units: units([["m²/s", "Square metres per second", 1], ["mm²/s", "Square millimetres per second", 1e-6], ["St", "Stokes", 1e-4], ["cSt", "Centistokes", 1e-6]]) },
    { name: "Electric current", units: units([["A", "Ampere", 1], ["mA", "Milliampere", .001], ["µA", "Microampere", 1e-6], ["kA", "Kiloampere", 1000]]) },
    { name: "Voltage", units: units([["V", "Volt", 1], ["mV", "Millivolt", .001], ["µV", "Microvolt", 1e-6], ["kV", "Kilovolt", 1000], ["MV", "Megavolt", 1e6]]) },
    { name: "Resistance", units: units([["Ω", "Ohm", 1], ["mΩ", "Milliohm", .001], ["kΩ", "Kiloohm", 1000], ["MΩ", "Megaohm", 1e6]]) },
    { name: "Capacitance", units: units([["F", "Farad", 1], ["mF", "Millifarad", 1e-3], ["µF", "Microfarad", 1e-6], ["nF", "Nanofarad", 1e-9], ["pF", "Picofarad", 1e-12]]) },
    { name: "Inductance", units: units([["H", "Henry", 1], ["mH", "Millihenry", 1e-3], ["µH", "Microhenry", 1e-6], ["nH", "Nanohenry", 1e-9]]) },
    { name: "Electric charge", units: units([["C", "Coulomb", 1], ["mC", "Millicoulomb", .001], ["Ah", "Ampere-hour", 3600], ["mAh", "Milliampere-hour", 3.6], ["e", "Elementary charge", 1.602176634e-19]]) },
    { name: "Conductance", units: units([["S", "Siemens", 1], ["mS", "Millisiemens", 1e-3], ["µS", "Microsiemens", 1e-6], ["kS", "Kilosiemens", 1e3]]) },
    { name: "Magnetic flux", units: units([["Wb", "Weber", 1], ["mWb", "Milliweber", .001], ["µWb", "Microweber", 1e-6], ["Mx", "Maxwell", 1e-8]]) },
    { name: "Magnetic flux density", units: units([["T", "Tesla", 1], ["mT", "Millitesla", 1e-3], ["µT", "Microtesla", 1e-6], ["G", "Gauss", 1e-4]]) },
    { name: "Illuminance", units: units([["lx", "Lux", 1], ["klx", "Kilolux", 1000], ["fc", "Foot-candle", 1 / .09290304], ["ph", "Phot", 10000]]) },
    { name: "Data size", units: units([["B", "Byte", 1], ["bit", "Bit", .125], ["kB", "Kilobyte (decimal)", 1000], ["MB", "Megabyte (decimal)", 1e6], ["GB", "Gigabyte (decimal)", 1e9], ["TB", "Terabyte (decimal)", 1e12], ["KiB", "Kibibyte", 1024], ["MiB", "Mebibyte", 1024 ** 2], ["GiB", "Gibibyte", 1024 ** 3], ["TiB", "Tebibyte", 1024 ** 4]]) },
    { name: "Data rate", units: units([["bit/s", "Bits per second", 1], ["kbit/s", "Kilobits per second", 1000], ["Mbit/s", "Megabits per second", 1e6], ["Gbit/s", "Gigabits per second", 1e9], ["B/s", "Bytes per second", 8], ["MB/s", "Megabytes per second", 8e6], ["MiB/s", "Mebibytes per second", 8 * 1024 ** 2]]) },
    { name: "Volume flow", units: units([["m³/s", "Cubic metres per second", 1], ["m³/h", "Cubic metres per hour", 1 / 3600], ["L/s", "Litres per second", .001], ["L/min", "Litres per minute", .001 / 60], ["gal US/min", "US gallons per minute", .003785411784 / 60], ["ft³/min", "Cubic feet per minute", .028316846592 / 60]]) },
    { name: "Thermal conductivity", units: units([["W/(m·K)", "Watts per metre-kelvin", 1], ["mW/(m·K)", "Milliwatts per metre-kelvin", .001], ["W/(cm·K)", "Watts per centimetre-kelvin", 100], ["BTU IT/(h·ft·°F)", "BTU IT per hour-foot-degree Fahrenheit", 1055.05585262 / 3600 / .3048 * 1.8]]) },
    { name: "Specific heat capacity", units: units([["J/(kg·K)", "Joules per kilogram-kelvin", 1], ["kJ/(kg·K)", "Kilojoules per kilogram-kelvin", 1000], ["J/(g·K)", "Joules per gram-kelvin", 1000], ["cal th/(g·°C)", "Thermochemical calories per gram-degree Celsius", 4184]]) },
    { name: "Surface tension", units: units([["N/m", "Newtons per metre", 1], ["mN/m", "Millinewtons per metre", .001], ["dyn/cm", "Dynes per centimetre", .001], ["lbf/ft", "Pound-force per foot", 4.4482216152605 / .3048]]) },
];
export function convertUnit(input: number, category: string, from: string, to: string): number {
    const group = UNIT_CATEGORIES.find((item) => item.name === category);
    const source = group?.units.find((item) => item.symbol === from), target = group?.units.find((item) => item.symbol === to);
    if (!source || !target || !Number.isFinite(input)) throw new Error("Choose units in one category and enter a finite number.");
    const base = (input + (source.offset ?? 0)) * source.factor;
    if (category === "Temperature" && base < 0) throw new Error("Absolute temperature cannot be below zero kelvin.");
    const result = base / target.factor - (target.offset ?? 0);
    if (!Number.isFinite(result)) throw new Error("The converted value exceeds numeric range.");
    // Remove cancellation noise around affine temperature zeroes without
    // rounding genuinely small linear quantities such as electronvolts.
    if (target.offset && Math.abs(result) <= Number.EPSILON * Math.abs(base / target.factor) * 8) return 0;
    return Object.is(result, -0) ? 0 : result;
}
