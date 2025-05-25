import './StreamingMessage.css';

interface StreamingMessageProps {
  content: string;
}

const StreamingMessage = ({ content }: StreamingMessageProps) => {
  return (
    <div className="message-item assistant streaming">
      <div className="message-content">
        <div className="message-text">
          {content}
          <span className="typing-indicator">▊</span>
        </div>
        <div className="message-timestamp">
          streaming...
        </div>
      </div>
    </div>
  );
};

export default StreamingMessage;
