import { TRPCClientError, createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from 'server';
import { trpcClientContext } from './trpcClientContext';

export const trpc = createTRPCReact<AppRouter>({
  // reactQueryContext: trpcClientContext
})

export function isTRPCClientError(
  cause: unknown,
): cause is TRPCClientError<AppRouter> {
  return cause instanceof TRPCClientError
}
