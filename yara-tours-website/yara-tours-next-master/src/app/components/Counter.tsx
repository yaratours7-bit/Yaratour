'use client';

import React from 'react';
import Image from 'next/image';

const Counter = () => {
  const counterData = [
    {
      id: 1,
      number: '10',
      title: 'Years Experience',
      suffix: '+'
    },
    {
      id: 2,
      number: '100',
      title: 'Happy Clients',
      suffix: '%'
    },
    {
      id: 3,
      number: '12',
      title: 'Tours Offered',
      suffix: '+'
    },
    {
      id: 4,
      number: '5',
      title: 'Star Rating',
      suffix: ''
    }
  ];

  return (
    <div className="counter-area space">
      <div className="container">
        <div className="row">
          {counterData.map((item) => (
            <div key={item.id} className="col-sm-6 col-xl-3 counter-card-wrap">
              <div className="counter-card">
                <div className="counter-shape">
                  <span></span>
                </div>
                <div className="media-body">
                  <h3 className="box-number">
                    <span className="counter-number">{item.number}</span>
                    {item.suffix}
                  </h3>
                  <h6 className="counter-title">{item.title}</h6>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Shape Elements */}
        <div 
          className="shape-mockup shape1 d-none d-xl-block" 
          style={{
            position: 'absolute',
            top: '30%',
            left: '-15%'
          }}
        >
          <Image 
            src="/assets/img/shape/shape_1.png" 
            alt="shape"
            width={100}
            height={100}
          />
        </div>
        
        <div 
          className="shape-mockup shape2 d-none d-xl-block" 
          style={{
            position: 'absolute',
            top: '45%',
            left: '-13%'
          }}
        >
          <Image 
            src="/assets/img/shape/shape_2.png" 
            alt="shape"
            width={80}
            height={80}
          />
        </div>
        
        <div 
          className="shape-mockup shape3 d-none d-xl-block" 
          style={{
            position: 'absolute',
            top: '32%',
            left: '-7%'
          }}
        >
          <Image 
            src="/assets/img/shape/shape_3.png" 
            alt="shape"
            width={60}
            height={60}
          />
        </div>
        
        <div 
          className="shape-mockup d-none d-xl-block" 
          style={{
            position: 'absolute',
            bottom: '-24%',
            left: '-15%'
          }}
        >
          <Image 
            src="/assets/img/shape/shape_6.png" 
            alt="shape"
            width={120}
            height={120}
          />
        </div>
        
        <div 
          className="shape-mockup jump d-none d-xl-block" 
          style={{
            position: 'absolute',
            top: '5%',
            right: '-10%'
          }}
        >
          <Image 
            src="/assets/img/shape/shape_5.png" 
            alt="shape"
            width={100}
            height={100}
          />
        </div>
      </div>
    </div>
  );
};

export default Counter;
