export const animationUtils = {
    easing: {
      linear: t => t,
      easeInQuad: t => t * t,
      easeOutQuad: t => t * (2 - t),
      easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    },
  
    oscillate: (time, frequency = 1, amplitude = 1) => {
      return Math.sin(time * frequency * Math.PI * 2) * amplitude;
    },
  
    pulse: (time, minValue = 0, maxValue = 1, frequency = 1) => {
      const normalized = (Math.sin(time * frequency * Math.PI * 2) + 1) / 2;
      return mathUtils.lerp(minValue, maxValue, normalized);
    }
  };