import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { sendMessageToAi } from '../services/geminiService';
import SparklesIcon from './icons/SparklesIcon';
import MarkdownRenderer from './MarkdownRenderer';

const UserMessage: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex justify-end mb-4">
    <div className="bg-brand-primary text-white rounded-l-2xl rounded-tr-2xl py-3 px-5 max-w-md shadow-md">
      {text}
    </div>
  </div>
);

const ThinkingIndicator: React.FC = () => (
    <div className="flex items-center space-x-1.5 py-2">
        <div className="w-2 h-2 bg-brand-primary/70 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-brand-primary/70 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-brand-primary/70 rounded-full animate-pulse"></div>
    </div>
);

const AiMessage: React.FC<{ text: string }> = ({ text }) => {
    return (
        <div className="flex justify-start mb-4">
            <div className="bg-gray-700 text-dark-text rounded-r-2xl rounded-tl-2xl py-3 px-5 max-w-md shadow-md">
                {text.length === 0 ? <ThinkingIndicator /> : <MarkdownRenderer text={text} />}
            </div>
        </div>
    );
};


const AiChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      { id: 'init', role: 'model', text: "Hello! I'm StudyBuddy. How can I help you with your studies today?" }
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    const loadingMessage: ChatMessage = { id: 'loading', role: 'model', text: ''};
    const updatedMessages = [...messages, userMessage, loadingMessage];
    
    setMessages(updatedMessages);
    const messageToSend = input;
    setInput('');
    setIsLoading(true);

    try {
        const aiResponseText = await sendMessageToAi(messages, messageToSend);
        const aiMessage: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: aiResponseText };
        setMessages(prev => [...prev.filter(m => m.id !== 'loading'), aiMessage]);

    } catch (error) {
        const err = error as Error;
        const errorMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            text: `Sorry, an error occurred: ${err.message}`
        };
        setMessages(prev => [...prev.filter(m => m.id !== 'loading'), errorMessage]);
        console.error(error);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-dark-card rounded-3xl shadow-2xl h-full w-full max-w-lg mx-auto overflow-hidden">
        <div className="p-4 border-b border-gray-700 flex items-center space-x-3">
            <SparklesIcon className="w-8 h-8 text-brand-primary" />
            <h2 className="text-xl font-bold">StudyBuddy AI</h2>
        </div>
        <div className="flex-1 p-6 overflow-y-auto">
            {messages.map((msg) => 
            msg.role === 'user' 
            ? <UserMessage key={msg.id} text={msg.text} /> 
            : <AiMessage key={msg.id} text={msg.text} />
            )}
            <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t border-gray-700">
            <div className="flex items-center bg-gray-900 rounded-full p-2">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask a question..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 px-3"
                disabled={isLoading}
            />
            <button
                onClick={handleSend}
                disabled={isLoading}
                className="bg-brand-primary rounded-full p-3 text-white disabled:bg-gray-600 hover:bg-brand-primary/80 transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
            </button>
            </div>
        </div>
    </div>
  );
};

export default AiChat;