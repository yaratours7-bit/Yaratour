'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Team = () => {
  const teamMembers = [
    {
      id: 1,
      name: 'Jacob Jones',
      position: 'Tourist Guide',
      image: '/assets/img/team/team_1_1.jpg',
      link: '/tour-guider-details',
      social: {
        facebook: 'https://facebook.com/',
        twitter: 'https://twitter.com/',
        instagram: 'https://instagram.com/',
        linkedin: 'https://linkedin.com/'
      }
    },
    {
      id: 2,
      name: 'Jane Cooper',
      position: 'Tourist Guide',
      image: '/assets/img/team/team_1_2.jpg',
      link: '/tour-guider-details',
      social: {
        facebook: 'https://facebook.com/',
        twitter: 'https://twitter.com/',
        instagram: 'https://instagram.com/',
        linkedin: 'https://linkedin.com/'
      }
    },
    {
      id: 3,
      name: 'Guy Hawkins',
      position: 'Tourist Guide',
      image: '/assets/img/team/team_1_3.jpg',
      link: '/tour-guider-details',
      social: {
        facebook: 'https://facebook.com/',
        twitter: 'https://twitter.com/',
        instagram: 'https://instagram.com/',
        linkedin: 'https://linkedin.com/'
      }
    },
    {
      id: 4,
      name: 'Jenny Wilson',
      position: 'Tourist Guide',
      image: '/assets/img/team/team_1_4.jpg',
      link: '/tour-guider-details',
      social: {
        facebook: 'https://facebook.com/',
        twitter: 'https://twitter.com/',
        instagram: 'https://instagram.com/',
        linkedin: 'https://linkedin.com/'
      }
    }
  ];

  return (
    <section 
      className="bg-smoke space overflow-hidden" 
      style={{
        backgroundImage: 'url(/assets/img/bg/team_bg_1.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="container z-index-common">
        <div className="title-area text-center">
          <span className="sub-title">Meet with Guide</span>
          <h2 className="sec-title">Tour Guide</h2>
        </div>
        
        <div className="slider-area">
          <div 
            className="swiper th-slider teamSlider1 has-shadow" 
            id="teamSlider1" 
            data-slider-options='{"breakpoints":{"0":{"slidesPerView":1},"576":{"slidesPerView":"1"},"768":{"slidesPerView":"2"},"992":{"slidesPerView":"3"},"1200":{"slidesPerView":"4"}}}'
          >
            <div className="swiper-wrapper">
              {teamMembers.map((member) => (
                <div key={member.id} className="swiper-slide">
                  <div className="th-team team-box">
                    <div className="team-img">
                      <Image 
                        src={member.image} 
                        alt={member.name}
                        width={300}
                        height={350}
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className="team-content">
                      <div className="media-body">
                        <h3 className="box-title">
                          <Link href={member.link}>{member.name}</Link>
                        </h3>
                        <span className="team-desig">{member.position}</span>
                        <div className="th-social">
                          <a 
                            target="_blank" 
                            href={member.social.facebook}
                            rel="noopener noreferrer"
                          >
                            <i className="fab fa-facebook-f"></i>
                          </a>
                          <a 
                            target="_blank" 
                            href={member.social.twitter}
                            rel="noopener noreferrer"
                          >
                            <i className="fab fa-twitter"></i>
                          </a>
                          <a 
                            target="_blank" 
                            href={member.social.instagram}
                            rel="noopener noreferrer"
                          >
                            <i className="fab fa-instagram"></i>
                          </a>
                          <a 
                            target="_blank" 
                            href={member.social.linkedin}
                            rel="noopener noreferrer"
                          >
                            <i className="fab fa-linkedin-in"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Duplicate slides for infinite scroll */}
              {teamMembers.map((member) => (
                <div key={`duplicate-${member.id}`} className="swiper-slide">
                  <div className="th-team team-box">
                    <div className="team-img">
                      <Image 
                        src={member.image} 
                        alt={member.name}
                        width={300}
                        height={350}
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className="team-content">
                      <div className="media-body">
                        <h3 className="box-title">
                          <Link href={member.link}>{member.name}</Link>
                        </h3>
                        <span className="team-desig">{member.position}</span>
                        <div className="th-social">
                          <a 
                            target="_blank" 
                            href={member.social.facebook}
                            rel="noopener noreferrer"
                          >
                            <i className="fab fa-facebook-f"></i>
                          </a>
                          <a 
                            target="_blank" 
                            href={member.social.twitter}
                            rel="noopener noreferrer"
                          >
                            <i className="fab fa-twitter"></i>
                          </a>
                          <a 
                            target="_blank" 
                            href={member.social.instagram}
                            rel="noopener noreferrer"
                          >
                            <i className="fab fa-instagram"></i>
                          </a>
                          <a 
                            target="_blank" 
                            href={member.social.linkedin}
                            rel="noopener noreferrer"
                          >
                            <i className="fab fa-linkedin-in"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="slider-pagination"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;
