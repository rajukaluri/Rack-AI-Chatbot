import React from 'react';
import ReactMarkdown from 'react-markdown';
import { User } from 'lucide-react';

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`message-container ${isUser ? 'user' : 'ai'}`}>
      <div className={`avatar ${isUser ? 'user' : 'ai'}`}>
        {isUser ? <User size={18} color="var(--accent-color)" /> : ''}
      </div>
      
      <div className="message-content" style={{ flex: 1, maxWidth: isUser ? 'calc(100% - 50px)' : '100%' }}>
        
        {/* Render Attachments if any */}
        {isUser && message.attachments && message.attachments.length > 0 && (
          <div className="attachments-display" style={{ justifyContent: 'flex-end' }}>
            {message.attachments.map((att, index) => (
              <img 
                key={index} 
                src={att.previewUrl} 
                alt="Attached" 
                className="attached-image" 
              />
            ))}
          </div>
        )}

        {/* Render Text Content */}
        {message.content && (
          <div className="message-bubble">
            {isUser ? (
              <p>{message.content}</p>
            ) : (
              <ReactMarkdown>{message.content}</ReactMarkdown>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
