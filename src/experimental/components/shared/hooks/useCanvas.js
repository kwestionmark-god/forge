import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook to manage canvas setup, resizing, and context
 * @param {Object} options - Configuration options
 * @param {boolean} options.handleResize - Whether to auto-handle window resizing
 * @param {number} options.dpr - Device pixel ratio override
 * @param {Function} options.onResize - Callback when canvas is resized
 * @returns {[React.RefObject, CanvasRenderingContext2D]} Canvas ref and context
 */
export const useCanvas = (options = {}) => {
  const {
    handleResize = true,
    dpr = window.devicePixelRatio || 1,
    onResize = null
  } = options;

  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  // Setup canvas with proper scaling for device pixel ratio
  const setupCanvas = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Get the container size
    const container = canvas.parentElement;
    const width = container?.clientWidth || window.innerWidth;
    const height = container?.clientHeight || window.innerHeight;
    
    // Scale canvas for high DPI displays
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    
    // Scale context to device
    ctx.scale(dpr, dpr);
    contextRef.current = ctx;

    // Call resize callback if provided
    if (onResize) {
      onResize(width, height);
    }
  }, [dpr, onResize]);

  // Initialize canvas and handle resizing
  useEffect(() => {
    setupCanvas();
    
    if (handleResize) {
      const resizeHandler = () => {
        setupCanvas();
      };

      window.addEventListener('resize', resizeHandler);
      return () => window.removeEventListener('resize', resizeHandler);
    }
  }, [handleResize, setupCanvas]);

  return [canvasRef, contextRef.current];
};