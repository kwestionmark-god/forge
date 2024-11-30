// src/components/MerkabaMeditation.jsx
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import YouTubeAudioPlayer from './YouTubeAudioPlayer'; // Ensure the correct path
import './MerkabaMeditation.css'; // Import the CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faPlay, faPause, faTimes } from '@fortawesome/free-solid-svg-icons';

const MerkabaMeditation = () => {
  const containerRef = useRef();
  const animationFrameRef = useRef();

  // State for settings with improved initial values
  const [settings, setSettings] = useState({
    rotationSpeed: 0.005,
    backgroundColor: '#1a1a1a', // Dark gray background
    wireframe: true,
    solidPolygonOpacity: 0.8, // More opaque
    solidPolygonColor: '#00aaff', // Soothing blue
    wireframeColor: '#ffffff', // White wireframes
    wireframeOpacity: 0.5, // Added opacity control
    sphereColor: '#ffdd00', // Warm yellow spheres
    metalness: 0.2, // Reduced metalness for better ambient light response
    roughness: 0.8, // Increased roughness
    ambientLightIntensity: 0.6, // Slightly higher
    ambientLightColor: '#ffffff', // White ambient light
    directionalLightIntensity: 0.5, // Reduced intensity
    directionalLightColor: '#ffffff', // White directional light
  });

  const [isPlaying, setIsPlaying] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  // References to Three.js objects for updates
  const sceneRef = useRef();
  const cameraRef = useRef();
  const rendererRef = useRef();
  const solidGroupRef = useRef();
  const wireframeGroupRef = useRef();
  const sphereGroupRef = useRef();
  const controlsRef = useRef();
  const ambientLightRef = useRef();
  const directionalLightRef = useRef();

  // Mutable refs to hold latest settings and isPlaying state
  const settingsRef = useRef(settings);
  const isPlayingRef = useRef(isPlaying);

  // Reference to the YouTubeAudioPlayer component
  const audioPlayerRef = useRef();

  // Update refs whenever settings or isPlaying changes
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Initialization useEffect: runs once on mount
  useEffect(() => {
    const currentContainer = containerRef.current;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(settings.backgroundColor);
    sceneRef.current = scene;

    // Camera
    const width = currentContainer.clientWidth;
    const height = currentContainer.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 200); // Fixed position for better visibility
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    currentContainer.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controlsRef.current = controls;

    // Lights
    const ambientLight = new THREE.AmbientLight(settings.ambientLightColor, settings.ambientLightIntensity);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const directionalLight = new THREE.DirectionalLight(
      settings.directionalLightColor,
      settings.directionalLightIntensity
    );
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);
    directionalLightRef.current = directionalLight;

    // Optional Point Light for additional illumination
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Create Groups
    const solidGroup = new THREE.Group();
    solidGroupRef.current = solidGroup;
    scene.add(solidGroup);

    const wireframeGroup = new THREE.Group();
    wireframeGroupRef.current = wireframeGroup;
    scene.add(wireframeGroup);

    const sphereGroup = new THREE.Group();
    sphereGroupRef.current = sphereGroup;
    scene.add(sphereGroup);

    // Base Geometry and Materials
    const baseSize = 1;
    const geometry = new THREE.TetrahedronGeometry(baseSize);

    // Solid Material with opacity controlled
    const solidMaterial = new THREE.MeshStandardMaterial({
      color: settings.solidPolygonColor,
      metalness: settings.metalness,
      roughness: settings.roughness,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: settings.solidPolygonOpacity,
    });

    // Wireframe Material with increased opacity
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: settings.wireframeColor,
      wireframe: true,
      transparent: true,
      opacity: settings.wireframe ? settings.wireframeOpacity : 0, // Updated opacity
    });

    // Function to create wireframes using standard MeshBasicMaterial
    const createWireframe = (geometry, material) => {
      const wireframe = new THREE.Mesh(geometry, material);
      return wireframe;
    };

    // First Tetrahedron (Pointing Up)
    const tetrahedronUp = createWireframe(geometry, wireframeMaterial);
    tetrahedronUp.rotation.x = Math.PI; // Corrected rotation
    tetrahedronUp.scale.setScalar(50); // Scaled up for visibility
    tetrahedronUp.position.y = 0;
    wireframeGroup.add(tetrahedronUp);

    // Second Tetrahedron (Pointing Down)
    const tetrahedronDown = createWireframe(geometry, wireframeMaterial);
    tetrahedronDown.rotation.x = -Math.PI / 2; // Corrected rotation
    tetrahedronDown.rotation.y = Math.PI;
    tetrahedronDown.scale.setScalar(50); // Scaled up for visibility
    tetrahedronDown.position.y = 0;
    wireframeGroup.add(tetrahedronDown);

    // Add Solid Polygons
    const solidTetrahedronUp = new THREE.Mesh(geometry, solidMaterial);
    solidTetrahedronUp.rotation.x = Math.PI; // Corrected rotation
    solidTetrahedronUp.scale.setScalar(50);
    solidTetrahedronUp.position.y = 0;
    solidGroup.add(solidTetrahedronUp);

    const solidTetrahedronDown = new THREE.Mesh(geometry, solidMaterial);
    solidTetrahedronDown.rotation.x = -Math.PI / 2; // Corrected rotation
    solidTetrahedronDown.rotation.y = Math.PI;
    solidTetrahedronDown.scale.setScalar(50);
    solidTetrahedronDown.position.y = 0;
    solidGroup.add(solidTetrahedronDown);

    // Add Spheres at Vertices
    const vertexGeometry = new THREE.SphereGeometry(4, 16, 16);
    const vertexMaterial = new THREE.MeshStandardMaterial({
      color: settings.sphereColor,
      metalness: 0.5,
      roughness: 0.2,
    });

    const vertices = [
      new THREE.Vector3(1, 1, 1),
      new THREE.Vector3(-1, -1, 1),
      new THREE.Vector3(-1, 1, -1),
      new THREE.Vector3(1, -1, -1),
    ];

    vertices.forEach(vertex => {
      const vertexSphereUp = new THREE.Mesh(vertexGeometry, vertexMaterial);
      vertexSphereUp.position.copy(vertex).multiplyScalar(50); // Adjusted scaling for visibility
      sphereGroup.add(vertexSphereUp);

      const vertexSphereDown = new THREE.Mesh(vertexGeometry, vertexMaterial);
      vertexSphereDown.position.copy(vertex).multiplyScalar(-50);
      sphereGroup.add(vertexSphereDown);
    });

    // Initial Orientation
    const initialRotationX = Math.PI / 6; // 30 degrees
    const initialRotationY = Math.PI / 4; // 45 degrees
    solidGroup.rotation.x = initialRotationX;
    solidGroup.rotation.y = initialRotationY;
    wireframeGroup.rotation.x = initialRotationX;
    wireframeGroup.rotation.y = initialRotationY;
    sphereGroup.rotation.x = initialRotationX;
    sphereGroup.rotation.y = initialRotationY;

    // Handle Window Resize
    const onWindowResize = () => {
      const width = currentContainer.clientWidth;
      const height = currentContainer.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onWindowResize, false);

    // Animation Loop
    const animate = () => {
      if (isPlayingRef.current) {
        solidGroup.rotation.x += settingsRef.current.rotationSpeed;
        solidGroup.rotation.y += settingsRef.current.rotationSpeed;
        wireframeGroup.rotation.x += settingsRef.current.rotationSpeed;
        wireframeGroup.rotation.y += settingsRef.current.rotationSpeed;
        sphereGroup.rotation.x += settingsRef.current.rotationSpeed;
        sphereGroup.rotation.y += settingsRef.current.rotationSpeed;
      }

      controls.update();
      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    // Cleanup on Unmount
    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', onWindowResize);
      controls.dispose();
      renderer.dispose();
      scene.clear();

      // Remove renderer DOM element
      if (currentContainer && renderer.domElement.parentNode === currentContainer) {
        currentContainer.removeChild(renderer.domElement);
      }
    };
  }, []); // Runs once on mount

  // Settings Update useEffect: runs whenever settings change
  // Separated into multiple useEffect hooks for better dependency management

  // Update Wireframe Color and Opacity
  useEffect(() => {
    const wireframeGroup = wireframeGroupRef.current;
    if (!wireframeGroup) return;

    wireframeGroup.children.forEach(child => {
      if (
        child instanceof THREE.Mesh &&
        child.material instanceof THREE.MeshBasicMaterial &&
        child.material.wireframe
      ) {
        child.material.color.set(settings.wireframeColor);
        child.material.opacity = settings.wireframe ? settings.wireframeOpacity : 0;
        child.material.needsUpdate = true;
        console.log(`Wireframe color set to: ${child.material.color.getStyle()}, opacity: ${child.material.opacity}`);
      }
    });
  }, [settings.wireframeColor, settings.wireframe, settings.wireframeOpacity]);

  // Update Solid Polygon Color, Opacity, Metalness, and Roughness
  useEffect(() => {
    const solidGroup = solidGroupRef.current;
    if (!solidGroup) return;

    solidGroup.children.forEach(child => {
      if (
        child instanceof THREE.Mesh &&
        child.material instanceof THREE.MeshStandardMaterial &&
        !child.material.wireframe
      ) {
        child.material.color.set(settings.solidPolygonColor);
        child.material.opacity = settings.solidPolygonOpacity;
        child.material.metalness = settings.metalness;
        child.material.roughness = settings.roughness;
        child.material.needsUpdate = true;
      }
    });
  }, [settings.solidPolygonColor, settings.solidPolygonOpacity, settings.metalness, settings.roughness]);

  // Update Sphere Color
  useEffect(() => {
    const sphereGroup = sphereGroupRef.current;
    if (!sphereGroup) return;

    sphereGroup.children.forEach(child => {
      if (child instanceof THREE.Mesh && child.geometry.type === 'SphereGeometry') {
        child.material.color.set(settings.sphereColor);
        child.material.needsUpdate = true;
      }
    });
  }, [settings.sphereColor]);

  // Update Ambient Light Color and Intensity
  useEffect(() => {
    const ambientLight = ambientLightRef.current;
    if (!ambientLight) return;

    ambientLight.color.set(settings.ambientLightColor);
    ambientLight.intensity = settings.ambientLightIntensity;
    ambientLight.needsUpdate = true;

    console.log('Ambient Light Color:', settings.ambientLightColor);
    console.log('Ambient Light Intensity:', settings.ambientLightIntensity);
  }, [settings.ambientLightColor, settings.ambientLightIntensity]);

  // Update Directional Light Intensity and Color
  useEffect(() => {
    const directionalLight = directionalLightRef.current;
    if (!directionalLight) return;

    directionalLight.intensity = settings.directionalLightIntensity;
    directionalLight.color.set(settings.directionalLightColor);
    directionalLight.needsUpdate = true;

    console.log('Directional Light Intensity:', settings.directionalLightIntensity);
    console.log('Directional Light Color:', settings.directionalLightColor);
  }, [settings.directionalLightIntensity, settings.directionalLightColor]);

  // Update Background Color and Camera Position
  useEffect(() => {
    const scene = sceneRef.current;
    const camera = cameraRef.current;

    if (!scene || !camera) return;

    // Update Background Color
    scene.background.set(settings.backgroundColor);

    // Update Camera Position (fixed at 200 units away)
    camera.position.set(0, 0, 200);
  }, [settings.backgroundColor]);

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
          : ['rotationSpeed', 'solidPolygonOpacity', 'metalness', 'roughness', 'ambientLightIntensity', 'directionalLightIntensity', 'wireframeOpacity'].includes(name)
          ? parseFloat(value)
          : value,
    }));

    if (name === 'wireframeColor') {
      console.log(`Wireframe Color changed to: ${value}`);
    }
    if (name === 'wireframeOpacity') {
      console.log(`Wireframe Opacity changed to: ${value}`);
    }
  };

  // Toggle Functions
  const toggleAudioPlayback = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.togglePlay();
      setIsPlaying(!isPlaying);
    }
  };

  const toggleSettings = () => setShowSettings(prev => !prev);

  return (
    <div className="meditation-container">
      {/* Three.js Container */}
      <div
        ref={containerRef}
        className="three-container"
      />

      {/* Control Buttons */}
      <div className="control-buttons">
        {/* Play/Pause Button */}
        <button
          onClick={toggleAudioPlayback}
          className="control-button"
          aria-label={isPlaying ? 'Pause Audio' : 'Play Audio'}
        >
          <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} /> {isPlaying ? 'Pause' : 'Play'}
        </button>
        
        {/* Settings Button */}
        <button
          onClick={toggleSettings}
          className="control-button"
          aria-label="Toggle Settings"
        >
          <FontAwesomeIcon icon={faCog} /> Settings
        </button>
      </div>
      
      {/* Floating Audio Controls */}
      <div className="floating-audio-controls">
        <button
          onClick={toggleAudioPlayback}
          className="audio-control-button"
          aria-label={isPlaying ? 'Pause Audio' : 'Play Audio'}
        >
          <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
        </button>
      </div>
      
      {/* YouTube Audio Player: Always Mounted */}
      <YouTubeAudioPlayer ref={audioPlayerRef} videoId="He462jFzrAM" />

      {/* Settings Panel */}
      <div className={`settings-panel ${showSettings ? 'open' : ''}`}>
        {/* Close Button */}
        <button
          onClick={toggleSettings}
          className="close-button"
          aria-label="Close Settings"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        {/* Rotation Speed Slider */}
        <div className="control-group">
          <label htmlFor="rotationSpeed">Rotation Speed:</label>
          <input
            type="range"
            name="rotationSpeed"
            id="rotationSpeed"
            min="0"
            max="0.1"
            step="0.001"
            value={settings.rotationSpeed}
            onChange={handleInputChange}
            aria-label="Rotation Speed"
          />
          <span>{settings.rotationSpeed.toFixed(3)}</span>
        </div>
        
        {/* Solid Polygon Opacity Slider */}
        <div className="control-group">
          <label htmlFor="solidPolygonOpacity">Solid Polygon Opacity:</label>
          <input
            type="range"
            name="solidPolygonOpacity"
            id="solidPolygonOpacity"
            min="0"
            max="1"
            step="0.05"
            value={settings.solidPolygonOpacity}
            onChange={handleInputChange}
            aria-label="Solid Polygon Opacity"
          />
          <span>{settings.solidPolygonOpacity.toFixed(2)}</span>
        </div>
        
        {/* Metalness Slider */}
        <div className="control-group">
          <label htmlFor="metalness">Metalness:</label>
          <input
            type="range"
            name="metalness"
            id="metalness"
            min="0"
            max="1"
            step="0.01"
            value={settings.metalness}
            onChange={handleInputChange}
            aria-label="Metalness"
          />
          <span>{settings.metalness.toFixed(2)}</span>
        </div>
        
        {/* Roughness Slider */}
        <div className="control-group">
          <label htmlFor="roughness">Roughness:</label>
          <input
            type="range"
            name="roughness"
            id="roughness"
            min="0"
            max="1"
            step="0.01"
            value={settings.roughness}
            onChange={handleInputChange}
            aria-label="Roughness"
          />
          <span>{settings.roughness.toFixed(2)}</span>
        </div>
        
        {/* Wireframe Color Picker */}
        <div className="control-group">
          <label htmlFor="wireframeColor">Wireframe Color:</label>
          <input
            type="color"
            name="wireframeColor"
            id="wireframeColor"
            value={settings.wireframeColor}
            onChange={handleInputChange}
            aria-label="Wireframe Color"
          />
        </div>
        
        {/* Wireframe Opacity Slider */}
        <div className="control-group">
          <label htmlFor="wireframeOpacity">Wireframe Opacity:</label>
          <input
            type="range"
            name="wireframeOpacity"
            id="wireframeOpacity"
            min="0"
            max="1"
            step="0.05"
            value={settings.wireframeOpacity}
            onChange={handleInputChange}
            aria-label="Wireframe Opacity"
          />
          <span>{settings.wireframeOpacity.toFixed(2)}</span>
        </div>
        
        {/* Solid Polygon Color Picker */}
        <div className="control-group">
          <label htmlFor="solidPolygonColor">Solid Polygon Color:</label>
          <input
            type="color"
            name="solidPolygonColor"
            id="solidPolygonColor"
            value={settings.solidPolygonColor}
            onChange={handleInputChange}
            aria-label="Solid Polygon Color"
          />
        </div>
        
        {/* Sphere Color Picker */}
        <div className="control-group">
          <label htmlFor="sphereColor">Sphere Color:</label>
          <input
            type="color"
            name="sphereColor"
            id="sphereColor"
            value={settings.sphereColor}
            onChange={handleInputChange}
            aria-label="Sphere Color"
          />
        </div>
        
        {/* Background Color Picker */}
        <div className="control-group">
          <label htmlFor="backgroundColor">Background Color:</label>
          <input
            type="color"
            name="backgroundColor"
            id="backgroundColor"
            value={settings.backgroundColor}
            onChange={handleInputChange}
            aria-label="Background Color"
          />
        </div>
        
        {/* Ambient Light Color Picker */}
        <div className="control-group">
          <label htmlFor="ambientLightColor">Ambient Light Color:</label>
          <input
            type="color"
            name="ambientLightColor"
            id="ambientLightColor"
            value={settings.ambientLightColor}
            onChange={handleInputChange}
            aria-label="Ambient Light Color"
          />
        </div>
        
        {/* Ambient Light Intensity Slider */}
        <div className="control-group">
          <label htmlFor="ambientLightIntensity">Ambient Light Intensity:</label>
          <input
            type="range"
            name="ambientLightIntensity"
            id="ambientLightIntensity"
            min="0"
            max="1"
            step="0.05"
            value={settings.ambientLightIntensity}
            onChange={handleInputChange}
            aria-label="Ambient Light Intensity"
          />
          <span>{settings.ambientLightIntensity.toFixed(2)}</span>
        </div>
        
        {/* Directional Light Intensity Slider */}
        <div className="control-group">
          <label htmlFor="directionalLightIntensity">Directional Light Intensity:</label>
          <input
            type="range"
            name="directionalLightIntensity"
            id="directionalLightIntensity"
            min="0"
            max="2"
            step="0.05"
            value={settings.directionalLightIntensity}
            onChange={handleInputChange}
            aria-label="Directional Light Intensity"
          />
          <span>{settings.directionalLightIntensity.toFixed(2)}</span>
        </div>
        
        {/* Directional Light Color Picker */}
        <div className="control-group">
          <label htmlFor="directionalLightColor">Directional Light Color:</label>
          <input
            type="color"
            name="directionalLightColor"
            id="directionalLightColor"
            value={settings.directionalLightColor}
            onChange={handleInputChange}
            aria-label="Directional Light Color"
          />
        </div>
      </div>
    </div>
  );
};

export { MerkabaMeditation };
