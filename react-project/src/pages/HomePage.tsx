import React from 'react';
import Countdown from '../components/Countdown/Countdown';
import './HomePage.css';

const HomePage: React.FC = () => {
  // Target date for the countdown (October 20, 2025 at 13:30)
  const targetDate = new Date("2025-10-20T13:30:00");

  return (
    <div className="home-page">
      <Countdown targetDate={targetDate} />
    </div>
  );
};

export default HomePage;