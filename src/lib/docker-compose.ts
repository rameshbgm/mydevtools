import { asRecord, getArray, getString, isRecord } from "@/lib/structured-data";

export type ComposeFinding = { severity: "error" | "warning" | "info"; service?: string; message: string };
export type ComposeSummary = { services: number; networks: number; volumes: number; findings: ComposeFinding[] };

export function analyseComposeDocument(value: unknown): ComposeSummary {
    const document = asRecord(value);
    const services = asRecord(document.services);
    const findings: ComposeFinding[] = [];
    if (!Object.keys(services).length) findings.push({ severity: "error", message: "No services were declared under `services`." });
    for (const [name, rawService] of Object.entries(services)) {
        const service = asRecord(rawService);
        if (!getString(service.image) && !getString(service.build) && !isRecord(service.build)) findings.push({ severity: "error", service: name, message: "Service needs an image or build definition." });
        if (service.privileged === true) findings.push({ severity: "warning", service: name, message: "Privileged containers have broad host access." });
        if (getString(service.network_mode) === "host") findings.push({ severity: "warning", service: name, message: "Host networking bypasses normal container network isolation." });
        if (!service.healthcheck) findings.push({ severity: "info", service: name, message: "No healthcheck is defined." });
        for (const port of getArray(service.ports)) {
            const portText = typeof port === "string" ? port : JSON.stringify(port);
            if (portText.includes("0.0.0.0") || /^\d+:[\d/]+$/.test(portText)) findings.push({ severity: "info", service: name, message: `Host port exposure: ${portText}.` });
        }
    }
    return { services: Object.keys(services).length, networks: Object.keys(asRecord(document.networks)).length, volumes: Object.keys(asRecord(document.volumes)).length, findings };
}
