import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { VisualizationContainer } from '../../shared/VisualizationContainer';
import { useCanvas, useAnimation } from '../../shared/hooks';
import { mathUtils, colorUtils } from '../../../utils/visualizationUtils';

// Define types for our visualization settings
interface VisualizationSettings {
  // Core visual settings with specific numeric constraints
  baseSize: number;        // Size of the base pattern (50-200)
  patternCount: number;    // Number of patterns (3-12)
  rotationSpeed: number;   // Speed of rotation (0-2)
  
  // Style settings with specific ranges
  intensity: number;       // Overall brightness (0-1)
  lineWidth: number;      // Line thickness (1-5)
  colorShift: number;     // Color change rate (0-360)
  
  // Animation settings with defined ranges
  pulseStrength: number;  // Strength of pulse (0-1)
  waveFrequency: number;  // Wave frequency (0-2)
  smoothing: number;      // Transition smoothing (0-1)
}

// Define types for our animation frame data
interface AnimationFrame {
  time: number;
  delta: number;
  fps: number;
}

// Type definition for pattern drawing parameters
interface PatternParams {
  x: number;
  y: number;
  size: number;
  rotation: number;
  index: number;
}

// Initial settings with type safety
const initialSettings: VisualizationSettings = {
  baseSize: 100,
  patternCount: 6,
  rotationSpeed: 0.5,
  intensity: 0.7,
  lineWidth: 2,
  colorShift: 30,
  pulseStrength: 0.3,
  waveFrequency: 0.5,
  smoothing: 0.15,
};

const Resonance: React.FC = () => {
  // State with proper typing
  const [showControls, setShowControls] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [settings, setSettings] = useState<VisualizationSettings>(initialSettings);

  // Canvas hook with type safety
  const [canvasRef, ctx] = useCanvas({
    handleResize: true,
    dpr: window.devicePixelRatio
  });

  // Type-safe setting update function
  const updateSetting = useCallback(<K extends keyof VisualizationSettings>(
    key: K,
    value: VisualizationSettings[K]
  ) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  // Drawing function with typed parameters
  const draw = useCallback(({ time, delta }: AnimationFrame) => {
    if (!ctx) return;

    // Clear with fade effect
    ctx.fillStyle = isDarkMode 
      ? 'rgba(0, 0, 0, 0.1)' 
      : 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;

    // Draw patterns with type safety
    for (let i = 0; i < settings.patternCount; i++) {
      const angle = (i / settings.patternCount) * Math.PI * 2;
      const rotation = time * settings.rotationSpeed;
      const waveOffset = Math.sin(time * settings.waveFrequency) * 20;
      const radius = settings.baseSize + waveOffset;

      const x = centerX + Math.cos(angle + rotation) * radius;
      const y = centerY + Math.sin(angle + rotation) * radius;

      drawPattern(ctx, {
        x,
        y,
        size: radius * settings.intensity,
        rotation: rotation + angle,
        index: i
      });
    }
  }, [ctx, settings, isDarkMode]);

  // Animation hook with typed callback
  useAnimation(draw, {
    isPlaying,
    fps: 60
  });

  // Type-safe control handlers
  const controls = {
    isPlaying,
    onPlayToggle: () => setIsPlaying(prev => !prev),
    isDarkMode,
    onDarkModeToggle: () => setIsDarkMode(prev => !prev),
    isMuted,
    onMuteToggle: () => setIsMuted(prev => !prev),
    showControls,
    onControlsToggle: () => setShowControls(prev => !prev)
  };

  return (
    <VisualizationContainer controls={controls}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />

      {showControls && (
        <Card className="fixed right-4 top-20 w-80 bg-black/30 backdrop-blur-md">
          <CardContent className="p-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-white">Pattern Size</label>
              <Slider
                value={[settings.baseSize]}
                onValueChange={([value]) => updateSetting('baseSize', value)}
                min={50}
                max={200}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white">Pattern Count</label>
              <Slider
                value={[settings.patternCount]}
                onValueChange={([value]) => updateSetting('patternCount', value)}
                min={3}
                max={12}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white">Rotation Speed</label>
              <Slider
                value={[settings.rotationSpeed]}
                onValueChange={([value]) => updateSetting('rotationSpeed', value)}
                min={0}
                max={2}
                step={0.1}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <Alert className="fixed bottom-4 left-4 max-w-md bg-black/30 backdrop-blur-md">
        <AlertDescription>
          Move your mouse to interact. Use controls to customize the visualization.
        </AlertDescription>
      </Alert>
    </VisualizationContainer>
  );
};

// Helper function with proper typing
function drawPattern(
  ctx: CanvasRenderingContext2D,
  { x, y, size, rotation, index }: PatternParams
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);

  const hue = (index * 60 + rotation * 30) % 360;
  ctx.strokeStyle = `hsla(${hue}, 70%, 60%, 0.8)`;
  ctx.lineWidth = 2;

  ctx.beginPath();
  const points = 6;
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
  ctx.stroke();

  ctx.restore();
}

export default Resonance;
