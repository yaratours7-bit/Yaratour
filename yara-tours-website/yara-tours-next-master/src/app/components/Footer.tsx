'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/utils/supabase';

const Footer = () => {
  const [instagramImages, setInstagramImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchInstagramImages = async () => {
      const { data } = await supabase.storage
        .from('website')
        .list('instagram', {
          limit: 6,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' },
        });

      if (data) {
        const images = data.map((file) => {
          const { data: imageUrl } = supabase.storage
            .from('website')
            .getPublicUrl(`instagram/${file.name}`);
          return imageUrl.publicUrl;
        });
        setInstagramImages(images);
      }
    };

    fetchInstagramImages();
  }, []);

  return (
    <footer className="footer-wrapper footer-layout1">
      <div className="widget-area">
        <div className="container">
          <div className="newsletter-area">
            <div className="newsletter-top">
              <div className="row gy-4 align-items-center">
                <div className="col-lg-5">
                  <h2 className="newsletter-title text-capitalize mb-0">
                    get updated the latest newsletter
                  </h2>
                </div>
                <div className="col-lg-7">
                  <form className="newsletter-form">
                    <input 
                      className="form-control" 
                      type="email" 
                      placeholder="Enter Email" 
                      required 
                    />
                    <button type="submit" className="th-btn style3">
                      Subscribe Now
                      <Image 
                        src="/assets/img/icon/plane.svg" 
                        alt="A paper plane icon for the subscribe button." 
                        width={20} 
                        height={20}
                      />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
          
          <div className="row justify-content-between">
            <div className="col-md-6 col-xl-3">
              <div className="widget footer-widget">
                <div className="th-widget-about">
                  <div className="about-logo">
                    <Link href="/">
                      <Image 
                        src="/assets/img/YaraTours&Travel-logo-footer.png" 
                        alt="Yara Tours & Travel Logo" 
                        width={120} 
                        height={40}
                      />
                    </Link>
                  </div>
                  <p className="about-text">
                    Yara Tours & Travel is a Cape Town-based tourism company dedicated to delivering meaningful, inspiring, and luxurious travel experiences.
                  </p>
                  <div className="th-social">
                    <a href="https://www.facebook.com/yaratoursntravel" target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="https://www.tiktok.com/@yaratoursandtravel" target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-tiktok"></i>
                    </a>
                    <a href="https://wa.me/27671364077" target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-whatsapp"></i>
                    </a>
                    <a href="https://www.instagram.com/yaratours_ntravel/" target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-instagram"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-xl-auto">
              <div className="widget widget_nav_menu footer-widget">
                <h3 className="widget_title">Quick Links</h3>
                <div className="menu-all-pages-container">
                  <ul className="menu">
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/about">About Us</Link></li>
                    <li><Link href="/tour">Tours</Link></li>
                    <li><Link href="/gallery">Gallery</Link></li>
                    <li><Link href="/contact">Contact</Link></li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-xl-auto">
              <div className="widget footer-widget">
                <h3 className="widget_title">Address</h3>
                <div className="th-widget-contact">
                  <div className="info-box_text">
                    <div className="icon">
                      <Image 
                        src="/assets/img/icon/phone.svg" 
                        alt="A phone icon." 
                        width={20} 
                        height={20}
                      />
                    </div>
                    <div className="details">
                      <p>
                        <a href="tel:+27218186077" className="info-box_link">
                          +27 21 818 6077
                        </a>
                      </p>
                    </div>
                  </div>
                  
                  <div className="info-box_text">
                    <div className="icon">
                      <Image 
                        src="/assets/img/icon/envelope.svg" 
                        alt="An email icon." 
                        width={20} 
                        height={20}
                      />
                    </div>
                    <div className="details">
                      <p>
                        <a href="mailto:info@yaratoursntravel.com" className="info-box_link">
                          info@yaratoursntravel.com
                        </a>
                      </p>
                    </div>
                  </div>
                  
                  <div className="info-box_text">
                    <div className="icon">
                      <Image 
                        src="/assets/img/icon/location-dot.svg" 
                        alt="A location pin icon." 
                        width={20} 
                        height={20}
                      />
                    </div>
                    <div className="details">
                      <p>Cape Town, South Africa</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-xl-auto">
              <div className="widget footer-widget">
                <h3 className="widget_title">Instagram Post</h3>
                <div className="sidebar-gallery">
                  {instagramImages.map((image, index) => (
                    <div className="gallery-thumb" key={index}>
                      <Image 
                        src={image}
                        alt={`An Instagram post from Yara Tours & Travel, image ${index + 1}.`} 
                        width={60} 
                        height={60}
                        style={{ objectFit: 'cover', aspectRatio: '1 / 1' }}
                      />
                      <a 
                        target="_blank" 
                        href="https://www.instagram.com/yaratours_ntravel/" 
                        className="gallery-btn"
                        rel="noopener noreferrer"
                      >
                        <i className="fab fa-instagram"></i>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div 
        className="copyright-wrap" 
        style={{
          backgroundImage: 'url(/assets/img/bg/copyright_bg_1.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container">
          <div className="row justify-content-between align-items-center">
            <div className="col-md-6">
              <p className="copyright-text">
                Copyright 2025 <Link href="/">Yara Tours & Travel</Link>. All Rights Reserved.
              </p>
            </div>
            <div className="col-md-6 text-end d-none d-md-block">
              <div className="footer-card">
                <span className="title">We Accept</span>
                <Image 
                  src="/assets/img/shape/cards.png" 
                  alt="Payment Cards" 
                  width={200} 
                  height={30}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
