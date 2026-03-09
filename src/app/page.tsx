"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';

import type { Product, CartItem, CarouselItem as CarouselItemType, AboutItem, ContactInfo, FooterData } from '@/lib/types';
import { APP_SCRIPT_URL } from '@/lib/config';
import { validateName, validateEmail, validatePhone } from '@/lib/validation';
import { sanitizeInput } from '@/lib/utils';

import Header from '@/components/Header';
import MobileSidebar from '@/components/MobileSidebar';
import CarouselSection from '@/components/sections/CarouselSection';
import ProductsSection from '@/components/sections/ProductsSection';
import AboutSection from '@/components/sections/AboutSection';
import ContactSection from '@/components/sections/ContactSection';
import CartSidebar from '@/components/CartSidebar';
import Footer from '@/components/Footer';


declare global {
  interface Window {
    snap: any;
  }
}

const navLinks = [
  { page: 'home', label: 'Home' },
  { page: 'products', label: 'Products' },
  { page: 'about', label: 'About' },
  { page: 'contact', label: 'Contact' },
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [carousels, setCarousels] = useState<CarouselItemType[]>([]);
  const [abouts, setAbouts] = useState<AboutItem[]>([]);
  const [contacts, setContacts] = useState<ContactInfo | null>(null);
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  
  const [currentPage, setCurrentPage] = useState('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isLoading, setIsLoading] = useState({
    products: true,
    carousel: true,
    about: true,
    contact: true,
    footer: true,
  });

  const fetchData = useCallback(async (type: string) => {
    try {
      const res = await fetch(`${APP_SCRIPT_URL}?type=${type}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      if (!data.success) throw new Error(`Failed to fetch ${type}: ${data.message || ''}`);
      return data;
    } catch (err) {
      console.error(`Error fetching ${type}:`, err);
      return null;
    }
  }, []);

  useEffect(() => {
    const loadAllData = () => {
      fetchData("products").then(data => {
        if (data) setProducts(data.products || []);
      }).finally(() => setIsLoading(prev => ({...prev, products: false})));

      fetchData("home").then(data => {
        if (data) setCarousels(data.carousels || []);
      }).finally(() => setIsLoading(prev => ({...prev, carousel: false})));

      fetchData("about").then(data => {
        if (data) setAbouts(data.abouts || data.data || data.about || []);
      }).finally(() => setIsLoading(prev => ({...prev, about: false})));

      fetchData("contact").then(data => {
        if (data) setContacts(data.contacts?.[0] || data.data?.[0] || data.contact?.[0] || null);
      }).finally(() => setIsLoading(prev => ({...prev, contact: false})));
      
      fetchData("footer").then(data => {
        if (data) setFooterData(data.footer || {});
      }).finally(() => setIsLoading(prev => ({...prev, footer: false})));
    };

    loadAllData();
  }, [fetchData]);

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    } catch (e) {
      console.error("Failed to parse cart from localStorage", e);
      localStorage.removeItem("cart");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleNavClick = (page: string) => {
    setCurrentPage(page);
  };
  
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

    const badge = document.getElementById("cartBadge");
    if (badge) {
      badge.style.transform = 'scale(1.2)';
      setTimeout(() => { badge.style.transform = 'scale(1)'; }, 150);
    }
  }, [cart]);

  const handleUpdateQuantity = useCallback((id: string, delta: number) => {
    setCart(prevCart => {
      const itemToUpdate = prevCart.find(i => i.id === id);
      if (!itemToUpdate) return prevCart;

      const newQty = itemToUpdate.quantity + delta;
      
      if (newQty > itemToUpdate.stock) {
        Swal.fire({
          icon: 'error',
          title: 'Stok tidak mencukupi',
          text: `Stok tersedia hanya ${itemToUpdate.stock} item.`,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
        return prevCart;
      }
      
      if (newQty <= 0) {
        return prevCart.filter(i => i.id !== id);
      }
      
      return prevCart.map(i => i.id === id ? { ...i, quantity: newQty } : i);
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
    if (!validatePhone(phone)) return showValidationError('Nomor telepon tidak valid', 'Gunakan format internasional (cth: +6281234567890).');
    
    for (const item of cart) {
        const product = products.find((p) => p.id === item.id);
        const currentStock = product ? product.stock : item.stock;
        if (item.quantity > currentStock) {
            showValidationError('Stok Habis', `Stok untuk ${item.name} tidak mencukupi.`);
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
          onClose: () => { /* Logic is handled by isCheckingOut state in CartSidebar */ }
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

  const isOverlayVisible = isCartOpen || isMobileMenuOpen;

  const closeAllPopups = () => {
    setIsCartOpen(false);
    setIsMobileMenuOpen(false);
  };
  
  return (
    <>
      <Header
        storeName={footerData?.storeName || 'estetik.store'}
        navLinks={navLinks}
        currentPage={currentPage}
        onNavClick={handleNavClick}
        cartItemCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onCartToggle={() => setIsCartOpen(true)}
        onHamburgerClick={() => setIsMobileMenuOpen(true)}
      />
      <MobileSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        storeName={footerData?.storeName || 'estetik.store'}
        navLinks={navLinks}
        currentPage={currentPage}
        onNavClick={handleNavClick}
      />
      
      <div className={`overlay ${isOverlayVisible ? 'active' : ''}`} onClick={closeAllPopups}></div>

      {currentPage === 'home' && (
        <CarouselSection items={carousels} isLoading={isLoading.carousel} />
      )}
      
      <div className="container" id="pageContainer">
        {currentPage === 'products' && (
          <div id="productsPage">
            <ProductsSection products={products} onAddToCart={handleAddToCart} isLoading={isLoading.products} />
          </div>
        )}
        {currentPage === 'about' && (
          <div id="aboutPage">
            <AboutSection items={abouts} isLoading={isLoading.about} />
          </div>
        )}
        {currentPage === 'contact' && (
          <div id="contactPage">
            <ContactSection info={contacts} isLoading={isLoading.contact} />
          </div>
        )}
      </div>

      <Footer data={footerData} isLoading={isLoading.footer} />

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveFromCart={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />
    </>
  );
}
