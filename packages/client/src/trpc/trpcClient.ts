import { TRPCClientError, createTRPCReact } from '@trpc/react-query'
import { trpcClientContext } from './trpcClientContext'
import type { AppRouter } from 'server';

export const trpc = createTRPCReact<AppRouter>({
  reactQueryContext: trpcClientContext,
})

export function isTRPCClientError(
  cause: unknown,
): cause is TRPCClientError<AppRouter> {
  return cause instanceof TRPCClientError
}
