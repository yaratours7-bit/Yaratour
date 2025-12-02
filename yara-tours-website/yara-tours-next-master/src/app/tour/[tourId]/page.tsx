import { tours } from '@/data/tours';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import TourBooking from '@/app/components/TourBooking';
import Image from 'next/image';

export default function TourDetailsPage({ params }: { params: { tourId: string } }) {
  const tour = tours.find(t => t.id === params.tourId);

  if (!tour) {
    notFound();
  }

  return (
    <div>
      <Header />
      <div 
        className="breadcumb-wrapper" 
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${tour.images[0]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container">
          <div className="breadcumb-content">
            <h1 className="breadcumb-title">{tour.title}</h1>
            <ul className="breadcumb-menu">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/tour">Tours</Link></li>
              <li>{tour.title}</li>
            </ul>
          </div>
        </div>
      </div>
      <section className="space">
        <div className="container">
          <div className="row">
            <div className="col-xxl-8 col-lg-7">
              <div className="tour-page-single">
                {/* Show a clean, static hero image or simple grid for this tour */}
                {tour.images.length <= 1 ? (
                  <div className="mb-4">
                    <div className="tour-slider-img">
                      <Image
                        src={tour.images[0]}
                        alt={tour.title}
                        width={800}
                        height={450}
                        style={{ width: '100%', height: '450px', objectFit: 'cover' }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="row g-3 mb-4">
                    {tour.images.map((image, index) => (
                      <div key={index} className={index === 0 ? "col-12" : "col-sm-6 col-md-4"}>
                        <div className="tour-slider-img">
                          <Image
                            src={image}
                            alt={tour.title}
                            width={800}
                            height={450}
                            style={{ width: '100%', height: index === 0 ? '450px' : '220px', objectFit: 'cover' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="page-content">
                  <h2 className="box-title mt-30">{tour.title}</h2>
                  <h4 className="tour-price"><span className="currency">{tour.price}</span>/Person</h4>
                  <p className="box-text mb-30">{tour.description}</p>
                  
                  {tour.highlights.length > 0 && (
                    <div>
                      <h2 className="box-title">Highlights</h2>
                      <div className="checklist mb-50">
                        <ul>
                          {tour.highlights.map((highlight, index) => (
                            <li key={index}>{highlight}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  <h2 className="box-title">Included and Excluded</h2>
                  <div className="destination-checklist">
                    <div className="checklist style2 style4">
                      <ul>
                        {tour.included.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="checklist style5">
                      <ul>
                        {tour.notIncluded.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xxl-4 col-lg-5">
              <TourBooking tour={tour} />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
