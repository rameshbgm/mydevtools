"use client";

import { useState, useMemo } from "react";
import { Input, Typography, Table, Tag, Card, Tabs, Space, Tooltip, Button, Collapse, Divider } from "antd";
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
import ToolPageLayout from "@/components/ToolPageLayout";
import { useAppStore } from "@/lib/store";

const { Text, Title, Paragraph } = Typography;

interface RFCStandard {
    rfc: string;
    title: string;
    category: string;
    description: string;
    status: "Standard" | "Proposed Standard" | "Best Current Practice" | "Informational" | "Experimental" | "Historic";
    year: number;
    url: string;
    relatedRFCs?: string[];
    keywords: string[];
}

const RFC_STANDARDS: RFCStandard[] = [
    // JWT/JWE/JWS Family (JOSE)
    {
        rfc: "RFC 7519",
        title: "JSON Web Token (JWT)",
        category: "Security - JOSE",
        description: "JSON Web Token (JWT) is a compact, URL-safe means of representing claims to be transferred between two parties. The claims in a JWT are encoded as a JSON object used as the payload of a JSON Web Signature (JWS) or plaintext of a JSON Web Encryption (JWE).",
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
        description: "JSON Web Signature (JWS) represents content secured with digital signatures or Message Authentication Codes (MACs) using JSON-based data structures. Cryptographic algorithms and identifiers are described in RFC 7518.",
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
        description: "JSON Web Encryption (JWE) represents encrypted content using JSON-based data structures. Encryption operations are described in RFC 7518. JWE provides confidentiality for the plaintext being encrypted.",
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
        description: "A JSON Web Key (JWK) is a JavaScript Object Notation (JSON) data structure that represents a cryptographic key. This specification also defines a JWK Set JSON data structure for representing a set of JWKs.",
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
        description: "Registers cryptographic algorithms and identifiers to be used with the JSON Web Signature (JWS), JSON Web Encryption (JWE), and JSON Web Key (JWK) specifications.",
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
        description: "The OAuth 2.0 authorization framework enables third-party applications to obtain limited access to an HTTP service, either on behalf of a resource owner or by allowing the application to obtain access on its own behalf.",
        status: "Standard",
        year: 2012,
        url: "https://datatracker.ietf.org/doc/html/rfc6749",
        relatedRFCs: ["RFC 6750", "RFC 7636", "RFC 8252"],
        keywords: ["oauth", "oauth2", "authorization", "access token", "refresh token", "grant"],
    },
    {
        rfc: "RFC 6750",
        title: "OAuth 2.0 Bearer Token Usage",
        category: "Security - OAuth",
        description: "This specification describes how to use bearer tokens in HTTP requests to access OAuth 2.0 protected resources. Any party in possession of a bearer token can use it to get access to the associated resources.",
        status: "Standard",
        year: 2012,
        url: "https://datatracker.ietf.org/doc/html/rfc6750",
        relatedRFCs: ["RFC 6749"],
        keywords: ["oauth", "bearer token", "authorization header", "access token"],
    },
    {
        rfc: "RFC 7636",
        title: "PKCE - Proof Key for Code Exchange",
        category: "Security - OAuth",
        description: "Proof Key for Code Exchange (PKCE) is an extension to the Authorization Code flow to prevent CSRF and authorization code injection attacks for public clients.",
        status: "Standard",
        year: 2015,
        url: "https://datatracker.ietf.org/doc/html/rfc7636",
        relatedRFCs: ["RFC 6749"],
        keywords: ["pkce", "oauth", "code verifier", "code challenge", "public client", "spa"],
    },
    {
        rfc: "RFC 8252",
        title: "OAuth 2.0 for Native Apps",
        category: "Security - OAuth",
        description: "Best current practice for implementing OAuth 2.0 authorization flows in native applications including mobile apps, desktop applications, and CLI tools.",
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
        description: "Defines a method for a protected resource to query an OAuth 2.0 authorization server to determine the active state of an access token and to determine meta-information about this token.",
        status: "Standard",
        year: 2015,
        url: "https://datatracker.ietf.org/doc/html/rfc7662",
        relatedRFCs: ["RFC 6749", "RFC 6750"],
        keywords: ["oauth", "introspection", "token validation", "active", "scope"],
    },
    {
        rfc: "RFC 7009",
        title: "OAuth 2.0 Token Revocation",
        category: "Security - OAuth",
        description: "Defines an additional endpoint for OAuth authorization servers, allowing clients to notify the authorization server that a previously obtained token is no longer needed.",
        status: "Standard",
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
        description: "WebFinger is used to discover information about people or other entities on the Internet. Used by OpenID Connect for issuer discovery.",
        status: "Standard",
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
        description: "Defines the semantics of HTTP: the architecture, terminology, and protocol aspects shared by all HTTP versions including methods, status codes, headers, and content negotiation.",
        status: "Standard",
        year: 2022,
        url: "https://datatracker.ietf.org/doc/html/rfc9110",
        relatedRFCs: ["RFC 9111", "RFC 9112", "RFC 9113"],
        keywords: ["http", "semantics", "methods", "status codes", "headers", "request", "response"],
    },
    {
        rfc: "RFC 9111",
        title: "HTTP Caching",
        category: "HTTP",
        description: "Defines HTTP caches and the associated header fields that control cache behavior and indicate cacheable response messages.",
        status: "Standard",
        year: 2022,
        url: "https://datatracker.ietf.org/doc/html/rfc9111",
        relatedRFCs: ["RFC 9110"],
        keywords: ["http", "cache", "cache-control", "etag", "expires", "max-age", "validation"],
    },
    {
        rfc: "RFC 9112",
        title: "HTTP/1.1",
        category: "HTTP",
        description: "Defines the HTTP/1.1 message syntax and connection management, including message framing, request and response message format, and persistent connections.",
        status: "Standard",
        year: 2022,
        url: "https://datatracker.ietf.org/doc/html/rfc9112",
        relatedRFCs: ["RFC 9110"],
        keywords: ["http", "http/1.1", "message", "connection", "keep-alive", "chunked"],
    },
    {
        rfc: "RFC 9113",
        title: "HTTP/2",
        category: "HTTP",
        description: "HTTP/2 enables more efficient use of network resources through header field compression and allows multiple concurrent exchanges on the same connection using streams and multiplexing.",
        status: "Standard",
        year: 2022,
        url: "https://datatracker.ietf.org/doc/html/rfc9113",
        relatedRFCs: ["RFC 9110", "RFC 7541"],
        keywords: ["http", "http/2", "h2", "streams", "multiplexing", "hpack", "server push"],
    },
    {
        rfc: "RFC 9114",
        title: "HTTP/3",
        category: "HTTP",
        description: "HTTP/3 is the third major version of HTTP, using QUIC as the transport layer. Provides improved performance through 0-RTT connection establishment and better handling of packet loss.",
        status: "Standard",
        year: 2022,
        url: "https://datatracker.ietf.org/doc/html/rfc9114",
        relatedRFCs: ["RFC 9110", "RFC 9000"],
        keywords: ["http", "http/3", "h3", "quic", "udp", "0-rtt"],
    },
    {
        rfc: "RFC 7541",
        title: "HPACK: Header Compression for HTTP/2",
        category: "HTTP",
        description: "HPACK is a compression format for efficiently representing HTTP header fields in HTTP/2. Reduces overhead through Huffman coding and dynamic tables.",
        status: "Standard",
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
        description: "The Transport Layer Security (TLS) Protocol Version 1.3. Major update with improved security, reduced handshake latency (1-RTT and 0-RTT), and removal of legacy cryptographic algorithms.",
        status: "Proposed Standard",
        year: 2018,
        url: "https://datatracker.ietf.org/doc/html/rfc8446",
        relatedRFCs: ["RFC 5246"],
        keywords: ["tls", "tls 1.3", "ssl", "encryption", "handshake", "0-rtt", "certificate"],
    },
    {
        rfc: "RFC 5246",
        title: "TLS 1.2",
        category: "Security - TLS",
        description: "The Transport Layer Security (TLS) Protocol Version 1.2. Widely deployed version providing secure communication through authentication, confidentiality, and integrity.",
        status: "Proposed Standard",
        year: 2008,
        url: "https://datatracker.ietf.org/doc/html/rfc5246",
        relatedRFCs: ["RFC 8446"],
        keywords: ["tls", "tls 1.2", "ssl", "encryption", "cipher suite", "certificate"],
    },
    {
        rfc: "RFC 6066",
        title: "TLS Extensions",
        category: "Security - TLS",
        description: "Describes TLS extensions including Server Name Indication (SNI), maximum fragment length negotiation, and certificate status request (OCSP stapling).",
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
        description: "HSTS allows web servers to declare that browsers should only interact with it using secure HTTPS connections, protecting against protocol downgrade attacks and cookie hijacking.",
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
        description: "HPKP was a security mechanism allowing HTTPS websites to resist impersonation by attackers using mis-issued or fraudulent certificates. Note: Deprecated in favor of Certificate Transparency.",
        status: "Historic",
        year: 2015,
        url: "https://datatracker.ietf.org/doc/html/rfc7469",
        relatedRFCs: ["RFC 6797"],
        keywords: ["hpkp", "pinning", "certificate", "deprecated", "security"],
    },
    {
        rfc: "RFC 7034",
        title: "HTTP Header Field X-Frame-Options",
        category: "Security - Web",
        description: "The X-Frame-Options HTTP header field indicates whether a browser should be allowed to render a page in a frame, iframe, or object. Used to prevent clickjacking attacks.",
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
        description: "Defines the concept of 'origin' which is used to scope the authority of web content. Foundation for Same-Origin Policy, CORS, and other web security mechanisms.",
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
        description: "The WebSocket Protocol enables two-way communication between a client and a server through a single TCP connection. Used for real-time web applications.",
        status: "Standard",
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
        description: "Defines HTTP semantics including request methods, response status codes, and header fields. Note: Superseded by RFC 9110 but still widely referenced.",
        status: "Historic",
        year: 2014,
        url: "https://datatracker.ietf.org/doc/html/rfc7231",
        relatedRFCs: ["RFC 9110"],
        keywords: ["http", "semantics", "methods", "status codes", "superseded"],
    },

    // DNS
    {
        rfc: "RFC 1035",
        title: "Domain Names - Implementation and Specification",
        category: "DNS",
        description: "Describes the details of the DNS protocol including message format, transport, and implementation requirements.",
        status: "Standard",
        year: 1987,
        url: "https://datatracker.ietf.org/doc/html/rfc1035",
        relatedRFCs: ["RFC 1034"],
        keywords: ["dns", "domain", "nameserver", "resolver", "query", "record"],
    },
    {
        rfc: "RFC 8484",
        title: "DNS Queries over HTTPS (DoH)",
        category: "DNS",
        description: "Describes how to run DNS over HTTPS, improving privacy by encrypting DNS queries and preventing observation and modification by network intermediaries.",
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
        description: "Specifies the use of TLS to provide privacy for DNS. DNS queries sent over TLS on port 853.",
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
        description: "Specifies the SMTP protocol for transmitting email. Defines how mail servers exchange messages and deliver to recipients.",
        status: "Standard",
        year: 2008,
        url: "https://datatracker.ietf.org/doc/html/rfc5321",
        relatedRFCs: ["RFC 5322"],
        keywords: ["smtp", "email", "mail", "mta", "mx", "relay"],
    },
    {
        rfc: "RFC 5322",
        title: "Internet Message Format",
        category: "Email",
        description: "Specifies the syntax for text messages sent between computer users within the Internet email framework including headers and body structure.",
        status: "Standard",
        year: 2008,
        url: "https://datatracker.ietf.org/doc/html/rfc5322",
        relatedRFCs: ["RFC 5321"],
        keywords: ["email", "message format", "headers", "from", "to", "subject"],
    },
    {
        rfc: "RFC 7208",
        title: "Sender Policy Framework (SPF)",
        category: "Email",
        description: "SPF allows domain owners to specify which mail servers are authorized to send email on behalf of their domain, helping to prevent email spoofing.",
        status: "Standard",
        year: 2014,
        url: "https://datatracker.ietf.org/doc/html/rfc7208",
        relatedRFCs: ["RFC 6376", "RFC 7489"],
        keywords: ["spf", "email", "authentication", "spoofing", "dns txt"],
    },
    {
        rfc: "RFC 6376",
        title: "DomainKeys Identified Mail (DKIM)",
        category: "Email",
        description: "DKIM provides a method for validating a domain name identity that is associated with a message through cryptographic authentication using digital signatures.",
        status: "Standard",
        year: 2011,
        url: "https://datatracker.ietf.org/doc/html/rfc6376",
        relatedRFCs: ["RFC 7208", "RFC 7489"],
        keywords: ["dkim", "email", "signature", "authentication", "cryptographic"],
    },
    {
        rfc: "RFC 7489",
        title: "DMARC",
        category: "Email",
        description: "Domain-based Message Authentication, Reporting, and Conformance (DMARC) allows email domain owners to specify how unauthenticated mail should be handled.",
        status: "Informational",
        year: 2015,
        url: "https://datatracker.ietf.org/doc/html/rfc7489",
        relatedRFCs: ["RFC 7208", "RFC 6376"],
        keywords: ["dmarc", "email", "authentication", "policy", "reporting"],
    },

    // URI/URL Standards
    {
        rfc: "RFC 3986",
        title: "Uniform Resource Identifier (URI)",
        category: "Web Protocols",
        description: "Defines the generic URI syntax and a process for resolving URI references. Foundation for URLs, URNs, and all web resource identification.",
        status: "Standard",
        year: 2005,
        url: "https://datatracker.ietf.org/doc/html/rfc3986",
        relatedRFCs: ["RFC 6570"],
        keywords: ["uri", "url", "urn", "scheme", "path", "query", "fragment"],
    },
    {
        rfc: "RFC 6570",
        title: "URI Template",
        category: "Web Protocols",
        description: "URI Templates provide a mechanism for describing a range of URIs through variable expansion. Commonly used in REST APIs and hypermedia.",
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
        description: "Defines JSON (JavaScript Object Notation), a lightweight data-interchange format that is easy for humans to read and write and for machines to parse and generate.",
        status: "Standard",
        year: 2017,
        url: "https://datatracker.ietf.org/doc/html/rfc8259",
        relatedRFCs: ["RFC 6901", "RFC 6902"],
        keywords: ["json", "data format", "interchange", "javascript", "object"],
    },
    {
        rfc: "RFC 6901",
        title: "JavaScript Object Notation (JSON) Pointer",
        category: "Data Formats",
        description: "JSON Pointer defines a string syntax for identifying a specific value within a JSON document. Used in JSON Patch and other specifications.",
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
        description: "JSON Patch defines a JSON document structure for expressing a sequence of operations to apply to a JSON document. Operations include add, remove, replace, move, copy, and test.",
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
        description: "Defines a JSON merge patch format for describing changes to a JSON document. Simpler alternative to JSON Patch for partial updates.",
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
        description: "Defines a standard way to carry machine-readable details of errors in HTTP response content. Commonly used as 'application/problem+json'.",
        status: "Proposed Standard",
        year: 2016,
        url: "https://datatracker.ietf.org/doc/html/rfc7807",
        relatedRFCs: [],
        keywords: ["problem details", "error", "api", "json", "http", "rest"],
    },
    {
        rfc: "RFC 5789",
        title: "PATCH Method for HTTP",
        category: "HTTP",
        description: "Defines the HTTP PATCH method for making partial modifications to a resource. Complementary to PUT for partial updates.",
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
        description: "QUIC is a UDP-based multiplexed and secure transport protocol. Provides transport layer security, connection migration, and 0-RTT connection establishment. Foundation for HTTP/3.",
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
        description: "Describes how TLS 1.3 is used to secure QUIC. Defines how TLS handshake messages are carried over QUIC and how keys are derived.",
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
        description: "Provides recommendations for the implementation of public-key cryptography based on the RSA algorithm, including key generation, encryption, and signatures.",
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
        description: "Specifies two elliptic curves - Curve25519 and Curve448 - for use in cryptographic applications. Provides high security with efficient implementation.",
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
        description: "Describes the EdDSA digital signature algorithm using Edwards curves. Includes Ed25519 and Ed448 variants.",
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
        description: "Describes the commonly used base encoding schemes including base16, base32, and base64. Also defines URL-safe base64.",
        status: "Standard",
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
        description: "Defines a date and time format for use in Internet protocols, derived from ISO 8601. Widely used in JSON and APIs.",
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
        description: "Defines the format of UUIDs (Universally Unique IDentifiers) and generation algorithms for versions 1-8. Supersedes RFC 4122.",
        status: "Standard",
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
        description: "Defines SVCB and HTTPS DNS record types for conveying service configuration information including port, priority, and transport protocols.",
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
        description: "Defines a protocol for an HTTP- and JSON-based Security Token Service (STS) by defining an OAuth 2.0 grant type for exchanging tokens.",
        status: "Standard",
        year: 2020,
        url: "https://datatracker.ietf.org/doc/html/rfc8693",
        relatedRFCs: ["RFC 6749"],
        keywords: ["oauth", "token exchange", "sts", "delegation", "impersonation"],
    },
    {
        rfc: "RFC 8414",
        title: "OAuth 2.0 Authorization Server Metadata",
        category: "Security - OAuth",
        description: "Defines a metadata format that OAuth 2.0 clients can use to obtain the information needed to interact with OAuth 2.0 authorization servers.",
        status: "Standard",
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
        description: "Specifies Argon2, winner of the Password Hashing Competition. Defines Argon2d, Argon2i, and Argon2id variants for password hashing and key derivation.",
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
        description: "Specifies the scrypt password-based key derivation function designed to be expensive to perform in hardware with high memory requirements.",
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
        description: "Defines HTTP status code 451 to indicate that a server is denying access to a resource as a consequence of a legal demand.",
        status: "Proposed Standard",
        year: 2016,
        url: "https://datatracker.ietf.org/doc/html/rfc7725",
        relatedRFCs: ["RFC 9110"],
        keywords: ["http", "status code", "451", "legal", "censorship", "unavailable"],
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
    "Standard": "green",
    "Proposed Standard": "blue",
    "Best Current Practice": "cyan",
    "Informational": "orange",
    "Experimental": "purple",
    "Historic": "default",
};

export default function RFCStandardsPage() {
    const { darkMode } = useAppStore();
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

        if (search) {
            const searchLower = search.toLowerCase();
            result = result.filter(r =>
                r.rfc.toLowerCase().includes(searchLower) ||
                r.title.toLowerCase().includes(searchLower) ||
                r.description.toLowerCase().includes(searchLower) ||
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
            title: "Title",
            dataIndex: "title",
            key: "title",
            render: (title: string, record: RFCStandard) => (
                <div>
                    <Text strong>{title}</Text>
                    <div style={{ marginTop: 4 }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>{record.description}</Text>
                    </div>
                </div>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: 150,
            render: (status: string) => (
                <Tag color={STATUS_COLORS[status]}>{status}</Tag>
            ),
        },
        {
            title: "Year",
            dataIndex: "year",
            key: "year",
            width: 80,
            sorter: (a: RFCStandard, b: RFCStandard) => a.year - b.year,
        },
        {
            title: "Related",
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
        label: cat === "all" ? "All Standards" : cat,
        children: null,
    }));

    return (
        <ToolPageLayout
            title="RFC Standards Reference"
            description="Comprehensive reference for important RFC standards"
            icon={<SafetyCertificateOutlined style={{ fontSize: 24 }} />}
            color="#722ed1"
            learnMore={{
                whatIs: "RFC (Request for Comments) documents are technical standards and specifications published by the IETF (Internet Engineering Task Force). They define the protocols, procedures, and conventions that power the Internet, from HTTP and TLS to JWT and OAuth.",
                whyUse: "Understanding RFC standards is essential for implementing secure and interoperable systems. This reference helps developers quickly find the relevant specifications for authentication (JWT, JWE, OAuth), transport security (TLS), HTTP protocols, and more.",
                howToUse: [
                    "Use the search bar to find standards by RFC number, title, or keywords",
                    "Filter by category to browse related standards (e.g., 'Security - JOSE' for JWT family)",
                    "Click on RFC numbers to open the official IETF documentation",
                    "Check related RFCs to understand the full specification family",
                    "Note the status - 'Standard' and 'Proposed Standard' are widely implemented",
                ],
                tips: [
                    "JWT (RFC 7519) depends on JWS (7515), JWE (7516), JWK (7517), and JWA (7518)",
                    "For modern OAuth implementations, always use PKCE (RFC 7636)",
                    "TLS 1.3 (RFC 8446) should be preferred over TLS 1.2",
                    "HTTP/3 (RFC 9114) uses QUIC (RFC 9000) instead of TCP",
                    "RFC 9110 consolidates and obsoletes earlier HTTP RFCs (7230-7235)",
                ],
                useCases: [
                    "Implementing JWT-based authentication systems",
                    "Building OAuth 2.0 / OpenID Connect identity providers",
                    "Configuring TLS and HTTPS for web servers",
                    "Designing REST APIs with proper HTTP semantics",
                    "Setting up email authentication (SPF, DKIM, DMARC)",
                ],
            }}
        >
            <Card>
                <Space orientation="vertical" size="large" style={{ width: "100%" }}>
                    <Input
                        size="large"
                        placeholder="Search RFCs by number, title, or keyword (e.g., 'jwt', 'oauth', 'tls')..."
                        prefix={<SearchOutlined />}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        allowClear
                    />

                    <Tabs
                        activeKey={selectedCategory}
                        onChange={setSelectedCategory}
                        items={tabItems}
                        type="card"
                    />

                    <div>
                        <Text type="secondary">
                            Showing {filteredStandards.length} of {RFC_STANDARDS.length} standards
                        </Text>
                    </div>

                    {selectedCategory === "all" ? (
                        <Collapse
                            defaultActiveKey={Array.from(groupedByCategory.keys())}
                            items={Array.from(groupedByCategory.entries()).map(([category, standards]) => ({
                                key: category,
                                label: (
                                    <Space>
                                        {CATEGORY_ICONS[category]}
                                        <Text strong>{category}</Text>
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

                    <Divider />

                    <div style={{ padding: "16px 0" }}>
                        <Title level={5}>Quick Reference: Key RFC Families</Title>
                        <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
                            <Card size="small" title={<><KeyOutlined /> JOSE (JSON Object Signing and Encryption)</>}>
                                <Text>
                                    <strong>RFC 7519</strong> (JWT) • <strong>RFC 7515</strong> (JWS) •
                                    <strong> RFC 7516</strong> (JWE) • <strong>RFC 7517</strong> (JWK) •
                                    <strong> RFC 7518</strong> (JWA)
                                </Text>
                            </Card>
                            <Card size="small" title={<><LockOutlined /> OAuth 2.0 Family</>}>
                                <Text>
                                    <strong>RFC 6749</strong> (Core) • <strong>RFC 6750</strong> (Bearer) •
                                    <strong> RFC 7636</strong> (PKCE) • <strong>RFC 7662</strong> (Introspection) •
                                    <strong> RFC 8414</strong> (Metadata)
                                </Text>
                            </Card>
                            <Card size="small" title={<><ApiOutlined /> Modern HTTP</>}>
                                <Text>
                                    <strong>RFC 9110</strong> (Semantics) • <strong>RFC 9111</strong> (Caching) •
                                    <strong> RFC 9112</strong> (HTTP/1.1) • <strong>RFC 9113</strong> (HTTP/2) •
                                    <strong> RFC 9114</strong> (HTTP/3)
                                </Text>
                            </Card>
                            <Card size="small" title={<><MailOutlined /> Email Authentication</>}>
                                <Text>
                                    <strong>RFC 7208</strong> (SPF) • <strong>RFC 6376</strong> (DKIM) •
                                    <strong> RFC 7489</strong> (DMARC)
                                </Text>
                            </Card>
                        </Space>
                    </div>
                </Space>
            </Card>
        </ToolPageLayout>
    );
}
