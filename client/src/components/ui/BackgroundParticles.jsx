import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function BackgroundParticles() {
  const particles = useMemo(() => {
    // Generate random particles
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      size: Math.random() * 4 + 1, // 1px to 5px
      x: Math.random() * 100, // 0 to 100 vw
      y: Math.random() * 100, // 0 to 100 vh
      duration: Math.random() * 20 + 15, // 15s to 35s
      delay: Math.random() * 10,
      opacity: Math.random() * 0.3 + 0.1, // 0.1 to 0.4
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Tiny floating particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-primary-400"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}vw`,
            top: `${p.y}vh`,
            opacity: p.opacity,
            boxShadow: `0 0 ${p.size * 2}px var(--color-primary-500, rgba(251, 146, 60, 0.6))`
          }}
          animate={{
            y: [0, -60, 0],
            x: [0, Math.random() * 40 - 20, 0],
            opacity: [p.opacity, p.opacity * 2, p.opacity],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "linear",
            delay: p.delay,
          }}
        />
      ))}
      
      {/* Large Glowing Ambient Orbs */}
      <motion.div 
        className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] rounded-full bg-primary-600/10 blur-[120px] mix-blend-screen"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-[-10%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-blue-600/10 blur-[130px] mix-blend-screen"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      
      {/* Starry static background layer */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />
    </div>
  );
}
