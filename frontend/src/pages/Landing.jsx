import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaPlay, 
  FaTv, 
  FaDownload, 
  FaMobileAlt, 
  FaLock, 
  FaChevronRight, 
  FaChevronDown,
  FaStar,
  FaFire
} from 'react-icons/fa';
import './Landing.css';

/**
 * Landing Page Component
 * Features:
 * - Netflix/Disney+ inspired Hero Showcase
 * - Dynamic email capture form leading to Registration
 * - Feature Cards grid with hover tilt & glow effects
 * - Collapsible FAQ Accordion using React State
 */
const Landing = () => {
  const [email, setEmail] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);
  const navigate = useNavigate();

  const handleGetStarted = (e) => {
    e.preventDefault();
    if (email.trim()) {
      navigate(`/register?email=${encodeURIComponent(email.trim())}`);
    } else {
      navigate('/register');
    }
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "What is STREAMFLIX?",
      answer: "STREAMFLIX is a modern, high-performance movie streaming showcase built with React, Node.js, and TMDB API. Browse thousands of blockbuster movies, view trailers, curate watchlists, and enjoy personalized recommendations."
    },
    {
      question: "How much does STREAMFLIX cost?",
      answer: "STREAMFLIX offers free access to browse trailers, cast details, reviews, and manage your watchlist! Premium 4K streaming tiers are available with zero advertisements."
    },
    {
      question: "Where can I watch?",
      answer: "Watch anywhere, anytime. Sign in with your STREAMFLIX account to watch instantly on the web from your desktop computer, smart TV, smartphone, tablet, or streaming stick."
    },
    {
      question: "How do I cancel?",
      answer: "STREAMFLIX is flexible. There are no annoying contracts and no commitments. You can easily cancel your subscription online in two clicks from your profile settings."
    },
    {
      question: "Is STREAMFLIX safe for kids?",
      answer: "Yes! Kids profiles feature age-gated controls and PIN protection so children can enjoy family-friendly animation and movies safely."
    }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="landing-hero">
        <div className="hero-backdrop-overlay"></div>
        <div className="hero-content container">
          <div className="hero-badge">
            <FaFire className="badge-icon" /> #1 Streaming Experience of 2026
          </div>
          <h1 className="hero-title">
            Unlimited Movies, TV Shows & Cinematic Masterpieces.
          </h1>
          <p className="hero-subtitle">
            Watch anywhere. Stream in crisp 4K Ultra HD. Cancel anytime.
          </p>

          <form className="hero-email-form" onSubmit={handleGetStarted}>
            <input 
              type="email" 
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="email-input"
              required
            />
            <button type="submit" className="btn btn-primary cta-btn">
              Get Started <FaChevronRight />
            </button>
          </form>

          <div className="hero-trust-bar">
            <span><FaStar className="star-icon" /> 4.9/5 Rating</span>
            <span className="dot">•</span>
            <span>Over 10,000+ Movies & Series</span>
            <span className="dot">•</span>
            <span>Instant Setup</span>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="landing-features container">
        <div className="section-header">
          <h2 className="section-title">Why Choose StreamFlix?</h2>
          <p className="section-subtitle">Engineered with cutting-edge web technology for seamless performance.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card glass-card">
            <div className="feature-icon-box">
              <FaTv />
            </div>
            <h3>Watch on Your TV</h3>
            <p>Stream on Smart TVs, PlayStation, Xbox, Chromecast, Apple TV, Blu-ray players, and more.</p>
          </div>

          <div className="feature-card glass-card">
            <div className="feature-icon-box">
              <FaDownload />
            </div>
            <h3>Download Your Shows</h3>
            <p>Save your favorite titles easily and always have something to watch offline anywhere.</p>
          </div>

          <div className="feature-card glass-card">
            <div className="feature-icon-box">
              <FaMobileAlt />
            </div>
            <h3>Watch Everywhere</h3>
            <p>Stream unlimited movies and TV shows on your phone, tablet, laptop, and desktop without paying more.</p>
          </div>

          <div className="feature-card glass-card">
            <div className="feature-icon-box">
              <FaLock />
            </div>
            <h3>Secure Account & Profiles</h3>
            <p>Create individual user profiles, customize favorites, and protect accounts with JWT security.</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="landing-faq container">
        <div className="section-header">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">Got questions? We've got answers.</p>
        </div>

        <div className="faq-accordion">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item glass-card ${activeFaq === index ? 'active' : ''}`}
            >
              <button 
                className="faq-question" 
                onClick={() => toggleFaq(index)}
              >
                <span>{faq.question}</span>
                <FaChevronDown className="faq-chevron" />
              </button>
              {activeFaq === index && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="faq-cta-box glass-card">
          <h3>Ready to start watching?</h3>
          <p>Enter your email to create or restart your membership.</p>
          <Link to="/register" className="btn btn-primary">Create Your Account</Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;
