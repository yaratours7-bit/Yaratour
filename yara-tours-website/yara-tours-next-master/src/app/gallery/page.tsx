import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';
import GalleryGrid from '../components/GalleryGrid';
import InstagramFeed from '../components/InstagramFeed';

export const metadata = {
  title: 'Gallery - Tourm Travel & Tour Booking Agency',
  description: 'Explore our beautiful travel gallery showcasing amazing destinations and memorable moments from our tours.',
};

const Breadcrumb = () => {
  return (
    <div 
      className="breadcumb-wrapper" 
      style={{
        backgroundImage: 'url(https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website//header-img.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="container">
        <div className="breadcumb-content">
          <h1 className="breadcumb-title">Gallery</h1>
          <ul className="breadcumb-menu">
            <li><Link href="/">Home</Link></li>
            <li>Gallery</li>
          </ul>
        </div>
      </div>
    </div>
  );
};


const VideoSection = () => {
  return (
    <section 
      className="video-area space" 
      style={{
        backgroundImage: 'url(https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website/Gallery/cape-peninsula-tour/20250712_173128.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-6">
            <div className="title-area text-center">
              <span className="sub-title text-white">Experience Africa's Wonders with Yara</span>
              <h2 className="sec-title text-white">Crafting African Journeys, One Memory at a Time</h2>
              <p className="sec-text text-white">
                From the wild beauty of the bush to the urban pulse of Cape Town, we create journeys that connect you deeply with Africa. Let us show you Africa the Yara way: Wild, beautiful, and unforgettable.
              </p>
            </div>
            <div className="video-btn">
              <a href="https://www.youtube.com/watch?v=_sI_Ps7JSEk" className="play-btn popup-video">
                <i className="fas fa-play"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


export default function GalleryPage() {
  return (
    <main>
      <Header />
      <Breadcrumb />
      <GalleryGrid />
      <VideoSection />
      <InstagramFeed />
      <Footer />
    </main>
  );
}
