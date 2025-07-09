import '../styles/globals.css';
import type { AppProps } from 'next/app';
import ErrorBoundary from '../components/ErrorBoundary';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Ensure DOM is ready
    if (typeof window !== 'undefined') {
      console.log('App initialized');
    }
  }, []);

  return (
    <ErrorBoundary>
      <div suppressHydrationWarning>
        <Component {...pageProps} />
      </div>
    </ErrorBoundary>
  );
}

export default MyApp;
