import { validate, version, v3, v4, v5, v7 } from "uuid";
export function generateUuids(count: number, selectedVersion: 4 | 7): string[] {
    if (!Number.isInteger(count) || count < 1 || count > 1000) throw new Error("Choose an integer count from 1 to 1000.");
    return Array.from({ length: count }, () => selectedVersion === 7 ? v7() : v4());
}
export const UUID_NAMESPACES = { DNS: v5.DNS, URL: v5.URL, OID: "6ba7b812-9dad-11d1-80b4-00c04fd430c8", X500: "6ba7b814-9dad-11d1-80b4-00c04fd430c8" };
export function generateNamedUuids(names: string[], namespace: string, selectedVersion: 3 | 5): string[] {
    if (!validate(namespace)) throw new Error("Enter a valid namespace UUID.");
    if (!names.length || names.length > 1000 || names.some((name) => !name.length || name.length > 10_000) || names.join("\n").length > 1_000_000) throw new Error("Enter 1–1000 nonempty names, up to 10,000 characters each and one million characters total.");
    return names.map((name) => (selectedVersion === 3 ? v3 : v5)(name, namespace));
}
const ULID_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const RANDOM_MAX = (BigInt(1) << BigInt(80)) - BigInt(1);
/** Page-session monotonic sequence: clock rollback keeps the previous timestamp. */
export function createUlidGenerator(random: (bytes: Uint8Array) => Uint8Array = (bytes) => crypto.getRandomValues(bytes)) {
    let lastTime = -1, lastRandom = BigInt(0);
    return (now = Date.now()): string => {
        if (!Number.isSafeInteger(now) || now < 0 || now > 0xffffffffffff) throw new Error("ULID timestamp must be an integer from 0 through 281474976710655 milliseconds.");
        if (now <= lastTime) { if (lastRandom === RANDOM_MAX) throw new Error("ULID random component overflowed. Retry after the clock advances."); lastRandom++; }
        else { const entropy = random(new Uint8Array(10)); if (entropy.length !== 10) throw new Error("ULID randomness must contain ten bytes."); lastRandom = Array.from(entropy).reduce((value, byte) => (value << BigInt(8)) | BigInt(byte), BigInt(0)); lastTime = now; }
        let value = (BigInt(lastTime) << BigInt(80)) | lastRandom, output = "";
        for (let index = 0; index < 26; index++) { output = ULID_ALPHABET[Number(value & BigInt(31))] + output; value >>= BigInt(5); }
        return output;
    };
}
const nextUlid = createUlidGenerator();
export function generateUlids(count: number): string[] {
    if (!Number.isInteger(count) || count < 1 || count > 1000) throw new Error("Choose an integer count from 1 to 1000.");
    return Array.from({ length: count }, () => nextUlid());
}
export function inspectUlid(input: string) {
    const ulid = input.trim().toUpperCase();
    if (!/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/.test(ulid)) throw new Error("Enter a valid 26-character ULID without I, L, O or U.");
    let value = BigInt(0); for (const character of ulid) value = (value << BigInt(5)) | BigInt(ULID_ALPHABET.indexOf(character));
    const unixMilliseconds = Number(value >> BigInt(80));
    return { ulid, unixMilliseconds, timestamp: new Date(unixMilliseconds).toISOString(), randomnessHex: (value & RANDOM_MAX).toString(16).padStart(20, "0") };
}
export function inspectUuid(input: string) {
    const uuid = input.trim().toLowerCase();
    if (!validate(uuid)) throw new Error("Enter a valid RFC 9562 UUID.");
    const selectedVersion = version(uuid);
    const unixMilliseconds = selectedVersion === 7 ? parseInt(uuid.replace(/-/g, "").slice(0, 12), 16) : null;
    return { uuid, version: selectedVersion, variant: uuid === "00000000-0000-0000-0000-000000000000" ? "Nil" : uuid === "ffffffff-ffff-ffff-ffff-ffffffffffff" ? "Max" : "RFC 9562", unixMilliseconds, timestamp: unixMilliseconds === null ? null : new Date(unixMilliseconds).toISOString() };
}
