import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import ErrorBoundary from '../components/ErrorBoundary';

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