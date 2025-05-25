# Chat Feature API Integration Guide

## 🚀 **Backend Status: 100% Complete & Tested**

The streaming chat functionality is fully operational with real OpenRouter API integration.

## 📡 **API Endpoints for Chat Feature**

### Base URL
```
http://localhost:5000/api/v1
```

### Core Chat Endpoints

#### 1. **Send Message (Streaming)**
```http
POST /messages/chat-sessions/{chat_session_id}/send-message
Content-Type: application/json

{
  "content": "Hello, how are you today?",
  "stream": true  // optional, defaults to true
}
```

**Response**: Server-Sent Events stream
```
Content-Type: text/event-stream

data: {"type": "content", "data": "Hello"}
data: {"type": "content", "data": " there"}
data: {"type": "content", "data": "!"}
data: {"type": "done"}
```

#### 2. **Get Messages**
```http
GET /messages/chat-sessions/{chat_session_id}?page=1&per_page=50
```

**Response**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "chat_session_id": 1,
        "role": "user",
        "content": "Hello, how are you today?",
        "timestamp": "2025-05-24T23:18:31"
      },
      {
        "id": 2,
        "chat_session_id": 1,
        "role": "assistant", 
        "content": "Hello! I'm doing well, thank you for asking.",
        "timestamp": "2025-05-24T23:18:32"
      }
    ],
    "pagination": {
      "total_count": 2,
      "total_pages": 1,
      "current_page": 1,
      "page_size": 50,
      "has_next": false,
      "has_previous": false
    }
  }
}
```

#### 3. **Get Latest Messages**
```http
GET /messages/chat-sessions/{chat_session_id}/latest?count=10
```

## 🔧 **SSE Event Types**

All SSE events follow this format:
```typescript
// Content chunk
{"type": "content", "data": "partial text"}

// Stream complete
{"type": "done"}

// Error occurred
{"type": "error", "error": "Error message"}

// Stream cancelled  
{"type": "cancelled", "reason": "user_cancelled"}
```

## 📋 **TypeScript Interfaces**

```typescript
// Message
interface Message {
  id: number;
  chat_session_id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// Send Message Request
interface SendMessageRequest {
  content: string;
  stream?: boolean; // default: true
}

// SSE Events
type SSEEvent = 
  | { type: 'content'; data: string }
  | { type: 'done' }
  | { type: 'error'; error: string }
  | { type: 'cancelled'; reason: string };
```

## 🎯 **Real Implementation Example**

**JavaScript/Fetch SSE Integration**:
```javascript
async function sendMessage(chatSessionId, content) {
  const response = await fetch(`/api/v1/messages/chat-sessions/${chatSessionId}/send-message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content })
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const event = JSON.parse(line.slice(6));
        
        switch (event.type) {
          case 'content':
            // Append event.data to your message display
            appendToMessage(event.data);
            break;
          case 'done':
            // Message complete
            onMessageComplete();
            break;
          case 'error':
            // Handle error
            onError(event.error);
            break;
        }
      }
    }
  }
}
```

## ✅ **Key Features Confirmed Working**

- **Real OpenRouter API Integration** ✅
- **Perfect SSE Streaming** ✅  
- **Message Persistence** ✅
- **Character Roleplay** ✅
- **Error Handling** ✅
- **CORS Enabled** ✅

## 🧪 **Live Test Results**

```bash
# Test conversation that worked:
User: "Tell me a short joke!"
AI: "Sure! Why did the scarecrow win an award? Because he was outstanding in his field!"

User: "That was funny! Tell me another one."  
AI: "Why couldn't the bicycle stand up by itself? Because it was two tired!"
```

Both messages properly saved to database with correct timestamps and roles.

## 📚 **API Documentation**

Full interactive docs available at: `http://localhost:5000/api/v1/docs`

The backend is production-ready for frontend integration!