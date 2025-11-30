import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import About from '../components/About';
import Counter from '../components/Counter';
import Team from '../components/Team';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'About Us - Tourm Travel & Tour Booking Agency',
  description: 'Learn more about Tourm - your trusted travel and tour booking agency. Discover our story, mission, and experienced team.',
};

const Breadcrumb = () => {
  return (
    <div 
      className="breadcumb-wrapper" 
      style={{
        backgroundImage: 'url(/assets/img/bg/breadcumb-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="container">
        <div className="breadcumb-content">
          <h1 className="breadcumb-title">About Us</h1>
          <ul className="breadcumb-menu">
            <li><Link href="/">Home</Link></li>
            <li>About Us</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const WhyChooseUs = () => {
  const features = [
    {
      id: 1,
      icon: '/assets/img/icon/feature_1_1.svg',
      title: 'Best Price Guarantee',
      description: 'We offer the most competitive prices in the market with no hidden fees.'
    },
    {
      id: 2,
      icon: '/assets/img/icon/feature_1_2.svg',
      title: '24/7 Customer Support',
      description: 'Our dedicated support team is available round the clock to assist you.'
    },
    {
      id: 3,
      icon: '/assets/img/icon/feature_1_3.svg',
      title: 'Expert Local Guides',
      description: 'Experience destinations through the eyes of knowledgeable local experts.'
    },
    {
      id: 4,
      icon: '/assets/img/icon/feature_1_4.svg',
      title: 'Flexible Booking',
      description: 'Easy booking modifications and cancellations with flexible policies.'
    }
  ];

  return (
    <section className="feature-area space">
      <div className="container">
        <div className="title-area text-center">
          <span className="sub-title">Why Choose Us</span>
          <h2 className="sec-title">We Are The Best Travel Agency</h2>
        </div>
        <div className="row gy-4">
          {features.map((feature) => (
            <div key={feature.id} className="col-md-6 col-xl-3">
              <div className="feature-card">
                <div className="feature-card_icon">
                  <Image src={feature.icon} alt={feature.title} width={50} height={50} />
                </div>
                <div className="feature-card_content">
                  <h3 className="feature-card_title">{feature.title}</h3>
                  <p className="feature-card_text">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const BestTours = () => {
  return (
    <section 
      className="history-area space" 
      style={{
        position: 'relative',
        backgroundImage: 'url(/assets/img/bg/history_bg_1.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '30px',
        overflow: 'hidden'
      }}
    >
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1,
        borderRadius: '30px'
      }}></div>
      <div className="container" style={{position: 'relative', zIndex: 2}}>
        <div className="row align-items-center">
          <div className="col-xl-6">
            <div className="title-area mb-35">
              <span className="sub-title text-white">The Best Tours</span>
              <h2 className="sec-title text-white">Unforgettable Journeys with Yara Tours</h2>
              <p className="sec-text text-white">
                At Yara Tours & Travel, we are committed to providing the most exceptional and immersive tour experiences. 
                Our passion for travel drives us to curate unique adventures that go beyond the ordinary, ensuring every trip 
                is a cherished memory for our customers.
              </p>
            </div>
          </div>
          <div className="col-xl-6">
            <div className="history-img">
              <Image src="/assets/img/normal/history_1_1.jpg" alt="Our History" width={600} height={400} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function AboutPage() {
  return (
    <main>
      <Header />
      <Breadcrumb />
      <About />
      <WhyChooseUs />
      <Counter />
      <BestTours />
      <Footer />
    </main>
  );
}
