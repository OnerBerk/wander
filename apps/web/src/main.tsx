import {QueryClientProvider} from '@tanstack/react-query';
import {queryClient} from '@/store/query-client';
import {BrowserRouter} from 'react-router-dom';
import {createRoot} from 'react-dom/client';
import {StrictMode} from 'react';

import App from '@/App';
import '@/styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
