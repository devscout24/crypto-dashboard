import { routes } from "@/routes/Router";
import { RouterProvider } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useAuth } from "@/hooks/useAuth";
import { SSEProvider } from "@/contexts/SSEProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

export default function Providers() {
  const currentUser = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <SSEProvider url="/api/v1/sse/public">
        <RouterProvider router={routes} />
        <ReactQueryDevtools initialIsOpen={false} />
      </SSEProvider>
    </QueryClientProvider>
  );
}
