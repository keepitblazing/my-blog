"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/visitor", {
      method: "POST",
    }).catch(console.error);
  }, [pathname]);

  return null;
}
