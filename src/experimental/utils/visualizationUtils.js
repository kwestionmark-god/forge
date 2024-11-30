// src/experimental/utils/visualizationUtils.js

/**
 * Collection of math utilities for geometric calculations
 */
export const mathUtils = {
    // Convert degrees to radians
    toRadians: (degrees) => (degrees * Math.PI) / 180,
    
    // Convert radians to degrees
    toDegrees: (radians) => (radians * 180) / Math.PI,
    
    // Linear interpolation between two values
    lerp: (start, end, t) => start * (1 - t) + end * t,
    
    // Clamp a value between min and max
    clamp: (value, min, max) => Math.min(Math.max(value, min), max),
    
    // Map a value from one range to another
    mapRange: (value, inMin, inMax, outMin, outMax) => {
      const normalized = (value - inMin) / (inMax - inMin);
      return normalized * (outMax - outMin) + outMin;
    },
  
    // Generate points on a circle
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
  
  /**
   * Color utilities for working with different color spaces and transitions
   */
  export const colorUtils = {
    // Convert HSL to RGB
    hslToRgb: (h, s, l) => {
      h /= 360;
      s /= 100;
      l /= 100;
      let r, g, b;
  
      if (s === 0) {
        r = g = b = l;
      } else {
        const hue2rgb = (p, q, t) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1/6) return p + (q - p) * 6 * t;
          if (t < 1/2) return q;
          if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
        };
  
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
      }
  
      return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
      };
    },
  
    // Create a color scheme based on spiritual/chakra associations
    getChakraColor: (index, alpha = 1) => {
      const chakraColors = [
        { h: 0, s: 100, l: 50 },    // Root (Red)
        { h: 33, s: 100, l: 50 },   // Sacral (Orange)
        { h: 60, s: 100, l: 50 },   // Solar Plexus (Yellow)
        { h: 120, s: 100, l: 40 },  // Heart (Green)
        { h: 200, s: 100, l: 50 },  // Throat (Blue)
        { h: 240, s: 100, l: 50 },  // Third Eye (Indigo)
        { h: 270, s: 100, l: 50 }   // Crown (Violet)
      ];
      
      const color = chakraColors[index % chakraColors.length];
      return `hsla(${color.h}, ${color.s}%, ${color.l}%, ${alpha})`;
    }
  };
  
  /**
   * Canvas drawing utilities for common visualization needs
   */
  export const canvasUtils = {
    // Create a glowing effect
    drawGlow: (ctx, x, y, radius, color, intensity = 1) => {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, color.replace(')', `, ${intensity})`));
      gradient.addColorStop(1, color.replace(')', ', 0)'));
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    },
  
    // Create a sacred geometry pattern
    drawSacredPattern: (ctx, x, y, size, points, rotation = 0) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      
      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const px = Math.cos(angle) * size;
        const py = Math.sin(angle) * size;
        
        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.closePath();
      ctx.restore();
    }
  };
  
  /**
   * Animation utilities for smooth transitions and effects
   */
  export const animationUtils = {
    // Easing functions for smooth animations
    easing: {
      linear: t => t,
      easeInQuad: t => t * t,
      easeOutQuad: t => t * (2 - t),
      easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    },
  
    // Generate a smooth oscillation
    oscillate: (time, frequency = 1, amplitude = 1) => {
      return Math.sin(time * frequency * Math.PI * 2) * amplitude;
    },
  
    // Create a pulsing effect
    pulse: (time, minValue = 0, maxValue = 1, frequency = 1) => {
      const normalized = (Math.sin(time * frequency * Math.PI * 2) + 1) / 2;
      return mathUtils.lerp(minValue, maxValue, normalized);
    }
  };