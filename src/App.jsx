import React, { useState } from 'react';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import { sendMessageToGemini } from './services/gemini';
import { Sparkles } from 'lucide-react';

function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (text, attachments = []) => {
    // Construct the user message object for the UI
    const userMessage = { 
      role: 'user', 
      content: text,
      attachments: attachments // Array of attachment objects
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Construct the payload for Gemini
      let geminiPayload;
      
      if (attachments.length > 0) {
        // Multimodal payload
        geminiPayload = [];
        if (text) {
          geminiPayload.push({ text: text });
        }
        attachments.forEach(att => {
          geminiPayload.push({ inlineData: att.inlineData });
        });
      } else {
        // Text-only payload
        geminiPayload = text;
      }

      const responseText = await sendMessageToGemini(geminiPayload);
      const aiMessage = { role: 'ai', content: responseText };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage = { 
        role: 'ai', 
        content: '**Error:** I encountered an issue connecting to my brain. Please make sure the API key is set correctly.' 
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">
          Rack Ai
          <Sparkles size={18} color="var(--accent-color)" />
        </h1>
      </header>
      
      <ChatWindow messages={messages} isLoading={isLoading} />
      
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}

export default App;
