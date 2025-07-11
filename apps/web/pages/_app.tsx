import React, { useEffect } from 'react';
import { AppProps } from 'next/app';
import ErrorBoundary from '../components/ErrorBoundary';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Prevent React hydration issues
    if (typeof window !== 'undefined') {
      console.log('App mounted successfully');
    }
  }, []);

  return (
    <ErrorBoundary>
      <div suppressHydrationWarning={true}>
        <Component {...pageProps} />
      </div>
    </ErrorBoundary>
  )
}