import React, { useState, useEffect } from 'react';

const pad = (n) => String(n).padStart(2, '0');

const FlipCard = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <div className="relative w-16 h-16 md:w-20 md:h-20">
      <div className="w-full h-full bg-gradient-to-b from-surface-muted to-surface-card border border-surface-border rounded-xl flex items-center justify-center shadow-card">
        <span className="font-display font-bold text-3xl md:text-4xl text-white tabular-nums">{pad(value)}</span>
      </div>
    </div>
    <span className="text-gray-400 text-xs mt-2 uppercase tracking-widest">{label}</span>
  </div>
);

const CountdownTimer = ({ targetDate, label, colorClass = 'text-kalarava-400' }) => {
  const [timeLeft, setTimeLeft] = useState({});
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const calculate = () => {
      const diff = new Date(targetDate) - new Date();
      if (diff <= 0) { setExpired(true); return; }
      setTimeLeft({
        days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    calculate();
    const id = setInterval(calculate, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  if (expired) return <div className={`text-lg font-bold ${colorClass}`}>🎉 The fest is LIVE!</div>;

  return (
    <div className="text-center">
      {label && <p className={`text-sm font-medium mb-4 ${colorClass}`}>{label}</p>}
      <div className="flex items-end gap-2 md:gap-4">
        <FlipCard value={timeLeft.days} label="Days" />
        <span className="text-3xl text-gray-500 font-bold mb-8">:</span>
        <FlipCard value={timeLeft.hours} label="Hours" />
        <span className="text-3xl text-gray-500 font-bold mb-8">:</span>
        <FlipCard value={timeLeft.minutes} label="Mins" />
        <span className="text-3xl text-gray-500 font-bold mb-8">:</span>
        <FlipCard value={timeLeft.seconds} label="Secs" />
      </div>
    </div>
  );
};

export default CountdownTimer;
