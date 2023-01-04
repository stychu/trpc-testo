
In root folder run `pnpm install`

then run `pnpm start`

Visit http://127.0.0.1:5173/

You should see `{ "message": "HELLOO THERE" }` and error boundary with `404 NOT_FOUND`
which is re-thrown from trpc query

change `useErrorBoundary` to `true` in [Boundary Component](packages/client/src/BoundaryTest.tsx)
to see that error boundary doesn't work anymore and app crashes
