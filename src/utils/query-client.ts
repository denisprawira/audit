import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    },
  },
});

export const invalidateQuery = (queryKey: string) => {
  queryClient.invalidateQueries({
    queryKey: [queryKey],
  });
};
