import React, { ComponentType, FC } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import { isTRPCClientError } from './trpc/trpcClient';

export class BoundaryError extends Error {
  readonly traceId?: string

  readonly status?: number

  constructor(message, { traceId = undefined, status = undefined }) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = 'BoundaryError'
    this.traceId = traceId
    this.status = status
  }
}

const ErrorFallback = ({ traceId, status, error, resetErrorBoundary }) => {
  let trace = error.traceId ?? traceId
  let errorStatus = error.status ?? status
  let message

  if (error instanceof BoundaryError) {
    message = error.message
  } else if (isTRPCClientError(error)) {
    trace = error?.data?.traceId
    message = error?.data?.code
    errorStatus = error?.data?.httpStatus
  } else {
    message = 'Internal App Error'
  }

  return (
    <div style={{background: 'red', margin: '20px'}}>
      <small>
        <strong>
          {errorStatus} {message}
        </strong>
      </small>
      <br />
      <span>Please </span>
      <button type='button' onClick={resetErrorBoundary}>
        try again
      </button>
    </div>
  )
}

export const withTlsErrorBoundary =
  <P extends object>(Component: ComponentType<P>) =>
  (props: P) =>
    (
      <TlsErrorBoundary>
        <Component {...props} />
      </TlsErrorBoundary>
    )

const TlsErrorBoundary: FC<{ traceId?: string; status?: number }> = ({
  children,
  traceId,
  status,
}) => {
  const { reset } = useQueryErrorResetBoundary()

  return (
    <ErrorBoundary
      onReset={reset}
      FallbackComponent={(props) => (
        <ErrorFallback {...props} traceId={traceId} status={status} />
      )}
    >
      {children}
    </ErrorBoundary>
  )
}

export default TlsErrorBoundary
