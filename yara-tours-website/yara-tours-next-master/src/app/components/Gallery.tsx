'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/utils/supabase';
import { tours } from '@/data/tours';

const Gallery = () => {
  const [galleryImages, setGalleryImages] = useState<{ id: string; image: string; alt: string; }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      const allImages: { id: string; image: string; alt: string; }[] = [];
      for (const tour of tours.slice(0, 7)) { // Fetch from first 7 tours
        const { data } = await supabase.storage
          .from('website')
          .list(`Gallery/${tour.id}`, {
            limit: 1, // Fetch only one image per tour
            offset: 0,
            sortBy: { column: 'name', order: 'asc' },
          });

        if (data && data.length > 0) {
          const file = data[0];
          const { data: imageUrl } = supabase.storage
            .from('website')
            .getPublicUrl(`Gallery/${tour.id}/${file.name}`);
          
          if (imageUrl && imageUrl.publicUrl) {
            const altText = `A gallery image of the ${tour.title} tour, showing ${file.name.split('.')[0].replace(/_/g, ' ')}.`;
            allImages.push({
              id: `${tour.id}-${file.name}`,
              image: imageUrl.publicUrl,
              alt: altText,
            });
          }
        }
      }
      setGalleryImages(allImages);
      setLoading(false);
    };

    fetchImages();
  }, []);

  if (loading) {
    return <div>Loading gallery...</div>;
  }

  return (
    <div className="gallery-area">
      <div className="container th-container">
        <div className="title-area text-center">
          <span className="sub-title">Unforgettable Moments</span>
          <h2 className="sec-title">Our Gallery</h2>
        </div>
        
        <div className="row gy-10 gx-10 justify-content-center align-items-center">
          {galleryImages.length > 0 && (
            <>
              <div className="col-md-6 col-lg-2">
                <div className="gallery-card">
                  <div className="box-img global-img">
                    <Image 
                      src={galleryImages[0].image} 
                      alt={galleryImages[0].alt}
                      width={200}
                      height={250}
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="col-md-6 col-lg-2">
                <div className="gallery-card">
                  <div className="box-img global-img">
                    <Image 
                      src={galleryImages[1].image} 
                      alt={galleryImages[1].alt}
                      width={200}
                      height={120}
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </div>
                <div className="gallery-card">
                  <div className="box-img global-img">
                    <Image 
                      src={galleryImages[2].image} 
                      alt={galleryImages[2].alt}
                      width={200}
                      height={120}
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="col-md-6 col-lg-2">
                <div className="gallery-card">
                  <div className="box-img global-img">
                    <Image 
                      src={galleryImages[3].image} 
                      alt={galleryImages[3].alt}
                      width={200}
                      height={250}
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="col-md-6 col-lg-2">
                <div className="gallery-card">
                  <div className="box-img global-img">
                    <Image 
                      src={galleryImages[4].image} 
                      alt={galleryImages[4].alt}
                      width={200}
                      height={120}
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </div>
                <div className="gallery-card">
                  <div className="box-img global-img">
                    <Image 
                      src={galleryImages[5].image} 
                      alt={galleryImages[5].alt}
                      width={200}
                      height={120}
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="col-md-6 col-lg-2">
                <div className="gallery-card">
                  <div className="box-img global-img">
                    <Image 
                      src={galleryImages[6].image} 
                      alt={galleryImages[6].alt}
                      width={200}
                      height={250}
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Shape Elements */}
        <div 
          className="shape-mockup d-none d-xl-block" 
          style={{
            position: 'absolute',
            top: '-25%',
            left: '0%'
          }}
        >
          <Image 
            src="/assets/img/shape/line.png" 
            alt="A decorative line shape."
            width={100}
            height={200}
          />
        </div>
        
        <div 
          className="shape-mockup movingX d-none d-xl-block" 
          style={{
            position: 'absolute',
            top: '30%',
            left: '-3%'
          }}
        >
          <Image 
            src="/assets/img/shape/shape_4.png" 
            alt="A decorative shape element."
            width={80}
            height={80}
            className="gmovingX"
          />
        </div>
      </div>
    </div>
  );
};

export default Gallery;
