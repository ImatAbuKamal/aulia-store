"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';

import type { Product, CartItem, CarouselItem as CarouselItemType, AboutItem, ContactInfo } from '@/lib/types';
import { APP_SCRIPT_URL } from '@/lib/config';
import { validateName, validateEmail, validatePhone } from '@/lib/validation';
import { sanitizeInput } from '@/lib/utils';
import Header from '@/components/Header';
import CarouselSection from '@/components/sections/CarouselSection';
import ProductsSection from '@/components/sections/ProductsSection';
import AboutSection from '@/components/sections/AboutSection';
import ContactSection from '@/components/sections/ContactSection';
import CartSidebar from '@/components/CartSidebar';

declare global {
  interface Window {
    snap: any;
  }
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [carousels, setCarousels] = useState<CarouselItemType[]>([]);
  const [abouts, setAbouts] = useState<AboutItem[]>([]);
  const [contacts, setContacts] = useState<ContactInfo | null>(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState({
    products: true,
    carousel: true,
    about: true,
    contact: true,
  });

  const fetchData = useCallback(async (type: string) => {
    try {
      const res = await fetch(`${APP_SCRIPT_URL}?type=${type}`);
      const data = await res.json();
      if (!data.success) throw new Error(`Failed to fetch ${type}`);
      return data;
    } catch (err) {
      console.error(`Error fetching ${type}:`, err);
      return null;
    }
  }, []);

  useEffect(() => {
    const loadAllData = async () => {
      // Fetch Products
      fetchData("products").then(data => {
        if (data) setProducts(data.products || []);
      }).finally(() => setIsLoading(prev => ({...prev, products: false})));

      // Fetch Carousel
      fetchData("home").then(data => {
        if (data) setCarousels(data.carousels || []);
      }).finally(() => setIsLoading(prev => ({...prev, carousel: false})));

      // Fetch About
      fetchData("about").then(data => {
        if (data) setAbouts(data.abouts || data.data || data.about || []);
      }).finally(() => setIsLoading(prev => ({...prev, about: false})));

      // Fetch Contact
      fetchData("contact").then(data => {
        if (data) setContacts(data.contacts?.[0] || data.data?.[0] || data.contact?.[0] || null);
      }).finally(() => setIsLoading(prev => ({...prev, contact: false})));
    };

    loadAllData();
  }, [fetchData]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);
  
  const handleAddToCart = useCallback((product: Product) => {
    const existing = cart.find((i) => i.id === product.id);
    const currentQty = existing ? existing.quantity : 0;

    if (currentQty + 1 > product.stock) {
      Swal.fire({
        icon: 'error',
        title: 'Stok tidak mencukupi',
        text: `Stok tersedia hanya ${product.stock} item.`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }

    setCart(prevCart => {
      if (existing) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { id: product.id, name: product.name, price: product.price, image: product.imageUrl, quantity: 1, stock: product.stock }];
      }
    });

    Swal.fire({
      icon: 'success',
      title: `${product.name} ditambahkan`,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    });
  }, [cart]);

  const handleUpdateQuantity = useCallback((id: string, delta: number) => {
    setCart(prevCart => {
      const item = prevCart.find(i => i.id === id);
      if (!item) return prevCart;

      const newQty = item.quantity + delta;
      
      if (newQty > item.stock) {
        Swal.fire({
          icon: 'error',
          title: 'Stok tidak mencukupi',
          text: `Stok tersedia hanya ${item.stock} item.`,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
        return prevCart;
      }
      
      if (newQty <= 0) {
        return prevCart.filter(i => i.id !== id);
      } else {
        return prevCart.map(i => i.id === id ? { ...i, quantity: newQty } : i);
      }
    });
  }, []);

  const handleRemoveFromCart = useCallback((id: string) => {
    setCart(prevCart => prevCart.filter(i => i.id !== id));
  }, []);

  const handleCheckout = useCallback(async (customerDetails: { name: string, email: string, phone: string }) => {
    const { name: rawName, email: rawEmail, phone: rawPhone } = customerDetails;
    const name = sanitizeInput(rawName);
    const email = sanitizeInput(rawEmail);
    const phone = sanitizeInput(rawPhone);

    const showValidationError = (title: string, text: string) => {
      Swal.fire({ icon: 'error', title, text, toast: true, position: 'top-end', showConfirmButton: false, timer: 4000 });
    };

    if (!validateName(name)) return showValidationError('Nama tidak valid', 'Minimal 2 huruf dan hanya karakter yang valid.');
    if (!validateEmail(email)) return showValidationError('Email tidak valid', 'Format email salah.');
    if (!validatePhone(phone)) return showValidationError('Nomor telepon tidak valid', 'Minimal 8 digit.');

    for (let item of cart) {
      const product = products.find((p) => p.id === item.id);
      const currentStock = product ? product.stock : item.stock;
      if (!product || item.quantity > currentStock) {
        showValidationError('Stok tidak mencukupi', `Produk ${item.name} hanya tersisa ${currentStock} item.`);
        return { success: false };
      }
    }

    const payload = {
      action: "checkout",
      customer: { name, email, phone },
      items: cart.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
      totalAmount: cart.reduce((acc, i) => acc + i.price * i.quantity, 0)
    };
    
    try {
      const formBody = new URLSearchParams();
      formBody.append("payload", JSON.stringify(payload));
      const res = await fetch(APP_SCRIPT_URL, {
        method: "POST",
        body: formBody,
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      });
      const data = await res.json();

      if (data.success && data.snapToken) {
        const currentOrderId = data.orderId;
        window.snap.pay(data.snapToken, {
          onSuccess: async (result: any) => {
            const confirmPayload = { action: 'confirm', orderId: currentOrderId, transactionId: result.transaction_id, status: 'success', items: cart.map(i => ({ id: i.id, quantity: i.quantity })) };
            const confirmBody = new URLSearchParams();
            confirmBody.append("payload", JSON.stringify(confirmPayload));
            await fetch(APP_SCRIPT_URL, { method: "POST", body: confirmBody, headers: { "Content-Type": "application/x-www-form-urlencoded" } });
            
            setCart([]);
            setIsCartOpen(false);
            Swal.fire({ icon: 'success', title: 'Pembayaran berhasil!', text: 'Terima kasih telah berbelanja.', toast: true, position: 'top-end', showConfirmButton: false, timer: 4000 });
            
            fetchData("products").then(data => data && setProducts(data.products || []));
          },
          onError: (err: any) => showValidationError('Pembayaran gagal', err.message || ''),
          onClose: () => {
            // Re-enable checkout button in CartSidebar component
          }
        });
        return { success: true };
      } else {
        throw new Error(data.message || 'Gagal mendapatkan token pembayaran.');
      }
    } catch (err: any) {
      showValidationError('Checkout Gagal', err.message);
      return { success: false };
    }
    return { success: false };
  }, [cart, products, fetchData]);

  return (
    <>
      <Header
        currentPage={currentPage}
        onNavClick={setCurrentPage}
        cartItemCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onCartToggle={() => setIsCartOpen(true)}
      />

      {currentPage === 'home' && (
        <CarouselSection items={carousels} isLoading={isLoading.carousel} />
      )}
      
      <main className="container" id="pageContainer">
        {currentPage === 'products' && (
          <ProductsSection products={products} onAddToCart={handleAddToCart} isLoading={isLoading.products} />
        )}
        {currentPage === 'about' && (
          <AboutSection items={abouts} isLoading={isLoading.about} />
        )}
        {currentPage === 'contact' && (
          <ContactSection info={contacts} isLoading={isLoading.contact} />
        )}
      </main>

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveFromCart={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />

      <div
        className={`overlay ${isCartOpen ? 'active' : ''}`}
        onClick={() => setIsCartOpen(false)}
      ></div>
    </>
  );
}
