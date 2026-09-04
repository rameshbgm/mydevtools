import assert from "node:assert";
import { createPinnedLookup, isPublicIp } from "../src/lib/server-network-policy";

const blocked = [
    "127.0.0.1", "10.0.0.1", "100.64.0.1", "169.254.169.254", "172.16.0.1",
    "192.168.1.1", "198.18.0.1", "::", "0:0:0:0:0:0:0:0", "::1", "fc00::1", "fd12::1", "fe80::1",
    "2001:db8::1", "::ffff:127.0.0.1", "::ffff:7f00:1", "::7f00:1",
];
for (const address of blocked) assert.equal(isPublicIp(address), false, `${address} must be blocked`);
for (const address of ["1.1.1.1", "8.8.8.8", "2606:4700:4700::1111"]) {
    assert.equal(isPublicIp(address), true, `${address} must be allowed`);
}
assert.equal(isPublicIp("::ffff:808:808"), true, "public IPv4-mapped IPv6 must be allowed");

const lookup = createPinnedLookup([{ address: "1.1.1.1", family: 4 }]);
(async () => {
    await new Promise<void>((resolve, reject) => {
        lookup("example.com", { all: true }, (error, addresses) => {
            try {
                assert.ifError(error);
                assert.deepEqual(addresses, [{ address: "1.1.1.1", family: 4 }]);
                resolve();
            } catch (assertionError) {
                reject(assertionError);
            }
        });
    });
    console.log(`✓ ${blocked.length + 4}/${blocked.length + 4} network policy assertions passed`);
})().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
