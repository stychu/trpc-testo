import React, { useState } from 'react';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { httpBatchLink, loggerLink } from '@trpc/react-query';
import superjson from 'superjson';

import { isTRPCClientError, trpc } from './trpcClient';
import { trpcClientContext } from './trpcClientContext';
import { getFetch } from '@trpc/client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       refetchOnWindowFocus: false,
//       staleTime: 5 * 1000, // seconds
//       retry: false,
//       // useErrorBoundary: true,
//     },
//   },
//   queryCache: new QueryCache({
//     onError: (error) => {
//       if (isTRPCClientError(error) && error?.data?.httpStatus === 401) {
//         console.log('-----------------------START-----------------------')
//         console.log("OOOOOOOOO 401")
//         console.log('-----------------------END-----------------------')
//       }
//     },
//   }),
// })
//
// const client = trpc.createClient({
//   transformer: superjson,
//   links: [
//     loggerLink({
//       enabled: (opts) =>
//         process.env.NODE_ENV === 'development' ||
//         (opts.direction === 'down' && opts.result instanceof Error),
//     }),
//     httpBatchLink({
//       url: "http://localhost:8000/api/trpc",
//       fetch: async (input, init?) => {
//         const fetch = getFetch();
//         return fetch(input, {
//           ...init,
//           credentials: "include",
//         });
//       },
//     }),
//   ],
// })

export const TrpcWrapper: React.FC = ({ children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 1000,
          },
        },
      })
  );

  const [trpcClient] = useState(() =>
    trpc.createClient({
      transformer: superjson,
      links: [
        loggerLink(),
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
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient} context={trpcClientContext}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </trpc.Provider>
  );
};
