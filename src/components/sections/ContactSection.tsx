"use client";

import React from 'react';
import type { ContactInfo } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { escapeHTML } from '@/lib/utils';

type ContactSectionProps = {
  info: ContactInfo | null;
  isLoading: boolean;
};

export default function ContactSection({ info, isLoading }: ContactSectionProps) {
  if (isLoading) {
    return (
        <div id="contactPage">
            <div className="contact-section">
                 <Skeleton className="skeleton-card" style={{ height: '250px' }} />
            </div>
        </div>
    )
  }

  return (
    <div id="contactPage">
      <div className="contact-section" id="contactContent">
        {!info ? (
          <p>Informasi kontak belum tersedia.</p>
        ) : (
          <>
            <h2 className="section-title">Hubungi Kami</h2>
            <div className="contact-grid">
              <div className="contact-info">
                {info.phone || info.telepon ? <div><i className="fas fa-phone-alt"></i> {escapeHTML(info.phone || info.telepon)}</div> : null}
                {info.email ? <div><i className="fas fa-envelope"></i> {escapeHTML(info.email)}</div> : null}
                {info.address || info.alamat ? <div><i className="fas fa-map-marker-alt"></i> {escapeHTML(info.address || info.alamat)}</div> : null}
              </div>
              
              {(info.mapUrl || info.map || info.embedMap) ? (
                 <div className="map-container">
                    <iframe src={escapeHTML(info.mapUrl || info.map || info.embedMap)} allowFullScreen loading="lazy" title="Location Map"></iframe>
                 </div>
              ) : (
                <div className="map-container" style={{background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-light)'}}>
                    Peta tidak tersedia
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
