import React, { useState, useEffect } from 'react';
import type { 
  ChatSession, 
  UpdateChatSessionRequest, 
  UserProfile, 
  SystemPrompt, 
  AIModel 
} from '../../types';
import './SessionConfigModal.css';

interface SessionConfigModalProps {
  isOpen: boolean;
  chatSession: ChatSession;
  userProfiles: UserProfile[];
  systemPrompts: SystemPrompt[];
  aiModels: AIModel[];
  onClose: () => void;
  onSave: (updates: UpdateChatSessionRequest) => Promise<void>;
  loading?: boolean;
}

const SessionConfigModal: React.FC<SessionConfigModalProps> = ({
  isOpen,
  chatSession,
  userProfiles,
  systemPrompts,
  aiModels,
  onClose,
  onSave,
  loading = false
}) => {
  const [formData, setFormData] = useState<UpdateChatSessionRequest>({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && chatSession) {
      setFormData({
        user_profile_id: chatSession.user_profile_id,
        ai_model_id: chatSession.ai_model_id,
        system_prompt_id: chatSession.system_prompt_id,
        pre_prompt: chatSession.pre_prompt || '',
        pre_prompt_enabled: chatSession.pre_prompt_enabled || false,
        post_prompt: chatSession.post_prompt || '',
        post_prompt_enabled: chatSession.post_prompt_enabled || false,
      });
      setError(null);
    }
  }, [isOpen, chatSession]);
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error('Error saving session configuration:', err);
      setError('Failed to save configuration. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setError(null);
    onClose();
  };

  const updateFormData = (updates: Partial<UpdateChatSessionRequest>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="session-config-modal">
          <div className="modal-header">
            <h3>Configure Session</h3>
          </div>
          <div className="modal-body">
            <div className="loading">Loading configuration data...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="session-config-modal">
        <div className="modal-header">
          <h3>Configure Session</h3>
          <button 
            className="close-button"
            onClick={handleCancel}
            disabled={isSaving}
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="user-profile-select">User Profile:</label>
            <select
              id="user-profile-select"
              value={formData.user_profile_id || ''}
              onChange={(e) => updateFormData({ 
                user_profile_id: e.target.value ? parseInt(e.target.value) : null 
              })}
              disabled={isSaving}
            >
              <option value="">None</option>
              {userProfiles.map(profile => (
                <option key={profile.id} value={profile.id}>
                  {profile.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="system-prompt-select">System Prompt:</label>
            <select
              id="system-prompt-select"
              value={formData.system_prompt_id || ''}
              onChange={(e) => updateFormData({ 
                system_prompt_id: e.target.value ? parseInt(e.target.value) : null 
              })}
              disabled={isSaving}
            >
              <option value="">None</option>
              {systemPrompts.map(prompt => (
                <option key={prompt.id} value={prompt.id}>
                  {prompt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="ai-model-select">AI Model:</label>
            <select
              id="ai-model-select"
              value={formData.ai_model_id || ''}
              onChange={(e) => updateFormData({ 
                ai_model_id: e.target.value ? parseInt(e.target.value) : null 
              })}
              disabled={isSaving}
            >
              <option value="">None</option>
              {aiModels.map(model => (
                <option key={model.id} value={model.id}>
                  {model.label}
                </option>
              ))}
            </select>
          </div>

          <div className="prompt-section">
            <h4>Pre-System Prompt</h4>
            <div className="prompt-controls">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.pre_prompt_enabled || false}
                  onChange={(e) => updateFormData({ pre_prompt_enabled: e.target.checked })}
                  disabled={isSaving}
                />
                Enable
              </label>
            </div>
            <textarea
              className={`prompt-textarea ${!formData.pre_prompt_enabled ? 'disabled-textarea' : ''}`}
              value={formData.pre_prompt || ''}
              onChange={(e) => updateFormData({ pre_prompt: e.target.value })}
              placeholder="Enter pre-system prompt content..."
              rows={4}
              disabled={isSaving}
            />
          </div>

          <div className="prompt-section">
            <h4>Post-System Prompt</h4>
            <div className="prompt-controls">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.post_prompt_enabled || false}
                  onChange={(e) => updateFormData({ post_prompt_enabled: e.target.checked })}
                  disabled={isSaving}
                />
                Enable
              </label>
            </div>
            <textarea
              className={`prompt-textarea ${!formData.post_prompt_enabled ? 'disabled-textarea' : ''}`}
              value={formData.post_prompt || ''}
              onChange={(e) => updateFormData({ post_prompt: e.target.value })}
              placeholder="Enter post-system prompt content..."
              rows={4}
              disabled={isSaving}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button 
            className="btn btn-secondary"
            onClick={handleCancel}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button 
            className="btn btn-primary"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionConfigModal;
