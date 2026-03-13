"use client";

import React from 'react';
import { Skeleton } from './ui/skeleton';

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
  isLoading: boolean;
};

export default function Header({ storeName, navLinks, currentPage, onNavClick, cartItemCount, onCartToggle, onHamburgerClick, isLoading }: HeaderProps) {
  return (
    <header>
      <div className="header-left">
        <div className="hamburger" id="hamburgerBtn" onClick={onHamburgerClick}>
          <i className="fas fa-bars"></i>
        </div>
        {isLoading ? (
          <Skeleton style={{ height: '1.5rem', width: '120px' }} />
        ) : (
          <div className="logo" id="headerLogo">{storeName}</div>
        )}
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
