import React from 'react';
import { useNavigate } from 'react-router-dom';

const ExperimentalPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Experimental Visualizations</h1>
          <p className="text-gray-400">Testing new React patterns and components</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Visualization Cards */}
          <VisualizationCard
            title="Hypnotic Illusion (New)"
            description="Enhanced version with improved React patterns"
            onClick={() => navigate('/experimental/hypnotic')}
          />
          <VisualizationCard
            title="Merkabah (New)"
            description="Modernized sacred geometry visualization"
            onClick={() => navigate('/experimental/merkabah')}
          />
          <VisualizationCard
            title="Original Version"
            description="Return to the original implementation"
            onClick={() => navigate('/')}
            variant="secondary"
          />
        </div>
      </div>
    </div>
  );
};

const VisualizationCard = ({ title, description, onClick, variant = 'primary' }) => (
  <button
    onClick={onClick}
    className={`
      p-6 rounded-lg text-left transition-all
      ${variant === 'primary' 
        ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700' 
        : 'bg-blue-900 hover:bg-blue-800 border border-blue-700'
      }
    `}
  >
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </button>
);

export default ExperimentalPage;