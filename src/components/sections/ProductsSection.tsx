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
    <div id="productsPage">
      <h1 className="section-title">Semua Produk</h1>
      <div className="product-grid" id="allProductGrid">
        {isLoading ? (
            Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="product-card">
                    <Skeleton className="product-image" />
                    <div className="product-info">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-8 w-1/2 my-3" />
                        <Skeleton className="h-4 w-1/4 mb-2" />
                        <Skeleton className="h-10 w-full rounded-full" />
                    </div>
                </div>
            ))
        ) : products.length === 0 ? (
          <p style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem' }}>✨ Belum ada produk.</p>
        ) : (
          products.map(p => {
            const stock = p.stock || 0;
            const stockText = stock > 0 ? `Stok: ${stock}` : 'Stok habis';
            const disabled = stock <= 0;
            return (
              <div key={p.id} className="product-card">
                <img src={escapeHTML(p.imageUrl || DEFAULT_IMAGE)} alt={p.name} className="product-image" loading="lazy" />
                <div className="product-info">
                  <div className="product-title">{escapeHTML(p.name)}</div>
                  <div className="product-price">{formatRupiah(p.price)}</div>
                  <div className="product-stock">{stockText}</div>
                  <button className="btn-add" onClick={() => onAddToCart(p)} disabled={disabled}>
                    <i className="fas fa-shopping-bag"></i> {stock > 0 ? 'Tambah' : 'Habis'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
