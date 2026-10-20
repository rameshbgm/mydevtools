import net from "node:net";
import { ConnectorHttpError } from "./local-connector-auth";
export function connectorHost(value: unknown): string {
    if (typeof value !== "string" || !value || value.length > 253 || /[\s/\\@?#]/.test(value)) throw new ConnectorHttpError("Enter a hostname or IP address without a URL, path or credentials.", 400);
    const host = value.replace(/^\[|\]$/g, "");
    let checkedHost = host;
    if (net.isIP(host) === 6) {
        const normalized = new net.SocketAddress({ address: host, family: "ipv6" }).address;
        checkedHost = normalized;
        // IPv4-mapped IPv6 literals must not bypass the same link-local and
        // multicast checks applied to their underlying IPv4 destinations.
        if (normalized.startsWith("::ffff:")) connectorHost(normalized.slice(7));
    }
    if (/^169\.254\.|^0\.|^fe[89ab][0-9a-f]:|^ff[0-9a-f]{0,2}:/i.test(checkedHost) || checkedHost === "::" || net.isIP(checkedHost) === 4 && Number(checkedHost.split(".")[0]) >= 224 || !net.isIP(checkedHost) && !/^[a-z\d](?:[a-z\d.-]*[a-z\d])?$/i.test(checkedHost)) throw new ConnectorHttpError("Use a database/service host; link-local, unspecified and multicast addresses are not supported.", 400);
    return host;
}
export function connectorPort(value: unknown): number { if (typeof value !== "number" || !Number.isInteger(value) || value < 1 || value > 65535) throw new ConnectorHttpError("Enter a port from 1 to 65535.", 400); return value; }
export function connectorText(value: unknown, label: string, max = 4096, allowEmpty = true): string { if (typeof value !== "string" || value.length > max || !allowEmpty && !value) throw new ConnectorHttpError(`Check ${label} (up to ${max} characters).`, 400); return value; }
export function connectorObject(value: unknown): Record<string, unknown> { if (!value || typeof value !== "object" || Array.isArray(value)) throw new ConnectorHttpError("Enter connection settings as an object.", 400); return value as Record<string, unknown>; }
