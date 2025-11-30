'use client';

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { tours as allTours } from '@/data/tours';


const Breadcrumb = () => {
  return (
    <div 
      className="breadcumb-wrapper" 
      style={{
        backgroundImage: 'url(/assets/img/bg/breadcumb_bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="container">
        <div className="breadcumb-content">
          <h1 className="breadcumb-title">Our Tours</h1>
          <ul className="breadcumb-menu">
            <li><Link href="/">Home</Link></li>
            <li>Tours</li>
          </ul>
        </div>
      </div>
    </div>
  );
};


const TourGrid = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('All');
  const [selectedDuration, setSelectedDuration] = useState('All');
  const [filteredTours, setFilteredTours] = useState(allTours);

  useEffect(() => {
    let results = allTours;
    if (selectedDestination !== 'All') {
      results = results.filter(tour => tour.location === selectedDestination);
    }
    if (selectedDuration !== 'All') {
      results = results.filter(tour => tour.duration === selectedDuration);
    }
    results = results.filter(tour =>
      tour.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTours(results);
  }, [searchTerm, selectedDestination, selectedDuration]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleDestinationChange = (destination: string) => {
    setSelectedDestination(destination);
  };

  const handleDurationChange = (duration: string) => {
    setSelectedDuration(duration);
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <i 
        key={index} 
        className={`fas fa-star text-warning`}
      ></i>
    ));
  };

  return (
    <section className="tour-area space">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            {(selectedDestination !== 'All' || selectedDuration !== 'All') && (
              <div className="mb-4">
                <h3>
                  Showing tours for: 
                  {selectedDestination !== 'All' && ` ${selectedDestination}`}
                  {selectedDuration !== 'All' && ` - ${selectedDuration}`}
                </h3>
              </div>
            )}
            <div className="row gy-30">
              {filteredTours.map((tour) => (
                <div key={tour.id} className="col-md-6">
                  <div className="tour-box th-ani">
                    <div className="tour-box_img global-img" style={{ height: '250px', overflow: 'hidden' }}>
                      <Image src={tour.images[0]} alt={tour.title} width={400} height={250} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <span className="tour-badge">{tour.location}</span>
                    </div>
                    <div className="tour-content">
                      <h3 className="box-title">
                        <Link href={`/tour/${tour.id}`}>{tour.title}</Link>
                      </h3>
                      <div className="tour-rating">
                        <div className="">
                          {renderStars()}
                        </div>
                        <span className="rating-count">({tour.rating} Rating)</span>
                      </div>
                      <h4 className="tour-box_price">
                        <span className="currency">{tour.price}</span>/Person
                      </h4>
                      <div className="tour-action">
                        <span>
                          <i className="fa-light fa-clock"></i>
                          {tour.duration}
                        </span>
                        <Link href={`/tour/${tour.id}`} className="th-btn style4 th-icon">
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination */}
            {filteredTours.length >= 10 && (
              <div className="th-pagination text-center mt-50">
                <ul>
                  <li><a href="#" className="prev-page"><i className="far fa-arrow-left"></i></a></li>
                  <li><a href="#" className="active">1</a></li>
                  <li><a href="#">2</a></li>
                  <li><a href="#">3</a></li>
                  <li><a href="#" className="next-page"><i className="far fa-arrow-right"></i></a></li>
                </ul>
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="col-lg-4">
            <aside className="sidebar-area">
              {/* Search Widget */}
              <div className="widget widget_search">
                <h3 className="widget_title">Search Tours</h3>
                <form className="search-form" onSubmit={(e) => e.preventDefault()}>
                  <input type="text" placeholder="Search tours..." value={searchTerm} onChange={handleSearchChange} style={{ color: 'var(--title-color)' }} />
                  <button type="submit"><i className="far fa-search"></i></button>
                </form>
              </div>
              
              {/* Filter Widget */}
              <div className="widget widget_categories">
                <h3 className="widget_title">Filter by Destination</h3>
                <ul>
                  <li><a href="#" onClick={() => handleDestinationChange('All')}>All <span>({allTours.length})</span></a></li>
                  <li><a href="#" onClick={() => handleDestinationChange('Hermanus')}>Hermanus <span>(1)</span></a></li>
                  <li><a href="#" onClick={() => handleDestinationChange('Cape Town')}>Cape Town <span>(1)</span></a></li>
                  <li><a href="#" onClick={() => handleDestinationChange('Constantia')}>Constantia <span>(1)</span></a></li>
                  <li><a href="#" onClick={() => handleDestinationChange('Garden Route')}>Garden Route <span>(2)</span></a></li>
                  <li><a href="#" onClick={() => handleDestinationChange('Cape Peninsula')}>Cape Peninsula <span>(1)</span></a></li>
                  <li><a href="#" onClick={() => handleDestinationChange('Stellenbosch')}>Stellenbosch <span>(2)</span></a></li>
                  <li><a href="#" onClick={() => handleDestinationChange('Cape Agulhas')}>Cape Agulhas <span>(1)</span></a></li>
                </ul>
              </div>
              
             
              
              {/* Duration Filter */}
              <div className="widget widget_categories">
                <h3 className="widget_title">Duration</h3>
                <ul>
                  <li><a href="#" onClick={() => handleDurationChange('All')}>All <span>({allTours.length})</span></a></li>
                  <li><a href="#" onClick={() => handleDurationChange('Full Day')}>Full Day <span>(7)</span></a></li>
                  <li><a href="#" onClick={() => handleDurationChange('3 Days')}>3 Days <span>(1)</span></a></li>
                </ul>
              </div>
              
              {/* Popular Tours Widget */}
              <div className="widget widget_recent_entries">
                <h3 className="widget_title">Popular Tours</h3>
                <div className="recent-post-wrap">
                  <div className="recent-post">
                    <div className="media-img">
                      <Link href="/tour/whale-watching-tour-in-hermanus">
                        <Image src="/assets/img/tour/tour_1_1.jpg" alt="Tour" width={100} height={100} />
                      </Link>
                    </div>
                    <div className="media-body">
                      <h4 className="post-title">
                        <Link href="/tour/whale-watching-tour-in-hermanus">Whale Watching in Hermanus</Link>
                      </h4>
                      <div className="recent-post-meta">
                        <span className="price">R3500</span>
                        <span className="rating">★ 5.0</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="recent-post">
                    <div className="media-img">
                      <Link href="/tour/cape-town-city-tour">
                        <Image src="/assets/img/tour/tour_1_2.jpg" alt="Tour" width={100} height={100} />
                      </Link>
                    </div>
                    <div className="media-body">
                      <h4 className="post-title">
                        <Link href="/tour/cape-town-city-tour">Cape Town City Tour</Link>
                      </h4>
                      <div className="recent-post-meta">
                        <span className="price">R1900</span>
                        <span className="rating">★ 5.0</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="recent-post">
                    <div className="media-img">
                      <Link href="/tour/wine-tasting-in-constantia">
                        <Image src="/assets/img/tour/tour_1_3.jpg" alt="Tour" width={100} height={100} />
                      </Link>
                    </div>
                    <div className="media-body">
                      <h4 className="post-title">
                        <Link href="/tour/wine-tasting-in-constantia">Wine Tasting in Constantia</Link>
                      </h4>
                      <div className="recent-post-meta">
                        <span className="price">R1900</span>
                        <span className="rating">★ 5.0</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function ToursPage() {
  return (
    <main>
      <Header />
      <Breadcrumb />
      <TourGrid />
      <Footer />
    </main>
  );
}
