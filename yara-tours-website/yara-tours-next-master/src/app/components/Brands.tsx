'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Brands = () => {
  const brands = [
    {
      id: 1,
      name: 'Brand 1',
      logo: '/assets/img/brand/brand_1_1.svg',
      link: '#'
    },
    {
      id: 2,
      name: 'Brand 2',
      logo: '/assets/img/brand/brand_1_2.svg',
      link: '#'
    },
    {
      id: 3,
      name: 'Brand 3',
      logo: '/assets/img/brand/brand_1_3.svg',
      link: '#'
    },
    {
      id: 4,
      name: 'Brand 4',
      logo: '/assets/img/brand/brand_1_4.svg',
      link: '#'
    },
    {
      id: 5,
      name: 'Brand 5',
      logo: '/assets/img/brand/brand_1_5.svg',
      link: '#'
    },
    {
      id: 6,
      name: 'Brand 6',
      logo: '/assets/img/brand/brand_1_6.svg',
      link: '#'
    },
    {
      id: 7,
      name: 'Brand 7',
      logo: '/assets/img/brand/brand_1_7.svg',
      link: '#'
    },
    {
      id: 8,
      name: 'Brand 8',
      logo: '/assets/img/brand/brand_1_8.svg',
      link: '#'
    }
  ];

  return (
    <div className="brand-area overflow-hidden space-bottom">
      <div className="container th-container">
        <div 
          className="swiper th-slider brandSlider1" 
          id="brandSlider1" 
          data-slider-options='{"breakpoints":{"0":{"slidesPerView":1},"576":{"slidesPerView":"2"},"768":{"slidesPerView":"3"},"992":{"slidesPerView":"3"},"1200":{"slidesPerView":"6"},"1400":{"slidesPerView":"8"}}}'
        >
          <div className="swiper-wrapper">
            {brands.map((brand) => (
              <div key={brand.id} className="swiper-slide">
                <div className="brand-box">
                  <Link href={brand.link}>
                    <Image 
                      className="original" 
                      src={brand.logo} 
                      alt={`${brand.name} Logo`}
                      width={120}
                      height={60}
                      style={{ objectFit: 'contain' }}
                    />
                    <Image 
                      className="gray" 
                      src={brand.logo} 
                      alt={`${brand.name} Logo`}
                      width={120}
                      height={60}
                      style={{ objectFit: 'contain', filter: 'grayscale(100%)' }}
                    />
                  </Link>
                </div>
              </div>
            ))}
            
            {/* Duplicate slides for infinite scroll */}
            {brands.map((brand) => (
              <div key={`duplicate-${brand.id}`} className="swiper-slide">
                <div className="brand-box">
                  <Link href={brand.link}>
                    <Image 
                      className="original" 
                      src={brand.logo} 
                      alt={`${brand.name} Logo`}
                      width={120}
                      height={60}
                      style={{ objectFit: 'contain' }}
                    />
                    <Image 
                      className="gray" 
                      src={brand.logo} 
                      alt={`${brand.name} Logo`}
                      width={120}
                      height={60}
                      style={{ objectFit: 'contain', filter: 'grayscale(100%)' }}
                    />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Brands;
