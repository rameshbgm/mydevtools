/**
 * Shared credit-card brand data and Luhn helpers.
 *
 * Used by the Credit Card Validator (detect + verify) and the Credit Card
 * Generator (synthesise Luhn-valid test numbers). Everything here is pure and
 * client-side — these are fake numbers for testing payment forms, they carry no
 * account behind them and will be declined by any real processor.
 */

export interface CardType {
    name: string;
    prefixes: number[];
    lengths: number[];
    /** Brand colour, used for the card-face gradient and tags. */
    color: string;
    /** Length of the security code (CVV / CVC / CID). */
    cvvLength: number;
}

export const CARD_TYPES: CardType[] = [
    { name: "Visa", prefixes: [4], lengths: [13, 16, 19], color: "#1a1f71", cvvLength: 3 },
    { name: "Mastercard", prefixes: [51, 52, 53, 54, 55, 2221, 2720], lengths: [16], color: "#eb001b", cvvLength: 3 },
    { name: "American Express", prefixes: [34, 37], lengths: [15], color: "#006fcf", cvvLength: 4 },
    { name: "Discover", prefixes: [6011, 644, 645, 646, 647, 648, 649, 65], lengths: [16, 19], color: "#ff6000", cvvLength: 3 },
    { name: "JCB", prefixes: [3528, 3589], lengths: [16, 19], color: "#0b4ea2", cvvLength: 3 },
    { name: "Diners Club", prefixes: [300, 301, 302, 303, 304, 305, 36, 38], lengths: [14, 16, 19], color: "#004c97", cvvLength: 3 },
    { name: "Maestro", prefixes: [5018, 5020, 5038, 5893, 6304, 6759, 6761, 6762, 6763], lengths: [12, 13, 14, 15, 16, 17, 18, 19], color: "#cc0000", cvvLength: 3 },
    { name: "UnionPay", prefixes: [62, 81], lengths: [16, 17, 18, 19], color: "#e21836", cvvLength: 3 },
    { name: "RuPay", prefixes: [60, 6521, 6522], lengths: [16], color: "#097969", cvvLength: 3 },
    { name: "Elo", prefixes: [4011, 4312, 4389, 5041, 5067, 6277, 6362, 6363], lengths: [16], color: "#ffcb05", cvvLength: 3 },
    { name: "Hipercard", prefixes: [606282, 3841], lengths: [16, 19], color: "#822124", cvvLength: 3 },
    { name: "Mir", prefixes: [2200, 2201, 2202, 2203, 2204], lengths: [16, 17, 18, 19], color: "#0f754e", cvvLength: 3 },
    { name: "Troy", prefixes: [9792, 65], lengths: [16], color: "#00a1a7", cvvLength: 3 },
    { name: "InterPayment", prefixes: [636], lengths: [16, 17, 18, 19], color: "#5b5b5b", cvvLength: 3 },
];

/** Verify a card number's Luhn (mod-10) checksum. */
export function luhnCheck(cardNumber: string): boolean {
    const digits = cardNumber.replace(/\D/g, "");
    if (!digits) return false;

    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
        let digit = parseInt(digits[i], 10);

        if (isEven) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }

        sum += digit;
        isEven = !isEven;
    }

    return sum % 10 === 0;
}

/**
 * Identify the brand from a (possibly partial) number.
 * Longest prefix wins, so `6521…` resolves to RuPay rather than UnionPay.
 */
export function detectCardType(cardNumber: string): CardType | null {
    const digits = cardNumber.replace(/\D/g, "");
    if (!digits) return null;

    let best: CardType | null = null;
    let bestLen = 0;

    for (const cardType of CARD_TYPES) {
        for (const prefix of cardType.prefixes) {
            const p = prefix.toString();
            if (digits.startsWith(p) && p.length > bestLen) {
                best = cardType;
                bestLen = p.length;
            }
        }
    }

    return best;
}

/** Append the Luhn check digit to a partial number. */
export function appendLuhnCheckDigit(partial: string): string {
    let sum = 0;
    let isEven = true;

    for (let i = partial.length - 1; i >= 0; i--) {
        let digit = parseInt(partial[i], 10);

        if (isEven) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }

        sum += digit;
        isEven = !isEven;
    }

    const checkDigit = (10 - (sum % 10)) % 10;
    return partial + checkDigit;
}

/**
 * Generate one Luhn-valid number for a brand.
 * `length` picks a specific supported length; omit it for a random one.
 */
export function generateCardNumber(cardType: CardType, length?: number): string {
    const prefix = cardType.prefixes[Math.floor(Math.random() * cardType.prefixes.length)];
    const len =
        length && cardType.lengths.includes(length)
            ? length
            : cardType.lengths[Math.floor(Math.random() * cardType.lengths.length)];

    let number = prefix.toString();
    while (number.length < len - 1) {
        number += Math.floor(Math.random() * 10);
    }
    // A prefix longer than the target length would overflow — trim before the check digit.
    number = number.slice(0, len - 1);

    return appendLuhnCheckDigit(number);
}

/** Group digits for display: 4-6-5 for Amex, otherwise groups of 4. */
export function formatCardNumber(number: string, brand?: string | null): string {
    const digits = number.replace(/\D/g, "");

    if (brand === "American Express") {
        return [digits.slice(0, 4), digits.slice(4, 10), digits.slice(10)].filter(Boolean).join(" ");
    }

    const groups: string[] = [];
    for (let i = 0; i < digits.length; i += 4) {
        groups.push(digits.slice(i, i + 4));
    }
    return groups.join(" ");
}

const FIRST_NAMES = ["ALEX", "JORDAN", "TAYLOR", "MORGAN", "CASEY", "RILEY", "AVERY", "QUINN", "SAM", "JAMIE"];
const LAST_NAMES = ["MORGAN", "REYES", "OKAFOR", "NAKAMURA", "DUBOIS", "SILVA", "NOVAK", "AHMED", "KELLY", "PATEL"];

export interface GeneratedCard {
    brand: string;
    color: string;
    number: string;
    formatted: string;
    cvv: string;
    expiry: string;
    holder: string;
    length: number;
}

/** Build a full fake card record: number, CVV, future expiry, holder name. */
export function generateCard(cardType: CardType, length?: number): GeneratedCard {
    const number = generateCardNumber(cardType, length);

    const cvv = Array.from({ length: cardType.cvvLength }, () => Math.floor(Math.random() * 10)).join("");

    // Expiry between 1 and 60 months out, so cards are always still valid.
    const now = new Date();
    const expDate = new Date(now.getFullYear(), now.getMonth() + 1 + Math.floor(Math.random() * 59), 1);
    const expiry = `${String(expDate.getMonth() + 1).padStart(2, "0")}/${String(expDate.getFullYear()).slice(-2)}`;

    const holder = `${FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]} ${
        LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]
    }`;

    return {
        brand: cardType.name,
        color: cardType.color,
        number,
        formatted: formatCardNumber(number, cardType.name),
        cvv,
        expiry,
        holder,
        length: number.length,
    };
}
