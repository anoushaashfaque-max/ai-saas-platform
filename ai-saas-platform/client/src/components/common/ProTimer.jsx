import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const ProTimer = ({ subscriptionEndDate, isPro }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!isPro || !subscriptionEndDate) {
      setTimeLeft('');
      return;
    }

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      // Handle different date formats
      let endDate;
      if (typeof subscriptionEndDate === 'string') {
        endDate = new Date(subscriptionEndDate);
      } else if (subscriptionEndDate instanceof Date) {
        endDate = subscriptionEndDate;
      } else {
        endDate = new Date(subscriptionEndDate);
      }

      if (isNaN(endDate.getTime())) {
        setTimeLeft('Invalid Date');
        return;
      }

      const difference = endDate.getTime() - now;

      if (difference <= 0) {
        setTimeLeft('Expired');
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${minutes}m`);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [subscriptionEndDate, isPro]);

  if (!isPro || !timeLeft || timeLeft === 'Expired') {
    return null;
  }

  return (
    <div className="flex items-center text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full ml-2">
      <Clock className="h-3 w-3 mr-1" />
      <span className="font-medium">Pro: {timeLeft}</span>
    </div>
  );
};

export default ProTimer;