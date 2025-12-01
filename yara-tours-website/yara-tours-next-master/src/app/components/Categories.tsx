'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Categories = () => {
  const categories = [
    {
      id: 1,
      title: 'Whale Watching',
      image: '/assets/img/destination/hermanus.jpg',
      link: '/tour',
      alt: 'A humpback whale breaching the water in the ocean.',
    },
    {
      id: 2,
      title: 'City Tour',
      image: '/assets/img/destination/cape town city.jpg',
      link: '/tour',
      alt: 'A bustling city street with modern and historic buildings.',
    },
    {
      id: 3,
      title: 'Wine Tasting',
      image: '/assets/img/destination/constantia.jpg',
      link: '/tour',
      alt: 'A close-up of a wine glass during a wine tasting event.',
    },
    {
      id: 4,
      title: 'Safari',
      image: '/assets/img/destination/wine estate.jpg',
      link: '/tour',
      alt: 'A giraffe standing in the African savanna.',
    },
    {
      id: 5,
      title: 'Cape Peninsula',
      image: '/assets/img/destination/cape point.jpg',
      link: '/tour',
      alt: 'A scenic view of the Cape Peninsula with its dramatic coastline.',
    }
  ];

  return (
    <section 
      className="category-area bg-top-center" 
      style={{
        backgroundImage: 'url(/assets/img/bg/category_bg_1.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center top'
      }}
    >
      <div className="container th-container">
        <div className="title-area text-center">
          <span className="sub-title">Wonderful Place For You</span>
          <h2 className="sec-title">Tour Categories</h2>
        </div>
        
        <div 
          className="swiper th-slider has-shadow categorySlider" 
          id="categorySlider1" 
          data-slider-options='{"spaceBetween": "50","breakpoints":{"0":{"slidesPerView":1},"576":{"slidesPerView":"1"},"768":{"slidesPerView":"2"},"992":{"slidesPerView":"3"},"1200":{"slidesPerView":"3"},"1400":{"slidesPerView":"5"}}}'
        >
          <div className="swiper-wrapper">
            {categories.map((category) => (
              <div key={category.id} className="swiper-slide">
                <div className="category-card single">
                  <div className="box-img global-img">
                    <Image 
                      src={category.image} 
                      alt={category.alt}
                      width={300}
                      height={200}
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <h3 className="box-title">
                    <Link href={category.link}>{category.title}</Link>
                  </h3>
                  <Link className="line-btn" href={category.link}>
                    See more
                  </Link>
                </div>
              </div>
            ))}
            
            {/* Duplicate slides for infinite scroll effect */}
            {categories.map((category) => (
              <div key={`duplicate-${category.id}`} className="swiper-slide">
                <div className="category-card single">
                  <div className="box-img global-img">
                    <Image 
                      src={category.image} 
                      alt={category.alt}
                      width={300}
                      height={200}
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <h3 className="box-title">
                    <Link href={category.link}>{category.title}</Link>
                  </h3>
                  <Link className="line-btn" href={category.link}>
                    See more
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="slider-pagination"></div>
        </div>
      </div>
    </section>
  );
};

export default Categories;
