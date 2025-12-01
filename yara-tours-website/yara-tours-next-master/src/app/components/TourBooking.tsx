'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Tour } from '@/data/tours';
import { supabase } from '@/utils/supabase';
import { useToast } from '../contexts/ToastContext';

interface TourBookingProps {
  tour: Tour;
}

const TourBooking: React.FC<TourBookingProps> = ({ tour }) => {
  const { addToast } = useToast();
  const searchParams = useSearchParams();
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const date = searchParams.get('date');
    const people = searchParams.get('people');

    if (date) {
      setBookingDate(date);
    }
    if (people) {
      setNumberOfPeople(parseInt(people, 10));
    }
  }, [searchParams]);

  useEffect(() => {
    const price = parseFloat(tour.price.replace('R', ''));
    setTotalPrice(price * numberOfPeople);
  }, [numberOfPeople, tour.price]);

  const handleNumberOfPeopleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0) {
      setNumberOfPeople(value);
    } else {
      setNumberOfPeople(1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !bookingDate) {
      addToast('Please fill in all fields.', 'error');
      return;
    }

    setIsLoading(true);

    try {
      // 1) Save lead into Supabase so it appears in the CRM (Leads Pool)
      const numericBudget = Number(totalPrice || 0);

      const { error: leadError } = await supabase.from('leads').insert([
        {
          // Core identity
          name,
          email,
          phone,

          // New schema fields
          created: new Date().toISOString(),
          source: 'Website',
          form: 'Booking form',
          channel: 'Website',
          stage: 'New',
          owner: null,
          label: tour.title,
          secondary_phone: null,
          whatsapp_number: null,

          // Travel details
          destination: tour.location || tour.title,
          travel_dates: bookingDate,
          num_travelers: numberOfPeople,
          budget: numericBudget,
        },
      ]);

      if (leadError) {
        console.error('Failed to insert lead into Supabase:', leadError.message || leadError);
      }

      // 2) Best-effort: send booking notification email to admin
      try {
        const response = await fetch('/api/send-booking-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            phone,
            bookingDate,
            numberOfPeople,
            totalPrice,
            tourTitle: tour.title,
          }),
        });

        if (!response.ok) {
          console.error('Failed to send booking email');
        }
      } catch (emailError) {
        console.error('Error sending booking email', emailError);
      }
    } catch (err) {
      console.error('Unexpected error handling booking', err);
    }

    // Keep the same UX for the user
    await new Promise((resolve) => setTimeout(resolve, 500));

    addToast('Booking request sent successfully! We will contact you shortly.', 'success');
    setName('');
    setEmail('');
    setPhone('');
    setBookingDate('');
    setNumberOfPeople(1);

    setIsLoading(false);
  };

  return (
    <aside className="sidebar-area">
      <div className="widget widget_book">
        <h3 className="widget_title">Book This Tour</h3>
        <form className="book-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="tourName">Tour</label>
            <input id="tourName" type="text" value={tour.title} disabled />
          </div>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ color: 'var(--title-color)' }} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ color: 'var(--title-color)' }} />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required style={{ color: 'var(--title-color)' }} />
          </div>
          <div className="form-group ">
            <label htmlFor="bookingDate">Date</label>
            <input id="bookingDate" type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="numberOfPeople">Number of People</label>
            <input 
              id="numberOfPeople" 
              type="number" 
              placeholder="Number of People" 
              min="1" 
              value={numberOfPeople}
              onChange={handleNumberOfPeopleChange}
              required
              style={{ color: 'var(--title-color)' }} 
            />
          </div>
          <div className="form-group">
            <h4>Total: R{totalPrice.toFixed(2)}</h4>
          </div>
          <div className="form-group">
            <button type="submit" className="th-btn style4 th-icon" disabled={isLoading}>
              {isLoading ? 'Booking...' : 'Book Now'}
            </button>
          </div>
        </form>
      </div>
    </aside>
  );
};

export default TourBooking;
