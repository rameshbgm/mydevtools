"use client";
import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { lookupEmailMx, type MxDiagnostic, type MX_RESOLVERS } from "@/lib/email-mx";
const STATUS = {
    mx: "MX records found. The domain publishes mail exchangers; this does not verify the mailbox or delivery.",
    "null-mx": "Null MX: this domain explicitly states that it does not accept email (RFC 7505).",
    implicit: "No MX records. Address records exist, so SMTP can attempt implicit delivery to the domain. This does not verify that an SMTP service is running.",
    "no-address": "No MX or fallback A/AAAA address records were returned. Delivery is not currently discoverable through these DNS answers.",
    nxdomain: "NXDOMAIN: the resolver reports that this domain does not exist.",
    "invalid-mx": "Invalid null-MX configuration: the root target must be the only MX record with priority 0. Review the domain’s DNS configuration.",
};
const KNOWN_DNS_ERRORS = new Set(["Enter an email domain without a protocol or path.", "Enter a valid public domain name.", "The resolver truncated its response. Retry with the other resolver.", "The resolver returned malformed MX data.", "MX was absent, but the fallback address lookup failed. Retry before drawing a conclusion.", "DNS resolver returned an empty response.", "DNS response exceeds 64 KiB.", "DNS resolver response has an invalid shape.", "Choose a supported DNS resolver."]);
export default function EmailMxDiagnostic({ domain }: { domain: string }) {
    const { t, direction } = useLanguage();
    const [resolver, setResolver] = useState<keyof typeof MX_RESOLVERS>("cloudflare"), [result, setResult] = useState<MxDiagnostic | null>(null), [error, setError] = useState(""), [busy, setBusy] = useState(false);
    const renderError = (detail: string) => {
        if (KNOWN_DNS_ERRORS.has(detail)) return t(detail);
        const http = /^DNS resolver returned HTTP (\d+)\.$/.exec(detail);
        if (http) return t("DNS resolver returned HTTP {status}.", { status: http[1] });
        const status = /^DNS resolver returned status (\d+)\. This does not establish whether mail is accepted\.$/.exec(detail);
        if (status) return t("DNS resolver returned status {status}. This does not establish whether mail is accepted.", { status: status[1] });
        return <>{t("DNS lookup failed. Resolver details:")} <bdi dir="ltr">{detail}</bdi></>;
    };
    const visible = result?.domain === domain.toLowerCase() ? result : null;
    return <section className="wb-workbench" dir={direction} style={{ marginTop: 24 }}><h2>{t("Email domain MX diagnostics")}</h2><p>{t("Only the domain is sent directly to the selected public DNS-over-HTTPS resolver when you click. The email address and local part stay in your browser. DNS records cannot confirm whether a mailbox exists.")}</p><label>{t("Domain from the single email")}<input readOnly value={domain} dir="ltr" aria-label={t("Domain from the single email")} placeholder={t("Enter a valid email above")} /></label><label>{t("DNS resolver")}<select value={resolver} disabled={busy} onChange={(event) => { setResolver(event.target.value as keyof typeof MX_RESOLVERS); setResult(null); setError(""); }}><option value="cloudflare">Cloudflare</option><option value="google">Google Public DNS</option></select></label>
        <button disabled={!domain || busy} onClick={async () => { setBusy(true); setResult(null); setError(""); try { setResult(await lookupEmailMx(domain, resolver)); } catch (cause) { setError(cause instanceof Error ? cause.message : String(cause)); } finally { setBusy(false); } }}>{busy ? t("Checking DNS…") : t("Check domain MX")}</button>
        {error && <p role="alert">{renderError(error)}</p>}{visible && <><p role="status">{t(STATUS[visible.status])}</p>{visible.records.length > 0 && <div className="wb-table-scroll"><table className="wb-data-table"><thead><tr><th>{t("Priority")}</th><th>{t("Mail exchanger")}</th><th>{t("TTL (seconds)")}</th></tr></thead><tbody>{visible.records.map((record, index) => <tr key={index}><td>{record.priority}</td><td><bdi dir="ltr">{record.exchange}</bdi></td><td>{record.ttl}</td></tr>)}</tbody></table></div>}{visible.addresses.length > 0 && <p>{t("Fallback addresses:")} <bdi dir="ltr">{visible.addresses.join(", ")}</bdi></p>}<p>{t(visible.authenticated ? "The resolver set the DNSSEC authenticated-data flag." : "The resolver did not set the DNSSEC authenticated-data flag.")} {t("Results reflect this resolver’s cache at lookup time.")}</p></>}
    </section>;
}
