"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { CarouselItem as CarouselItemType } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { escapeHTML } from '@/lib/utils';
import { DEFAULT_IMAGE } from '@/lib/config';

type CarouselProps = {
  items: CarouselItemType[];
  isLoading: boolean;
};

export default function CarouselSection({ items, isLoading }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const resetTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
    if (containerRef.current) {
      const slideWidth = containerRef.current.clientWidth;
      containerRef.current.scrollTo({
        left: index * slideWidth,
        behavior: 'smooth'
      });
    }
  }, []);

  useEffect(() => {
    resetTimeout();
    if (items.length > 0) {
      timeoutRef.current = setTimeout(
        () => {
          const nextIndex = (currentIndex + 1) % items.length;
          goToSlide(nextIndex);
        },
        3000
      );
    }
    return () => {
      resetTimeout();
    };
  }, [currentIndex, items, resetTimeout, goToSlide]);

  const handleDotClick = (index: number) => {
    goToSlide(index);
  };

  if (isLoading) {
    return (
      <div className="carousel-section">
        <div className="carousel-container">
          <Skeleton className="skeleton-carousel" />
        </div>
      </div>
    );
  }
  
  if (!items.length) {
     return (
        <div className="carousel-section">
            <div className="carousel-container">
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', background: '#1e2b3c', color: 'white'}}>
                    ✨ Belum ada konten carousel.
                </div>
            </div>
        </div>
     );
  }

  return (
    <div className="carousel-section" id="carouselSection">
      <div className="carousel-container" id="carouselContainer" ref={containerRef}>
        {items.map((item, index) => (
          <div key={index} className="carousel-item">
            <img src={escapeHTML(item.imageUrl || DEFAULT_IMAGE)} alt={escapeHTML(item.title)} loading="lazy" />
            <div className="carousel-caption">
              <h3>{escapeHTML(item.title || "Promo Spesial")}</h3>
              <p>{escapeHTML(item.caption || "")}</p>
              {item.link && (
                <a href={escapeHTML(item.link)} target="_blank" rel="noopener noreferrer">
                  Lihat Selengkapnya →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="carousel-indicators" id="carouselIndicators">
        {items.map((_, index) => (
          <span
            key={index}
            className={`dot ${currentIndex === index ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
          ></span>
        ))}
      </div>
    </div>
  );
}
