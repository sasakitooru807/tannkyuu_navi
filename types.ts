
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  // Add sources for research grounding support
  sources?: any[];
}

export interface ResearchNote {
  id: string;
  title: string;
  content: string;
  createdAt: number;
}

export interface ResearchProject {
  id: string;
  goal: string;
  questions: string[];
  notes: ResearchNote[];
  chatHistory: Message[];
}