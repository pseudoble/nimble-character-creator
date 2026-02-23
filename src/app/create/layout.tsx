"use client";

import { CreatorProvider } from "@/lib/creator/context";
import { CreatorShell } from "@/lib/creator/creator-shell";

export default function CreatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <CreatorProvider>
      <CreatorShell>
        {children}
      </CreatorShell>
    </CreatorProvider>
  );
}
