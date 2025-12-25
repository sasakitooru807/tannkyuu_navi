
import React from 'react';
import { Message } from '../types';

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isAssistant = message.role === 'assistant';

  return (
    <div className={`flex ${isAssistant ? 'justify-start' : 'justify-end'} mb-6`}>
      <div className={`flex max-w-[90%] ${isAssistant ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${isAssistant ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'} ${isAssistant ? 'mr-3' : 'ml-3'}`}>
          <i className={`fas ${isAssistant ? 'fa-robot' : 'fa-user'} text-xl`}></i>
        </div>
        <div className={`p-5 rounded-2xl shadow-sm text-base md:text-lg leading-relaxed ${isAssistant ? 'bg-white text-gray-800 rounded-tl-none' : 'bg-green-500 text-white rounded-tr-none'}`}>
          <div className="whitespace-pre-wrap font-medium">{message.content}</div>
          
          {/* Display search grounding sources as required by guidelines */}
          {isAssistant && message.sources && message.sources.length > 0 && (
            <div className="mt-4 pt-4 border-t border-blue-50">
              <p className="text-xs font-bold text-blue-400 mb-2">
                <i className="fas fa-search mr-1"></i> しらべたページ:
              </p>
              <div className="flex flex-wrap gap-2">
                {message.sources.map((source, idx) => {
                  const web = source.web;
                  const maps = source.maps;
                  if (web) {
                    return (
                      <a 
                        key={idx} 
                        href={web.uri} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors flex items-center shadow-sm"
                      >
                        <i className="fas fa-external-link-alt mr-1.5 opacity-70"></i>
                        {web.title || 'ページをみる'}
                      </a>
                    );
                  }
                  if (maps) {
                    return (
                      <a 
                        key={idx} 
                        href={maps.uri} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors flex items-center shadow-sm"
                      >
                        <i className="fas fa-map-marker-alt mr-1.5 opacity-70"></i>
                        {maps.title || '地図をみる'}
                      </a>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;