import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';

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
          <h1 className="breadcumb-title">FAQs</h1>
          <ul className="breadcumb-menu">
            <li><Link href="/">Home</Link></li>
            <li>FAQs</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const FaqSection = () => {
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
      id: 4,
      question: 'Are your tours suitable for families?',
      answer: 'Absolutely! We offer family-friendly tours designed for all ages. Many of our packages include special activities and accommodations for children.'
    },
    {
      id: 5,
      question: 'What should I pack for my trip?',
      answer: 'We recommend packing comfortable clothing, sturdy shoes, sunscreen, a hat, and any personal medications. A detailed packing list will be provided upon booking.'
    },
    {
      id: 6,
      question: 'Are meals included in the tours?',
      answer: 'Most of our tours include breakfast, and some include lunch or dinner. Please check the "Included" section of each tour for specific details.'
    }
  ];

  return (
    <div className="space-top space-extra-bottom">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-7">
            <div className="title-area text-center">
              <span className="sub-title">FAQ</span>
              <h2 className="sec-title">frequently Ask Questions</h2>
              <p>Have questions you want answers to?</p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-10 offset-lg-1">
            <div className="accordion-area accordion mb-30" id="faqAccordion">
              {faqs.map((faq, index) => (
                <div className="accordion-card style2" key={faq.id}>
                  <div className="accordion-header" id={`collapse-item-${faq.id}`}>
                    <button className={`accordion-button ${index !== 0 ? 'collapsed' : ''}`} type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-${faq.id}`} aria-expanded={index === 0 ? 'true' : 'false'} aria-controls={`collapse-${faq.id}`}>
                      {`Q${index + 1}. ${faq.question}`}
                    </button>
                  </div>
                  <div id={`collapse-${faq.id}`} className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`} aria-labelledby={`collapse-item-${faq.id}`} data-bs-parent="#faqAccordion">
                    <div className="accordion-body style2">
                      <p className="faq-text">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function FaqPage() {
  return (
    <main>
      <Header />
      <Breadcrumb />
      <FaqSection />
      <Footer />
    </main>
  );
}
