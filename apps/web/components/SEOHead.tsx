
import Head from 'next/head';
import { useEffect, useState } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

export default function SEOHead({ 
  title, 
  description, 
  keywords, 
  ogImage, 
  canonicalUrl, 
  noIndex = false 
}: SEOProps) {
  const [seoSettings, setSeoSettings] = useState<any>({});

  useEffect(() => {
    // Fetch global SEO settings
    fetch('/api/seo/settings')
      .then(res => res.json())
      .then(data => setSeoSettings(data))
      .catch(console.error);
  }, []);

  const metaTitle = title || seoSettings.metaTitle || 'EduAI Platform';
  const metaDescription = description || seoSettings.metaDescription || 'Complete education management platform';
  const metaKeywords = keywords || seoSettings.metaKeywords || 'education, AI, learning';
  const ogImageUrl = ogImage || seoSettings.ogImage || '/images/og-default.jpg';

  return (
    <Head>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      
      {/* Open Graph */}
      <meta property="og:title" content={seoSettings.ogTitle || metaTitle} />
      <meta property="og:description" content={seoSettings.ogDescription || metaDescription} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:type" content="website" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content={seoSettings.twitterCard || 'summary_large_image'} />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImageUrl} />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      
      {/* Viewport */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
  );
}
