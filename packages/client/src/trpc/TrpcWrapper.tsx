import React from 'react';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { httpBatchLink, loggerLink } from '@trpc/react-query';
import superjson from 'superjson';

import { isTRPCClientError, trpc } from './trpcClient';
import { getFetch } from '@trpc/client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { trpcClientContext } from './trpcClientContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 1000, // seconds
      retry: false,
      // useErrorBoundary: true,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      if (isTRPCClientError(error) && error?.data?.httpStatus === 401) {
        console.log('-----------------------START-----------------------');
        console.log('OOOOOOOOO 401');
        console.log('-----------------------END-----------------------');
      }
    },
  }),
});

const trpcClient = trpc.createClient({
  transformer: superjson,
  links: [
    loggerLink({
      enabled: (opts) =>
        process.env.NODE_ENV === 'development' ||
        (opts.direction === 'down' && opts.result instanceof Error),
    }),
    httpBatchLink({
      url: 'http://localhost:8000/api/trpc',
      fetch: async (input, init?) => {
        const fetch = getFetch();
        return fetch(input, {
          ...init,
          credentials: 'include',
        });
      },
    }),
  ],
});

export const TrpcWrapper: React.FC = ({ children }) => {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      {/*<QueryClientProvider client={queryClient} context={trpcClientContext}>*/}
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </trpc.Provider>
  );
};
