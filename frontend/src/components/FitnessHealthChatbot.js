import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { analyzeUserInput } from '../utils/healthAdviceKnowledgeBase';

const FitnessHealthChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: '👋 Welcome to WellNest FitnessBot! I\'m here to provide personalized fitness & health advice. Tell me about your symptoms, workout, or health concerns!',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userHealthMetrics, setUserHealthMetrics] = useState({});
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load user health metrics from dashboard
  useEffect(() => {
    const fetchUserMetrics = () => {
      try {
        const stored = localStorage.getItem('userHealthMetrics');
        if (stored) {
          setUserHealthMetrics(JSON.parse(stored));
        }
      } catch (error) {
        console.log('No health metrics available yet');
      }
    };
    fetchUserMetrics();
  }, [isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      text: userInput,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    setIsLoading(true);

    // Simulate bot processing
    setTimeout(() => {
      const botResponse = analyzeUserInput(userInput, userHealthMetrics);
      const newBotMessage = {
        id: messages.length + 2,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newBotMessage]);
      setIsLoading(false);
    }, 500);
  };

  const quickActions = [
    { label: '💪 Leg Press Help', prompt: 'I did 20 reps of leg press and have a cramp' },
    { label: '🏥 Feeling Dizzy', prompt: 'I feel dizzy after my workout' },
    { label: '🔄 Recovery Tips', prompt: 'How should I recover after intense workout?' },
    { label: '🥗 Nutrition Help', prompt: 'What should I eat after my workout?' },
    { label: '⚠️ Shortness of Breath', prompt: 'I have shortness of breath during cardio' },
    { label: '🧘 Stretching Guide', prompt: 'How should I stretch properly?' }
  ];

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg transition-all duration-300 z-40 transform ${
          isOpen
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-green-500 hover:bg-green-600 scale-100 hover:scale-110'
        }`}
        title="FitnessBot - Health & Fitness Advice"
      >
        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <MessageCircle size={24} className="text-white" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden z-40 border border-gray-200 animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle size={24} />
              <div>
                <h3 className="font-bold text-lg">FitnessBot</h3>
                <p className="text-xs text-green-100">Health & Fitness Advice</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-green-700 p-1 rounded transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-3 rounded-lg whitespace-pre-wrap text-sm ${
                    message.sender === 'user'
                      ? 'bg-green-500 text-white rounded-br-none'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 border border-gray-200 px-4 py-3 rounded-lg rounded-bl-none">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length === 1 && (
            <div className="px-4 py-2 bg-white border-t border-gray-200 max-h-32 overflow-y-auto">
              <p className="text-xs text-gray-500 font-semibold mb-2">Quick Actions:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setUserInput(action.prompt);
                      handleSendMessage({
                        preventDefault: () => {},
                        target: { value: action.prompt }
                      });
                    }}
                    className="text-xs bg-green-50 hover:bg-green-100 text-green-700 p-2 rounded border border-green-200 transition text-left font-medium"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Describe your symptom or workout..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !userInput.trim()}
                className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white p-2 rounded-lg transition"
              >
                <Send size={18} />
              </button>
            </form>
            <p className="text-xs text-gray-400 mt-2 text-center">
              ⚠️ Not a substitute for professional medical advice
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default FitnessHealthChatbot;
