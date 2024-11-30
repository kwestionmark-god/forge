import React, { useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

// This component handles a group of related settings
const SettingGroup = ({ title, children }) => (
  <div className="mb-6 last:mb-0">
    {title && (
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        {title}
      </h4>
    )}
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

// Handles numeric settings with a slider and precise input
const NumberSetting = ({ 
  label, 
  value, 
  onChange, 
  min = 0, 
  max = 1, 
  step = 0.1,
  showInput = true 
}) => {
  // Allow for precise numeric input alongside the slider
  const handleInputChange = useCallback((e) => {
    const newValue = Number(e.target.value);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  }, [min, max, onChange]);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm text-gray-600 dark:text-gray-400">
          {label}
        </label>
        {showInput && (
          <input
            type="number"
            value={value}
            onChange={handleInputChange}
            min={min}
            max={max}
            step={step}
            className="w-20 px-2 py-1 text-sm text-right rounded border border-gray-300 dark:border-gray-600"
          />
        )}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="range"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          className="flex-1"
        />
        <span className="text-sm text-gray-500 dark:text-gray-400 w-12 text-right">
          {value.toFixed(step >= 1 ? 0 : 2)}
        </span>
      </div>
    </div>
  );
};

// Handles boolean settings with a toggle switch
const BooleanSetting = ({ label, value, onChange }) => (
  <div className="flex items-center justify-between">
    <label className="text-sm text-gray-600 dark:text-gray-400">
      {label}
    </label>
    <Switch
      checked={value}
      onCheckedChange={onChange}
      className="data-[state=checked]:bg-blue-500"
    />
  </div>
);

// Handles selection from predefined options
const SelectSetting = ({ label, value, options, onChange }) => (
  <div className="space-y-2">
    <label className="text-sm text-gray-600 dark:text-gray-400">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-2 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

// The main settings panel component
export const SettingsPanel = ({ 
  show, 
  settings = {}, 
  onUpdate,
  groups = [],  // Optional grouping configuration
  className = '' 
}) => {
  if (!show) return null;

  // Helper to render the appropriate setting control
  const renderSetting = (key, value, config = {}) => {
    const { type = 'number', ...props } = config;
    
    switch (type) {
      case 'boolean':
        return (
          <BooleanSetting
            key={key}
            label={props.label || key}
            value={value}
            onChange={(newValue) => onUpdate(key, newValue)}
          />
        );
      case 'select':
        return (
          <SelectSetting
            key={key}
            label={props.label || key}
            value={value}
            options={props.options || []}
            onChange={(newValue) => onUpdate(key, newValue)}
          />
        );
      default:
        return (
          <NumberSetting
            key={key}
            label={props.label || key}
            value={value}
            onChange={(newValue) => onUpdate(key, newValue)}
            min={props.min}
            max={props.max}
            step={props.step}
          />
        );
    }
  };

  // If groups are provided, organize settings by groups
  if (groups.length > 0) {
    return (
      <Card className={`fixed top-0 right-0 h-screen w-80 overflow-y-auto ${className}`}>
        <CardContent className="p-6">
          {groups.map(group => (
            <SettingGroup key={group.id} title={group.title}>
              {Object.entries(settings)
                .filter(([key]) => group.settings.includes(key))
                .map(([key, value]) => renderSetting(key, value, group.config?.[key]))}
            </SettingGroup>
          ))}
        </CardContent>
      </Card>
    );
  }

  // Default ungrouped layout
  return (
    <Card className={`fixed top-0 right-0 h-screen w-80 overflow-y-auto ${className}`}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {Object.entries(settings).map(([key, value]) => renderSetting(key, value))}
        </div>
      </CardContent>
    </Card>
  );
};
