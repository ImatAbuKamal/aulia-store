"use client";

import React from 'react';
import type { Product } from '@/lib/types';
import { formatRupiah, escapeHTML } from '@/lib/utils';
import { DEFAULT_IMAGE } from '@/lib/config';
import { Skeleton } from '@/components/ui/skeleton';

type ProductsSectionProps = {
  products: Product[];
  onAddToCart: (product: Product) => void;
  isLoading: boolean;
};

export default function ProductsSection({ products, onAddToCart, isLoading }: ProductsSectionProps) {
  return (
    <>
      <h1 className="section-title">Semua Produk</h1>
      <div className="product-grid" id="allProductGrid">
        {isLoading ? (
            Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="product-card">
                    <Skeleton className="product-image" />
                    <div className="product-info">
                        <Skeleton style={{height: '1.1rem', width: '75%', marginBottom: '0.3rem'}} />
                        <Skeleton style={{height: '1rem', width: '50%', marginBottom: '0.5rem'}} />
                        <Skeleton style={{height: '0.9rem', width: '30%', marginBottom: '1rem'}} />
                        <Skeleton style={{height: '40px', width: '100%', borderRadius: '12px'}} />
                    </div>
                </div>
            ))
        ) : products.length === 0 ? (
          <p style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem' }}>✨ Belum ada produk.</p>
        ) : (
          products.map(p => {
            const stock = p.stock || 0;
            const stockText = stock > 0 ? `Stok: ${stock}` : 'Stok habis';
            const isOutOfStock = stock <= 0;
            return (
              <div key={p.id} className="product-card">
                <img src={escapeHTML(p.imageUrl || DEFAULT_IMAGE)} alt={p.name} className="product-image" loading="lazy" />
                <div className="product-info">
                  <div className="product-title">{escapeHTML(p.name)}</div>
                  <div className="product-price">{formatRupiah(p.price)}</div>
                  <div className="product-stock">{stockText}</div>
                  <button className="btn-add" onClick={() => onAddToCart(p)} disabled={isOutOfStock}>
                    <i className="fas fa-shopping-bag"></i> {isOutOfStock ? 'Habis' : 'Tambah'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
