import { ImageResponse } from 'next/og';
import { SITE_URL } from '@/lib/seo';

export const runtime = 'edge';
export const alt = 'Mohamed Tarek — Graphic Designer & UI/UX Designer';
export const size = {
  width: 1200,
  height: 630
};
export const contentType = 'image/png';

export default function OpenGraphImage() {
  const domainLabel = SITE_URL.replace(/^https?:\/\//i, '');

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          backgroundColor: '#0a0812',
          backgroundImage:
            'radial-gradient(circle at 86% 18%, rgba(124, 58, 237, 0.36) 0%, rgba(124, 58, 237, 0) 48%), radial-gradient(circle at 14% 88%, rgba(3, 89, 215, 0.34) 0%, rgba(3, 89, 215, 0) 46%), radial-gradient(circle at 52% 100%, rgba(232, 121, 249, 0.16) 0%, rgba(232, 121, 249, 0) 40%)',
          color: '#ffffff',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          position: 'relative'
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 20px',
              borderRadius: '999px',
              border: '1px solid rgba(167, 139, 250, 0.35)',
              backgroundColor: 'rgba(124, 58, 237, 0.14)',
              fontSize: '18px',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#e9d5ff'
            }}
          >
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '999px',
                backgroundColor: '#E879F9'
              }}
            />
            <span>Portfolio 2026</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '18px',
              color: 'rgba(255, 255, 255, 0.72)'
            }}
          >
            <span>EN / AR</span>
          </div>
        </div>

        {/* Center hero typography */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            maxWidth: '980px'
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: '84px',
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: '-0.03em',
              color: '#ffffff'
            }}
          >
            Mohamed Tarek
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: '38px',
              fontWeight: 600,
              lineHeight: 1.2,
              backgroundImage: 'linear-gradient(90deg, #A78BFA 0%, #E879F9 52%, #60A5FA 100%)',
              backgroundClip: 'text',
              color: 'transparent'
            }}
          >
            Graphic Designer &amp; UI/UX Designer
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: '23px',
              fontWeight: 400,
              lineHeight: 1.45,
              color: 'rgba(255, 255, 255, 0.74)',
              maxWidth: '820px',
              marginTop: '4px'
            }}
          >
            Social media campaigns, brand identities, and bilingual websites crafted to feel clear, confident, and memorable.
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            paddingTop: '24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.12)'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            {['Social Media', 'Brand Identity', 'UI/UX Design', 'Motion'].map((label) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  padding: '8px 16px',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  fontSize: '17px',
                  fontWeight: 500,
                  color: 'rgba(255, 255, 255, 0.88)'
                }}
              >
                {label}
              </div>
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: '18px',
              fontWeight: 500,
              color: 'rgba(255, 255, 255, 0.65)'
            }}
          >
            {domainLabel}
          </div>
        </div>
      </div>
    ),
    {
      ...size
    }
  );
}
