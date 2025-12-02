'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { tours } from '../../data/tours';

const Tours = () => {
  return (
    <section 
      className="tour-area position-relative bg-top-center overflow-hidden space" 
      id="service-sec" 
      style={{
        backgroundImage: 'url(/assets/img/bg/tour_bg_1.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center top'
      }}
    >
      <div className="container">
        <div className="row">
          <div className="col-lg-6 offset-lg-3">
            <div className="title-area text-center">
              <span className="sub-title">Best Place For You</span>
              <h2 className="sec-title">Most Popular Tour</h2>
              <p className="sec-text">
                Explore the best tours in and around Cape Town. We offer a variety of tours to suit every interest, from whale watching to wine tasting.
              </p>
            </div>
          </div>
        </div>
        
        <div className="slider-area tour-slider">
          <div 
            className="swiper th-slider has-shadow" 
            data-slider-options='{"breakpoints":{"0":{"slidesPerView":1},"576":{"slidesPerView":"1"},"768":{"slidesPerView":"2"},"992":{"slidesPerView":"2"},"1200":{"slidesPerView":"3"},"1300":{"slidesPerView":"4"}}}'
          >
            <div className="swiper-wrapper">
              {tours.map((tour) => (
                <div key={tour.id} className="swiper-slide h-auto">
                  <div className="tour-box th-ani gsap-cursor h-100">
                    <div className="tour-box_img global-img" style={{ height: '250px', overflow: 'hidden' }}>
                      <Image
                        src={tour.images[0]}
                        alt={`A preview image of the ${tour.title} tour.`}
                        width={350}
                        height={250}
                        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                      />
                      {tour.language === 'Portuguese' && (
                        <div className="tour-language">
                          <span className="badge bg-primary text-white">Portuguese Guide</span>
                        </div>
                      )}
                    </div>
                    <div className="tour-content">
                      <h3 className="box-title">
                        <Link href={`/tour/${tour.id}`}>{tour.title}</Link>
                      </h3>
                      <div className="tour-rating">
                        <div className="star-rating" role="img" aria-label={`Rated ${tour.rating} out of 5`}>
                          <span style={{ width: `${tour.rating * 20}%` }}>
                            Rated <strong className="rating">{tour.rating}</strong> out of 5
                          </span>
                        </div>
                        <Link href={`/tour/${tour.id}`} className="woocommerce-review-link">
                          (<span className="count">{tour.rating}</span> Rating)
                        </Link>
                      </div>
                      <h4 className="tour-box_price">
                        <span className="currency">{tour.price}</span>/Person
                      </h4>
                      <div className="tour-action">
                        <span>
                          <i className="fa-light fa-clock" />
                          {tour.duration}
                        </span>
                        <Link href={`/tour/${tour.id}`} className="th-btn style4 th-icon">
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tours;
