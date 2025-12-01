'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { tours } from '@/data/tours';
import Image from 'next/image';

const GalleryGrid = () => {
  const [galleryImages, setGalleryImages] = useState<{ id: string; image: string; category: string; title: string; alt: string; }[]>([]);
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('*');
  const [animating, setAnimating] = useState(false);
  const [visibleImages, setVisibleImages] = useState(6);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      const allImages: { id: string; image: string; category: string; title: string; alt: string; }[] = [];
      for (const tour of tours) {
        const { data } = await supabase.storage
          .from('website')
          .list(`Gallery/${tour.id}`, {
            limit: 100,
            offset: 0,
            sortBy: { column: 'name', order: 'asc' },
          });

        if (data && data.length > 0) {
          const tourImages = data
            .filter(file => file.name !== '.emptyFolderPlaceholder') // Exclude placeholder files
            .map((file) => {
              const { data: imageUrl } = supabase.storage
                .from('website')
                .getPublicUrl(`Gallery/${tour.id}/${file.name}`);
              
              if (imageUrl && imageUrl.publicUrl) {
                return {
                  id: `${tour.id}-${file.name}`,
                  image: imageUrl.publicUrl,
                  category: tour.location,
                  title: tour.title,
                  alt: `${tour.title} Gallery`,
                };
              }
              return null;
            })
            .filter((image): image is { id: string; image: string; category: string; title: string; alt: string; } => image !== null); // Remove null entries

          if (tourImages.length > 0) {
            allImages.push(...tourImages);
          }
        }
      }

      // Fallback: if there are no Supabase gallery images, use static destination photos
      if (allImages.length === 0) {
        const staticDestinations = [
          { id: 'hermanus', image: '/assets/img/destination/hermanus.jpg', category: 'Hermanus', title: 'Hermanus' },
          { id: 'cape-town-city', image: '/assets/img/destination/cape town city.jpg', category: 'Cape Town', title: 'Cape Town City' },
          { id: 'constantia', image: '/assets/img/destination/constantia.jpg', category: 'Constantia', title: 'Constantia' },
          { id: 'stellenbosch', image: '/assets/img/destination/stellenbosch.jpg', category: 'Stellenbosch', title: 'Stellenbosch' },
          { id: 'cape-point', image: '/assets/img/destination/cape point.jpg', category: 'Cape Peninsula', title: 'Cape Peninsula' },
          { id: 'garden-route', image: '/assets/img/destination/garden-route.jpg', category: 'Garden Route', title: 'Garden Route' },
        ];

        for (const dest of staticDestinations) {
          allImages.push({
            id: `static-${dest.id}`,
            image: dest.image,
            category: dest.category,
            title: dest.title,
            alt: `${dest.title} Gallery`,
          });
        }
      }

      setGalleryImages(allImages);
      const locations = [...new Set(allImages.map(image => image.category))];
      setAvailableLocations(locations);
      setLoading(false);
    };

    fetchImages();
  }, []);


  const handleFilterChange = (newFilter: string) => {
    setAnimating(true);
    setVisibleImages(6); // Reset visible images on filter change
    setTimeout(() => {
      setFilter(newFilter);
      setAnimating(false);
    }, 300);
  };

  const filteredImages = galleryImages.filter(image => 
    filter === '*' || image.category.toLowerCase().replace(/\s+/g, '-') === filter
  );

  const loadMore = () => {
    setVisibleImages(prev => prev + 3);
  };

  return (
    <>
      <style jsx>{`
        .gallery-item {
          transition: opacity 300ms ease-in-out, transform 300ms ease-in-out;
        }
        .gallery-item.animating {
          opacity: 0;
          transform: scale(0.9);
        }
      `}</style>
      <section className="gallery-area space">
        <div className="container">
          {/* Filter Tabs */}
          <div className="filter-menu filter-menu-active">
            <button onClick={() => handleFilterChange('*')} className={filter === '*' ? 'active th-btn' : 'th-btn'}>All</button>
            {availableLocations.map(location => (
              <button 
                key={location} 
                onClick={() => handleFilterChange(location.toLowerCase().replace(/\s+/g, '-'))} 
                className={filter === location.toLowerCase().replace(/\s+/g, '-') ? 'active th-btn' : 'th-btn'}
              >
                {location}
              </button>
            ))}
          </div>
          
          {/* Gallery Grid */}
          <div className="gallery-grid-container">
            {loading ? (
              <p>Loading images...</p>
            ) : filteredImages.length > 0 ? (
              filteredImages.slice(0, visibleImages).map((item) => (
                <div key={item.id} className={`gallery-item ${item.category.toLowerCase().replace(/\s+/g, '-')} ${animating ? 'animating' : ''}`}>
                  <div className="gallery-box style5">
                    <div className="gallery-img global-img">
                      <Image src={item.image} alt={item.alt} width={400} height={300} style={{ objectFit: 'cover' }} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No images found for the selected filter.</p>
            )}
          </div>
          
          {/* Load More Button */}
          {visibleImages < filteredImages.length && (
            <div className="text-center mt-50">
              <button onClick={loadMore} className="th-btn">Load More Images</button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default GalleryGrid;
