import React from 'react';

const symbols = ['🫀', '💊', '🏥', '⚕️', '🧬', '🩺', '💪', '🏃', '🚴', '🧘', '💧', '😴', '🌿', '🥗', '🩹', '🧪'];

const particles = Array.from({ length: 36 }).map((_, index) => ({
  id: index,
  symbol: symbols[index % symbols.length],
  left: `${(index * 17) % 100}%`,
  top: `${(index * 23) % 100}%`,
  size: 18 + (index % 6) * 4,
  duration: 14 + (index % 7) * 3,
  delay: -(index % 9) * 2,
  drift: (index % 2 === 0 ? 1 : -1) * (8 + (index % 5) * 2)
}));

const MovingHealthBackground = () => {
  return (
    <div className="wellnest-motion-bg" aria-hidden="true">
      <div className="wellnest-motion-glow wellnest-motion-glow-one" />
      <div className="wellnest-motion-glow wellnest-motion-glow-two" />
      <div className="wellnest-motion-glow wellnest-motion-glow-three" />

      {particles.map((item) => (
        <span
          key={item.id}
          className="wellnest-motion-item"
          style={{
            left: item.left,
            top: item.top,
            fontSize: `${item.size}px`,
            animationDuration: `${item.duration}s`,
            animationDelay: `${item.delay}s`,
            '--wellnest-drift': `${item.drift}px`
          }}
        >
          {item.symbol}
        </span>
      ))}
    </div>
  );
};

export default MovingHealthBackground;
