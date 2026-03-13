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
      // Elemen JSX ImageResponse
      <div
        style={{
          fontSize: 20,
          background: '#1e293b',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '8px',
          fontWeight: 'bold',
        }}
      >
        E
      </div>
    ),
    // Opsi ImageResponse
    {
      ...size,
    }
  )
}
