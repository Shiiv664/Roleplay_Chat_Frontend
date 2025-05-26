import React, { useState, useEffect } from 'react';
import type { FormattingSettings, FormattingRule } from '../../types';
import { createDefaultFormattingSettings } from '../../utils/textFormatter';
import './FormattingConfigModal.css';

interface FormattingConfigModalProps {
  isOpen: boolean;
  currentSettings?: FormattingSettings | null;
  onSave: (settings: FormattingSettings) => void;
  onClose: () => void;
}

const FormattingConfigModal: React.FC<FormattingConfigModalProps> = ({
  isOpen,
  currentSettings,
  onSave,
  onClose
}) => {
  const [settings, setSettings] = useState<FormattingSettings>(() => 
    currentSettings || createDefaultFormattingSettings()
  );

  useEffect(() => {
    if (currentSettings) {
      setSettings(currentSettings);
    } else {
      setSettings(createDefaultFormattingSettings());
    }
  }, [currentSettings, isOpen]);

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  const handleEnabledChange = (enabled: boolean) => {
    setSettings(prev => ({ ...prev, enabled }));
  };

  const updateRule = (index: number, updates: Partial<FormattingRule>) => {
    setSettings(prev => ({
      ...prev,
      rules: prev.rules.map((rule, i) => 
        i === index ? { ...rule, ...updates } : rule
      )
    }));
  };

  const addRule = () => {
    const newRule: FormattingRule = {
      id: `rule_${Date.now()}`,
      delimiter: '|',
      name: 'New Rule',
      styles: { color: '#000000' },
      enabled: true
    };
    setSettings(prev => ({
      ...prev,  
      rules: [...prev.rules, newRule]
    }));
  };

  const deleteRule = (index: number) => {
    setSettings(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Configure Text Formatting</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="master-toggle">
            <label>
              <input
                type="checkbox"
                checked={settings.enabled}
                onChange={(e) => handleEnabledChange(e.target.checked)}
              />
              Enable text formatting for this chat
            </label>
          </div>

          {settings.enabled && (
            <div className="rules-section">
              <h3>Formatting Rules</h3>
              
              {settings.rules.map((rule, index) => (
                <div key={rule.id} className="rule-card">
                  <div className="rule-header">
                    <input
                      type="text"
                      value={rule.name}
                      onChange={(e) => updateRule(index, { name: e.target.value })}
                      className="rule-name-input"
                    />
                    <label>
                      <input
                        type="checkbox"
                        checked={rule.enabled}
                        onChange={(e) => updateRule(index, { enabled: e.target.checked })}
                      />
                      Enabled
                    </label>
                    <button 
                      onClick={() => deleteRule(index)}
                      className="delete-rule-btn"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="rule-config">
                    <div className="config-row">
                      <label>
                        Delimiter:
                        <input
                          type="text"
                          value={rule.delimiter}
                          maxLength={3}
                          onChange={(e) => updateRule(index, { delimiter: e.target.value })}
                          className="delimiter-input"
                        />
                      </label>
                      
                      <label>
                        Color:
                        <input
                          type="color"
                          value={rule.styles.color || '#000000'}
                          onChange={(e) => updateRule(index, { 
                            styles: { ...rule.styles, color: e.target.value }
                          })}
                        />
                      </label>
                    </div>
                    
                    <div className="config-row">
                      <label>
                        Font Weight:
                        <select
                          value={rule.styles.fontWeight || 'normal'}
                          onChange={(e) => updateRule(index, {
                            styles: { ...rule.styles, fontWeight: e.target.value as 'normal' | 'bold' }
                          })}
                        >
                          <option value="normal">Normal</option>
                          <option value="bold">Bold</option>
                        </select>
                      </label>
                      
                      <label>
                        Font Style:
                        <select
                          value={rule.styles.fontStyle || 'normal'}
                          onChange={(e) => updateRule(index, {
                            styles: { ...rule.styles, fontStyle: e.target.value as 'normal' | 'italic' }
                          })}
                        >
                          <option value="normal">Normal</option>
                          <option value="italic">Italic</option>
                        </select>
                      </label>
                    </div>
                  </div>
                </div>
              ))}

              <button onClick={addRule} className="add-rule-btn">
                Add New Rule
              </button>
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <button onClick={onClose} className="cancel-btn">Cancel</button>
          <button onClick={handleSave} className="save-btn">Save</button>
        </div>
      </div>
    </div>
  );
};

export default FormattingConfigModal;
