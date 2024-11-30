import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import HypnoticIllusion from './components/HypnoticIllusion';
import { MerkabaMeditation } from './components/Merkabah';
import TitleScreen from './components/TitleScreen';
import ExperimentalPage from './experimental/pages/ExperimentalPage';
import ExperimentalHypnotic from './experimental/components/visualizations/HypnoticIllusion';
import ExperimentalMerkabah from './experimental/components/visualizations/Merkabah';
import './App.css';,
import { Routes, Route } from 'react-router-dom';
import ResonanceVisualization from './experimental/visualizations/Resonance';

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <button 
      onClick={() => navigate(-1)} 
      className="back-button"
    >
      Back
    </button>
  );
};

const VisualizationLayout = ({ children }) => (
  <>
    <BackButton />
    {children}
  </>
);

const App = () => (
  <Routes>
    {/* Original Routes */}
    <Route path="/" element={<TitleScreen />} />
    <Route 
      path="/hypnotic" 
      element={
        <VisualizationLayout>
          <HypnoticIllusion />
        </VisualizationLayout>
      } 
    />
    <Route 
      path="/merkabah" 
      element={
        <VisualizationLayout>
          <MerkabaMeditation />
        </VisualizationLayout>
        <Route path="/experimental/resonance" element={<ResonanceVisualization />} />
      } 
    />

    {/* Experimental Routes */}
    <Route path="/experimental" element={<ExperimentalPage />} />
    <Route 
      path="/experimental/hypnotic" 
      element={
        <VisualizationLayout>
          <ExperimentalHypnotic />
        </VisualizationLayout>
      } 
    />
    <Route 
      path="/experimental/merkabah" 
      element={
        <VisualizationLayout>
          <ExperimentalMerkabah />
        </VisualizationLayout>
      } 
    />
  </Routes>
);

export default App;