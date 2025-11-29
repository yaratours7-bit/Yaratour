'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import MobileMenu from './MobileMenu';

const Header = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add('th-body-visible');
    } else {
      document.body.classList.remove('th-body-visible');
    }
  }, [menuOpen]);

  const navigationSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "SiteNavigationElement",
        "position": 1,
        "name": "Home",
        "url": "https://yaratoursntravel.com/"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 2,
        "name": "About",
        "url": "https://yaratoursntravel.com/about"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 3,
        "name": "Tours",
        "url": "https://yaratoursntravel.com/tour"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 4,
        "name": "Gallery",
        "url": "https://yaratoursntravel.com/gallery"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 5,
        "name": "Contact",
        "url": "https://yaratoursntravel.com/contact"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 6,
        "name": "FAQ",
        "url": "https://yaratoursntravel.com/faq"
      }
    ]
  };

  return (
    <header className="th-header header-layout1">
      <Script
        id="navigation-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(navigationSchema) }}
      />
      <MobileMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />
      <div className="header-top d-none d-md-block">
        <div className="container th-container">
          <div className="row justify-content-center justify-content-xl-between align-items-center">
            <div className="col-auto d-none d-md-block">
              <div className="header-links">
                <ul>
                  <li className="d-none d-xl-inline-block">
                    <i className="fa-sharp fa-regular fa-phone"></i>
                    <span>+27 21 818 6077</span>
                  </li>
                  <li className="d-none d-xl-inline-block">
                    <i className="fa-regular fa-clock"></i>
                    <span>Monday to Friday: 8.00 am - 7.00 pm</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-auto">
              <div className="header-right">
                {/* <div className="currency-menu">
                  <select className="form-select nice-select" defaultValue="language">
                    <option value="language">language</option>
                    
                    <option value="EUR">PT</option>
                    <option value="AUD">ENG</option>
                    <option value="CNY">ESP</option>
                  </select>
                </div> */}
                <div className="header-links">
                  <ul>
                    <li className="d-none d-md-inline-block">
                      <Link href="/faq">FAQ</Link>
                    </li>
                    <li className="d-none d-md-inline-block">
                      <Link href="/contact">Support</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="sticky-wrapper">
        <div className="menu-area">
          <div className="container th-container">
            <div className="row align-items-center justify-content-between ">
              <div className="col-auto">
                <div className="header-logo">
                  <Link href="/">
                    <Image 
                      src="/assets/img/yara-logo-white-boarder.png" 
                      alt="Yara Tours & Travel Logo" 
                      width={120} 
                      height={40}
                    />
                  </Link>
                </div>
              </div>
              <div className="col-auto">
                <nav className="main-menu d-none d-xl-inline-block">
                  <ul>
                    <li>
                      <Link 
                        href="/" 
                        className={pathname === '/' ? 'active' : ''}
                      >
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/about" 
                        className={pathname === '/about' ? 'active' : ''}
                      >
                        About
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/tour" 
                        className={pathname === '/tour' ? 'active' : ''}
                      >
                        Tours
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/gallery" 
                        className={pathname === '/gallery' ? 'active' : ''}
                      >
                        Gallery
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/contact" 
                        className={pathname === '/contact' ? 'active' : ''}
                      >
                        Contact
                      </Link>
                    </li>
                    
                  </ul>
                </nav>
                <button
                  type="button"
                  className="th-menu-toggle d-block d-xl-none"
                  onClick={toggleMenu}
                >
                  <i className="far fa-bars"></i>
                </button>
              </div>
              <div className="col-auto d-none d-xl-block">
                <div className="header-button">
                  <Link href="/tour" className="th-btn style3 th-icon">
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="logo-bg" data-mask-src="/assets/img/logo_bg_mask.png"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
