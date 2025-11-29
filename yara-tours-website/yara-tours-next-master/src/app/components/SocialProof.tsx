'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const names = ["Miguel", "Sofia", "Davi", "Júlia", "Arthur", "Isabella", "Pedro", "Manuela", "Gabriel", "Laura"];
const locations = ["Whale Watching Tour", "Cape Town City Tour", "Wine Tasting in Constantia", "Garden Route Adventure", "Cape Peninsula Tour", "Stellenbosch Winelands"];

const SocialProof = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const showRandomPopup = () => {
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomLocation = locations[Math.floor(Math.random() * locations.length)];
      const randomTime = Math.floor(Math.random() * 50) + 10; // 10 to 59 minutes ago

      setMessage(`${randomName} booked the ${randomLocation} ${randomTime} minutes ago`);
      setIsVisible(true);

      // Hide the pop-up after 5 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 5000);

      // Schedule the next pop-up at a random interval
      scheduleNextPopup();
    };

    const scheduleNextPopup = () => {
      const randomDelay = Math.random() * 40000 + 20000; // Show every 20-60 seconds
      timeoutId = setTimeout(showRandomPopup, randomDelay);
    };

    // Start the first pop-up after an initial random delay
    scheduleNextPopup();

    return () => clearTimeout(timeoutId);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="social-proof-popup">
      <Image 
        src="/assets/img/logo-icon.svg" 
        alt="Yara Tours" 
        width={40} 
        height={40} 
      />
      <p>{message}</p>
    </div>
  );
};

export default SocialProof;
