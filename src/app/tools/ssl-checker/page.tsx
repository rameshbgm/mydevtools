"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function Page() {
  const router = useRouter();
  useEffect(() => { router.replace("/tools/certificate-chain-validator?tab=ct-logs"); }, [router]);
  return null;
}
