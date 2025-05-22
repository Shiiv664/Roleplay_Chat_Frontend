import { useState, useEffect } from 'react';
import { settingsApi, userProfilesApi, systemPromptsApi, aiModelsApi } from '../services/api';
import type { ApplicationSettings, UserProfile, SystemPrompt, AIModel } from '../types';
import './ApplicationSettingsPage.css';

const ApplicationSettingsPage = () => {
  const [, setSettings] = useState<ApplicationSettings | null>(null);
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [systemPrompts, setSystemPrompts] = useState<SystemPrompt[]>([]);
  const [aiModels, setAIModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    default_user_profile_id: null as number | null,
    default_system_prompt_id: null as number | null,
    default_ai_model_id: null as number | null,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [settingsResponse, profilesResponse, promptsResponse, modelsResponse] = await Promise.all([
        settingsApi.get(),
        userProfilesApi.getAll(),
        systemPromptsApi.getAll(),
        aiModelsApi.getAll(),
      ]);

      setSettings(settingsResponse);
      setUserProfiles(profilesResponse);
      setSystemPrompts(promptsResponse);
      setAIModels(modelsResponse);
      
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
      </div>
    </div>
  );
};

export default ApplicationSettingsPage;