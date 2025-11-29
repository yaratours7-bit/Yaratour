'use client';

import React from 'react';
import Image from 'next/image';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'John Doe',
      position: 'Happy Traveller',
      image: '/assets/img/testimonial/testi_1_1.jpg',
      rating: 5,
      text: 'Yara Tours & Travel made our trip to Cape Town unforgettable! The whale watching tour was breathtaking, and the wine tasting in Constantia was superb. Highly recommended!'
    },
    {
      id: 2,
      name: 'Jane Smith',
      position: 'Happy Traveller',
      image: '/assets/img/testimonial/testi_1_2.jpg',
      rating: 5,
      text: 'Our family had an amazing time on the Cape Peninsula tour. The kids loved seeing the penguins! The guides were knowledgeable and friendly. We will definitely be back!'
    },
    {
      id: 3,
      name: 'Peter Jones',
      position: 'Happy Traveller',
      image: '/assets/img/testimonial/testi_1_1.jpg',
      rating: 5,
      text: 'The Garden Route adventure was the highlight of our trip. The safari was incredible, and the elephant experience was a once-in-a-lifetime opportunity. Thank you, Yara Tours!'
    },
    {
      id: 4,
      name: 'Mary Williams',
      position: 'Happy Traveller',
      image: '/assets/img/testimonial/testi_1_2.jpg',
      rating: 5,
      text: 'We had a fantastic day exploring the Stellenbosch winelands. The wineries were beautiful, and the wine was delicious. Yara Tours took care of everything, making it a stress-free day.'
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <i 
        key={index} 
        className={`fa-solid fa-star ${index < rating ? 'text-warning' : 'text-muted'}`}
      ></i>
    ));
  };

  return (
    <section className="testi-area overflow-hidden space" id="testi-sec">
      <div className="container-fluid p-0">
        <div className="title-area mb-20 text-center">
          <span className="sub-title">Testimonial</span>
          <h2 className="sec-title">What Client Say About us</h2>
        </div>
        
        <div className="slider-area">
          <div 
            className="swiper th-slider testiSlider1 has-shadow" 
            id="testiSlider1" 
            data-slider-options='{"breakpoints":{"0":{"slidesPerView":1},"767":{"slidesPerView":"2","centeredSlides":"true"},"992":{"slidesPerView":"2","centeredSlides":"true"},"1200":{"slidesPerView":"2","centeredSlides":"true"},"1400":{"slidesPerView":"3","centeredSlides":"true"}}}'
          >
            <div className="swiper-wrapper">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="swiper-slide">
                  <div className="testi-card">
                    <div className="testi-card_wrapper">
                      <div className="testi-card_profile">
                        <div className="testi-card_avater">
                          <Image 
                            src={testimonial.image} 
                            alt={`A profile picture of ${testimonial.name}, a happy traveller.`}
                            width={80}
                            height={80}
                            style={{ objectFit: 'cover', borderRadius: '50%' }}
                          />
                        </div>
                        <div className="media-body">
                          <h3 className="box-title">{testimonial.name}</h3>
                          <span className="testi-card_desig">{testimonial.position}</span>
                        </div>
                      </div>
                      <div className="testi-card_review">
                        {renderStars(testimonial.rating)}
                      </div>
                    </div>
                    <p className="testi-card_text">"{testimonial.text}"</p>
                    <div className="testi-card-quote">
                      <Image 
                        src="/assets/img/icon/testi-quote.svg" 
                        alt="A quote icon."
                        width={40}
                        height={40}
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Duplicate slides for infinite scroll */}
              {testimonials.map((testimonial) => (
                <div key={`duplicate-${testimonial.id}`} className="swiper-slide">
                  <div className="testi-card">
                    <div className="testi-card_wrapper">
                      <div className="testi-card_profile">
                        <div className="testi-card_avater">
                          <Image 
                            src={testimonial.image} 
                            alt={`A profile picture of ${testimonial.name}, a happy traveller.`}
                            width={80}
                            height={80}
                            style={{ objectFit: 'cover', borderRadius: '50%' }}
                          />
                        </div>
                        <div className="media-body">
                          <h3 className="box-title">{testimonial.name}</h3>
                          <span className="testi-card_desig">{testimonial.position}</span>
                        </div>
                      </div>
                      <div className="testi-card_review">
                        {renderStars(testimonial.rating)}
                      </div>
                    </div>
                    <p className="testi-card_text">"{testimonial.text}"</p>
                    <div className="testi-card-quote">
                      <Image 
                        src="/assets/img/icon/testi-quote.svg" 
                        alt="A quote icon."
                        width={40}
                        height={40}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="slider-pagination"></div>
          </div>
        </div>
      </div>
      
      {/* Shape Elements */}
      <div 
        className="shape-mockup d-none d-xl-block" 
        style={{
          position: 'absolute',
          bottom: '-2%',
          right: '0%'
        }}
      >
        <Image 
          src="/assets/img/shape/line2.png" 
          alt="A decorative line shape."
          width={150}
          height={100}
        />
      </div>
      
      <div 
        className="shape-mockup movingX d-none d-xl-block" 
        style={{
          position: 'absolute',
          top: '30%',
          left: '5%'
        }}
      >
        <Image 
          src="/assets/img/shape/shape_7.png" 
          alt="A decorative shape element."
          width={80}
          height={80}
        />
      </div>
    </section>
  );
};

export default Testimonials;
