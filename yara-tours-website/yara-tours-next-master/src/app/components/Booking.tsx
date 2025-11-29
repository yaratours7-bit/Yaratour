'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { tours } from '@/data/tours';

const Booking = () => {
  const [selectedTour, setSelectedTour] = useState('');
  const [date, setDate] = useState('');
  const [numPeople, setNumPeople] = useState('');
  const router = useRouter();

  const handleTourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTour(e.target.value);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const handleNumPeopleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumPeople(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedTour) {
      const queryParams = new URLSearchParams();
      if (date) queryParams.append('date', date);
      if (numPeople) queryParams.append('people', numPeople);

      const queryString = queryParams.toString();
      router.push(`/tour/${selectedTour}${queryString ? `?${queryString}` : ''}`);
    }
  };

  return (
    <div className="booking-sec">
      <div className="container">
        <form onSubmit={handleSubmit} className="booking-form ajax-contact">
          <div className="input-wrap">
            <div className="row align-items-center justify-content-between">
              <div className="form-group col-md-6 col-lg-auto">
                <div className="icon">
                  <i className="fa-regular fa-person-hiking"></i>
                </div>
                <div className="search-input ">
                  <label>Type</label>
                  <select
                    value={selectedTour}
                    onChange={handleTourChange}
                  >
                    <option value="" disabled>
                      Select Tour Type
                    </option>
                    {tours.map((tour) => (
                      <option key={tour.id} value={tour.id}>
                        {tour.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-group col-md-6 col-lg-auto">
                <div className="icon">
                  <i className="fa-light fa-calendar-days"></i>
                </div>
                <div className="search-input">
                  <label>Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={date}
                    onChange={handleDateChange}
                  />
                </div>
              </div>
              
              <div className="form-group col-md-6 col-lg-auto">
                <div className="icon">
                  <i className="fa-light fa-user-group"></i>
                </div>
                <div className="search-input">
                  <label>Number of People</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Number of People"
                    min="1"
                    value={numPeople}
                    onChange={handleNumPeopleChange}
                  />
                </div>
              </div>
              
              <div className="form-btn col-md-12 col-lg-auto">
                <button className="th-btn" type="submit">
                  <Image 
                    src="/assets/img/icon/search.svg" 
                    alt="Search" 
                    width={20} 
                    height={20}
                  />
                  Search
                </button>
              </div>
            </div>
            <p className="form-messages mb-0 mt-3"></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Booking;
