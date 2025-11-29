'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: 'Top 5 Wine Farms to Visit in Stellenbosch',
      image: '/assets/img/blog/blog_1_1.jpg',
      date: 'July 18 2025',
      readTime: '5 min read',
      link: '/blog'
    },
    {
      id: 2,
      title: 'A Guide to Whale Watching in Hermanus',
      image: '/assets/img/blog/blog_1_2.jpg',
      date: 'July 17 2025',
      readTime: '7 min read',
      link: '/blog'
    },
    {
      id: 3,
      title: 'Exploring the Cape Peninsula: A Photographer\'s Dream',
      image: '/assets/img/blog/blog_1_3.jpg',
      date: 'July 16 2025',
      readTime: '6 min read',
      link: '/blog'
    }
  ];

  return (
    <section className="bg-smoke overflow-hidden space overflow-hidden" id="blog-sec">
      <div className="container">
        <div className="mb-30 text-center text-md-start">
          <div className="row align-items-center justify-content-between">
            <div className="col-md-7">
              <div className="title-area mb-md-0">
                <span className="sub-title">From Our Blog</span>
                <h2 className="sec-title">News & Articles From Yara Tours</h2>
              </div>
            </div>
            <div className="col-md-auto">
              <Link href="/blog" className="th-btn style4 th-icon">
                See More Articles
              </Link>
            </div>
          </div>
        </div>
        
        <div className="slider-area">
          <div 
            className="swiper th-slider has-shadow" 
            id="blogSlider1" 
            data-slider-options='{"breakpoints":{"0":{"slidesPerView":1},"576":{"slidesPerView":"1"},"768":{"slidesPerView":"2"},"992":{"slidesPerView":"2"},"1200":{"slidesPerView":"3"}}}'
          >
            <div className="swiper-wrapper">
              {blogPosts.map((post) => (
                <div key={post.id} className="swiper-slide">
                  <div className="blog-box th-ani">
                    <div className="blog-img global-img">
                      <Image 
                        src={post.image} 
                        alt={post.title}
                        width={400}
                        height={250}
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className="blog-box_content">
                      <div className="blog-meta">
                        <Link className="author" href="/blog">
                          {post.date}
                        </Link>
                        <Link href="/blog">{post.readTime}</Link>
                      </div>
                      <h3 className="box-title">
                        <Link href={post.link}>{post.title}</Link>
                      </h3>
                      <Link href={post.link} className="th-btn style4 th-icon">
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Duplicate slides for infinite scroll */}
              {blogPosts.map((post) => (
                <div key={`duplicate-${post.id}`} className="swiper-slide">
                  <div className="blog-box th-ani">
                    <div className="blog-img global-img">
                      <Image 
                        src={post.image} 
                        alt={post.title}
                        width={400}
                        height={250}
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className="blog-box_content">
                      <div className="blog-meta">
                        <Link className="author" href="/blog">
                          {post.date}
                        </Link>
                        <Link href="/blog">{post.readTime}</Link>
                      </div>
                      <h3 className="box-title">
                        <Link href={post.link}>{post.title}</Link>
                      </h3>
                      <Link href={post.link} className="th-btn style4 th-icon">
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Shape Elements */}
        <div 
          className="shape-mockup shape1 d-none d-xxl-block" 
          style={{
            position: 'absolute',
            bottom: '20%',
            left: '-17%'
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
            bottom: '5%',
            left: '-17%'
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
          className="shape-mockup shape3 d-none d-xxl-block" 
          style={{
            position: 'absolute',
            bottom: '12%',
            left: '-10%'
          }}
        >
          <Image 
            src="/assets/img/shape/shape_3.png" 
            alt="shape"
            width={60}
            height={60}
          />
        </div>
      </div>
    </section>
  );
};

export default Blog;
