import { useState, useEffect } from 'react';
import { settingsApi, userProfilesApi, systemPromptsApi, aiModelsApi } from '../services/api';
import type { ApplicationSettings, UserProfile, SystemPrompt, AIModel, OpenRouterAPIKeyStatus, FormattingSettings } from '../types';
import FormattingConfigModal from '../components/chat/FormattingConfigModal';
import './ApplicationSettingsPage.css';

const ApplicationSettingsPage = () => {
  const [, setSettings] = useState<ApplicationSettings | null>(null);
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [systemPrompts, setSystemPrompts] = useState<SystemPrompt[]>([]);
  const [aiModels, setAIModels] = useState<AIModel[]>([]);
  const [apiKeyStatus, setApiKeyStatus] = useState<OpenRouterAPIKeyStatus | null>(null);
  const [defaultFormatting, setDefaultFormatting] = useState<FormattingSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [checkingApiKey, setCheckingApiKey] = useState(false);
  const [settingApiKey, setSettingApiKey] = useState(false);
  const [clearingApiKey, setClearingApiKey] = useState(false);
  const [showFormattingModal, setShowFormattingModal] = useState(false);

  const [formData, setFormData] = useState({
    default_user_profile_id: null as number | null,
    default_system_prompt_id: null as number | null,
    default_ai_model_id: null as number | null,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [settingsResponse, profilesResponse, promptsResponse, modelsResponse, apiKeyStatusResponse] = await Promise.all([
        settingsApi.get(),
        userProfilesApi.getAll(),
        systemPromptsApi.getAll(),
        aiModelsApi.getAll(),
        settingsApi.getOpenRouterAPIKeyStatus(),
      ]);

      setSettings(settingsResponse);
      setUserProfiles(profilesResponse);
      setSystemPrompts(promptsResponse);
      setAIModels(modelsResponse);
      setApiKeyStatus(apiKeyStatusResponse);
      
      // Fetch default formatting with separate error handling
      try {
        const defaultFormattingResponse = await settingsApi.getDefaultFormatting();
        let formattingSettings = defaultFormattingResponse.data?.default_formatting_rules;
        
        // Handle case where the rules might be a JSON string
        if (typeof formattingSettings === 'string') {
          try {
            formattingSettings = JSON.parse(formattingSettings);
          } catch (parseError) {
            console.warn('Failed to parse formatting rules JSON:', parseError);
            formattingSettings = null;
          }
        }
        
        setDefaultFormatting(formattingSettings);
      } catch (formattingError) {
        console.warn('Failed to load default formatting settings:', formattingError);
        setDefaultFormatting(null);
      }
      
      setFormData({
        default_user_profile_id: settingsResponse.default_user_profile_id,
        default_system_prompt_id: settingsResponse.default_system_prompt_id,
        default_ai_model_id: settingsResponse.default_ai_model_id,
      });

      setError(null);
    } catch (err) {
      console.error('Error fetching settings data:', err);
      setError('Failed to load settings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const updatedSettings = await settingsApi.update(formData);
      setSettings(updatedSettings);
      setSuccess('Settings saved successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSelectChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value === '' ? null : parseInt(value, 10),
    }));
  };

  const handleCheckApiKeyStatus = async () => {
    try {
      setCheckingApiKey(true);
      const status = await settingsApi.getOpenRouterAPIKeyStatus();
      setApiKeyStatus(status);
      setSuccess(status.has_api_key ? 'API key is configured' : 'No API key configured');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error checking API key status:', err);
      setError('Failed to check API key status.');
    } finally {
      setCheckingApiKey(false);
    }
  };

  const handleSetApiKey = async () => {
    if (!apiKeyInput.trim()) {
      setError('Please enter an API key.');
      return;
    }

    try {
      setSettingApiKey(true);
      setError(null);
      await settingsApi.setOpenRouterAPIKey({ api_key: apiKeyInput });
      setApiKeyInput('');
      setApiKeyStatus({ has_api_key: true });
      setSuccess('API key set successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error setting API key:', err);
      setError('Failed to set API key. Please check the key and try again.');
    } finally {
      setSettingApiKey(false);
    }
  };

  const handleClearApiKey = async () => {
    try {
      setClearingApiKey(true);
      setError(null);
      await settingsApi.clearOpenRouterAPIKey();
      setApiKeyStatus({ has_api_key: false });
      setSuccess('API key cleared successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error clearing API key:', err);
      setError('Failed to clear API key.');
    } finally {
      setClearingApiKey(false);
    }
  };

  const handleFormattingSave = async (formattingSettings: FormattingSettings) => {
    try {
      setError(null);
      await settingsApi.updateDefaultFormatting(formattingSettings);
      setDefaultFormatting(formattingSettings);
      setShowFormattingModal(false);
      setSuccess('Default formatting settings saved successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error saving default formatting:', err);
      setError('Failed to save default formatting settings. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="application-settings-page">
        <div className="container">
          <div className="loading">Loading settings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="application-settings-page">
      <div className="container">
        <div className="page-header">
          <h1>Application Settings</h1>
          <p className="page-description">Configure default selections for new conversations</p>
        </div>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <div className="settings-form">
          <div className="setting-group">
            <label htmlFor="user-profile-select">Default User Profile</label>
            <select
              id="user-profile-select"
              value={formData.default_user_profile_id || ''}
              onChange={(e) => handleSelectChange('default_user_profile_id', e.target.value)}
            >
              <option value="">No default selected</option>
              {userProfiles.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.name}
                </option>
              ))}
            </select>
          </div>

          <div className="setting-group">
            <label htmlFor="system-prompt-select">Default System Prompt</label>
            <select
              id="system-prompt-select"
              value={formData.default_system_prompt_id || ''}
              onChange={(e) => handleSelectChange('default_system_prompt_id', e.target.value)}
            >
              <option value="">No default selected</option>
              {systemPrompts.map((prompt) => (
                <option key={prompt.id} value={prompt.id}>
                  {prompt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="setting-group">
            <label htmlFor="ai-model-select">Default AI Model</label>
            <select
              id="ai-model-select"
              value={formData.default_ai_model_id || ''}
              onChange={(e) => handleSelectChange('default_ai_model_id', e.target.value)}
            >
              <option value="">No default selected</option>
              {aiModels.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button 
              className="btn btn-primary" 
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>

        <div className="settings-section">
          <h2>Default Text Formatting</h2>
          <p className="section-description">Configure default text formatting rules for new chat sessions</p>
          
          <div className="formatting-status">
            <div className="status-info">
              <span className="status-label">Current Status:</span>
              <span className={`status-value ${defaultFormatting?.enabled ? 'enabled' : 'disabled'}`}>
                {defaultFormatting?.enabled 
                  ? `Enabled (${defaultFormatting.rules?.length || 0} rules)` 
                  : defaultFormatting === null 
                    ? 'Not configured'
                    : 'Disabled'}
              </span>
            </div>
            <button 
              className="btn btn-secondary" 
              onClick={() => setShowFormattingModal(true)}
            >
              {defaultFormatting === null ? 'Set Up Formatting' : 'Configure Formatting'}
            </button>
          </div>
        </div>

        <div className="settings-section">
          <h2>OpenRouter API Configuration</h2>
          <p className="section-description">Configure your OpenRouter API key for AI model access</p>
          
          <div className="api-key-status">
            <div className="status-info">
              <span className="status-label">API Key Status:</span>
              <span className={`status-value ${apiKeyStatus?.has_api_key ? 'configured' : 'not-configured'}`}>
                {apiKeyStatus?.has_api_key 
                  ? `Configured${apiKeyStatus.key_length ? ` (${apiKeyStatus.key_length} chars)` : ''}` 
                  : 'Not Configured'}
              </span>
            </div>
            <button 
              className="btn btn-secondary" 
              onClick={handleCheckApiKeyStatus}
              disabled={checkingApiKey}
            >
              {checkingApiKey ? 'Checking...' : 'Check Status'}
            </button>
          </div>

          <div className="api-key-form">
            <div className="input-group">
              <label htmlFor="api-key-input">OpenRouter API Key</label>
              <input
                id="api-key-input"
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="Enter your OpenRouter API key"
                className="api-key-input"
              />
            </div>
            
            <div className="api-key-actions">
              <button 
                className="btn btn-primary" 
                onClick={handleSetApiKey}
                disabled={settingApiKey || !apiKeyInput.trim()}
              >
                {settingApiKey ? 'Setting...' : 'Set API Key'}
              </button>
              
              {apiKeyStatus?.has_api_key && (
                <button 
                  className="btn btn-danger" 
                  onClick={handleClearApiKey}
                  disabled={clearingApiKey}
                >
                  {clearingApiKey ? 'Clearing...' : 'Clear API Key'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showFormattingModal && (
        <FormattingConfigModal
          isOpen={showFormattingModal}
          onClose={() => setShowFormattingModal(false)}
          currentSettings={defaultFormatting || {
            enabled: false,
            rules: [
              {
                id: 'actions',
                delimiter: '*',
                name: 'Actions',
                styles: {
                  fontStyle: 'italic',
                  color: '#8B4513',
                  fontFamily: 'Georgia'
                },
                enabled: true
              },
              {
                id: 'speech',
                delimiter: '"',
                name: 'Speech',
                styles: {
                  color: '#008000',
                  fontFamily: 'Arial'
                },
                enabled: true
              },
              {
                id: 'thoughts',
                delimiter: '~',
                name: 'Thoughts',
                styles: {
                  fontStyle: 'italic',
                  color: '#0066CC',
                  fontSize: '90%',
                  fontFamily: 'Times New Roman'
                },
                enabled: true
              },
              {
                id: 'emphasis',
                delimiter: '_',
                name: 'Emphasis',
                styles: {
                  fontWeight: 'bold',
                  color: '#CC0000'
                },
                enabled: true
              }
            ]
          }}
          onSave={handleFormattingSave}
        />
      )}
    </div>
  );
};

export default ApplicationSettingsPage;