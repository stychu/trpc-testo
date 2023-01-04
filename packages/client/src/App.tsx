import { trpc } from './trpc/trpcClient';
import { TrpcWrapper } from './trpc/TrpcWrapper';

function AppContent () {
  const hello = trpc.sayHello.useQuery();
  return <main className='p-2'>{JSON.stringify(hello.data, null, 2)}</main>;
}

function App () {
  return (
    <TrpcWrapper>
      <AppContent />
    </TrpcWrapper>
  );
}

export default App;
