"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toolPathFromId } from "@/lib/category-routes";

export default function Page() {
  const router = useRouter();
  useEffect(() => {
    const p = toolPathFromId("certificate-chain-validator");
    if (p) router.replace(`${p}?tab=live`);
  }, [router]);
  return null;
}
