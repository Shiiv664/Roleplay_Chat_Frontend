import { useState, useEffect } from 'react';
import { systemPromptsApi } from '../services/api';
import type { SystemPrompt } from '../types';
import './SystemPromptsPage.css';
import SystemPromptList from '../components/systemPrompts/SystemPromptList';
import CreateSystemPromptModal from '../components/systemPrompts/CreateSystemPromptModal';

const SystemPromptsPage = () => {
  const [systemPrompts, setSystemPrompts] = useState<SystemPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchSystemPrompts = async () => {
    try {
      setLoading(true);
      const prompts = await systemPromptsApi.getAll();
      setSystemPrompts(prompts);
      setError(null);
    } catch (err) {
      console.error('Error fetching system prompts:', err);
      setError('Failed to load system prompts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemPrompts();
  }, []);

  const handleCreateSystemPrompt = async () => {
    setIsCreateModalOpen(false);
    await fetchSystemPrompts();
  };

  return (
    <div className="system-prompts-page">
      <div className="container">
        <div className="page-header">
          <h1>System Prompts</h1>
          <button 
            className="btn btn-primary" 
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create System Prompt
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading system prompts...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <SystemPromptList systemPrompts={systemPrompts} />
        )}

        {isCreateModalOpen && (
          <CreateSystemPromptModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSystemPromptCreated={handleCreateSystemPrompt}
          />
        )}
      </div>
    </div>
  );
};

export default SystemPromptsPage;