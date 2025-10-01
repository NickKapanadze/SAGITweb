import React, { useState, useEffect } from 'react';
import './Countdown.css';

interface TimeLeft {
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownProps {
  targetDate: Date;
}

const Countdown: React.FC<CountdownProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference > 0) {
        const months = Math.floor(difference / (1000 * 60 * 60 * 24 * 30.44));
        const days = Math.floor((difference % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft({ months, days, hours, minutes, seconds });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="countdown-container">
      <div className="time-unit">
        <h1>{timeLeft.months.toString().padStart(2, '0')} თვე</h1>
        <progress value={timeLeft.months} max={12}></progress>
      </div>
      <div className="time-unit">
        <h1>{timeLeft.days.toString().padStart(2, '0')} დღე</h1>
        <progress value={timeLeft.days} max={30}></progress>
      </div>
      <div className="time-unit">
        <h1>{timeLeft.hours.toString().padStart(2, '0')} საათი</h1>
        <progress value={timeLeft.hours} max={24}></progress>
      </div>
      <div className="time-unit">
        <h1>{timeLeft.minutes.toString().padStart(2, '0')} წუთი</h1>
        <progress value={timeLeft.minutes} max={60}></progress>
      </div>
      <div className="time-unit">
        <h1>{timeLeft.seconds.toString().padStart(2, '0')} წამი</h1>
        <progress value={timeLeft.seconds} max={60}></progress>
      </div>
    </div>
  );
};

export default Countdown;