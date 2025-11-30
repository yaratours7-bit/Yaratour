'use client';

import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { supabase } from '@/utils/supabase';
import Link from 'next/link';
import { useToast } from '../contexts/ToastContext';

export default function ContactPage() {
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Supabase disabled for now; simulate a successful send
    await new Promise((resolve) => setTimeout(resolve, 500));

    addToast('Message sent successfully!', 'success');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });

    setIsLoading(false);
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
            <h1 className="breadcumb-title">Contact Us</h1>
            <ul className="breadcumb-menu">
              <li><Link href="/">Home</Link></li>
              <li>Contact Us</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const ContactInfo = () => {
    const contactDetails = [
      {
        id: 1,
        icon: 'fas fa-map-marker-alt',
        title: 'Our Address',
        info: 'Cape Town, South Africa',
        link: '#'
      },
      {
        id: 2,
        icon: 'fas fa-phone',
        title: 'Phone Number',
        info: '+27 21 818 6077',
        link: 'tel:+27218186077'
      },
      {
        id: 3,
        icon: 'fas fa-envelope',
        title: 'Email Address',
        info: 'info@yaratoursntravel.com',
        link: 'mailto:info@yaratoursntravel.com'
      },
      {
        id: 4,
        icon: 'fas fa-clock',
        title: 'Working Hours',
        info: 'Mon - Fri: 9:00 AM - 6:00 PM',
        link: '#'
      }
    ];

    return (
      <section className="contact-area space">
        <div className="container">
          <div className="row gy-40">
            {contactDetails.map((item) => (
              <div key={item.id} className="col-md-6 col-lg-3">
                <div className="contact-info">
                  <div className="contact-info_icon">
                    <i className={item.icon}></i>
                  </div>
                  <div className="contact-info_details">
                    <h4 className="contact-info_title">{item.title}</h4>
                    {item.link !== '#' ? (
                      <a href={item.link} className="contact-info_text">{item.info}</a>
                    ) : (
                      <p className="contact-info_text">{item.info}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const ContactForm = () => {
    return (
      <section className="contact-area space-bottom">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="contact-form-wrap">
                <div className="title-area mb-30">
                  <span className="sub-title">Get In Touch</span>
                  <h2 className="sec-title">Send Us A Message</h2>
                  <p className="sec-text">
                    Have questions about our tours or need help planning your next adventure? 
                    We're here to help! Send us a message and our travel experts will get back to you.
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="contact-form ajax-contact">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <input 
                          type="text" 
                          className="form-control" 
                          name="name" 
                          placeholder="Your Name*"
                          value={formData.name}
                          onChange={handleInputChange}
                          required 
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <input 
                          type="email" 
                          className="form-control" 
                          name="email" 
                          placeholder="Email Address*"
                          value={formData.email}
                          onChange={handleInputChange}
                          required 
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <input 
                          type="tel" 
                          className="form-control" 
                          name="phone" 
                          placeholder="Phone Number"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <select 
                          name="subject" 
                          className="form-select"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select Subject*</option>
                          <option value="general">General Inquiry</option>
                          <option value="booking">Tour Booking</option>
                          <option value="support">Customer Support</option>
                          <option value="partnership">Partnership</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group">
                        <textarea 
                          name="message" 
                          className="form-control" 
                          placeholder="Write Your Message*"
                          rows={6}
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                        ></textarea>
                      </div>
                    </div>
                    <div className="form-btn col-12">
                      <button type="submit" className="th-btn" disabled={isLoading}>
                        {isLoading ? 'Sending...' : 'Send Message'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            
            <div className="col-lg-6">
              <div className="contact-map">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d211977.1493122832!2d18.4240553!3d-33.9248685!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1dcc500f8826eed7%3A0x687fe1fc27b13a9a!2sCape%20Town%2C%20South%20Africa!5e0!3m2!1sen!2sus!4v1635784008021!5m2!1sen!2sus"
                  width="100%"
                  height="500"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="Contact Location Map"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  const FAQ = () => {
    const faqs = [
      {
        id: 1,
        question: 'How do I book a tour?',
        answer: 'You can book a tour through our website by selecting your desired destination and dates, or contact our customer service team for personalized assistance.'
      },
      {
        id: 2,
        question: 'What is your cancellation policy?',
        answer: 'We offer flexible cancellation policies. You can cancel up to 48 hours before your tour for a full refund. Please check individual tour terms for specific conditions.'
      },
      {
        id: 3,
        question: 'Do you provide travel insurance?',
        answer: 'Yes, we offer comprehensive travel insurance options to protect your investment. Our team can help you choose the right coverage for your trip.'
      },
      {
        id: 4,
        question: 'Are your tours suitable for families?',
        answer: 'Absolutely! We offer family-friendly tours designed for all ages. Many of our packages include special activities and accommodations for children.'
      }
    ];

    return (
      <section className="faq-area space-bottom">
        <div className="container">
          <div className="title-area text-center">
            <span className="sub-title">FAQ</span>
            <h2 className="sec-title">Frequently Asked Questions</h2>
          </div>
          
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="accordion" id="faqAccordion">
                {faqs.map((faq, index) => (
                  <div key={faq.id} className="accordion-item">
                    <h2 className="accordion-header">
                      <button 
                        className={`accordion-button ${index !== 0 ? 'collapsed' : ''}`}
                        type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target={`#collapse${faq.id}`}
                        aria-expanded={index === 0 ? 'true' : 'false'}
                        aria-controls={`collapse${faq.id}`}
                      >
                        {faq.question}
                      </button>
                    </h2>
                    <div 
                      id={`collapse${faq.id}`}
                      className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`}
                      data-bs-parent="#faqAccordion"
                    >
                      <div className="accordion-body">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  return (
    <main>
      <Header />
      <Breadcrumb />
      <ContactInfo />
      <ContactForm />
      <FAQ />
      <Footer />
    </main>
  );
}
