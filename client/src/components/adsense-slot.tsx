import { useEffect } from 'react';

interface AdSenseSlotProps {
  adSlot?: string;
  adFormat?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  width?: string;
  height?: string;
  responsive?: boolean;
}

export function AdSenseSlot({
  adSlot = '1234567890',
  adFormat = 'horizontal',
  width = '100%',
  height = '90px',
  responsive = true,
}: AdSenseSlotProps) {
  const clientId = import.meta.env.VITE_GOOGLE_ADSENSE_CLIENT_ID;

  useEffect(() => {
    if (clientId && window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error('AdSense error:', err);
      }
    }
  }, [clientId]);

  // Don't render if no client ID
  if (!clientId) {
    return null;
  }

  return (
    <div className="flex justify-center my-4 px-4">
      <div
        style={{
          width: '100%',
          maxWidth: '728px',
          borderRadius: '0.5rem',
          overflow: 'hidden',
          backgroundColor: 'rgba(122, 31, 195, 0.02)',
          border: '1px solid rgba(122, 31, 195, 0.1)',
          padding: '0.25rem',
        }}
      >
        <ins
          className="adsbygoogle"
          style={{
            display: 'block',
            width: '100%',
            height,
          }}
          data-ad-client={clientId}
          data-ad-slot={adSlot}
          data-ad-format={adFormat}
          data-full-width-responsive={responsive.toString()}
        />
      </div>
    </div>
  );
}

// Declare global window type for adsbygoogle
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}
