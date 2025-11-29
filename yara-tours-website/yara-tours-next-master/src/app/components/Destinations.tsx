'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Destinations = () => {
  const destinations = [
    {
      id: 1,
      title: 'Hermanus',
      subtitle: '1 Tour',
      image: 'https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website/Hermanus/20250621_091329.jpg',
      link: '/tour',
      alt: 'A beautiful view of the coastal town of Hermanus, known for whale watching.',
    },
    {
      id: 2,
      title: 'Constantia',
      subtitle: '1 Tour',
      image: 'https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website/Constantia/20250625_103947.jpg',
      link: '/tour',
      alt: 'A lush green vineyard in the Constantia wine region.',
    },
    {
      id: 3,
      title: 'Stellenbosch',
      subtitle: '1 Tour',
      image: 'https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website/Stellenbosch/20250521_111518.jpg',
      link: '/tour',
      alt: 'A charming street with Cape Dutch architecture in Stellenbosch.',
    },
    {
      id: 4,
      title: 'Cape Point',
      subtitle: '1 Tour',
      image: 'https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website/Cape%20Point/20250702_175112%20(1).webp',
      link: '/tour',
      alt: 'The dramatic cliffs and lighthouse at Cape Point.',
    },
    {
      id: 5,
      title: 'Garden Route',
      subtitle: '2 Tours',
      image: 'https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website/Garden%20Route/20250615_110152.jpg',
      link: '/tour',
      alt: 'A stunning view of the coastline along the Garden Route.',
    }
  ];

  return (
    <div className="position-relative overflow-hidden">
      <div className="container">
        <div className="title-area text-center">
          <span className="sub-title">Top Destination</span>
          <h2 className="sec-title">Popular Destination</h2>
        </div>
        
        <div 
          className="swiper th-slider destination-slider slider-drag-wrap" 
          id="aboutSlider1" 
          data-slider-options='{"breakpoints":{"0":{"slidesPerView":1},"576":{"slidesPerView":"2"},"992":{"slidesPerView":"3"},"1200":{"slidesPerView":"3"}},"effect":"coverflow","coverflowEffect":{"rotate":"0","stretch":"95","depth":"212","modifier":"1"},"centeredSlides":"true"}'
        >
          <div className="swiper-wrapper">
            {destinations.map((destination) => (
              <div key={destination.id} className="swiper-slide">
                <div className="destination-box gsap-cursor">
                  <div className="destination-img">
                    <Image 
                      src={destination.image} 
                      alt={destination.alt}
                      width={400}
                      height={300}
                      style={{ objectFit: 'cover' }}
                    />
                    <div className="destination-content">
                      <div className="media-left">
                        <h4 className="box-title">
                          <Link href={destination.link}>{destination.title}</Link>
                        </h4>
                        <span className="destination-subtitle">{destination.subtitle}</span>
                      </div>
                      <div className="">
                        <Link href={destination.link} className="th-btn style2 th-icon">
                          View Tours
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Duplicate slides for infinite scroll */}
            {destinations.map((destination) => (
              <div key={`duplicate-${destination.id}`} className="swiper-slide">
                <div className="destination-box gsap-cursor">
                  <div className="destination-img">
                    <Image 
                      src={destination.image} 
                      alt={destination.alt}
                      width={400}
                      height={300}
                      style={{ objectFit: 'cover' }}
                    />
                    <div className="destination-content">
                      <div className="media-left">
                        <h4 className="box-title">
                          <Link href={destination.link}>{destination.title}</Link>
                        </h4>
                        <span className="destination-subtitle">{destination.subtitle}</span>
                      </div>
                      <div className="">
                        <Link href={destination.link} className="th-btn style2 th-icon">
                          View Tours
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Destinations;
