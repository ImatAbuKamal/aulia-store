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
  const mapUrl = info?.mapUrl || info?.map || info?.embedMap;

  return (
    <div className="contact-section" id="contactContent">
      {isLoading ? (
        <Skeleton className="skeleton-card" style={{ height: '300px' }} />
      ) : !info ? (
        <p>Informasi kontak belum tersedia.</p>
      ) : (
        <>
          <h2 className="section-title">Hubungi Kami</h2>
          <div className="contact-grid">
            <div className="contact-info">
              {(info.phone || info.telepon) && 
                <div><i className="fas fa-phone-alt"></i> {escapeHTML(info.phone || info.telepon)}</div>
              }
              {info.email && 
                <div><i className="fas fa-envelope"></i> {escapeHTML(info.email)}</div>
              }
              {(info.address || info.alamat) && 
                <div><i className="fas fa-map-marker-alt"></i> {escapeHTML(info.address || info.alamat)}</div>
              }
            </div>
            
            <div className="map-container">
              {mapUrl ? (
                 <iframe src={escapeHTML(mapUrl)} allowFullScreen loading="lazy" title="Location Map"></iframe>
              ) : (
                <div style={{background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', height: '100%'}}>
                    Peta tidak tersedia
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
