import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Booking from './components/Booking';
import Categories from './components/Categories';
import Destinations from './components/Destinations';
import About from './components/About';
import Tours from './components/Tours';
import Gallery from './components/Gallery';
import Counter from './components/Counter';
import Testimonials from './components/Testimonials';
import Blog from './components/Blog';
import Footer from './components/Footer';

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Booking />
      
      <Categories />
      <Destinations />
      <About />
      <Tours />
      <Gallery />
      <Counter />
      <Testimonials />
      {/* <Blog /> */}

      <Footer />
    </main>
  );
}
