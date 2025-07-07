
import { useEffect, useState } from 'react';
import Script from 'next/script';

interface AdComponentProps {
  slot: 'header' | 'sidebar' | 'footer' | 'inContent';
  className?: string;
}

export default function AdComponent({ slot, className = '' }: AdComponentProps) {
  const [adSettings, setAdSettings] = useState<any>({});

  useEffect(() => {
    fetch('/api/advertising/settings')
      .then(res => res.json())
      .then(data => setAdSettings(data))
      .catch(console.error);
  }, []);

  if (!adSettings.adsenseEnabled || !adSettings.adsenseClientId) {
    return null;
  }

  const slotId = adSettings.adsenseSlotIds?.[slot];
  if (!slotId) return null;

  return (
    <div className={`ad-container ${className}`}>
      {/* Google AdSense */}
      <Script
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adSettings.adsenseClientId}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <Script id={`adsense-${slot}`} strategy="afterInteractive">
        {`(adsbygoogle = window.adsbygoogle || []).push({});`}
      </Script>
    </div>
  );
}
