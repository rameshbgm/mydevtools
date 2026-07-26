/**
 * Self-check for src/lib/credit-card.ts — run with `npm run test:card`.
 *
 * Guards the two things that silently break: the Luhn checksum (a generator
 * that emits invalid numbers looks fine until someone pastes one into a form)
 * and brand detection (longest-prefix wins, e.g. 6521 is RuPay, not UnionPay).
 */
import assert from "node:assert/strict";
import {
    CARD_TYPES,
    luhnCheck,
    detectCardType,
    generateCard,
    generateCardNumber,
    formatCardNumber,
} from "../src/lib/credit-card";

// Known-good published test numbers must pass Luhn.
for (const known of ["4111111111111111", "5500000000000004", "378282246310005", "6011111111111117", "3530111333300000"]) {
    assert.equal(luhnCheck(known), true, `${known} should pass Luhn`);
}

// A single transposed digit must fail.
assert.equal(luhnCheck("4111111111111112"), false, "bad checksum should fail Luhn");
assert.equal(luhnCheck(""), false, "empty string is not a card");

// Every brand, every supported length: generated numbers are Luhn-valid,
// exactly the requested length, and detect back to the same brand.
for (const type of CARD_TYPES) {
    for (const len of type.lengths) {
        for (let i = 0; i < 50; i++) {
            const num = generateCardNumber(type, len);
            assert.equal(num.length, len, `${type.name} length ${len} got ${num.length}`);
            assert.equal(luhnCheck(num), true, `${type.name} generated invalid Luhn: ${num}`);
            assert.match(num, /^\d+$/, `${type.name} produced non-digits: ${num}`);
        }
    }
}

// Longest-prefix detection: overlapping prefixes resolve to the more specific brand.
assert.equal(detectCardType("6521000000000000")?.name, "RuPay", "6521 should beat UnionPay's 65-family");
assert.equal(detectCardType("4111111111111111")?.name, "Visa");
assert.equal(detectCardType("378282246310005")?.name, "American Express");
assert.equal(detectCardType("")?.name, undefined, "empty input has no brand");

// Amex groups 4-6-5; everything else in fours.
assert.equal(formatCardNumber("378282246310005", "American Express"), "3782 822463 10005");
assert.equal(formatCardNumber("4111111111111111", "Visa"), "4111 1111 1111 1111");

// Full record: CVV width follows the brand, expiry is in the future.
const amex = CARD_TYPES.find((t) => t.name === "American Express")!;
const card = generateCard(amex);
assert.equal(card.cvv.length, 4, "Amex CID is 4 digits");
const [mm, yy] = card.expiry.split("/").map(Number);
const exp = new Date(2000 + yy, mm - 1, 1);
assert.ok(exp > new Date(), `expiry ${card.expiry} should be in the future`);

const visaCard = generateCard(CARD_TYPES.find((t) => t.name === "Visa")!, 16);
assert.equal(visaCard.cvv.length, 3, "Visa CVV is 3 digits");
assert.equal(visaCard.number.length, 16);
assert.equal(luhnCheck(visaCard.number), true);

console.log("✓ credit-card.test.ts — all checks passed");
