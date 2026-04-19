import { useState } from 'react';
import { ChevronDown, MessageSquare } from 'lucide-react';

interface QuestionItemProps {
  question: string;
  index: number;
  accentColor: string;
}

export function QuestionItem({ question, index, accentColor }: QuestionItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="group border border-[#282934] rounded-xl overflow-hidden transition-all duration-200 hover:border-[#383946] w-full min-w-0"
      style={{ background: isExpanded ? 'rgba(82,148,208,0.04)' : 'transparent' }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-start gap-3 px-4 py-3.5 text-left transition-colors duration-150 hover:bg-[#1e1f26]"
      >
        <span
          className="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold mt-0.5 transition-all duration-200"
          style={{
            background: isExpanded ? accentColor + '22' : '#25262f',
            color: isExpanded ? accentColor : '#7d8490',
          }}
        >
          {index + 1}
        </span>

        <div className="flex-1 min-w-0 overflow-hidden">
          <p
            className="text-sm leading-relaxed transition-colors duration-150 break-words"
            style={{ color: isExpanded ? '#f1f3f5' : '#d5d9e0' }}
          >
            {question}
          </p>

          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-[#282934] animate-slide-down">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-3.5 h-3.5" style={{ color: accentColor }} />
                <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: accentColor }}>
                  Answer
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#25262f] text-[#7d8490] font-medium">
                  Coming Soon
                </span>
              </div>
              <p className="text-sm text-[#9ba1ad] italic leading-relaxed">
                Detailed answer will be added here. This section is ready to accept answer content.
              </p>
            </div>
          )}
        </div>

        <ChevronDown
          className="flex-shrink-0 w-4 h-4 text-[#5d6472] group-hover:text-[#9ba1ad] transition-all duration-200 mt-0.5"
          style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
    </div>
  );
}
