"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

type ProvidersProps = {
  children: ReactNode;
};

const queryClient = new QueryClient();

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
