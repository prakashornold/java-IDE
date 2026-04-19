import { useState } from 'react';
import { ChevronRight, Hash } from 'lucide-react';
import { QuestionItem } from './QuestionItem';

interface TopicSectionProps {
  topicKey: string;
  label: string;
  questions: string[];
  accentColor: string;
  defaultOpen?: boolean;
}

export function TopicSection({ label, questions, accentColor, defaultOpen = false }: TopicSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-[#282934] rounded-xl overflow-hidden transition-all duration-200 hover:border-[#383946] w-full min-w-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left bg-[#1e1f26] hover:bg-[#25262f] transition-colors duration-150 min-w-0"
      >
        <Hash className="w-3.5 h-3.5 flex-shrink-0" style={{ color: accentColor }} />
        <span className="flex-1 text-sm font-semibold text-[#d5d9e0] truncate min-w-0">{label}</span>
        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#25262f] text-[#7d8490] mr-2">
          {questions.length} Q
        </span>
        <ChevronRight
          className="w-4 h-4 text-[#5d6472] flex-shrink-0 transition-transform duration-200"
          style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
        />
      </button>

      {isOpen && (
        <div className="px-4 py-3 space-y-2 bg-[#1a1b22] animate-slide-down">
          {questions.map((question, idx) => (
            <QuestionItem
              key={idx}
              question={question}
              index={idx}
              accentColor={accentColor}
            />
          ))}
        </div>
      )}
    </div>
  );
}
