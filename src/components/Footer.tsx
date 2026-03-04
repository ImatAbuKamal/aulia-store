"use client";

import React from 'react';
import type { FooterData } from '@/lib/types';
import { escapeHTML } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';

type FooterProps = {
  data: FooterData | null;
  isLoading: boolean;
};

const isValidUrl = (url?: string): url is string => {
  if (!url) return false;
  try {
    const parsed = new URL(url, window.location.origin);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch (e) {
    return false;
  }
};

const SocialLink = ({ href, label, iconClass }: { href?: string; label: string; iconClass: string }) => {
  if (isValidUrl(href)) {
    return (
      <a href={escapeHTML(href)} target="_blank" rel="noopener noreferrer" aria-label={label}>
        <i className={iconClass}></i>
      </a>
    );
  }
  return null;
};

export default function Footer({ data, isLoading }: FooterProps) {
  if (isLoading) {
    return (
      <footer id="footer">
        <div className="footer-content">
          <Skeleton style={{ height: '2rem', width: '150px', backgroundColor: '#475569' }} />
          <Skeleton style={{ height: '1.8rem', width: '200px', backgroundColor: '#475569' }} />
          <Skeleton style={{ height: '1rem', width: '250px', backgroundColor: '#475569' }} />
        </div>
      </footer>
    );
  }

  const storeName = data?.storeName || 'estetik.store';
  const year = new Date().getFullYear();
  const socialPlatforms: { key: keyof FooterData, icon: string, label: string }[] = [
    { key: 'facebook', icon: 'fab fa-facebook', label: 'Facebook' },
    { key: 'instagram', icon: 'fab fa-instagram', label: 'Instagram' },
    { key: 'youtube', icon: 'fab fa-youtube', label: 'YouTube' },
    { key: 'tiktok', icon: 'fab fa-tiktok', label: 'TikTok' }
  ];

  const renderedLinks = socialPlatforms
    .map(p => {
      const url = data?.[p.key];
      return <SocialLink key={p.key} href={url} label={p.label} iconClass={p.icon} />;
    })
    .filter(Boolean);

  return (
    <footer id="footer">
      <div className="footer-content">
        <div className="store-name" id="storeName">{storeName}</div>
        <div className="social-links" id="socialLinks">
          {renderedLinks.length > 0 ? renderedLinks : <span style={{ color: '#94a3b8' }}>Ikuti kami di sosial media</span>}
        </div>
        <div className="copyright" id="copyrightText">
          © {year} {storeName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
