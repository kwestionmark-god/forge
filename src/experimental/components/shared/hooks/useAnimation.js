import { useRef, useEffect, useCallback } from 'react';

/**
 * Hook to manage animation timing and frame updates
 * @param {Function} callback - Animation frame callback
 * @param {Object} options - Animation options
 * @param {boolean} options.isPlaying - Whether animation is playing
 * @param {number} options.fps - Target frames per second
 * @returns {Object} Animation controls and time info
 */
export const useAnimation = (callback, options = {}) => {
  const {
    isPlaying = true,
    fps = 60
  } = options;

  const requestRef = useRef();
  const previousTimeRef = useRef();
  const timeRef = useRef(0);
  const frameInterval = 1000 / fps;

  // Animation frame handler
  const animate = useCallback((currentTime) => {
    if (previousTimeRef.current === undefined) {
      previousTimeRef.current = currentTime;
    }

    const deltaTime = currentTime - previousTimeRef.current;

    // Only update if enough time has passed for target FPS
    if (deltaTime >= frameInterval) {
      const delta = deltaTime / 1000; // Convert to seconds
      timeRef.current += delta;
      
      callback({
        time: timeRef.current,
        delta,
        fps: 1000 / deltaTime
      });

      previousTimeRef.current = currentTime;
    }

    requestRef.current = requestAnimationFrame(animate);
  }, [callback, frameInterval]);

  // Start/stop animation based on isPlaying
  useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isPlaying, animate]);

  // Return timing info and controls
  return {
    time: timeRef.current,
    isPlaying,
    reset: () => {
      timeRef.current = 0;
      previousTimeRef.current = undefined;
    }
  };
};
