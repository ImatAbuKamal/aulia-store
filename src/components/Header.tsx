"use client";

import React from 'react';

type NavLink = {
  page: string;
  label: string;
};

type HeaderProps = {
  storeName: string;
  navLinks: NavLink[];
  currentPage: string;
  onNavClick: (page: string) => void;
  cartItemCount: number;
  onCartToggle: () => void;
  onHamburgerClick: () => void;
};

export default function Header({ storeName, navLinks, currentPage, onNavClick, cartItemCount, onCartToggle, onHamburgerClick }: HeaderProps) {
  return (
    <header>
      <div className="header-left">
        <div className="hamburger" id="hamburgerBtn" onClick={onHamburgerClick}>
          <i className="fas fa-bars"></i>
        </div>
        <div className="logo" id="headerLogo">{storeName}</div>
        <nav className="desktop-nav" id="desktopNav">
          {navLinks.map(({ page, label }) => (
            <a
              key={page}
              className={`nav-link ${currentPage === page ? 'active' : ''}`}
              data-page={page}
              onClick={(e) => {
                e.preventDefault();
                onNavClick(page);
              }}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
      <div className="cart-icon" id="cartToggle" onClick={onCartToggle}>
        <i className="fas fa-shopping-bag"></i>
        <span className="cart-badge" id="cartBadge">{cartItemCount}</span>
      </div>
    </header>
  );
}
