
import React, { useState } from 'react';
import { ResearchNote } from '../types';

interface NotebookProps {
  notes: ResearchNote[];
  onAddNote: (title: string, content: string) => void;
  onDeleteNote: (id: string) => void;
}

const Notebook: React.FC<NotebookProps> = ({ notes, onAddNote, onDeleteNote }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const handleSave = () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    onAddNote(newTitle, newContent);
    setNewTitle('');
    setNewContent('');
    setIsAdding(false);
  };

  return (
    <div className="bg-yellow-50 rounded-2xl p-6 h-full shadow-inner border-2 border-yellow-100 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-yellow-800 flex items-center">
          <i className="fas fa-book-open mr-2"></i> じぶんのノート
        </h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-yellow-400 hover:bg-yellow-500 text-white px-5 py-2.5 rounded-full text-base font-bold transition-colors shadow-sm"
        >
          {isAdding ? 'とじる' : 'メモをかく'}
        </button>
      </div>

      {isAdding && (
        <div className="mb-8 bg-white p-5 rounded-2xl shadow-md border-2 border-yellow-200">
          <input
            type="text"
            placeholder="タイトル（なにをしらべた？）"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full mb-3 p-2 border-b-2 border-gray-100 focus:border-yellow-400 focus:outline-none font-bold text-lg"
          />
          <textarea
            placeholder="わかったこと、おもったこと..."
            rows={5}
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="w-full p-2 focus:outline-none resize-none text-base leading-relaxed"
          ></textarea>
          <div className="flex justify-end mt-3">
            <button
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full text-base font-bold transition-colors shadow-sm"
            >
              ほぞんする
            </button>
          </div>
        </div>
      )}

      <div className="flex-grow overflow-y-auto space-y-5 pr-2 custom-scrollbar">
        {notes.length === 0 ? (
          <div className="text-center text-yellow-600/50 mt-16">
            <i className="fas fa-edit text-5xl mb-4 opacity-30"></i>
            <p className="text-lg">まだメモがないよ。<br/>わかったことをメモしていこう！</p>
          </div>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="bg-white p-5 rounded-2xl shadow-sm border-2 border-yellow-100 group relative hover:border-yellow-300 transition-colors">
              <button
                onClick={() => onDeleteNote(note.id)}
                className="absolute top-3 right-3 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-1"
              >
                <i className="fas fa-trash-alt"></i>
              </button>
              <h3 className="font-bold text-gray-800 text-lg mb-2">{note.title}</h3>
              <p className="text-base text-gray-600 whitespace-pre-wrap leading-relaxed">{note.content}</p>
              <div className="flex items-center mt-3 text-xs text-gray-400">
                <i className="far fa-clock mr-1"></i>
                {new Date(note.createdAt).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notebook;
