import type {Metadata} from 'next';
import './globals.css';
import React from "react";
import { APP_SCRIPT_URL } from '@/lib/config';
import type { FooterData } from '@/lib/types';

// Fungsi untuk mengambil data footer dari server
async function getFooterData(): Promise<FooterData | null> {
    try {
        const res = await fetch(`${APP_SCRIPT_URL}?type=footer`, { next: { revalidate: 3600 } }); // Revalidate every hour
        if (!res.ok) return null;
        const data = await res.json();
        return data.success ? (data.footer || null) : null;
    } catch (err) {
        console.error(`Error fetching footer for metadata:`, err);
        return null;
    }
}

// Fungsi untuk generate metadata dinamis
export async function generateMetadata(): Promise<Metadata> {
  const footerData = await getFooterData();
  const storeName = footerData?.storeName || 'estetik.store';
  
  return {
    title: `${storeName} – Modern & Estetik.`,
    description: 'Modern & Estetik.',
  }
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.5, user-scalable=yes" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
        <script type='text/javascript' src='https://app.sandbox.midtrans.com/snap/snap.js' data-client-key='SB-Mid-client-FBGELqULvvZ8eF0E'></script>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
