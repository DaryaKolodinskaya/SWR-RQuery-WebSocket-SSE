import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

import WebSocketComponent from "./WebSocketComponent";
import SSEComponent from "./SSEComponent";
import SWRComponent from "./SWRComponent";
import ReactQueryComponent from './ReactQueryComponent';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient()

export default function App() {

  return (
    <div style={{ width: '100%', display: "flex", gap: '100px', alignItems: 'center', flexWrap: 'wrap' }}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryComponent />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
      <SWRComponent />
      <WebSocketComponent />
      <SSEComponent />
    </div>
  );
}
