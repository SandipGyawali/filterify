"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const client = new QueryClient();

function Providers({ children }: any) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

export default Providers;
