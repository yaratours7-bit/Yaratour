'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface MobileMenuProps {
  menuOpen: boolean;
  toggleMenu: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ menuOpen, toggleMenu }) => {
  return (
    <div className={`th-menu-wrapper ${menuOpen ? 'th-body-visible' : ''}`}>
      <div className="th-menu-area text-center">
        <button className="th-menu-toggle" onClick={toggleMenu}>
          <i className="fal fa-times"></i>
        </button>
        <div >
          <Link href="/">
            <Image
              src="/assets/img/yara-logo-white-boarder.png"
              alt="Yara Tours & Travel Logo"
              width={240}
              height={80}
            />
          </Link>
        </div>
        <div className={`th-mobile-menu ${menuOpen ? 'd-block' : ''}`}>
          <ul>
            <li>
              <Link href="/" onClick={toggleMenu} className="text-black">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" onClick={toggleMenu}>
                About
              </Link>
            </li>
            <li>
              <Link href="/tour" onClick={toggleMenu}>
                Tours
              </Link>
            </li>
            <li>
              <Link href="/gallery" onClick={toggleMenu}>
                Gallery
              </Link>
            </li>
            <li>
              <Link href="/contact" onClick={toggleMenu}>
                Contact
              </Link>
            </li>
            <li>
              <Link href="/faq" onClick={toggleMenu}>
                FAQ
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
