"use client";

import React from 'react';

type NavLink = {
  page: string;
  label: string;
};

type MobileSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  navLinks: NavLink[];
  currentPage: string;
  onNavClick: (page: string) => void;
  storeName: string;
};

export default function MobileSidebar({ isOpen, onClose, navLinks, currentPage, onNavClick, storeName }: MobileSidebarProps) {
  const handleNavClick = (page: string) => {
    onNavClick(page);
    onClose();
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`} id="sidebar">
      <div className="sidebar-header">
        <span className="logo" id="sidebarLogo">{storeName}</span>
        <i className="fas fa-times close-sidebar" id="closeSidebar" onClick={onClose}></i>
      </div>
      <nav className="sidebar-nav" id="sidebarNav">
        {navLinks.map(({ page, label }) => (
          <a
            key={page}
            className={`nav-link ${currentPage === page ? 'active' : ''}`}
            data-page={page}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick(page);
            }}
          >
            {label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
