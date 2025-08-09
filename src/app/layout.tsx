import React, { ReactNode } from 'react';
import AppWrappers from './AppWrappers';
import { QueryClientProviderWrapper } from 'providers/queryclient.provider';
import { ToastifyProvider } from 'providers/toastify.provider';
import { RefreshProvider } from 'contexts/RefreshTokenContext';
// import '@asseinfo/react-kanban/dist/styles.css';
// import '/public/styles/Plugins.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body id={'root'}>
        <QueryClientProviderWrapper>
          <AppWrappers>
            <ToastifyProvider>
              <RefreshProvider>
                {children}
              </RefreshProvider>
            </ToastifyProvider>
          </AppWrappers>
        </QueryClientProviderWrapper>
      </body>
    </html>
  );
}
