'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Hero = () => {
  return (
    <div className="th-hero-wrapper hero-1" id="hero">
      <div 
        className="swiper th-slider hero-slider-1" 
        id="heroSlide1" 
        data-slider-options='{"effect":"fade","menu": ["", "", ""],"heroSlide1": {"swiper-container": {"pagination": {"el": ".swiper-pagination", "clickable": true }}}}'
      >
        <div className="swiper-wrapper">
          <div className="swiper-slide">
            <div className="hero-inner">
              
              <Image
                src="https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/hero/20250712_115439.webp"
                alt="African landscape at sunset"
                layout="fill"
                objectFit="cover"
                quality={100}
                className="th-hero-bg"
              />
              <div className="hero-overlay"></div>
              <div className="container">
                <div className="hero-style1">
                  <span
                    className="sub-title style1"
                    data-ani="slideinup"
                    data-ani-delay="0.2s"
                  >
                    Experience Africa's Wonders with Yara
                  </span>
                  <h1
                    className="hero-title"
                    data-ani="slideinup"
                    data-ani-delay="0.4s"
                  >
                    Motherland Tours, One Memory at a Time
                  </h1>
                  <div
                    className="btn-group"
                    data-ani="slideinup"
                    data-ani-delay="0.6s"
                  >
                    <Link href="/tour" className="th-btn th-icon">
                      Explore Tours
                    </Link>
                    <Link href="/contact" className="th-btn style2 th-icon">
                      Contact Us
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="swiper-slide">
            <div className="hero-inner">
              
              <Image
                src="https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/hero/20250702_162100.jpg"
                alt="Wildebeest migration in the Serengeti"
                layout="fill"
                objectFit="cover"
                quality={100}
                className="th-hero-bg"
              />
              <div className="hero-overlay"></div>
              <div className="container">
                <div className="hero-style1">
                  <span
                    className="sub-title style1"
                    data-ani="slideinup"
                    data-ani-delay="0.2s"
                  >
                    Wild, beautiful, and unforgettable
                  </span>
                  <h1
                    className="hero-title"
                    data-ani="slideinup"
                    data-ani-delay="0.4s"
                  >
                    Personal and unforgettable travel
                  </h1>
                  <div
                    className="btn-group"
                    data-ani="slideinup"
                    data-ani-delay="0.6s"
                  >
                    <Link href="/tour" className="th-btn th-icon">
                      Explore Tours
                    </Link>
                    <Link href="/contact" className="th-btn style2 th-icon">
                      Contact Us
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="swiper-slide">
            <div className="hero-inner">
              
              <Image
                src="https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website/cape-town.jpg"
                alt="Aerial view of Cape Town with Table Mountain"
                layout="fill"
                objectFit="cover"
                quality={100}
                className="th-hero-bg"
              />
              <div className="hero-overlay"></div>
              <div className="container">
                <div className="hero-style1">
                  <span
                    className="sub-title style1"
                    data-ani="slideinup"
                    data-ani-delay="0.2s"
                  >
                    Meaningful connections with Africa
                  </span>
                  <h1
                    className="hero-title"
                    data-ani="slideinup"
                    data-ani-delay="0.4s"
                  >
                    Your Perfect African Getaway with Yara Tours
                  </h1>
                  <div
                    className="btn-group"
                    data-ani="slideinup"
                    data-ani-delay="0.6s"
                  >
                    <Link href="/tour" className="th-btn th-icon">
                      Explore Tours
                    </Link>
                    <Link href="/contact" className="th-btn style2 th-icon">
                      Contact Us
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="th-swiper-custom">
          <button data-slider-prev="#heroSlide1" className="slider-arrow slider-prev">
            <Image 
              src="/assets/img/icon/right-arrow.svg" 
              alt="Previous" 
              width={24} 
              height={24}
            />
          </button>
          <div className="slider-pagination"></div>
          <button data-slider-next="#heroSlide1" className="slider-arrow slider-next">
            <Image 
              src="/assets/img/icon/left-arrow.svg" 
              alt="Next" 
              width={24} 
              height={24}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
