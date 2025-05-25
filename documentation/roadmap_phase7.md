# Phase 7: Chat Page Implementation

## Overview
Implement the chat page interface allowing users to have streaming conversations with their characters.

## Prerequisites
- Phase 1-6 completed
- Character detail page with chat sessions display
- Backend chat API endpoints available (see `/documentation/chat_api.json`)

## Implementation Steps

### 1. Add "New Chat" Button to Character Detail Page
- Add button in `CharacterDetailPage.tsx` near chat sessions list
- On click: POST to `/api/chat-sessions` with `character_id` and `user_profile_id`
- On success: Navigate to `/chat/{chatSessionId}` route

### 2. Create Chat Page Component
**File**: `src/pages/ChatPage.tsx`
- Display character name and avatar in header
- Show message history (initially empty for new chats)
- Message input area with send button
- Real-time streaming message display

### 3. Implement Streaming Chat Service
**File**: `src/services/chatService.ts`
- Implement manual stream reading approach from `/documentation/chat/chat_guidance.md` (Option 1, lines 26-50)
- Handle SSE events: content, done, error (lines 9-21)
- Message sending with `stream: true` parameter

### 4. Message Display Components
**Files**: `src/components/chat/MessageList.tsx`, `MessageItem.tsx`
- User and assistant message differentiation
- Streaming message with typing indicator
- Markdown rendering support
- Auto-scroll behavior (line 81)

### 5. Chat Input Component
**File**: `src/components/chat/ChatInput.tsx`
- Text area with send button
- Disable during active streaming (line 62)
- Enter key to send (Shift+Enter for new line)

### 6. State Management
- Track streaming state: idle, streaming, completed, error (line 74)
- Store message history
- Handle partial message content during streaming

### 7. Error Handling
- Network disconnection recovery
- Display user-friendly error messages
- Handle API errors gracefully

## Technical Requirements
- TypeScript interfaces matching API response types
- React hooks for state management
- CSS modules for styling consistency
- Mobile-responsive design

## Success Criteria
- User can create new chat session from character detail page
- Messages stream in real-time as chunks arrive
- Clean, intuitive chat interface
- Proper error handling and loading states
- Smooth text appearance without flickering (line 80)

## Phase 8 Preview
- Message cancellation functionality
- Chat session management (delete, rename)
- Export chat history
- Advanced features (regenerate response, edit messages)