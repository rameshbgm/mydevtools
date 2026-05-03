"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toolPathFromId } from "@/lib/category-routes";

export default function Page() {
  const router = useRouter();
  useEffect(() => {
    const p = toolPathFromId("certificate-generator");
    if (p) router.replace(`${p}?tab=csr`);
  }, [router]);
  return null;
}
