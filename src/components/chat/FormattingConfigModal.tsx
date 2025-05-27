import React, { useState, useEffect } from 'react';
import type { FormattingSettings, FormattingRule } from '../../types';
import { createDefaultFormattingSettings } from '../../utils/textFormatter';
import FormattedText from '../common/FormattedText';
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
  const [settings, setSettings] = useState<FormattingSettings>(() => {
    if (currentSettings && currentSettings.rules) {
      return currentSettings;
    }
    return createDefaultFormattingSettings();
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    if (currentSettings && currentSettings.rules) {
      setSettings(currentSettings);
    } else {
      setSettings(createDefaultFormattingSettings());
    }
    setValidationErrors([]);
  }, [currentSettings, isOpen]);

  const validateSettings = (settingsToValidate: FormattingSettings): string[] => {
    const errors: string[] = [];
    const delimiters = new Set<string>();
    
    settingsToValidate.rules.forEach((rule, index) => {
      // Check for empty delimiter
      if (!rule.delimiter.trim()) {
        errors.push(`Rule "${rule.name}" has an empty delimiter`);
      }
      
      // Check for duplicate delimiters
      if (delimiters.has(rule.delimiter)) {
        errors.push(`Delimiter "${rule.delimiter}" is used by multiple rules`);
      }
      delimiters.add(rule.delimiter);
      
      // Check for empty rule name
      if (!rule.name.trim()) {
        errors.push(`Rule #${index + 1} has an empty name`);
      }
      
      // Validate color values
      if (rule.styles.color && !/^#[0-9A-Fa-f]{6}$/.test(rule.styles.color)) {
        errors.push(`Rule "${rule.name}" has an invalid color value`);
      }
      
      if (rule.styles.backgroundColor && !/^#[0-9A-Fa-f]{6}$/.test(rule.styles.backgroundColor)) {
        errors.push(`Rule "${rule.name}" has an invalid background color value`);
      }
    });
    
    return errors;
  };

  const handleSave = () => {
    const errors = validateSettings(settings);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    setValidationErrors([]);
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
    // Clear validation errors when user makes changes
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
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
          {validationErrors.length > 0 && (
            <div className="validation-errors">
              <h4>Please fix the following errors:</h4>
              <ul>
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

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
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
                Each rule applies formatting to text surrounded by its delimiter. Delimiters must be unique.
              </p>
              
              {settings.rules && settings.rules.map((rule, index) => (
                <div key={rule.id} className="rule-card">
                  <div className="rule-header">
                    <input
                      type="text"
                      value={rule.name}
                      onChange={(e) => updateRule(index, { name: e.target.value })}
                      className="rule-name-input"
                      placeholder="Rule name"
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
                      title="Delete this rule"
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
                          placeholder="e.g. *, &quot;, ~"
                        />
                      </label>
                    </div>

                    <div className="config-row">
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

                      <label>
                        Background Color:
                        <div className="color-input-group">
                          <input
                            type="color"
                            value={rule.styles.backgroundColor || '#ffffff'}
                            onChange={(e) => updateRule(index, { 
                              styles: { ...rule.styles, backgroundColor: e.target.value }
                            })}
                            disabled={!rule.styles.backgroundColor}
                          />
                          {rule.styles.backgroundColor ? (
                            <button
                              type="button"
                              onClick={() => updateRule(index, {
                                styles: { ...rule.styles, backgroundColor: undefined }
                              })}
                            >
                              Clear
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => updateRule(index, {
                                styles: { ...rule.styles, backgroundColor: '#ffffff' }
                              })}
                            >
                              Set
                            </button>
                          )}
                        </div>
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

                    <div className="config-row">
                      <label>
                        Text Decoration:
                        <select
                          value={rule.styles.textDecoration || 'none'}
                          onChange={(e) => updateRule(index, {
                            styles: { ...rule.styles, textDecoration: e.target.value as 'none' | 'underline' | 'line-through' }
                          })}
                        >
                          <option value="none">None</option>
                          <option value="underline">Underline</option>
                          <option value="line-through">Strikethrough</option>
                        </select>
                      </label>
                      
                      <label>
                        Font Size:
                        <select
                          value={rule.styles.fontSize || '100%'}
                          onChange={(e) => updateRule(index, {
                            styles: { ...rule.styles, fontSize: e.target.value }
                          })}
                        >
                          <option value="80%">80%</option>
                          <option value="90%">90%</option>
                          <option value="100%">100%</option>
                          <option value="110%">110%</option>
                          <option value="120%">120%</option>
                          <option value="130%">130%</option>
                        </select>
                      </label>
                    </div>

                    <div className="config-row">
                      <label>
                        Font Family:
                        <select
                          value={rule.styles.fontFamily || 'inherit'}
                          onChange={(e) => updateRule(index, {
                            styles: { ...rule.styles, fontFamily: e.target.value }
                          })}
                        >
                          <option value="inherit">Default</option>
                          <option value="Arial, sans-serif">Arial</option>
                          <option value="Georgia, serif">Georgia</option>
                          <option value="Times New Roman, serif">Times New Roman</option>
                          <option value="Courier New, monospace">Courier New</option>
                          <option value="Palatino, serif">Palatino</option>
                          <option value="Book Antiqua, serif">Book Antiqua</option>
                          <option value="Garamond, serif">Garamond</option>
                          <option value="Trebuchet MS, sans-serif">Trebuchet MS</option>
                          <option value="Verdana, sans-serif">Verdana</option>
                        </select>
                      </label>
                    </div>
                  </div>
                </div>
              ))}

              <button onClick={addRule} className="add-rule-btn">
                Add New Rule
              </button>

              <div className="preview-section">
                <h3>Live Preview</h3>
                <div className="preview-text">
                  Raw text: *Hello there!* &quot;What a lovely day,&quot; she said. ~I wonder what's next~ _This is important!_
                </div>
                <div className="preview-rendered">
                  {settings.enabled ? (
                    <FormattedText 
                      text="*Hello there!* &quot;What a lovely day,&quot; she said. ~I wonder what's next~ _This is important!_"
                      formattingSettings={settings}
                    />
                  ) : (
                    <span>*Hello there!* &quot;What a lovely day,&quot; she said. ~I wonder what's next~ _This is important!_ (formatting disabled)</span>
                  )}
                </div>
              </div>
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
