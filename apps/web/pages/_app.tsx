
import React from 'react';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import '../styles/globals.css';

// Dynamically import components to prevent SSR issues
const ErrorBoundary = dynamic(() => import('../components/ErrorBoundary'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}

export default MyApp;
