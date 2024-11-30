import { useState, useCallback } from 'react';

/**
 * Hook to manage visualization state and settings
 * @param {Object} initialSettings - Initial visualization settings
 * @returns {Object} State and update methods
 */
export const useVisualizationState = (initialSettings = {}) => {
  // Core visualization state
  const [state, setState] = useState({
    isPlaying: true,
    isDarkMode: true,
    isMuted: true,
    showControls: false,
    settings: initialSettings
  });

  // Update a single setting
  const updateSetting = useCallback((key, value) => {
    setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [key]: value
      }
    }));
  }, []);

  // Update multiple settings at once
  const updateSettings = useCallback((updates) => {
    setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...updates
      }
    }));
  }, []);

  // Toggle boolean state values
  const toggleState = useCallback((key) => {
    setState(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  }, []);

  // Reset all settings to initial values
  const resetSettings = useCallback(() => {
    setState(prev => ({
      ...prev,
      settings: initialSettings
    }));
  }, [initialSettings]);

  return {
    state,
    updateSetting,
    updateSettings,
    toggleState,
    resetSettings
  };
};