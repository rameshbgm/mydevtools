"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function Page() {
  const router = useRouter();
  useEffect(() => { router.replace("/tools/certificate-inspector?tab=pem-parser"); }, [router]);
  return null;
}
