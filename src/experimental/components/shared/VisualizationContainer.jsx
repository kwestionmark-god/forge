// src/experimental/components/shared/VisualizationContainer.jsx

import React from 'react';
import {
  Sliders,
  PlayCircle,
  PauseCircle,
  Sun,
  Moon,
  Volume2,
  VolumeX,
} from 'lucide-react';

// ControlButton component - Extracted for reusability
const ControlButton = ({ icon: Icon, label, onClick, className = '' }) => {
  // Using Tailwind's dark mode utilities for better theme support
  return (
    <button
      onClick={onClick}
      className={`
        p-2 rounded-full transition-all duration-200
        bg-gray-800/50 hover:bg-gray-700/60
        dark:bg-gray-100/10 dark:hover:bg-gray-100/20
        ${className}
      `}
      aria-label={label}
    >
      <Icon className="w-6 h-6 text-white" />
    </button>
  );
};

// Main container component that handles layout and controls
export const VisualizationContainer = ({
  children,
  controls: {
    isPlaying,
    onPlayToggle,
    isDarkMode,
    onDarkModeToggle,
    isMuted,
    onMuteToggle,
    showControls,
    onControlsToggle,
  },
  className = '',
}) => {
  // We'll use React's context later for theme management
  return (
    <div className={`relative w-full h-screen ${className}`}>
      {/* Main content area */}
      <div className="w-full h-full">
        {children}
      </div>

      {/* Control panel overlay */}
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        <ControlButton
          icon={isPlaying ? PauseCircle : PlayCircle}
          label={isPlaying ? 'Pause Visualization' : 'Play Visualization'}
          onClick={onPlayToggle}
        />
        
        <ControlButton
          icon={isDarkMode ? Sun : Moon}
          label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          onClick={onDarkModeToggle}
        />
        
        <ControlButton
          icon={isMuted ? VolumeX : Volume2}
          label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          onClick={onMuteToggle}
        />
        
        <ControlButton
          icon={Sliders}
          label={showControls ? 'Hide Settings' : 'Show Settings'}
          onClick={onControlsToggle}
          className={showControls ? 'bg-blue-500/50 hover:bg-blue-600/60' : ''}
        />
      </div>
    </div>
  );
};