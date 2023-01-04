import * as React from 'react';
import { BoundaryError, withTlsErrorBoundary } from './TlsErrorBoundary';
import { trpc } from './trpc/trpcClient';

const BoundaryTest = () => {
  // BROKEN if useErrorBoundary: true
  // but it should work like two below as trpc.error.useQuery supposed to throw the error
  const result = trpc.error.useQuery(
    undefined,
    { useErrorBoundary: false }
  );

  // THIS WORKS if useErrorBoundary: false
  // throw new BoundaryError('asd')

  // THIS WORKS if useErrorBoundary: false
  if (result.isError) {
    throw result.error;
  }

  return (
    <>
      <h1>TEST BOUNDARY</h1>
      <div>{result?.data}</div>
    </>
  );
};

export default withTlsErrorBoundary(BoundaryTest);
