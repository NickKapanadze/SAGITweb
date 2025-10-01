import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound: React.FC = () => {
  return (
    <div className="not-found-page">
      <div className="error-container">
        <div className="error-code">404</div>
        <div className="error-message">მანდ რა გინდა ეს... ?<br />გვერდი, რომელსაც ეძებთ, არ არსებობს.</div>
        <Link to="/" className="home-btn">მთავარ გვერდზე დაბრუნება</Link>
      </div>
      <div className="error-image">
        <img src="/assets/images/hqdefault.jpg" alt="404 Image" />
      </div>
    </div>
  );
};

export default NotFound;