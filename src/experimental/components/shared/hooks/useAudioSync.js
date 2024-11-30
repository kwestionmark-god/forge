// src/experimental/components/shared/hooks/useAudioSync.js
/**
 * Hook to synchronize visualizations with audio
 * Provides beat detection and frequency analysis
 */
export const useAudioSync = (options = {}) => {
    const {
      fftSize = 2048,
      smoothingTimeConstant = 0.8,
      minDecibels = -100,
      maxDecibels = -30,
    } = options;
  
    const [isInitialized, setIsInitialized] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const sourceRef = useRef(null);
  
    // Initialize audio context and analyzer
    const initialize = useCallback(async () => {
      try {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = fftSize;
        analyserRef.current.smoothingTimeConstant = smoothingTimeConstant;
        analyserRef.current.minDecibels = minDecibels;
        analyserRef.current.maxDecibels = maxDecibels;
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize audio context:', error);
      }
    }, [fftSize, smoothingTimeConstant, minDecibels, maxDecibels]);
  
    // Connect an audio element to the analyzer
    const connectAudio = useCallback((audioElement) => {
      if (!isInitialized) {
        initialize();
      }
  
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }
  
      sourceRef.current = audioContextRef.current.createMediaElementSource(audioElement);
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
    }, [isInitialized, initialize]);
  
    // Get current frequency data
    const getFrequencyData = useCallback(() => {
      if (!analyserRef.current) return new Uint8Array();
      
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      return dataArray;
    }, []);
  
    // Get current waveform data
    const getWaveformData = useCallback(() => {
      if (!analyserRef.current) return new Uint8Array();
      
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteTimeDomainData(dataArray);
      return dataArray;
    }, []);
  
    // Detect beats in the audio
    const detectBeat = useCallback((threshold = 0.15) => {
      const frequencyData = getFrequencyData();
      const average = frequencyData.reduce((sum, value) => sum + value, 0) / frequencyData.length;
      return average > threshold * 255;
    }, [getFrequencyData]);
  
    return {
      isInitialized,
      isPlaying,
      setIsPlaying,
      initialize,
      connectAudio,
      getFrequencyData,
      getWaveformData,
      detectBeat
    };
  };