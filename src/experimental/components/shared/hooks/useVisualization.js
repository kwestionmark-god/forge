// src/experimental/components/shared/hooks/useVisualization.js

import { useEffect, useRef, useCallback } from 'react';

// Hook to manage canvas sizing and context
export const useCanvas = (onResize) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const setupCanvas = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Handle high DPI displays for sharper rendering
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    
    ctx.scale(dpr, dpr);
    contextRef.current = ctx;

    // Call optional resize callback
    if (onResize) {
      onResize(rect.width, rect.height);
    }
  }, [onResize]);

  useEffect(() => {
    setupCanvas();
    
    const handleResize = () => {
      setupCanvas();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setupCanvas]);

  return [canvasRef, contextRef.current];
};

// Hook to manage animation timing
export const useAnimation = (callback, isPlaying = true, fps = 60) => {
  const requestRef = useRef();
  const previousTimeRef = useRef();
  const frameInterval = 1000 / fps;

  const animate = useCallback((time) => {
    if (previousTimeRef.current === undefined) {
      previousTimeRef.current = time;
    }

    const deltaTime = time - previousTimeRef.current;

    if (deltaTime >= frameInterval) {
      callback(deltaTime / 1000); // Convert to seconds
      previousTimeRef.current = time;
    }

    requestRef.current = requestAnimationFrame(animate);
  }, [callback, frameInterval]);

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
};

// Hook to manage visualization state
export const useVisualizationState = (initialSettings = {}) => {
  const [state, setState] = useState({
    isPlaying: true,
    isDarkMode: true,
    isMuted: true,
    showControls: false,
    settings: initialSettings,
  });

  const updateSetting = useCallback((key, value) => {
    setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [key]: value,
      }
    }));
  }, []);

  const toggleState = useCallback((key) => {
    setState(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  return {
    state,
    updateSetting,
    toggleState,
  };
};