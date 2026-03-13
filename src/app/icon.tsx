import { ImageResponse } from 'next/og'

// Konfigurasi route segment
export const runtime = 'edge'

// Metadata gambar
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// Generasi gambar
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#F97316"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="8" cy="21" r="1" />
          <circle cx="19" cy="21" r="1" />
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.16" />
        </svg>
        <div
          style={{
            position: 'absolute',
            top: '8px',
            left: '0px',
            right: '0px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#F97316',
            fontSize: 12,
            fontWeight: 700,
            lineHeight: 1,
            marginTop: '-2px'
          }}
        >
          AS
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
