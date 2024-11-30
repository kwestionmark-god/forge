export const mathUtils = {
    toRadians: (degrees) => (degrees * Math.PI) / 180,
    toDegrees: (radians) => (radians * 180) / Math.PI,
    lerp: (start, end, t) => start * (1 - t) + end * t,
    clamp: (value, min, max) => Math.min(Math.max(value, min), max),
    mapRange: (value, inMin, inMax, outMin, outMax) => {
      const normalized = (value - inMin) / (inMax - inMin);
      return normalized * (outMax - outMin) + outMin;
    },
    circlePoints: (centerX, centerY, radius, count) => {
      const points = [];
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        points.push({
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius
        });
      }
      return points;
    }
  };