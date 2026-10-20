export type DataBoundary = "local" | "direct" | "managed" | "network";

const BOUNDARIES: Record<string, DataBoundary> = {
    "data-explorer": "network",
    "s3-browser": "network",
    "whois-rdap": "managed",
    "redis-browser": "network",
    "email-validator": "direct",
    "sql-client": "network",
    "token-counter": "direct",
    "api-request-builder": "network", "mcp-inspector": "network", "a2a-inspector": "network",
    "certificate-inspector": "network", "ssl-checker": "managed", "certificate-chain-validator": "managed",
    "webhook-receiver": "managed", "dns-lookup": "direct", "websocket-tester": "direct",
    "cors-tester": "network", "soap-client": "network", "wsdl-parser": "network",
    "swagger-ui": "network", "rag-search": "network",
};

export const BOUNDARY_LABELS: Record<DataBoundary, string> = {
    local: "Local processing", direct: "Connects directly from your browser",
    managed: "Uses the mydevtools server", network: "Network features · view data disclosure",
};
export function dataBoundaryForTool(id?: string | null): DataBoundary { return id ? BOUNDARIES[id] ?? "local" : "local"; }
