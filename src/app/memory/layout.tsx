import type { Metadata } from "next";
import type { ReactNode } from "react";
export const metadata: Metadata = { title: "Memory & Storage", robots: { index: false, follow: false } };
export default function MemoryLayout({ children }: { children: ReactNode }) { return children; }
