import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import { Sparkles } from 'lucide-react';

const ChatWindow = ({ messages, isLoading }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="chat-window">
      {messages.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div className="avatar ai" style={{ width: 64, height: 64, marginBottom: 24 }}></div>
          <h2 style={{ margin: 0, fontWeight: 400, color: 'var(--text-primary)', fontSize: '2rem' }}>
            <span style={{ background: 'var(--ai-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundSize: '200% auto' }}>
              Hello there.
            </span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginTop: '8px' }}>How can I help you today?</p>
        </div>
      ) : (
        messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))
      )}
      
      {isLoading && (
        <div className="message-container ai">
          <div className="avatar ai"></div>
          <div className="message-content" style={{ paddingLeft: '18px' }}>
            <div className="gemini-loader">
              <Sparkles size={24} className="loader-star" />
            </div>
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatWindow;
