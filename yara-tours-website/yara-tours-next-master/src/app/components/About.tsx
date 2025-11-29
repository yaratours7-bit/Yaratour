'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const About = () => {
  return (
    <div className="about-area position-relative overflow-hidden space" id="about-sec">
      <div className="container">
        <div className="row">
          <div className="col-xl-6">
            <div className="img-box1">
              <div className="img1">
                <Image src="/assets/img/normal/about1.png" alt="A group of friends enjoying a safari tour." width={300} height={400} />
              </div>
              <div className="img2">
                <Image src="/assets/img/normal/about2.png" alt="A scenic view of a vineyard in Cape Town." width={300} height={400} />
              </div>
              <div className="img3">
                <Image src="/assets/img/normal/about3.png" alt="A family watching the sunset over the ocean." width={300} height={400} />
              </div>
            </div>
          </div>
          <div className="col-xl-6">
            <div className="ps-xl-4 ms-xl-2">
              <div className="title-area mb-20 pe-xl-5 me-xl-5">
                <span className="sub-title style1">Experience Africa's Wonders with Yara</span>
                <h2 className="sec-title mb-20 pe-xl-5 me-xl-5 heading">
                  Crafting African Journeys, One Memory at a Time
                </h2>
                <p className="sec-text mb-30">
                  Yara Tours & Travel was born from a passion for Africa's landscapes, its wildlife, its people, and its stories. We are a Cape Town-based tourism company dedicated to delivering meaningful, inspiring, and luxurious travel experiences centered around the beautiful Cape Town area.
                </p>
              </div>
              
              <div className="about-item-wrap">
                <div className="about-item">
                  <div className="about-item_img">
                    <Image src="/assets/img/icon/map3.svg" alt="An icon representing a map for tailor-made itineraries." width={50} height={50} />
                  </div>
                  <div className="about-item_centent">
                    <h5 className="box-title">Tailor-Made Itineraries</h5>
                    <p className="about-item_text">
                      From the wild beauty of the bush to the urban pulse of Cape Town, we create journeys that connect you deeply with Africa.
                    </p>
                  </div>
                </div>
                
                <div className="about-item">
                  <div className="about-item_img">
                    <Image src="/assets/img/icon/guide.svg" alt="An icon representing a guide for expert travel designers." width={50} height={50} />
                  </div>
                  <div className="about-item_centent">
                    <h5 className="box-title">Expert Travel Designers</h5>
                    <p className="about-item_text">
                      Our team of expert travel designers specializes in tailor-made itineraries that go beyond the brochure.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-35">
                <Link href="/about" className="th-btn style3 th-icon">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Shape Elements */}
        <div className="shape-mockup shape1 d-none d-xl-block" data-top="12%" data-left="-16%">
          <Image src="/assets/img/shape/shape_1.png" alt="A decorative shape element." width={100} height={100} />
        </div>
        
        <div className="shape-mockup shape2 d-none d-xl-block" data-top="20%" data-left="-16%">
          <Image src="/assets/img/shape/shape_2.png" alt="A decorative shape element." width={100} height={100} />
        </div>
        
        <div className="shape-mockup shape3 d-none d-xl-block" data-top="14%" data-left="-10%">
          <Image src="/assets/img/shape/shape_3.png" alt="A decorative shape element." width={100} height={100} />
        </div>
        
        <div className="shape-mockup about-shape movingX d-none d-xxl-block" data-bottom="0%" data-right="-11%">
          <Image src="/assets/img/normal/about-slide-img.png" alt="A decorative shape element." width={200} height={200} />
        </div>
        
        <div className="shape-mockup about-rating d-none d-xxl-block" data-bottom="50%" data-right="-20%">
          <i className="fa-sharp fa-solid fa-star"></i>
          <span>4.9k</span>
        </div>
        
        <div className="shape-mockup about-emoji d-none d-xxl-block" data-bottom="25%" data-right="5%">
          <Image src="/assets/img/icon/emoji.png" alt="" width={50} height={50} />
        </div>
      </div>
    </div>
  );
};

export default About;
