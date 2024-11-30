export const colorUtils = {
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
    