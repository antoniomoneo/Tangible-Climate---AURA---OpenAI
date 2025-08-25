import React, { useState, useEffect, useRef } from 'react';
import type { Language, ChatMessage } from '../types';
import { locales } from '../locales';
import { AuraIcon, UserIcon } from './icons';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  context: string;
  onDebugEvent: (data: any) => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, language, context, onDebugEvent }) => {
  const t = locales[language];
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (isOpen) {
      setMessages([]);
      setInput('');
      setError(null);
      setIsSending(false);
    }
  }, [isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const prompt = input.trim();
    if (!prompt || isSending) {
      return;
    }

    setIsSending(true);
    setError(null);
    setInput('');

    const userMessage: ChatMessage = { role: 'user', content: prompt };
    const historyForApi = [...messages];
    setMessages(prev => [...prev, userMessage, { role: 'assistant', content: '' }]);
    
    const apiUrl = `/api/chat`;
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: historyForApi,
          message: prompt,
          context: `Current context: The user is viewing the scene described as: "${context}". System instruction: ${t.chatSystemInstruction}`,
        }),
      });

      if (!response.ok || !response.body) {
          const errData = await response.json().catch(() => ({ error: { message: t.chatError }}));
          throw new Error(errData.error?.message || `HTTP error! status: ${response.status}`);
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        
        let boundary = buffer.indexOf('\n\n');
        while (boundary !== -1) {
            const messageBlock = buffer.substring(0, boundary);
            buffer = buffer.substring(boundary + 2);

            if (messageBlock.startsWith('data: ')) {
                const jsonData = messageBlock.substring(6);
                if (jsonData.trim()) {
                    try {
                        const parsed = JSON.parse(jsonData);
                        
                        if (parsed.type === 'chunk') {
                            setMessages(prev => {
                                const lastMsg = prev[prev.length - 1];
                                const updatedMsg = { ...lastMsg, content: lastMsg.content + parsed.payload };
                                return [...prev.slice(0, -1), updatedMsg];
                            });
                        } else if (parsed.type === 'debug') {
                            onDebugEvent(parsed.payload);
                        } else if (parsed.type === 'done') {
                            // No action needed for 'done' in stateless model
                        } else if (parsed.type === 'error') {
                            throw new Error(parsed.payload.message || t.chatError);
                        }

                    } catch (e) {
                        console.error("Error parsing stream part:", jsonData, e);
                    }
                }
            }
            boundary = buffer.indexOf('\n\n');
        }
      }

    } catch (e: any) {
        console.error('Chat error:', e);
        setError(e.message || t.chatError);
        // Remove the empty assistant message if an error occurred
        setMessages(prev => prev.filter(msg => msg.content !== '' || msg.role !== 'assistant'));
    } finally {
        setIsSending(false);
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-600 flex-shrink-0">
          <h2 className="font-title text-2xl text-cyan-400 flex items-center gap-3">
            <AuraIcon className="h-6 w-6" />
            {t.chatTitle}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
        </div>

        {/* Content */}
        <div className="flex-grow p-4 overflow-y-auto space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex items-start gap-3 my-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'assistant' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center">
                    <AuraIcon className="h-5 w-5 text-white" />
                  </div>
                )}
                <div className={`max-w-md p-3 rounded-lg shadow ${msg.role === 'user' ? 'bg-gray-700' : 'bg-gray-700'}`}>
                   <p className="text-white whitespace-pre-wrap">{msg.content}</p>
                   {isSending && msg.role === 'assistant' && index === messages.length -1 && <span className="inline-block w-2 h-4 bg-white ml-1 animate-pulse"></span>}
                </div>
                 {msg.role === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                    <UserIcon />
                  </div>
                )}
              </div>
            ))}
             <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 border-t border-gray-600 flex-shrink-0">
            {error && (
              <p className="text-red-400 text-sm mb-2 text-center">
                <span>{error}</span>
              </p>
            )}
            <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t.chatPlaceholder}
                    disabled={isSending}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
                    aria-label={t.chatPlaceholder}
                />
                <button
                    type="submit"
                    disabled={isSending || !input.trim()}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    {t.chatSend}
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
