import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/Header.css';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="main-header">
      <div className="logo">
        <Link to="/">
          <img src="/assets/images/bg.png" alt="Logo" />
        </Link>
      </div>

      {isMobile ? (
        <>
          <button 
            className={`hamburger ${isMenuOpen ? 'active' : ''}`} 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          
          <nav className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
            <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>მთავარი</Link>
            <Link to="/about" className="nav-link" onClick={() => setIsMenuOpen(false)}>ჩვენს შესახებ</Link>
            <Link to="/portal" className="nav-link" onClick={() => setIsMenuOpen(false)}>პორტალი</Link>
            <a 
              href="https://www.instagram.com/sgt_uni/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="ig-link"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="20" height="20" rx="6" stroke="#E6B76C" strokeWidth="2" fill="none"/>
                <circle cx="12" cy="12" r="5" stroke="#E6B76C" strokeWidth="2" fill="none"/>
                <circle cx="17" cy="7" r="1.2" fill="#E6B76C"/>
              </svg>
              <span>Instagram</span>
            </a>
          </nav>
        </>
      ) : (
        <nav className="nav-menu">
          <Link to="/" className="nav-link">მთავარი</Link>
          <Link to="/about" className="nav-link">ჩვენს შესახებ</Link>
          <Link to="/portal" className="nav-link">პორტალი</Link>
          <a 
            href="https://www.instagram.com/sgt_uni/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="ig-icon" 
            aria-label="Instagram"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="20" height="20" rx="6" stroke="#E6B76C" strokeWidth="2" fill="none"/>
              <circle cx="12" cy="12" r="5" stroke="#E6B76C" strokeWidth="2" fill="none"/>
              <circle cx="17" cy="7" r="1.2" fill="#E6B76C"/>
            </svg>
          </a>
        </nav>
      )}
    </header>
  );
};

export default Header;