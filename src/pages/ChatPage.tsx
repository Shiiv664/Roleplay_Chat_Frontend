import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { chatApi, charactersApi, userProfilesApi, systemPromptsApi, aiModelsApi } from '../services/api';
import type { Character, Message, FormattingSettings, ChatSession, UserProfile, SystemPrompt, AIModel, UpdateChatSessionRequest } from '../types';
import MessageList from '../components/chat/MessageList';
import ChatInput from '../components/chat/ChatInput';
import ChatSettingsMenu from '../components/chat/ChatSettingsMenu';
import FormattingConfigModal from '../components/chat/FormattingConfigModal';
import SessionConfigModal from '../components/chat/SessionConfigModal';
import FirstMessageSelector from '../components/chat/FirstMessageSelector';
import './ChatPage.css';

const ChatPage = () => {
  const { chatSessionId } = useParams<{ chatSessionId: string }>();
  const [character, setCharacter] = useState<Character | null>(null);
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formattingSettings, setFormattingSettings] = useState<FormattingSettings | null>(null);
  const [showFormattingModal, setShowFormattingModal] = useState(false);
  const [showSessionConfigModal, setShowSessionConfigModal] = useState(false);
  const [sessionConfigLoading, setSessionConfigLoading] = useState(false);
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [systemPrompts, setSystemPrompts] = useState<SystemPrompt[]>([]);
  const [aiModels, setAIModels] = useState<AIModel[]>([]);
  const [isInitializingFirstMessage, setIsInitializingFirstMessage] = useState(false);
  const streamingRef = useRef<boolean>(false);

  useEffect(() => {
    if (chatSessionId) {
      loadChatData();
    }
  }, [chatSessionId]);

  const loadChatData = async () => {
    if (!chatSessionId) return;

    try {
      setLoading(true);
      const sessionId = parseInt(chatSessionId, 10);
      
      // Get chat session info and messages in parallel
      const [chatSessionResponse, messagesResponse] = await Promise.all([
        chatApi.getChatSession(sessionId),
        chatApi.getMessages(sessionId)
      ]);
      
      // Store the complete chat session data
      setChatSession(chatSessionResponse);
      
      const messagesData = messagesResponse.items || [];
      
      // Sort messages by timestamp to ensure chronological order
      const sortedMessages = messagesData.sort((a, b) => {
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      });
      
      setMessages(sortedMessages);
      
      // Extract formatting settings from chat session
      if (chatSessionResponse?.formatting_settings) {
        try {
          // Parse the JSON string to get the actual object
          const parsedSettings = typeof chatSessionResponse.formatting_settings === 'string' 
            ? JSON.parse(chatSessionResponse.formatting_settings)
            : chatSessionResponse.formatting_settings;
          setFormattingSettings(parsedSettings);
        } catch (error) {
          console.error('Error parsing formatting settings:', error);
        }
      }
      
      // Get character info from chat session
      if (chatSessionResponse?.character) {
        setCharacter(chatSessionResponse.character);
      } else if (chatSessionResponse?.character_id) {
        // If we only have character_id, fetch the character details
        const characterData = await charactersApi.getById(chatSessionResponse.character_id);
        setCharacter(characterData);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error loading chat data:', err);
      setError('Failed to load chat session. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleFirstMessageSelection = async (content: string) => {
    if (!chatSessionId || isInitializingFirstMessage) return;

    try {
      setIsInitializingFirstMessage(true);
      const sessionId = parseInt(chatSessionId, 10);
      
      // Initialize the first message on the backend
      await chatApi.initializeFirstMessage(sessionId, { content });
      
      // Reload chat data to get the updated session and new message
      await loadChatData();
    } catch (error) {
      console.error('Error initializing first message:', error);
      setError('Failed to initialize first message. Please try again.');
    } finally {
      setIsInitializingFirstMessage(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!chatSessionId || isStreaming) return;

    const sessionId = parseInt(chatSessionId, 10);

    // Add user message to the UI immediately
    const tempUserMessageId = Date.now(); // Store temp ID for later replacement
    const userMessage: Message = {
      id: tempUserMessageId,
      chat_session_id: sessionId,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsStreaming(true);
    setStreamingMessage('');
    streamingRef.current = true;

    try {
      let accumulatedContent = '';
      const streamGenerator = chatApi.sendMessage(sessionId, content);

      for await (const event of streamGenerator) {
        // Check if we should stop streaming
        if (!streamingRef.current) {
          console.log('Stream cancelled by user');
          break;
        }

        switch (event.type) {
          case 'user_message_saved':
            // Update the user message with real ID from backend
            if (event.user_message_id) {
              setMessages(prev => prev.map(msg => 
                msg.id === tempUserMessageId 
                  ? { ...msg, id: event.user_message_id || tempUserMessageId }
                  : msg
              ));
            }
            break;

          case 'content':
            accumulatedContent += event.data || '';
            setStreamingMessage(accumulatedContent);
            break;

          case 'done':
            // Add the completed AI message to the message list with real ID
            if (event.ai_message_id) {
              const aiMessage: Message = {
                id: event.ai_message_id, // Real ID from backend
                chat_session_id: sessionId,
                role: 'assistant',
                content: accumulatedContent,
                timestamp: new Date().toISOString(),
              };

              setMessages(prev => [...prev, aiMessage]);
            }
            setStreamingMessage('');
            setIsStreaming(false);
            streamingRef.current = false;
            break;

          case 'error':
            console.error('Streaming error:', event.error);
            setError(event.error || 'An error occurred while generating response');
            setIsStreaming(false);
            streamingRef.current = false;
            break;

          case 'cancelled':
            console.log('Stream cancelled:', event.reason);
            setStreamingMessage(prev => prev + ' [cancelled]');
            setIsStreaming(false);
            streamingRef.current = false;
            break;
        }
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
      setIsStreaming(false);
      streamingRef.current = false;
    }
  };

  const handleCancelMessage = async () => {
    if (!chatSessionId || !isStreaming) return;

    try {
      // First, stop the local streaming
      streamingRef.current = false;
      
      // Then call the backend to cancel
      const sessionId = parseInt(chatSessionId, 10);
      await chatApi.cancelMessage(sessionId);
      
      // Update UI state
      setIsStreaming(false);
      setStreamingMessage(prev => prev ? prev + ' [cancelled]' : '');
      
      console.log('Message cancellation successful');
    } catch (err) {
      console.error('Error cancelling message:', err);
      // Even if backend cancellation fails, we should stop the frontend streaming
      streamingRef.current = false;
      setIsStreaming(false);
      setStreamingMessage(prev => prev ? prev + ' [cancelled]' : '');
    }
  };

  const handleEditMessage = async (messageId: number, newContent: string) => {
    try {
      await chatApi.updateMessage(messageId, newContent);
      
      // Update the message in the local state
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, content: newContent }
          : msg
      ));
    } catch (err) {
      console.error('Error updating message:', err);
      setError('Failed to update message. Please try again.');
      throw err; // Re-throw to let MessageItem handle the error state
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    if (!chatSessionId) return;

    // Show confirmation dialog
    const confirmed = window.confirm(
      'Are you sure you want to delete this message? This will also delete all subsequent messages in the conversation.'
    );

    if (!confirmed) return;

    try {
      // Call API to delete the message (and all subsequent ones)
      await chatApi.deleteMessage(messageId);
      
      // Reload chat data to get updated message list
      await loadChatData();
    } catch (err) {
      console.error('Error deleting message:', err);
      setError('Failed to delete message. Please try again.');
    }
  };

  const handleSaveFormatting = async (settings: FormattingSettings) => {
    if (!chatSessionId) return;
    
    try {
      const sessionId = parseInt(chatSessionId, 10);
      await chatApi.updateChatFormatting(sessionId, settings);
      setFormattingSettings(settings);
    } catch (err) {
      console.error('Error saving formatting settings:', err);
    }
  };

  const loadSessionConfigData = async () => {
    if (userProfiles.length === 0 || systemPrompts.length === 0 || aiModels.length === 0) {
      setSessionConfigLoading(true);
      try {
        const [profilesResponse, promptsResponse, modelsResponse] = await Promise.all([
          userProfilesApi.getAll(),
          systemPromptsApi.getAll(),
          aiModelsApi.getAll(),
        ]);
        
        setUserProfiles(profilesResponse);
        setSystemPrompts(promptsResponse);
        setAIModels(modelsResponse);
      } catch (err) {
        console.error('Error loading session config data:', err);
        setError('Failed to load configuration data');
      } finally {
        setSessionConfigLoading(false);
      }
    }
  };

  const handleConfigureSession = async () => {
    await loadSessionConfigData();
    setShowSessionConfigModal(true);
  };

  const handleSaveSessionConfig = async (updates: UpdateChatSessionRequest) => {
    if (!chatSessionId || !chatSession) return;
    
    try {
      const sessionId = parseInt(chatSessionId, 10);
      const updatedSession = await chatApi.updateChatSession(sessionId, updates);
      setChatSession(updatedSession);
    } catch (err) {
      console.error('Error saving session configuration:', err);
      throw err; // Re-throw to let modal handle the error
    }
  };

  if (loading) {
    return (
      <div className="chat-page">
        <div className="container">
          <div className="loading">Loading chat session...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chat-page">
        <div className="container">
          <div className="error">{error}</div>
          <Link to="/characters" className="btn btn-secondary">
            Back to Characters
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-page">
      <div className="chat-container">
        <div className="chat-header">
          <div className="header-top">
            <Link to="/characters" className="back-link">
              ← Back to Characters
            </Link>
            
            {character && (
              <div className="character-info-inline">
                <span className="character-name">{character.name}</span>
                <span className="character-label">{character.label}</span>
              </div>
            )}
            
            <ChatSettingsMenu 
              onConfigureFormatting={() => setShowFormattingModal(true)}
              onConfigureSession={handleConfigureSession}
            />
          </div>
        </div>

        <div className="chat-content">
          {chatSession && !chatSession.first_message_initialized && character?.first_messages && character.first_messages.length > 0 ? (
            <FirstMessageSelector 
              firstMessages={character.first_messages}
              onSelect={handleFirstMessageSelection}
              isLoading={isInitializingFirstMessage}
            />
          ) : (
            <MessageList 
              messages={messages}
              streamingMessage={streamingMessage}
              isStreaming={isStreaming}
              formattingSettings={formattingSettings}
              onDeleteMessage={handleDeleteMessage}
              onEditMessage={handleEditMessage}
            />
          )}
        </div>

        <div className="chat-input-container">
          <ChatInput
            onSendMessage={handleSendMessage}
            onCancelMessage={handleCancelMessage}
            disabled={isStreaming || (chatSession && !chatSession.first_message_initialized)}
            isStreaming={isStreaming}
          />
        </div>
      </div>
      
      <FormattingConfigModal
        isOpen={showFormattingModal}
        currentSettings={formattingSettings}
        onSave={handleSaveFormatting}
        onClose={() => setShowFormattingModal(false)}
      />
      
      {chatSession && (
        <SessionConfigModal
          isOpen={showSessionConfigModal}
          chatSession={chatSession}
          userProfiles={userProfiles}
          systemPrompts={systemPrompts}
          aiModels={aiModels}
          onSave={handleSaveSessionConfig}
          onClose={() => setShowSessionConfigModal(false)}
          loading={sessionConfigLoading}
        />
      )}
    </div>
  );
};

export default ChatPage;
