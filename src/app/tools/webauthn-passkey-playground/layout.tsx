import type { Metadata } from "next";
import type { ReactNode } from "react";
import { generateToolMetadata, generateToolStructuredData } from "@/lib/metadata-generator";
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata({ toolId: "webauthn-passkey-playground" }); }
export default function Layout({ children }: Readonly<{ children: ReactNode }>) { const data = generateToolStructuredData("webauthn-passkey-playground"); return <>{data && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />}{children}</>; }
