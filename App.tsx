
import React, { useState, useEffect, useRef } from 'react';
import { GeminiService } from './services/geminiService.ts';
import { Message, ResearchNote, ResearchProject } from './types.ts';
import ChatBubble from './components/ChatBubble.tsx';
import Notebook from './components/Notebook.tsx';

const App: React.FC = () => {
  const [project, setProject] = useState<ResearchProject>({
    id: 'default',
    goal: '',
    questions: [],
    notes: [],
    chatHistory: [
      {
        id: '1',
        role: 'assistant',
        content: 'こんにちは！探究パートナーのミライだよ。今日はなにを調べるのかな？いっしょにワクワクする発見をしよう！',
        timestamp: Date.now(),
      }
    ]
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const geminiRef = useRef<GeminiService | null>(null);

  useEffect(() => {
    geminiRef.current = new GeminiService();
    // Load data from local storage if available
    const saved = localStorage.getItem('research_project');
    if (saved) {
      try {
        setProject(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load saved project");
      }
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    localStorage.setItem('research_project', JSON.stringify(project));
  }, [project]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setProject(prev => ({
      ...prev,
      chatHistory: [...prev.chatHistory, userMsg]
    }));
    setInput('');
    setIsLoading(true);

    try {
      const result = await geminiRef.current?.sendMessage(input, project.chatHistory);
      
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result?.text || 'ごめんね、うまくお返事できなかったよ。',
        timestamp: Date.now(),
        sources: result?.sources
      };

      setProject(prev => ({
        ...prev,
        chatHistory: [...prev.chatHistory, assistantMsg]
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const addNote = (title: string, content: string) => {
    const newNote: ResearchNote = {
      id: Date.now().toString(),
      title,
      content,
      createdAt: Date.now()
    };
    setProject(prev => ({
      ...prev,
      notes: [newNote, ...prev.notes]
    }));
  };

  const deleteNote = (id: string) => {
    setProject(prev => ({
      ...prev,
      notes: prev.notes.filter(n => n.id !== id)
    }));
  };

  const resetProject = () => {
    if (window.confirm("これまでのしらべ学習のきろくをけして、新しく始める？")) {
      const initialProject: ResearchProject = {
        id: 'default',
        goal: '',
        questions: [],
        notes: [],
        chatHistory: [
          {
            id: '1',
            role: 'assistant',
            content: 'こんにちは！また新しく始めよう！今日はどんなことを知りたいかな？',
            timestamp: Date.now(),
          }
        ]
      };
      setProject(initialProject);
      localStorage.removeItem('research_project');
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-4 border-blue-400 px-8 py-5 flex justify-between items-center z-10">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-500 p-3 rounded-2xl text-white floating shadow-lg">
            <i className="fas fa-lightbulb text-3xl"></i>
          </div>
          <div>
            <h1 className="text-3xl font-black text-blue-900 kiwi-font tracking-tight">ミライ探究ラボ</h1>
            <p className="text-sm font-bold text-blue-400 uppercase tracking-[0.2em] mt-1">Inquiry Based Learning Companion</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <button 
            onClick={resetProject}
            className="text-gray-300 hover:text-red-500 transition-colors p-3 rounded-full hover:bg-red-50"
            title="リセット"
          >
            <i className="fas fa-trash-alt text-xl"></i>
          </button>
          <div className="hidden lg:flex bg-blue-50 px-5 py-2 rounded-full items-center border border-blue-100 shadow-sm">
            <span className="text-blue-700 font-bold text-base">
              <i className="fas fa-medal mr-2 text-yellow-500"></i> マスターたんきゅう員
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col md:flex-row overflow-hidden bg-blue-50/50">
        
        {/* Left: Chat Area */}
        <div className="flex-grow md:w-3/5 flex flex-col h-full border-r-2 border-blue-50">
          <div className="flex-grow overflow-y-auto p-6 md:p-10 custom-scrollbar">
            <div className="max-w-3xl mx-auto">
              {project.chatHistory.map((msg) => (
                <ChatBubble key={msg.id} message={msg} />
              ))}
              {isLoading && (
                <div className="flex justify-start mb-6">
                  <div className="bg-white p-5 rounded-2xl shadow-sm text-blue-400 flex items-center space-x-3 border border-blue-50">
                    <div className="flex space-x-1.5">
                      <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                      <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <span className="text-sm font-bold">ミライが一生けんめい考え中...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white border-t-2 border-blue-100 shadow-lg">
            <div className="max-w-3xl mx-auto relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="ミライにききたいことを書いてね（しらべかた、ヒントなど）"
                className="w-full pl-6 pr-20 py-5 rounded-2xl border-2 border-blue-100 focus:border-blue-400 focus:outline-none resize-none shadow-inner text-base md:text-lg font-medium"
                rows={2}
              ></textarea>
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                className={`absolute right-4 bottom-5 w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-md ${
                  input.trim() && !isLoading ? 'bg-blue-500 text-white hover:bg-blue-600 scale-105 active:scale-95' : 'bg-gray-100 text-gray-400 shadow-none'
                }`}
              >
                <i className="fas fa-paper-plane text-xl"></i>
              </button>
            </div>
            <p className="text-center text-xs text-gray-400 mt-3 font-medium">
              <i className="fas fa-info-circle mr-1"></i>
              ミライもしっぱいすることがあるから、図鑑や本でもたしかめてみてね！
            </p>
          </div>
        </div>

        {/* Right: Notebook / Tools */}
        <div className="hidden md:block w-2/5 h-full p-6 bg-white/30">
          <Notebook notes={project.notes} onAddNote={addNote} onDeleteNote={deleteNote} />
        </div>

      </main>

      {/* Mobile Footer Toggle */}
      <div className="md:hidden bg-yellow-400 text-white font-bold py-3 px-6 flex justify-between items-center shadow-inner">
        <span className="text-lg">じぶんのノート ({project.notes.length}こ)</span>
        <button className="bg-white text-yellow-500 px-4 py-2 rounded-xl text-sm font-black shadow-sm active:bg-yellow-50">
          ひらく
        </button>
      </div>
    </div>
  );
};

export default App;
