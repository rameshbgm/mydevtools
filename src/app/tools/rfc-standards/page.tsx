"use client";

import { useState, useMemo } from "react";
import { Input, Typography, Table, Tag, Card, Tabs, Space, Collapse, Divider } from "antd";
import {
    SearchOutlined,
    SafetyCertificateOutlined,
    LockOutlined,
    GlobalOutlined,
    ApiOutlined,
    LinkOutlined,
    MailOutlined,
    KeyOutlined,
    CloudOutlined,
    DatabaseOutlined,
} from "@ant-design/icons";
import { useLanguage } from "@/components/LanguageProvider";
import { REFERENCE_STANDARDS_TRANSLATIONS } from "@/lib/i18n/reference-standards";
import ToolPageLayout from "@/components/ToolPageLayout";

const { Text, Title } = Typography;

interface RFCStandard {
    rfc: string;
    title: string;
    category: string;
    description: string;
    status: "Internet Standard" | "Draft Standard" | "Proposed Standard" | "Best Current Practice" | "Informational" | "Experimental" | "Historic";
    year: number;
    url: string;
    relatedRFCs?: string[];
    obsoletedBy?: string[];
    keywords: string[];
}

const RFC_STANDARDS: RFCStandard[] = [
{"rfc":"RFC 9846","title":"The Transport Layer Security (TLS) Protocol Version 1.3","category":"Security - TLS","description":"TLS 1.3 specification replacing RFC 8446; also updates TLS 1.2 requirements.","status":"Proposed Standard","year":2026,"url":"https://www.rfc-editor.org/rfc/rfc9846.html","relatedRFCs":["RFC 5077","RFC 5246","RFC 6961","RFC 7627","RFC 8422","RFC 8446"],"keywords":["tls","security","tls1.3","9846"]},
{"rfc":"RFC 9989","title":"Domain-Based Message Authentication, Reporting, and Conformance (DMARC)","category":"Email","description":"DMARC validation and handling preferences; replaces RFC 7489 and 9091.","status":"Proposed Standard","year":2026,"url":"https://www.rfc-editor.org/rfc/rfc9989.html","relatedRFCs":["RFC 7489","RFC 9091"],"keywords":["dmarc","email","reporting","9989"]},
{"rfc":"RFC 9990","title":"Domain-Based Message Authentication, Reporting, and Conformance (DMARC) Aggregate Reporting","category":"Email","description":"DMARC aggregate XML reports; replaces reporting rules in RFC 7489.","status":"Proposed Standard","year":2026,"url":"https://www.rfc-editor.org/rfc/rfc9990.html","relatedRFCs":["RFC 7489"],"keywords":["dmarc","email","reporting","9990"]},
{"rfc":"RFC 9991","title":"Domain-Based Message Authentication, Reporting, and Conformance (DMARC) Failure Reporting","category":"Email","description":"DMARC individual-message failure reports; replaces RFC 7489 and updates 6591.","status":"Proposed Standard","year":2026,"url":"https://www.rfc-editor.org/rfc/rfc9991.html","relatedRFCs":["RFC 7489"],"keywords":["dmarc","email","reporting","9991"]},
    { rfc: "RFC 9700", title: "Best Current Practice for OAuth 2.0 Security", category: "Security - OAuth", description: "OAuth security guidance: use PKCE S256; do not use password grants.", status: "Best Current Practice", year: 2025, url: "https://www.rfc-editor.org/rfc/rfc9700.html", relatedRFCs: ["RFC 6749", "RFC 6750", "RFC 7636"], keywords: ["oauth", "security", "bcp", "pkce", "9700"] },
    { rfc: "RFC 8725", title: "JSON Web Token Best Current Practices", category: "Security - JOSE", description: "Validate JWT algorithms, keys, issuer and audience; decoding is not verification.", status: "Best Current Practice", year: 2020, url: "https://www.rfc-editor.org/rfc/rfc8725.html", relatedRFCs: ["RFC 7519", "RFC 7515"], keywords: ["jwt", "bcp", "algorithm", "issuer", "audience", "8725"] },
    // JWT/JWE/JWS Family (JOSE)
    {
        rfc: "RFC 7519",
        title: "JSON Web Token (JWT)",
        category: "Security - JOSE",
        description: "Compact claims format carried in JWS or JWE.",
        status: "Proposed Standard",
        year: 2015,
        url: "https://datatracker.ietf.org/doc/html/rfc7519",
        relatedRFCs: ["RFC 7515", "RFC 7516", "RFC 7517", "RFC 7518"],
        keywords: ["jwt", "token", "claims", "authentication", "authorization", "json"],
    },
    {
        rfc: "RFC 7515",
        title: "JSON Web Signature (JWS)",
        category: "Security - JOSE",
        description: "JSON-based signed or MAC-protected content.",
        status: "Proposed Standard",
        year: 2015,
        url: "https://datatracker.ietf.org/doc/html/rfc7515",
        relatedRFCs: ["RFC 7516", "RFC 7517", "RFC 7518", "RFC 7519"],
        keywords: ["jws", "signature", "mac", "digital signature", "json", "jose"],
    },
    {
        rfc: "RFC 7516",
        title: "JSON Web Encryption (JWE)",
        category: "Security - JOSE",
        description: "JSON-based authenticated encryption for confidential content.",
        status: "Proposed Standard",
        year: 2015,
        url: "https://datatracker.ietf.org/doc/html/rfc7516",
        relatedRFCs: ["RFC 7515", "RFC 7517", "RFC 7518", "RFC 7519"],
        keywords: ["jwe", "encryption", "confidentiality", "json", "jose", "aes", "rsa"],
    },
    {
        rfc: "RFC 7517",
        title: "JSON Web Key (JWK)",
        category: "Security - JOSE",
        description: "JSON representations of cryptographic keys and key sets.",
        status: "Proposed Standard",
        year: 2015,
        url: "https://datatracker.ietf.org/doc/html/rfc7517",
        relatedRFCs: ["RFC 7515", "RFC 7516", "RFC 7518", "RFC 7519"],
        keywords: ["jwk", "key", "cryptographic key", "json", "jose", "public key", "private key"],
    },
    {
        rfc: "RFC 7518",
        title: "JSON Web Algorithms (JWA)",
        category: "Security - JOSE",
        description: "Algorithm identifiers and requirements for JOSE cryptography.",
        status: "Proposed Standard",
        year: 2015,
        url: "https://datatracker.ietf.org/doc/html/rfc7518",
        relatedRFCs: ["RFC 7515", "RFC 7516", "RFC 7517", "RFC 7519"],
        keywords: ["jwa", "algorithms", "rsa", "ecdsa", "hmac", "aes", "jose"],
    },

    // OAuth 2.0 Family
    {
        rfc: "RFC 6749",
        title: "OAuth 2.0 Authorization Framework",
        category: "Security - OAuth",
        description: "Delegated authorization framework; apply RFC 9700 security guidance.",
        status: "Proposed Standard",
        year: 2012,
        url: "https://datatracker.ietf.org/doc/html/rfc6749",
        relatedRFCs: ["RFC 6750", "RFC 7636", "RFC 8252"],
        keywords: ["oauth", "oauth2", "authorization", "access token", "refresh token", "grant"],
    },
    {
        rfc: "RFC 6750",
        title: "OAuth 2.0 Bearer Token Usage",
        category: "Security - OAuth",
        description: "Bearer token transport; possession enables use, so protect tokens.",
        status: "Proposed Standard",
        year: 2012,
        url: "https://datatracker.ietf.org/doc/html/rfc6750",
        relatedRFCs: ["RFC 6749"],
        keywords: ["oauth", "bearer token", "authorization header", "access token"],
    },
    {
        rfc: "RFC 7636",
        title: "PKCE - Proof Key for Code Exchange",
        category: "Security - OAuth",
        description: "Bind authorization-code redemption to a verifier; prefer S256.",
        status: "Proposed Standard",
        year: 2015,
        url: "https://datatracker.ietf.org/doc/html/rfc7636",
        relatedRFCs: ["RFC 6749"],
        keywords: ["pkce", "oauth", "code verifier", "code challenge", "public client", "spa"],
    },
    {
        rfc: "RFC 8252",
        title: "OAuth 2.0 for Native Apps",
        category: "Security - OAuth",
        description: "OAuth guidance for native apps using external user agents.",
        status: "Best Current Practice",
        year: 2017,
        url: "https://datatracker.ietf.org/doc/html/rfc8252",
        relatedRFCs: ["RFC 6749", "RFC 7636"],
        keywords: ["oauth", "native app", "mobile", "desktop", "cli", "loopback"],
    },
    {
        rfc: "RFC 7662",
        title: "OAuth 2.0 Token Introspection",
        category: "Security - OAuth",
        description: "Query authorization servers for token state and metadata.",
        status: "Proposed Standard",
        year: 2015,
        url: "https://datatracker.ietf.org/doc/html/rfc7662",
        relatedRFCs: ["RFC 6749", "RFC 6750"],
        keywords: ["oauth", "introspection", "token validation", "active", "scope"],
    },
    {
        rfc: "RFC 7009",
        title: "OAuth 2.0 Token Revocation",
        category: "Security - OAuth",
        description: "Endpoint for revoking previously issued OAuth tokens.",
        status: "Proposed Standard",
        year: 2013,
        url: "https://datatracker.ietf.org/doc/html/rfc7009",
        relatedRFCs: ["RFC 6749"],
        keywords: ["oauth", "revocation", "token", "logout", "invalidate"],
    },

    // OpenID Connect (Built on OAuth)
    {
        rfc: "RFC 7033",
        title: "WebFinger",
        category: "Security - Identity",
        description: "Discover entity information, including OpenID Connect issuer discovery.",
        status: "Proposed Standard",
        year: 2013,
        url: "https://datatracker.ietf.org/doc/html/rfc7033",
        relatedRFCs: [],
        keywords: ["webfinger", "discovery", "openid", "identity", "acct"],
    },

    // HTTP Standards
    {
        rfc: "RFC 9110",
        title: "HTTP Semantics",
        category: "HTTP",
        description: "HTTP methods, status codes, fields and representation semantics.",
        status: "Internet Standard",
        year: 2022,
        url: "https://datatracker.ietf.org/doc/html/rfc9110",
        relatedRFCs: ["RFC 9111", "RFC 9112", "RFC 9113"],
        keywords: ["http", "semantics", "methods", "status codes", "headers", "request", "response"],
    },
    {
        rfc: "RFC 9111",
        title: "HTTP Caching",
        category: "HTTP",
        description: "HTTP cache operation, validation and cache-control fields.",
        status: "Internet Standard",
        year: 2022,
        url: "https://datatracker.ietf.org/doc/html/rfc9111",
        relatedRFCs: ["RFC 9110"],
        keywords: ["http", "cache", "cache-control", "etag", "expires", "max-age", "validation"],
    },
    {
        rfc: "RFC 9112",
        title: "HTTP/1.1",
        category: "HTTP",
        description: "HTTP/1.1 message syntax, framing and connection management.",
        status: "Internet Standard",
        year: 2022,
        url: "https://datatracker.ietf.org/doc/html/rfc9112",
        relatedRFCs: ["RFC 9110"],
        keywords: ["http", "http/1.1", "message", "connection", "keep-alive", "chunked"],
    },
    {
        rfc: "RFC 9113",
        title: "HTTP/2",
        category: "HTTP",
        description: "Multiplexed HTTP/2 streams and connection behavior.",
        status: "Proposed Standard",
        year: 2022,
        url: "https://datatracker.ietf.org/doc/html/rfc9113",
        relatedRFCs: ["RFC 9110", "RFC 7541"],
        keywords: ["http", "http/2", "h2", "streams", "multiplexing", "hpack", "server push"],
    },
    {
        rfc: "RFC 9114",
        title: "HTTP/3",
        category: "HTTP",
        description: "HTTP/3 mapping over QUIC; stream loss remains independent.",
        status: "Proposed Standard",
        year: 2022,
        url: "https://datatracker.ietf.org/doc/html/rfc9114",
        relatedRFCs: ["RFC 9110", "RFC 9000"],
        keywords: ["http", "http/3", "h3", "quic", "udp", "0-rtt"],
    },
    {
        rfc: "RFC 7541",
        title: "HPACK: Header Compression for HTTP/2",
        category: "HTTP",
        description: "HTTP/2 header compression with static and dynamic tables.",
        status: "Proposed Standard",
        year: 2015,
        url: "https://datatracker.ietf.org/doc/html/rfc7541",
        relatedRFCs: ["RFC 9113"],
        keywords: ["hpack", "compression", "http/2", "headers", "huffman"],
    },

    // TLS/SSL Standards
    {
        rfc: "RFC 8446",
        title: "TLS 1.3",
        category: "Security - TLS",
        description: "Earlier TLS 1.3 specification; replaced by RFC 9846.",
        status: "Proposed Standard",
        year: 2018,
        url: "https://datatracker.ietf.org/doc/html/rfc8446",
        relatedRFCs: ["RFC 5246"],
        keywords: ["tls", "tls 1.3", "ssl", "encryption", "handshake", "0-rtt", "certificate"],
    obsoletedBy: ["RFC 9846"],},
    {
        rfc: "RFC 5246",
        title: "TLS 1.2",
        category: "Security - TLS",
        description: "TLS 1.2 specification; follow its replacements and deployment guidance.",
        status: "Proposed Standard",
        year: 2008,
        url: "https://datatracker.ietf.org/doc/html/rfc5246",
        relatedRFCs: ["RFC 8446"],
        keywords: ["tls", "tls 1.2", "ssl", "encryption", "cipher suite", "certificate"],
    obsoletedBy: ["RFC 8446","RFC 9846"],},
    {
        rfc: "RFC 6066",
        title: "TLS Extensions",
        category: "Security - TLS",
        description: "TLS extensions including SNI and certificate-status requests.",
        status: "Proposed Standard",
        year: 2011,
        url: "https://datatracker.ietf.org/doc/html/rfc6066",
        relatedRFCs: ["RFC 5246", "RFC 8446"],
        keywords: ["tls", "sni", "server name indication", "ocsp", "extension"],
    },

    // Web Security
    {
        rfc: "RFC 6797",
        title: "HTTP Strict Transport Security (HSTS)",
        category: "Security - Web",
        description: "Tell browsers to require HTTPS for a host.",
        status: "Proposed Standard",
        year: 2012,
        url: "https://datatracker.ietf.org/doc/html/rfc6797",
        relatedRFCs: [],
        keywords: ["hsts", "https", "security", "strict transport", "preload"],
    },
    {
        rfc: "RFC 7469",
        title: "HTTP Public Key Pinning (HPKP)",
        category: "Security - Web",
        description: "Historical browser key-pinning mechanism; RFC maturity is a separate property.",
        status: "Proposed Standard",
        year: 2015,
        url: "https://datatracker.ietf.org/doc/html/rfc7469",
        relatedRFCs: ["RFC 6797"],
        keywords: ["hpkp", "pinning", "certificate", "deprecated", "security"],
    },
    {
        rfc: "RFC 7034",
        title: "HTTP Header Field X-Frame-Options",
        category: "Security - Web",
        description: "Frame-embedding restrictions through the X-Frame-Options response header.",
        status: "Informational",
        year: 2013,
        url: "https://datatracker.ietf.org/doc/html/rfc7034",
        relatedRFCs: [],
        keywords: ["x-frame-options", "clickjacking", "iframe", "frame", "security"],
    },
    {
        rfc: "RFC 6454",
        title: "The Web Origin Concept",
        category: "Security - Web",
        description: "Origins provide a security boundary for web content.",
        status: "Proposed Standard",
        year: 2011,
        url: "https://datatracker.ietf.org/doc/html/rfc6454",
        relatedRFCs: ["RFC 6455"],
        keywords: ["origin", "same-origin policy", "cors", "security", "web"],
    },
    {
        rfc: "RFC 6455",
        title: "The WebSocket Protocol",
        category: "Web Protocols",
        description: "Bidirectional messaging protocol established through a WebSocket handshake.",
        status: "Proposed Standard",
        year: 2011,
        url: "https://datatracker.ietf.org/doc/html/rfc6455",
        relatedRFCs: [],
        keywords: ["websocket", "ws", "wss", "real-time", "bidirectional", "tcp"],
    },

    // CORS
    {
        rfc: "RFC 7231",
        title: "HTTP/1.1: Semantics and Content (Superseded)",
        category: "HTTP",
        description: "Earlier HTTP semantics specification, obsoleted by RFC 9110.",
        status: "Proposed Standard",
        year: 2014,
        url: "https://datatracker.ietf.org/doc/html/rfc7231",
        relatedRFCs: ["RFC 9110"],
        keywords: ["http", "semantics", "methods", "status codes", "superseded"],
    obsoletedBy: ["RFC 9110"],},

    // DNS
    {
        rfc: "RFC 1035",
        title: "Domain Names - Implementation and Specification",
        category: "DNS",
        description: "DNS wire messages, resource records and implementation rules.",
        status: "Internet Standard",
        year: 1987,
        url: "https://datatracker.ietf.org/doc/html/rfc1035",
        relatedRFCs: ["RFC 1034"],
        keywords: ["dns", "domain", "nameserver", "resolver", "query", "record"],
    },
    {
        rfc: "RFC 8484",
        title: "DNS Queries over HTTPS (DoH)",
        category: "DNS",
        description: "Transport DNS queries and responses over HTTPS.",
        status: "Proposed Standard",
        year: 2018,
        url: "https://datatracker.ietf.org/doc/html/rfc8484",
        relatedRFCs: ["RFC 1035", "RFC 7858"],
        keywords: ["doh", "dns", "https", "privacy", "encrypted dns"],
    },
    {
        rfc: "RFC 7858",
        title: "DNS over TLS (DoT)",
        category: "DNS",
        description: "Encrypt DNS transport using TLS, normally on port 853.",
        status: "Proposed Standard",
        year: 2016,
        url: "https://datatracker.ietf.org/doc/html/rfc7858",
        relatedRFCs: ["RFC 1035", "RFC 8484"],
        keywords: ["dot", "dns", "tls", "privacy", "encrypted dns", "port 853"],
    },

    // Email
    {
        rfc: "RFC 5321",
        title: "Simple Mail Transfer Protocol (SMTP)",
        category: "Email",
        description: "Mail transfer commands and server-to-server delivery behavior.",
        status: "Draft Standard",
        year: 2008,
        url: "https://datatracker.ietf.org/doc/html/rfc5321",
        relatedRFCs: ["RFC 5322"],
        keywords: ["smtp", "email", "mail", "mta", "mx", "relay"],
    },
    {
        rfc: "RFC 5322",
        title: "Internet Message Format",
        category: "Email",
        description: "Internet email message headers and body syntax.",
        status: "Draft Standard",
        year: 2008,
        url: "https://datatracker.ietf.org/doc/html/rfc5322",
        relatedRFCs: ["RFC 5321"],
        keywords: ["email", "message format", "headers", "from", "to", "subject"],
    },
    {
        rfc: "RFC 7208",
        title: "Sender Policy Framework (SPF)",
        category: "Email",
        description: "Authorize sending hosts for an email envelope domain.",
        status: "Proposed Standard",
        year: 2014,
        url: "https://datatracker.ietf.org/doc/html/rfc7208",
        relatedRFCs: ["RFC 6376", "RFC 7489"],
        keywords: ["spf", "email", "authentication", "spoofing", "dns txt"],
    },
    {
        rfc: "RFC 6376",
        title: "DomainKeys Identified Mail (DKIM)",
        category: "Email",
        description: "Domain-associated digital signatures over email headers and body.",
        status: "Internet Standard",
        year: 2011,
        url: "https://datatracker.ietf.org/doc/html/rfc6376",
        relatedRFCs: ["RFC 7208", "RFC 7489"],
        keywords: ["dkim", "email", "signature", "authentication", "cryptographic"],
    },
    {
        rfc: "RFC 7489",
        title: "DMARC",
        category: "Email",
        description: "Earlier DMARC specification; replaced by RFC 9989, 9990 and 9991.",
        status: "Informational",
        year: 2015,
        url: "https://datatracker.ietf.org/doc/html/rfc7489",
        relatedRFCs: ["RFC 7208", "RFC 6376"],
        keywords: ["dmarc", "email", "authentication", "policy", "reporting"],
    obsoletedBy: ["RFC 9989","RFC 9990","RFC 9991"],},

    // URI/URL Standards
    {
        rfc: "RFC 3986",
        title: "Uniform Resource Identifier (URI)",
        category: "Web Protocols",
        description: "Generic URI syntax and relative-reference resolution.",
        status: "Internet Standard",
        year: 2005,
        url: "https://datatracker.ietf.org/doc/html/rfc3986",
        relatedRFCs: ["RFC 6570"],
        keywords: ["uri", "url", "urn", "scheme", "path", "query", "fragment"],
    },
    {
        rfc: "RFC 6570",
        title: "URI Template",
        category: "Web Protocols",
        description: "Expand variables into URI templates.",
        status: "Proposed Standard",
        year: 2012,
        url: "https://datatracker.ietf.org/doc/html/rfc6570",
        relatedRFCs: ["RFC 3986"],
        keywords: ["uri template", "url", "variable", "expansion", "rest", "api"],
    },

    // Data Formats
    {
        rfc: "RFC 8259",
        title: "The JavaScript Object Notation (JSON) Data Interchange Format",
        category: "Data Formats",
        description: "JSON data interchange syntax and interoperability considerations.",
        status: "Internet Standard",
        year: 2017,
        url: "https://datatracker.ietf.org/doc/html/rfc8259",
        relatedRFCs: ["RFC 6901", "RFC 6902"],
        keywords: ["json", "data format", "interchange", "javascript", "object"],
    },
    {
        rfc: "RFC 6901",
        title: "JavaScript Object Notation (JSON) Pointer",
        category: "Data Formats",
        description: "Identify a value within a JSON document.",
        status: "Proposed Standard",
        year: 2013,
        url: "https://datatracker.ietf.org/doc/html/rfc6901",
        relatedRFCs: ["RFC 8259", "RFC 6902"],
        keywords: ["json", "pointer", "path", "reference", "json patch"],
    },
    {
        rfc: "RFC 6902",
        title: "JavaScript Object Notation (JSON) Patch",
        category: "Data Formats",
        description: "Apply ordered add, remove, replace, move, copy and test operations.",
        status: "Proposed Standard",
        year: 2013,
        url: "https://datatracker.ietf.org/doc/html/rfc6902",
        relatedRFCs: ["RFC 8259", "RFC 6901"],
        keywords: ["json", "patch", "operations", "add", "remove", "replace"],
    },
    {
        rfc: "RFC 7396",
        title: "JSON Merge Patch",
        category: "Data Formats",
        description: "Describe JSON updates by example; null removes object members.",
        status: "Proposed Standard",
        year: 2014,
        url: "https://datatracker.ietf.org/doc/html/rfc7396",
        relatedRFCs: ["RFC 8259", "RFC 6902"],
        keywords: ["json", "merge patch", "partial update", "patch"],
    },

    // API Standards
    {
        rfc: "RFC 7807",
        title: "Problem Details for HTTP APIs",
        category: "API Standards",
        description: "Earlier HTTP problem-details format, obsoleted by RFC 9457.",
        status: "Proposed Standard",
        year: 2016,
        url: "https://datatracker.ietf.org/doc/html/rfc7807",
        relatedRFCs: [],
        keywords: ["problem details", "error", "api", "json", "http", "rest"],
    obsoletedBy: ["RFC 9457"],},
    {
        rfc: "RFC 4918",
        title: "HTTP Extensions for Web Distributed Authoring and Versioning (WebDAV)",
        category: "HTTP",
        description: "WebDAV authoring, properties, collections and locking; not the source of 102.",
        status: "Proposed Standard",
        year: 2007,
        url: "https://datatracker.ietf.org/doc/html/rfc4918",
        relatedRFCs: ["RFC 9110", "RFC 5842"],
        keywords: ["webdav", "http", "status codes", "authoring", "collaborative", "422", "423", "424", "507"],
    },
    {
        rfc: "RFC 5789",
        title: "PATCH Method for HTTP",
        category: "HTTP",
        description: "Partial resource modification through HTTP PATCH.",
        status: "Proposed Standard",
        year: 2010,
        url: "https://datatracker.ietf.org/doc/html/rfc5789",
        relatedRFCs: ["RFC 9110"],
        keywords: ["http", "patch", "method", "partial update", "rest"],
    },

    // QUIC
    {
        rfc: "RFC 9000",
        title: "QUIC: A UDP-Based Multiplexed and Secure Transport",
        category: "Transport",
        description: "Secure multiplexed transport over UDP with connection migration.",
        status: "Proposed Standard",
        year: 2021,
        url: "https://datatracker.ietf.org/doc/html/rfc9000",
        relatedRFCs: ["RFC 9001", "RFC 9114"],
        keywords: ["quic", "udp", "transport", "multiplexing", "0-rtt", "http/3"],
    },
    {
        rfc: "RFC 9001",
        title: "Using TLS to Secure QUIC",
        category: "Transport",
        description: "Use TLS handshake and key derivation to secure QUIC.",
        status: "Proposed Standard",
        year: 2021,
        url: "https://datatracker.ietf.org/doc/html/rfc9001",
        relatedRFCs: ["RFC 9000", "RFC 8446"],
        keywords: ["quic", "tls", "security", "handshake", "encryption"],
    },

    // Cryptographic Algorithms
    {
        rfc: "RFC 8017",
        title: "PKCS #1: RSA Cryptography Specifications",
        category: "Cryptography",
        description: "RSA encryption and signature encodings, including OAEP and PSS.",
        status: "Informational",
        year: 2016,
        url: "https://datatracker.ietf.org/doc/html/rfc8017",
        relatedRFCs: [],
        keywords: ["rsa", "pkcs", "encryption", "signature", "public key", "private key"],
    },
    {
        rfc: "RFC 7748",
        title: "Elliptic Curves for Security (Curve25519, Curve448)",
        category: "Cryptography",
        description: "X25519 and X448 elliptic-curve key agreement.",
        status: "Informational",
        year: 2016,
        url: "https://datatracker.ietf.org/doc/html/rfc7748",
        relatedRFCs: ["RFC 8032"],
        keywords: ["elliptic curve", "curve25519", "curve448", "ecdh", "cryptography"],
    },
    {
        rfc: "RFC 8032",
        title: "Edwards-Curve Digital Signature Algorithm (EdDSA)",
        category: "Cryptography",
        description: "Ed25519 and Ed448 digital signature algorithms.",
        status: "Informational",
        year: 2017,
        url: "https://datatracker.ietf.org/doc/html/rfc8032",
        relatedRFCs: ["RFC 7748"],
        keywords: ["eddsa", "ed25519", "ed448", "signature", "edwards curve"],
    },

    // Base Encoding
    {
        rfc: "RFC 4648",
        title: "Base Encodings (Base16, Base32, Base64)",
        category: "Data Formats",
        description: "Base16, Base32, Base64 and URL-safe Base64 encoding rules.",
        status: "Proposed Standard",
        year: 2006,
        url: "https://datatracker.ietf.org/doc/html/rfc4648",
        relatedRFCs: [],
        keywords: ["base64", "base32", "base16", "encoding", "hex", "url-safe"],
    },

    // Date/Time
    {
        rfc: "RFC 3339",
        title: "Date and Time on the Internet: Timestamps",
        category: "Data Formats",
        description: "Internet timestamp profile with dates, times and numeric offsets.",
        status: "Proposed Standard",
        year: 2002,
        url: "https://datatracker.ietf.org/doc/html/rfc3339",
        relatedRFCs: [],
        keywords: ["date", "time", "timestamp", "iso8601", "timezone", "utc"],
    },

    // UUID
    {
        rfc: "RFC 9562",
        title: "Universally Unique IDentifiers (UUIDs)",
        category: "Data Formats",
        description: "UUID formats and generation, including versions 6, 7 and 8.",
        status: "Proposed Standard",
        year: 2024,
        url: "https://datatracker.ietf.org/doc/html/rfc9562",
        relatedRFCs: ["RFC 4122"],
        keywords: ["uuid", "guid", "unique identifier", "version", "random"],
    },

    // gRPC / Protocol Buffers
    {
        rfc: "RFC 9460",
        title: "Service Binding (SVCB) and HTTPS DNS Records",
        category: "DNS",
        description: "SVCB and HTTPS DNS records for service connection information.",
        status: "Proposed Standard",
        year: 2023,
        url: "https://datatracker.ietf.org/doc/html/rfc9460",
        relatedRFCs: ["RFC 1035"],
        keywords: ["svcb", "https record", "dns", "alpn", "service binding"],
    },

    // Security Tokens
    {
        rfc: "RFC 8693",
        title: "OAuth 2.0 Token Exchange",
        category: "Security - OAuth",
        description: "OAuth token exchange for delegation and impersonation scenarios.",
        status: "Proposed Standard",
        year: 2020,
        url: "https://datatracker.ietf.org/doc/html/rfc8693",
        relatedRFCs: ["RFC 6749"],
        keywords: ["oauth", "token exchange", "sts", "delegation", "impersonation"],
    },
    {
        rfc: "RFC 8414",
        title: "OAuth 2.0 Authorization Server Metadata",
        category: "Security - OAuth",
        description: "OAuth server capabilities and endpoints in JSON metadata.",
        status: "Proposed Standard",
        year: 2018,
        url: "https://datatracker.ietf.org/doc/html/rfc8414",
        relatedRFCs: ["RFC 6749"],
        keywords: ["oauth", "metadata", "discovery", "well-known", "openid"],
    },

    // Password Hashing
    {
        rfc: "RFC 9106",
        title: "Argon2 Memory-Hard Function for Password Hashing",
        category: "Cryptography",
        description: "Argon2 password hashing and memory-hard key derivation.",
        status: "Informational",
        year: 2021,
        url: "https://datatracker.ietf.org/doc/html/rfc9106",
        relatedRFCs: [],
        keywords: ["argon2", "password", "hashing", "kdf", "memory-hard"],
    },
    {
        rfc: "RFC 7914",
        title: "The scrypt Password-Based Key Derivation Function",
        category: "Cryptography",
        description: "scrypt password-based, memory-hard key derivation.",
        status: "Informational",
        year: 2016,
        url: "https://datatracker.ietf.org/doc/html/rfc7914",
        relatedRFCs: [],
        keywords: ["scrypt", "password", "kdf", "key derivation", "memory-hard"],
    },

    // CORS-related
    {
        rfc: "RFC 7725",
        title: "An HTTP Status Code to Report Legal Obstacles (451)",
        category: "HTTP",
        description: "HTTP 451 indicates access denied because of a legal demand.",
        status: "Proposed Standard",
        year: 2016,
        url: "https://datatracker.ietf.org/doc/html/rfc7725",
        relatedRFCs: ["RFC 9110"],
        keywords: ["http", "status code", "451", "legal", "censorship", "unavailable"],
    },
    // ── Recent RFCs (2022–2024) ────────────────────────────────────────
    {
        rfc: "RFC 9293",
        title: "Transmission Control Protocol (TCP)",
        category: "HTTP",
        description: "TCP transport specification consolidating earlier requirements and corrections.",
        status: "Internet Standard",
        year: 2022,
        url: "https://datatracker.ietf.org/doc/html/rfc9293",
        keywords: ["tcp", "transport", "protocol", "stream", "reliable"],
    },
    {
        rfc: "RFC 9457",
        title: "Problem Details for HTTP APIs",
        category: "HTTP",
        description: "Structured HTTP problem details in JSON or XML.",
        status: "Proposed Standard",
        year: 2023,
        url: "https://datatracker.ietf.org/doc/html/rfc9457",
        relatedRFCs: ["RFC 7807", "RFC 9110"],
        keywords: ["problem details", "errors", "json", "api", "rest", "rfc 7807"],
    },
    {
        rfc: "RFC 9421",
        title: "HTTP Message Signatures",
        category: "Security - JOSE",
        description: "Sign selected HTTP message components using a signature base.",
        status: "Proposed Standard",
        year: 2024,
        url: "https://datatracker.ietf.org/doc/html/rfc9421",
        keywords: ["signature", "http", "webhook", "hmac", "ed25519", "integrity", "auth"],
    },
    {
        rfc: "RFC 9530",
        title: "Digest Fields",
        category: "HTTP",
        description: "Content-Digest and Repr-Digest fields for HTTP integrity information.",
        status: "Proposed Standard",
        year: 2024,
        url: "https://datatracker.ietf.org/doc/html/rfc9530",
        relatedRFCs: ["RFC 9421", "RFC 9651"],
        keywords: ["digest", "hash", "integrity", "content", "sha"],
    },
    {
        rfc: "RFC 9651",
        title: "Structured Field Values for HTTP",
        category: "HTTP",
        description: "Typed HTTP field values: items, lists and dictionaries.",
        status: "Proposed Standard",
        year: 2024,
        url: "https://datatracker.ietf.org/doc/html/rfc9651",
        relatedRFCs: ["RFC 9421", "RFC 9530"],
        keywords: ["http", "header", "structured fields", "parser", "typed"],
    },
    {
        rfc: "RFC 9512",
        title: "YAML Media Type",
        category: "Data Formats",
        description: "Registers application/yaml and describes YAML security considerations.",
        status: "Informational",
        year: 2024,
        url: "https://datatracker.ietf.org/doc/html/rfc9512",
        keywords: ["yaml", "media type", "mime", "configuration"],
    },
    {
        rfc: "RFC 9580",
        title: "OpenPGP",
        category: "Cryptography",
        description: "OpenPGP message, key, encryption and signature formats.",
        status: "Proposed Standard",
        year: 2024,
        url: "https://datatracker.ietf.org/doc/html/rfc9580",
        relatedRFCs: ["RFC 4880"],
        keywords: ["pgp", "gpg", "openpgp", "encryption", "signature", "key"],
    },
    {
        rfc: "RFC 9325",
        title: "Recommendations for Secure Use of TLS and DTLS",
        category: "Security - TLS",
        description: "TLS and DTLS deployment guidance; review later protocol updates too.",
        status: "Best Current Practice",
        year: 2022,
        url: "https://datatracker.ietf.org/doc/html/rfc9325",
        relatedRFCs: ["RFC 8446", "RFC 5246"],
        keywords: ["tls", "dtls", "best practice", "deployment", "security", "bcp 195"],
    },
];

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    "Security - JOSE": <KeyOutlined />,
    "Security - OAuth": <LockOutlined />,
    "Security - TLS": <SafetyCertificateOutlined />,
    "Security - Web": <GlobalOutlined />,
    "Security - Identity": <LockOutlined />,
    "HTTP": <ApiOutlined />,
    "Web Protocols": <LinkOutlined />,
    "DNS": <CloudOutlined />,
    "Email": <MailOutlined />,
    "Data Formats": <DatabaseOutlined />,
    "API Standards": <ApiOutlined />,
    "Transport": <GlobalOutlined />,
    "Cryptography": <KeyOutlined />,
};

const STATUS_COLORS: Record<string, string> = {
    "Internet Standard": "green",
    "Draft Standard": "lime",
    "Proposed Standard": "blue",
    "Best Current Practice": "cyan",
    "Informational": "orange",
    "Experimental": "purple",
    "Historic": "default",
};

const searchable = (value: string) => [value, ...(REFERENCE_STANDARDS_TRANSLATIONS[value] ?? [])].join("\n").toLowerCase();

export default function RFCStandardsPage() {
    const { t } = useLanguage();
    const [expandedCategories, setExpandedCategories] = useState<string[]>(() => Array.from(new Set(RFC_STANDARDS.map(row => row.category))));
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    const categories = useMemo(() => {
        const cats = new Set(RFC_STANDARDS.map(r => r.category));
        return ["all", ...Array.from(cats).sort()];
    }, []);

    const filteredStandards = useMemo(() => {
        let result = RFC_STANDARDS;

        if (selectedCategory !== "all") {
            result = result.filter(r => r.category === selectedCategory);
        }

        if (search.trim()) {
            const searchLower = search.trim().toLowerCase();
            result = result.filter(r =>
                r.rfc.toLowerCase().includes(searchLower) ||
                r.title.toLowerCase().includes(searchLower) ||
                searchable(r.description).includes(searchLower) ||
                searchable(r.category).includes(searchLower) ||
                r.keywords.some(k => k.toLowerCase().includes(searchLower))
            );
        }

        return result;
    }, [search, selectedCategory]);

    const groupedByCategory = useMemo(() => {
        const groups = new Map<string, RFCStandard[]>();
        filteredStandards.forEach(std => {
            const arr = groups.get(std.category) || [];
            arr.push(std);
            groups.set(std.category, arr);
        });
        return groups;
    }, [filteredStandards]);

    const columns = [
        {
            title: "RFC",
            dataIndex: "rfc",
            key: "rfc",
            width: 110,
            render: (rfc: string, record: RFCStandard) => (
                <a href={record.url} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600 }}>
                    {rfc}
                </a>
            ),
        },
        {
            title: t("Title"),
            dataIndex: "title",
            key: "title",
            render: (title: string, record: RFCStandard) => (
                <div>
                    <Text strong>{title}</Text>
                    <div style={{ marginTop: 4 }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>{t(record.description)}</Text>
                    </div>
                    {record.obsoletedBy?.length ? <div>{t("Replaced by:")} {record.obsoletedBy.map(rfc => <a key={rfc} href={`https://www.rfc-editor.org/rfc/${rfc.toLowerCase().replace(" ", "")}.html`} target="_blank" rel="noopener noreferrer" style={{ marginInlineEnd: 8 }}>{rfc}</a>)}</div> : null}
                </div>
            ),
        },
        {
            title: t("Maturity"),
            dataIndex: "status",
            key: "status",
            width: 150,
            render: (status: string) => (
                <Tag color={STATUS_COLORS[status]}>{t(status)}</Tag>
            ),
        },
        {
            title: t("Year"),
            dataIndex: "year",
            key: "year",
            width: 80,
            sorter: (a: RFCStandard, b: RFCStandard) => a.year - b.year,
        },
        {
            title: t("Related"),
            dataIndex: "relatedRFCs",
            key: "relatedRFCs",
            width: 180,
            render: (related: string[]) => (
                <Space size={[4, 4]} wrap>
                    {related?.map(r => (
                        <Tag key={r} style={{ fontSize: 11 }}>{r}</Tag>
                    ))}
                </Space>
            ),
        },
    ];

    const tabItems = categories.map(cat => ({
        key: cat,
        label: cat === "all" ? t("All Standards") : t(cat),
        children: null,
    }));

    return (
        <ToolPageLayout
            title={t("RFC Standards Reference")}
            description={t("Selected RFCs with explanations, maturity levels and replacement links")}
            icon={<SafetyCertificateOutlined style={{ fontSize: 24 }} />}
            color="#722ed1"
            learnMore={{
                whatIs: t("Browse selected RFCs, their formal maturity and replacement links. Official titles, identifiers and URLs remain unchanged across languages."),
                whyUse: t("Search an RFC number, title, keyword or translated explanation; select a category or expand a group."),
                howToUse: [t("Maturity is separate from deployment advice or obsolescence. A superseded RFC can retain its formal standards-track status.")],
                tips: [t("RFC Editor metadata checked 2026-10-21. This bundled selection does not automatically track later publications, updates or errata."), t("Follow the primary document, its replacement and relevant security guidance before implementing a protocol.")],
            }}
        >
            <Card>
                <Space orientation="vertical" size="large" style={{ width: "100%" }}>
                    <Input
                        size="large"
                        placeholder={t("Search RFCs by number, title, or keyword (e.g., 'jwt', 'oauth', 'tls')...")}
                        prefix={<SearchOutlined />}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        allowClear dir="auto" aria-label={t("Search references")}
                    />

                    <Tabs
                        activeKey={selectedCategory}
                        onChange={setSelectedCategory}
                        items={tabItems}
                        type="card"
                    />

                    <div>
                        <Text type="secondary" role="status">
                            {t("Showing {shown} of {total} standards", { shown: filteredStandards.length, total: RFC_STANDARDS.length })}
                        </Text>
                    </div>

                    {selectedCategory === "all" ? (
                        <Collapse
                            activeKey={expandedCategories}
                            onChange={(keys) => setExpandedCategories((Array.isArray(keys) ? keys : [keys]).map(String))}
                            items={Array.from(groupedByCategory.entries()).map(([category, standards]) => ({
                                key: category,
                                label: (
                                    <Space>
                                        {CATEGORY_ICONS[category]}
                                        <Text strong>{t(category)}</Text>
                                        <Tag>{standards.length}</Tag>
                                    </Space>
                                ),
                                children: (
                                    <Table
                                        dataSource={standards}
                                        columns={columns}
                                        rowKey="rfc"
                                        pagination={false}
                                        size="small"
                                    />
                                ),
                            }))}
                        />
                    ) : (
                        <Table
                            dataSource={filteredStandards}
                            columns={columns}
                            rowKey="rfc"
                            pagination={filteredStandards.length > 20 ? { pageSize: 20 } : false}
                        />
                    )}

                    <Text type="secondary">{t("RFC Editor metadata checked 2026-10-21; follow primary links for later updates.")}</Text>
                    <Divider />

                    <div style={{ padding: "16px 0" }}>
                        <Title level={5}>{t("Quick Reference: Key RFC Families")}</Title>
                        <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
                            {[
                                { title: t("JOSE family"), rfcs: ["RFC 7519", "RFC 7515", "RFC 7516", "RFC 7517", "RFC 7518"] },
                                { title: t("OAuth 2.0 family"), rfcs: ["RFC 6749", "RFC 6750", "RFC 7636", "RFC 7662", "RFC 8414", "RFC 9700"] },
                                { title: t("HTTP specifications"), rfcs: ["RFC 9110", "RFC 9111", "RFC 9112", "RFC 9113", "RFC 9114"] },
                                { title: t("Email authentication"), rfcs: ["RFC 7208", "RFC 6376", "RFC 9989", "RFC 9990", "RFC 9991"] },
                            ].map(family => <Card key={family.rfcs[0]} size="small" title={family.title}><Space wrap>{family.rfcs.map(rfc => <Tag key={rfc}>{rfc}</Tag>)}</Space></Card>)}
                        </Space>
                    </div>
                </Space>
            </Card>
        </ToolPageLayout>
    );
}
