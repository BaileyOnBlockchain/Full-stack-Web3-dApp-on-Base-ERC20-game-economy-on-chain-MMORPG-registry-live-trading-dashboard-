"use client";

import { useEffect } from 'react';

export default function PerformanceOptimizer() {
  useEffect(() => {
    // Preload critical resources
    const preloadResources = () => {
      // Preload critical images
      const criticalImages = [
        '/Cheshire%20Whale%20Token.jpg',
        '/Purple Brutus 8-Bit.png',
        '/jose.jpg'
      ];

      criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      });

      // Preload critical fonts
      const fontLink = document.createElement('link');
      fontLink.rel = 'preload';
      fontLink.href = '/fonts/geist-sans.woff2';
      fontLink.as = 'font';
      fontLink.type = 'font/woff2';
      fontLink.crossOrigin = 'anonymous';
      document.head.appendChild(fontLink);
    };

    // Preload on idle
    if ('requestIdleCallback' in window) {
      requestIdleCallback(preloadResources);
    } else {
      setTimeout(preloadResources, 0);
    }

    // Optimize scroll performance
    const optimizeScroll = () => {
      let ticking = false;
      
      const updateScroll = () => {
        // Add any scroll optimizations here
        ticking = false;
      };

      const requestTick = () => {
        if (!ticking) {
          requestAnimationFrame(updateScroll);
          ticking = true;
        }
      };

      window.addEventListener('scroll', requestTick, { passive: true });
      
      return () => {
        window.removeEventListener('scroll', requestTick);
      };
    };

    const cleanup = optimizeScroll();

    return () => {
      cleanup();
    };
  }, []);

  return null;
}
