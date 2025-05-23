### Client-Side Streaming Implementation

#### Sending Messages
- POST to `/api/chat-sessions/{id}/send-message` with `{content: string, stream: boolean}`
- Default `stream: true` for SSE response
- Handle response based on Content-Type header

#### SSE Event Format
```json
// Content event
{"type": "content", "data": "chunk of response text"}

// Completion event  
{"type": "done"}

// Error event
{"type": "error", "error": "error description"}

// Cancellation event (Phase 8)
{"type": "cancelled", "reason": "user_cancelled"}
```

#### Implementation Approaches

##### Option 1: Manual Stream Reading (Recommended for control)
```javascript
const response = await fetch('/api/chat-sessions/123/send-message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: 'Hello!', stream: true })
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
            handleStreamEvent(event);
        }
    }
}
```

##### Option 2: EventSource API (Simpler but less flexible)
Note: Requires separate endpoint for SSE or workaround since EventSource only supports GET

#### Message Display
- Append chunks to message display as they arrive
- Show typing indicator during streaming
- Transition to static display on completion
- Handle markdown formatting in real-time

#### Streaming Controls
- Disable message input during active stream
- Show cancel button while streaming
- POST to `/api/chat-sessions/{id}/cancel-message` to cancel
- Clear indicators on completion or error

#### Error Handling
- Parse error events from SSE stream
- Display user-friendly error messages
- Handle network disconnections gracefully
- Retry logic for transient failures

#### State Management
- Track streaming state: idle, streaming, completed, error
- Store partial message content
- Update UI based on state transitions
- Handle multiple tabs (consider shared state)

### UX Considerations
- Smooth text appearance (avoid flickering)
- Auto-scroll to bottom as content arrives
- Preserve scroll position if user scrolls up
- Loading states for initial connection
- Mobile-optimized streaming experience

### Complete Frontend Example

```typescript
// TypeScript/React example
interface StreamEvent {
    type: 'content' | 'done' | 'error' | 'cancelled';
    data?: string;
    error?: string;
    reason?: string;
}

class ChatService {
    async sendMessage(chatSessionId: number, content: string, stream = true) {
        const response = await fetch(`/api/chat-sessions/${chatSessionId}/send-message`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content, stream })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to send message');
        }
        
        if (stream && response.headers.get('content-type')?.includes('text/event-stream')) {
            return this.handleStream(response);
        }
        
        return response.json();
    }
    
    private async *handleStream(response: Response): AsyncGenerator<StreamEvent> {
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            
            // Keep incomplete line in buffer
            buffer = lines.pop() || '';
            
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const event = JSON.parse(line.slice(6));
                        yield event;
                    } catch (e) {
                        console.error('Failed to parse SSE event:', e);
                    }
                }
            }
        }
    }
    
    async cancelMessage(chatSessionId: number) {
        const response = await fetch(`/api/chat-sessions/${chatSessionId}/cancel-message`, {
            method: 'POST'
        });
        
        if (!response.ok) {
            throw new Error('Failed to cancel message');
        }
        
        return response.json();
    }
}

// Usage in React component
function ChatComponent({ chatSessionId }: { chatSessionId: number }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [streamingMessage, setStreamingMessage] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    
    const sendMessage = async (content: string) => {
        // Add user message
        const userMessage = { role: 'user', content, timestamp: new Date() };
        setMessages(prev => [...prev, userMessage]);
        
        // Start streaming
        setIsStreaming(true);
        setStreamingMessage('');
        
        try {
            const chatService = new ChatService();
            const stream = await chatService.sendMessage(chatSessionId, content);
            
            for await (const event of stream) {
                switch (event.type) {
                    case 'content':
                        setStreamingMessage(prev => prev + event.data);
                        break;
                        
                    case 'done':
                        // Add completed message to history
                        const aiMessage = {
                            role: 'assistant',
                            content: streamingMessage,
                            timestamp: new Date()
                        };
                        setMessages(prev => [...prev, aiMessage]);
                        setStreamingMessage('');
                        setIsStreaming(false);
                        break;
                        
                    case 'error':
                        console.error('Stream error:', event.error);
                        setIsStreaming(false);
                        // Show error to user
                        break;
                }
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            setIsStreaming(false);
        }
    };
    
    return (
        <div>
            {/* Render messages and streaming content */}
            {isStreaming && <div className="streaming-message">{streamingMessage}</div>}
        </div>
    );
}
```


## Frontend Integration Examples

### Using the SendMessage Endpoint

#### JavaScript/TypeScript Example (Streaming)
```typescript
// Streaming mode (default)
const response = await fetch('/api/chat-sessions/123/send-message', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        content: 'Hello, how are you?',
        stream: true  // optional, defaults to true
    })
});

// Handle SSE stream
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
                    // Append to message display
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
```

#### Using EventSource API (Recommended for SSE)
```typescript
const eventSource = new EventSource('/api/chat-sessions/123/stream');

eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);

    switch (data.type) {
        case 'content':
            appendToMessage(data.data);
            break;
        case 'done':
            eventSource.close();
            onMessageComplete();
            break;
        case 'error':
            eventSource.close();
            onError(data.error);
            break;
    }
};

eventSource.onerror = (error) => {
    console.error('SSE Error:', error);
    eventSource.close();
};

// Send message to trigger streaming
await fetch('/api/chat-sessions/123/send-message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: 'Hello!' })
});
```

### Cancelling a Stream
```typescript
// Cancel ongoing stream
const cancelResponse = await fetch('/api/chat-sessions/123/cancel-message', {
    method: 'POST'
});

if (cancelResponse.ok) {
    console.log('Stream cancelled successfully');
}
```