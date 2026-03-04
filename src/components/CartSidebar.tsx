"use client";

import React, { useState, useMemo } from 'react';
import type { CartItem } from '@/lib/types';
import { formatRupiah } from '@/lib/utils';
import { Loader } from '@/components/Loader';

type CartSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveFromCart: (id: string) => void;
  onCheckout: (customerDetails: { name: string, email: string, phone: string }) => Promise<{ success: boolean } | undefined>;
};

export default function CartSidebar({ isOpen, onClose, items, onUpdateQuantity, onRemoveFromCart, onCheckout }: CartSidebarProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const cartTotal = useMemo(() => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [items]);

  const handleCheckoutClick = async () => {
    setIsCheckingOut(true);
    const result = await onCheckout({ 
      name: customerName, 
      email: customerEmail, 
      phone: customerPhone 
    });
    // Don't clear form on payment failure
    if (result?.success) {
      // Logic to clear cart and close sidebar is handled in page.tsx
    }
    setIsCheckingOut(false);
  };
  
  const showForm = items.length > 0;

  return (
    <aside className={`cart-sidebar ${isOpen ? 'open' : ''}`} id="cartSidebar">
      <div className="cart-header">
        <h3><i className="fas fa-shopping-bag" style={{ marginRight: '0.5rem' }}></i> Keranjang</h3>
        <button className="close-cart" id="closeCart" onClick={onClose}><i className="fas fa-times"></i></button>
      </div>
      <div className="cart-scroll-area">
        <div className="cart-items" id="cartItems">
          {items.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem', color: '#64748b' }}>
              <i className="fas fa-shopping-bag fa-3x" style={{ opacity: 0.5 }}></i>
              <p style={{ marginTop: '1rem' }}>Keranjang kosong</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="cart-item" data-id={item.id}>
                <img src={item.image} alt={item.name} className="cart-item-img" loading="lazy" />
                <div className="cart-item-details">
                  <div className="cart-item-title">{item.name}</div>
                  <div className="cart-item-price">{formatRupiah(item.price)}</div>
                  <div className="cart-item-actions">
                    <button className="qty-btn" onClick={() => onUpdateQuantity(item.id, -1)} disabled={item.quantity <= 1}><i className="fas fa-minus"></i></button>
                    <span style={{ fontWeight: 600, minWidth: '24px', textAlign: 'center' }}>{item.quantity}</span>
                    <button className="qty-btn" onClick={() => onUpdateQuantity(item.id, 1)} disabled={item.quantity >= item.stock}><i className="fas fa-plus"></i></button>
                    <button className="qty-btn danger" onClick={() => onRemoveFromCart(item.id)} style={{ marginLeft: 'auto' }}><i className="fas fa-trash-alt"></i></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="checkout-form-container" style={{ display: showForm ? 'block' : 'none' }}>
            <div className="checkout-form">
              <div className="form-group">
                <label htmlFor="customerName">Nama Lengkap</label>
                <input type="text" id="customerName" placeholder="John Doe" autoComplete="name" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="customerEmail">Email</label>
                <input type="email" id="customerEmail" placeholder="hello@example.com" autoComplete="email" required value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="customerPhone">Nomor Telepon</label>
                <input type="tel" id="customerPhone" placeholder="+62 812 3456 7890" autoComplete="tel" required value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
              </div>
            </div>
        </div>
      </div>
      <div className="cart-footer">
        <div className="cart-total">
          <span>Total</span>
          <span id="cartTotal">{formatRupiah(cartTotal)}</span>
        </div>
        <button className="btn-checkout" id="checkoutBtn" onClick={handleCheckoutClick} disabled={items.length === 0 || isCheckingOut}>
          {isCheckingOut ? <span className="loading"></span> : <i className="fas fa-lock"></i>}
          {isCheckingOut ? 'Memproses...' : 'Checkout'}
        </button>
      </div>
    </aside>
  );
}
