"use client";

import React from 'react';
import type { AboutItem } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { escapeHTML } from '@/lib/utils';

type AboutSectionProps = {
  items: AboutItem[];
  isLoading: boolean;
};

export default function AboutSection({ items, isLoading }: AboutSectionProps) {
  if (isLoading) {
    return (
        <div id="aboutPage">
             <div className="about-section">
                <Skeleton className="skeleton-card" style={{ height: '200px' }} />
             </div>
        </div>
    )
  }

  return (
    <div id="aboutPage">
      <div className="about-section" id="aboutContent">
        {items.length === 0 ? (
          <p>Informasi perusahaan belum tersedia.</p>
        ) : (
          <>
            <h2 className="section-title">Tentang Kami</h2>
            <div className="about-grid">
              {items.map((item, index) => (
                <div key={index} className="about-item">
                  <h4>{escapeHTML(item.title)}</h4>
                  <p>{escapeHTML(item.content || item.deskripsi || item.text || '')}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
