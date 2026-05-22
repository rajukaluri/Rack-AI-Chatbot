import React, { useState, useRef } from 'react';
import { Send, ImagePlus, X } from 'lucide-react';

const ChatInput = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      // Basic check for image
      if (!file.type.startsWith('image/')) {
        alert("Only images are supported for now!");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target.result;
        // Split to get just the base64 data part and the mime type
        const splitStr = base64String.split(',');
        
        setAttachments(prev => [...prev, {
          file,
          previewUrl: base64String,
          inlineData: {
            data: splitStr[1],
            mimeType: file.type
          }
        }]);
      };
      reader.readAsDataURL(file);
    });
    
    // Reset input so the same file can be selected again
    e.target.value = null;
  };

  const removeAttachment = (indexToRemove) => {
    setAttachments(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // We can send if there's text OR attachments
    if ((input.trim() || attachments.length > 0) && !isLoading) {
      onSendMessage(input.trim(), attachments);
      setInput('');
      setAttachments([]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="chat-input-wrapper">
      <div className="input-form-container">
        
        {/* Image Previews */}
        {attachments.length > 0 && (
          <div className="preview-container">
            {attachments.map((att, index) => (
              <div key={index} className="preview-item">
                <img src={att.previewUrl} alt="Upload preview" />
                <button 
                  className="remove-preview" 
                  onClick={() => removeAttachment(index)}
                  title="Remove image"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="input-controls">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/webp, image/heic"
            multiple
            style={{ display: 'none' }}
          />
          
          <button 
            type="button" 
            className="file-input-label"
            onClick={() => fileInputRef.current.click()}
            title="Upload image"
            disabled={isLoading}
          >
            <ImagePlus size={22} />
          </button>
          
          <textarea
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Rack Ai anything..."
            disabled={isLoading}
            rows={1}
            style={{ resize: 'none' }}
          />
          
          <button 
            type="submit" 
            className="send-button"
            disabled={(!input.trim() && attachments.length === 0) || isLoading}
            aria-label="Send Message"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInput;
