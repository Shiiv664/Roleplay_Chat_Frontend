import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { chatApi, charactersApi } from '../services/api';
import type { Character, Message } from '../types';
import MessageList from '../components/chat/MessageList';
import ChatInput from '../components/chat/ChatInput';
import './ChatPage.css';

const API_BASE_URL = 'http://127.0.0.1:5000';

const ChatPage = () => {
  const { chatSessionId } = useParams<{ chatSessionId: string }>();
  const [character, setCharacter] = useState<Character | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
      
      const messagesData = messagesResponse.items || [];
      
      // Sort messages by timestamp to ensure chronological order
      const sortedMessages = messagesData.sort((a, b) => {
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      });
      
      setMessages(sortedMessages);
      
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

  const handleSendMessage = async (content: string) => {
    if (!chatSessionId || isStreaming) return;

    const sessionId = parseInt(chatSessionId, 10);

    // Add user message to the UI immediately
    const userMessage: Message = {
      id: Date.now(), // Temporary ID
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
          case 'content':
            accumulatedContent += event.data || '';
            setStreamingMessage(accumulatedContent);
            break;

          case 'done':
            // Add the completed AI message to the message list
            const aiMessage: Message = {
              id: Date.now() + 1, // Temporary ID
              chat_session_id: sessionId,
              role: 'assistant',
              content: accumulatedContent,
              timestamp: new Date().toISOString(),
            };

            setMessages(prev => [...prev, aiMessage]);
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

  const getAvatarUrl = (character: Character) => {
    if (character.avatar_url) {
      return character.avatar_url.startsWith('http') 
        ? character.avatar_url 
        : `${API_BASE_URL}${character.avatar_url}`;
    }
    
    if (character.avatar_image) {
      return character.avatar_image.startsWith('http')
        ? character.avatar_image
        : `${API_BASE_URL}${character.avatar_image.startsWith('/') ? '' : '/'}${character.avatar_image}`;
    }
    
    return null;
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
          <Link to="/characters" className="back-link">
            ← Back to Characters
          </Link>
          
          {character && (
            <div className="character-info">
              <div className="character-avatar">
                {getAvatarUrl(character) ? (
                  <img 
                    src={getAvatarUrl(character)!} 
                    alt={`${character.name}'s avatar`}
                  />
                ) : (
                  <div className="avatar-placeholder">
                    {character.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              
              <div className="character-details">
                <h1 className="character-name">{character.name}</h1>
                <p className="character-label">{character.label}</p>
              </div>
            </div>
          )}
        </div>

        <div className="chat-content">
          <MessageList 
            messages={messages}
            streamingMessage={streamingMessage}
            isStreaming={isStreaming}
          />
        </div>

        <div className="chat-input-container">
          <ChatInput
            onSendMessage={handleSendMessage}
            onCancelMessage={handleCancelMessage}
            disabled={isStreaming}
            isStreaming={isStreaming}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
