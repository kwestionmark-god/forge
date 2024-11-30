import { useState, useCallback } from 'react';
import { colorUtils } from '../../../utils/visualizationUtils';

/**
 * Hook to manage color schemes for visualizations
 * @param {string} initialScheme - Initial color scheme name
 * @returns {Object} Color scheme controls and utilities
 */
export const useColorScheme = (initialScheme = 'chakra') => {
  const [scheme, setScheme] = useState(initialScheme);
  const [customColors, setCustomColors] = useState([]);

  // Get color based on current scheme
  const getColor = useCallback((index, alpha = 1) => {
    switch (scheme) {
      case 'chakra':
        return colorUtils.getChakraColor(index, alpha);
      case 'custom':
        return customColors[index % customColors.length] || colorUtils.getChakraColor(index, alpha);
      default:
        return colorUtils.getChakraColor(index, alpha);
    }
  }, [scheme, customColors]);

  return {
    scheme,
    setScheme,
    getColor,
    setCustomColors,
    customColors
  };
};