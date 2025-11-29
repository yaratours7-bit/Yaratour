'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import Image from 'next/image';

const InstagramFeed = () => {
  const [instagramImages, setInstagramImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstagramImages = async () => {
      console.log('Fetching Instagram images...');
      setLoading(true);
      const { data, error } = await supabase.storage
        .from('website')
        .list('instagram', {
          limit: 6,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' },
        });

      if (error) {
        console.error('Error listing Instagram files:', error);
      }
      console.log(`Found ${data?.length || 0} Instagram files`, data);

      if (data) {
        const images = data.map((file) => {
          const { data: imageUrl } = supabase.storage
            .from('website')
            .getPublicUrl(`instagram/${file.name}`);
          console.log(`Public URL for ${file.name}:`, imageUrl.publicUrl);
          return imageUrl.publicUrl;
        });
        setInstagramImages(images);
      }
      setLoading(false);
    };

    fetchInstagramImages();
  }, []);

  return (
    <section className="instagram-area space-bottom mt-40">
      <div className="container">
        <div className="title-area text-center">
          <span className="sub-title">Follow Us</span>
          <h2 className="sec-title">@yaratours_ntravel on Instagram</h2>
          <p className="sec-text">
            Follow us on Instagram for daily travel inspiration and behind-the-scenes moments from our tours.
          </p>
        </div>
        
        <div className="row gy-10 gx-10">
          {loading ? (
            <p>Loading Instagram feed...</p>
          ) : instagramImages.length > 0 ? (
            instagramImages.map((image, index) => (
              <div key={index} className="col-md-4 col-lg-2">
                <div className="instagram-card">
                  <Image src={image} alt={`Instagram ${index + 1}`} width={200} height={200} style={{ objectFit: 'cover' }} />
                  <a
                    href="https://www.instagram.com/yaratours_ntravel/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="instagram-btn"
                  >
                    <i className="fab fa-instagram"></i>
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p>No Instagram images found. Please upload images to the 'instagram' folder in your Supabase 'website' bucket.</p>
          )}
        </div>
        
        <div className="text-center mt-40">
          <a 
            href="https://www.instagram.com/yaratours_ntravel/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="th-btn"
          >
            Follow Us on Instagram
          </a>
        </div>
      </div>
    </section>
  );
};

export default InstagramFeed;
