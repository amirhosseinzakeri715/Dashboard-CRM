"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

export const queryClient= new QueryClient();

export const QueryClientProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}