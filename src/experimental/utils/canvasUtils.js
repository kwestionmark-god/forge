export const canvasUtils = {
    drawGlow: (ctx, x, y, radius, color, intensity = 1) => {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, color.replace(')', `, ${intensity})`));
      gradient.addColorStop(1, color.replace(')', ', 0)'));
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    },
  
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