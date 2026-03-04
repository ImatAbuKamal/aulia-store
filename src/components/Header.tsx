"use client";

import React, { useState } from 'react';

type NavLink = {
  page: string;
  label: string;
};

type HeaderProps = {
  currentPage: string;
  onNavClick: (page: string) => void;
  cartItemCount: number;
  onCartToggle: () => void;
};

const navLinks: NavLink[] = [
  { page: 'home', label: 'Home' },
  { page: 'products', label: 'Products' },
  { page: 'about', label: 'About' },
  { page: 'contact', label: 'Contact' },
];

export default function Header({ currentPage, onNavClick, cartItemCount, onCartToggle }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (page: string) => {
    onNavClick(page);
    setIsMenuOpen(false);
  };

  return (
    <header>
      <div className="logo">estetik.store</div>
      <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`} id="navMenu">
        {navLinks.map(({ page, label }) => (
          <a
            key={page}
            className={`nav-link ${currentPage === page ? 'active' : ''}`}
            data-page={page}
            onClick={() => handleNavClick(page)}
          >
            {label}
          </a>
        ))}
      </nav>
      <div className="hamburger" id="hamburgerBtn" aria-label="Menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <i className="fas fa-bars"></i>
      </div>
      <div className="cart-icon" id="cartToggle" onClick={onCartToggle}>
        <i className="fas fa-shopping-bag"></i>
        <span className="cart-badge" id="cartBadge">{cartItemCount}</span>
      </div>
    </header>
  );
}
