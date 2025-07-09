
import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader, Trash2, Download, Settings, Lightbulb, BookOpen, Calculator, Beaker, Globe } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'code' | 'math' | 'image';
  subject?: string;
}

interface Suggestion {
  text: string;
  category: string;
  icon: React.ReactNode;
}

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('general');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions: Suggestion[] = [
    { text: "Explain photosynthesis in simple terms", category: "Science", icon: <Beaker className="w-4 h-4" /> },
    { text: "Help me solve this algebra equation", category: "Mathematics", icon: <Calculator className="w-4 h-4" /> },
    { text: "What are the causes of World War II?", category: "History", icon: <Globe className="w-4 h-4" /> },
    { text: "Explain the concept of metaphors", category: "English", icon: <BookOpen className="w-4 h-4" /> },
    { text: "How does machine learning work?", category: "Technology", icon: <Bot className="w-4 h-4" /> },
    { text: "Study tips for better memory retention", category: "Study Skills", icon: <Lightbulb className="w-4 h-4" /> }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Welcome message
    const welcomeMessage: Message = {
      id: '0',
      content: `Hello! I'm your AI learning assistant. I'm here to help you with your studies across various subjects. You can ask me about mathematics, science, history, literature, and much more. What would you like to learn today?`,
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    };
    setMessages([welcomeMessage]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text',
      subject: selectedSubject
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          message: inputMessage,
          context: selectedSubject,
          conversationHistory: messages.slice(-5) // Send last 5 messages for context
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: 'ai',
        timestamp: new Date(),
        type: 'text',
        subject: selectedSubject
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'I apologize, but I encountered an error. Please try again or contact support if the issue persists.',
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const clearConversation = () => {
    const welcomeMessage: Message = {
      id: '0',
      content: `Hello! I'm your AI learning assistant. I'm here to help you with your studies across various subjects. You can ask me about mathematics, science, history, literature, and much more. What would you like to learn today?`,
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    };
    setMessages([welcomeMessage]);
  };

  const exportConversation = () => {
    const conversationText = messages.map(msg => 
      `[${msg.timestamp.toLocaleTimeString()}] ${msg.sender.toUpperCase()}: ${msg.content}`
    ).join('\n\n');
    
    const blob = new Blob([conversationText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-chat-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout title="AI Learning Assistant">
      <div className="max-w-6xl mx-auto h-[calc(100vh-200px)] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Bot className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">AI Learning Assistant</h1>
                <p className="text-blue-100">Your personalized tutor for all subjects</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="bg-white/20 border border-white/30 rounded-xl px-4 py-2 text-white font-medium"
              >
                <option value="general" className="text-gray-900">General</option>
                <option value="mathematics" className="text-gray-900">Mathematics</option>
                <option value="science" className="text-gray-900">Science</option>
                <option value="english" className="text-gray-900">English</option>
                <option value="history" className="text-gray-900">History</option>
                <option value="programming" className="text-gray-900">Programming</option>
              </select>
              
              <button
                onClick={exportConversation}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-xl transition-colors"
                title="Export Conversation"
              >
                <Download className="w-5 h-5" />
              </button>
              
              <button
                onClick={clearConversation}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-xl transition-colors"
                title="Clear Conversation"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 flex bg-white rounded-b-2xl shadow-lg overflow-hidden">
          {/* Suggestions Sidebar */}
          <div className="w-80 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
            <h3 className="font-semibold text-gray-900 mb-4">Suggested Questions</h3>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  className="w-full text-left p-3 bg-white rounded-xl hover:bg-blue-50 transition-colors border border-gray-200 hover:border-blue-300"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-blue-600">{suggestion.icon}</div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium mb-1">{suggestion.category}</div>
                      <div className="text-sm text-gray-700">{suggestion.text}</div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start space-x-3 max-w-3xl ${
                      message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}>
                      <div className={`p-3 rounded-xl ${
                        message.sender === 'user' 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
                          : 'bg-gray-100'
                      }`}>
                        {message.sender === 'user' ? (
                          <User className="w-5 h-5 text-white" />
                        ) : (
                          <Bot className="w-5 h-5 text-gray-600" />
                        )}
                      </div>
                      
                      <div className={`rounded-2xl p-4 ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <div className="whitespace-pre-wrap">{message.content}</div>
                        <div className={`text-xs mt-2 ${
                          message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start space-x-3">
                    <div className="p-3 rounded-xl bg-gray-100">
                      <Bot className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="bg-gray-100 rounded-2xl p-4">
                      <div className="flex items-center space-x-2">
                        <Loader className="w-4 h-4 animate-spin text-gray-600" />
                        <span className="text-gray-600">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Ask me anything about your studies..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isLoading}
                  />
                  {selectedSubject !== 'general' && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                        {selectedSubject}
                      </span>
                    </div>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
              
              <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <span>💡 Tip: Be specific with your questions for better answers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>AI Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
