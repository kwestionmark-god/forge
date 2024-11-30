// src/experimental/components/shared/hooks/useGestures.js
import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Hook to handle touch and mouse interactions with visualizations
 * Supports common gestures like pinch-zoom, rotation, and panning
 */
export const useGestures = (options = {}) => {
  const {
    enableZoom = true,
    enableRotate = true,
    enablePan = true,
    minZoom = 0.1,
    maxZoom = 10,
  } = options;

  const [transform, setTransform] = useState({
    scale: 1,
    rotation: 0,
    translateX: 0,
    translateY: 0
  });

  // Track touch and mouse states
  const touchesRef = useRef([]);
  const isDraggingRef = useRef(false);
  const startTransformRef = useRef(null);

  // Calculate the distance between two touch points
  const getTouchDistance = useCallback((touch1, touch2) => {
    return Math.hypot(
      touch2.clientX - touch1.clientX,
      touch2.clientY - touch1.clientY
    );
  }, []);

  // Calculate the angle between two touch points
  const getTouchAngle = useCallback((touch1, touch2) => {
    return Math.atan2(
      touch2.clientY - touch1.clientY,
      touch2.clientX - touch1.clientX
    );
  }, []);

  // Handle the start of a gesture
  const handleGestureStart = useCallback((event) => {
    if (event.touches) {
      // Touch gesture
      touchesRef.current = Array.from(event.touches);
    } else {
      // Mouse gesture
      isDraggingRef.current = true;
      touchesRef.current = [{
        clientX: event.clientX,
        clientY: event.clientY
      }];
    }
    startTransformRef.current = { ...transform };
  }, [transform]);

  // Handle gesture movements
  const handleGestureMove = useCallback((event) => {
    if (!startTransformRef.current) return;

    event.preventDefault();
    const currentTouches = event.touches || [{
      clientX: event.clientX,
      clientY: event.clientY
    }];

    if (currentTouches.length === 2 && touchesRef.current.length === 2) {
      // Handle pinch-zoom and rotation
      const startDistance = getTouchDistance(touchesRef.current[0], touchesRef.current[1]);
      const currentDistance = getTouchDistance(currentTouches[0], currentTouches[1]);
      const startAngle = getTouchAngle(touchesRef.current[0], touchesRef.current[1]);
      const currentAngle = getTouchAngle(currentTouches[0], currentTouches[1]);

      if (enableZoom) {
        const scale = Math.min(Math.max(
          startTransformRef.current.scale * (currentDistance / startDistance),
          minZoom
        ), maxZoom);
        setTransform(prev => ({ ...prev, scale }));
      }

      if (enableRotate) {
        const rotation = startTransformRef.current.rotation + (currentAngle - startAngle);
        setTransform(prev => ({ ...prev, rotation }));
      }
    } else if (currentTouches.length === 1 && enablePan) {
      // Handle panning
      const deltaX = currentTouches[0].clientX - touchesRef.current[0].clientX;
      const deltaY = currentTouches[0].clientY - touchesRef.current[0].clientY;
      
      setTransform(prev => ({
        ...prev,
        translateX: startTransformRef.current.translateX + deltaX,
        translateY: startTransformRef.current.translateY + deltaY
      }));
    }
  }, [enableZoom, enableRotate, enablePan, minZoom, maxZoom, getTouchDistance, getTouchAngle]);

  // Handle gesture end
  const handleGestureEnd = useCallback(() => {
    touchesRef.current = [];
    isDraggingRef.current = false;
    startTransformRef.current = null;
  }, []);

  return {
    transform,
    setTransform,
    gestureHandlers: {
      onMouseDown: handleGestureStart,
      onMouseMove: isDraggingRef.current ? handleGestureMove : null,
      onMouseUp: handleGestureEnd,
      onMouseLeave: handleGestureEnd,
      onTouchStart: handleGestureStart,
      onTouchMove: handleGestureMove,
      onTouchEnd: handleGestureEnd
    }
  };
};