"use client";

import type { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider
      refetchOnWindowFocus={false}
      refetchInterval={0}
      refetchWhenOffline={false}
      refetchOnMount={false}
    >
      {children}
    </SessionProvider>
  );
}
