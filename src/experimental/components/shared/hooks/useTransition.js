// src/experimental/components/shared/hooks/useTransition.js
/**
 * Hook to create smooth transitions between states or values
 * Useful for animating visualization parameters
 */
export const useTransition = (initialValue, options = {}) => {
    const {
      duration = 500,
      easing = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    } = options;
  
    const [current, setCurrent] = useState(initialValue);
    const [target, setTarget] = useState(initialValue);
    const animationRef = useRef(null);
    const startTimeRef = useRef(null);
    const startValueRef = useRef(initialValue);
  
    // Animate to a new value
    const animateTo = useCallback((newValue) => {
      setTarget(newValue);
      startValueRef.current = current;
      startTimeRef.current = performance.now();
  
      const animate = (timestamp) => {
        if (!startTimeRef.current) startTimeRef.current = timestamp;
        const elapsed = timestamp - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easing(progress);
  
        if (typeof initialValue === 'number') {
          // Numeric transition
          setCurrent(
            startValueRef.current + (newValue - startValueRef.current) * easedProgress
          );
        } else if (Array.isArray(initialValue)) {
          // Array transition (e.g., for colors or vectors)
          setCurrent(
            startValueRef.current.map((start, i) => 
              start + (newValue[i] - start) * easedProgress
            )
          );
        } else if (typeof initialValue === 'object') {
          // Object transition
          setCurrent(
            Object.fromEntries(
              Object.entries(startValueRef.current).map(([key, start]) => [
                key,
                start + (newValue[key] - start) * easedProgress
              ])
            )
          );
        }
  
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };
  
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      animationRef.current = requestAnimationFrame(animate);
    }, [current, duration, easing, initialValue]);
  
    // Cleanup animation on unmount
    useEffect(() => {
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, []);
  
    return [current, animateTo, target];
  };