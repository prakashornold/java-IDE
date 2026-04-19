import { useState, useMemo } from 'react';
import { ArrowLeft, Search, X, BookOpen, Coffee, Leaf, Database, Layers, Table2, Server } from 'lucide-react';
import { Header } from './Header';
import { Footer } from './Footer';
import { CategoryPanel } from './interview/CategoryPanel';
import questionsData from '../data/interviewQuestions.json';

interface InterviewPrepProps {
  onNavigateHome: () => void;
  onNavigateToAdmin?: () => void;
}

type QuestionsDataType = typeof questionsData;
type CategoryKey = keyof QuestionsDataType;

const categoryIcons: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  JAVA_OOP: Coffee,
  SPRING_BOOT: Leaf,
  SPRING_DATA_JPA: Database,
  HIBERNATE: Layers,
  SQL: Table2,
  BACKEND_MICROSERVICES: Server,
};

function getTotalForCategory(categoryKey: CategoryKey): number {
  const cat = questionsData[categoryKey] as { topics: Record<string, { questions: string[] }> };
  return Object.values(cat.topics).reduce((sum, t) => sum + t.questions.length, 0);
}

function getAllQuestions(): { category: string; topic: string; question: string; color: string }[] {
  const results: { category: string; topic: string; question: string; color: string }[] = [];
  for (const catKey of Object.keys(questionsData) as CategoryKey[]) {
    const cat = questionsData[catKey] as {
      label: string;
      color: string;
      topics: Record<string, { label: string; questions: string[] }>;
    };
    for (const topicKey of Object.keys(cat.topics)) {
      const topic = cat.topics[topicKey];
      for (const q of topic.questions) {
        results.push({ category: cat.label, topic: topic.label, question: q, color: cat.color });
      }
    }
  }
  return results;
}

export function InterviewPrep({ onNavigateHome, onNavigateToAdmin }: InterviewPrepProps) {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const categoryKeys = Object.keys(questionsData) as CategoryKey[];
  const allQuestions = useMemo(() => getAllQuestions(), []);
  const totalQuestions = allQuestions.length;

  const filteredSearchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return allQuestions.filter(item => item.question.toLowerCase().includes(q));
  }, [searchQuery, allQuestions]);

  const isSearching = searchQuery.trim().length > 0;

  const visibleCategories = activeCategory === 'ALL'
    ? categoryKeys
    : categoryKeys.filter(k => k === activeCategory);

  const subHeader = (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-1.5 text-xs text-[#7d8490] hover:text-[#9ba1ad] transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span className="hidden sm:inline">Back to IDE</span>
          </button>

          <span className="text-[#383946] text-xs">/</span>

          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#4080b5] to-[#2a5580] flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-2.5 h-2.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xs font-semibold text-[#d5d9e0]">Interview Preparation</span>
          </div>
        </div>

        <span className="text-[11px] text-[#5d6472] hidden sm:block">
          {totalQuestions} questions &middot; {categoryKeys.length} topics
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#5d6472] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search questions..."
            className="w-full pl-8 pr-8 py-1.5 bg-[#13141a] border border-[#282934] rounded-lg text-xs text-[#d5d9e0] placeholder-[#5d6472] focus:outline-none focus:border-[#5294d0]/50 focus:ring-1 focus:ring-[#5294d0]/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5d6472] hover:text-[#9ba1ad] transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {!isSearching && (
          <div className="flex items-center gap-1.5 flex-1 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveCategory('ALL')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 flex-shrink-0 ${
                activeCategory === 'ALL'
                  ? 'bg-[#5294d0] text-white shadow-sm shadow-[#5294d0]/20'
                  : 'bg-[#13141a] text-[#9ba1ad] hover:bg-[#1e1f26] hover:text-[#d5d9e0] border border-[#282934]'
              }`}
            >
              All
            </button>
            {categoryKeys.map(key => {
              const cat = questionsData[key] as { label: string; color: string };
              const Icon = categoryIcons[key] || BookOpen;
              const isActive = activeCategory === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveCategory(isActive ? 'ALL' : key)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 border flex-shrink-0 ${
                    isActive
                      ? 'text-white shadow-sm'
                      : 'bg-[#13141a] text-[#9ba1ad] hover:bg-[#1e1f26] hover:text-[#d5d9e0] border-[#282934]'
                  }`}
                  style={isActive ? {
                    background: cat.color,
                    borderColor: cat.color,
                    boxShadow: `0 2px 8px ${cat.color}30`,
                  } : undefined}
                >
                  <Icon className="w-3 h-3" strokeWidth={2.5} />
                  <span className="hidden lg:inline">{cat.label}</span>
                  <span className="lg:hidden">{cat.label.split(/[\s&]/)[0]}</span>
                </button>
              );
            })}
          </div>
        )}

        {isSearching && (
          <p className="text-xs text-[#7d8490]">
            {filteredSearchResults.length} result{filteredSearchResults.length !== 1 ? 's' : ''} for &ldquo;{searchQuery}&rdquo;
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#1a1b22]">
      <Header onNavigateToAdmin={onNavigateToAdmin} subHeader={subHeader} />

      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 min-w-0">

          {isSearching ? (
            <div className="space-y-2.5 animate-fade-in">
              {filteredSearchResults.length === 0 ? (
                <div className="text-center py-20">
                  <Search className="w-8 h-8 text-[#383946] mx-auto mb-3" />
                  <p className="text-sm text-[#7d8490]">No questions match your search</p>
                </div>
              ) : (
                filteredSearchResults.map((item, idx) => (
                  <div
                    key={idx}
                    className="border border-[#282934] rounded-xl px-4 py-3.5 bg-[#1e1f26] hover:border-[#383946] transition-all"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{ background: item.color + '22', color: item.color }}
                      >
                        {item.category}
                      </span>
                      <span className="text-[10px] text-[#5d6472]">{item.topic}</span>
                    </div>
                    <p className="text-sm text-[#d5d9e0] leading-relaxed">{item.question}</p>
                  </div>
                ))
              )}
            </div>
          ) : (
            <>
              <div className="space-y-6 animate-fade-in">
                {visibleCategories.map(key => (
                  <div
                    key={key}
                    className="bg-[#1e1f26] border border-[#282934] rounded-2xl p-4 sm:p-5 hover:border-[#383946] transition-all duration-200 w-full overflow-hidden min-w-0"
                  >
                    <CategoryPanel
                      categoryKey={key}
                      data={{
                        ...(questionsData[key] as {
                          label: string;
                          icon: string;
                          color: string;
                          topics: Record<string, { label: string; questions: string[] }>;
                        }),
                      }}
                    />
                  </div>
                ))}
              </div>

              {activeCategory === 'ALL' && (
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {categoryKeys.map(key => {
                    const cat = questionsData[key] as { label: string; color: string };
                    const Icon = categoryIcons[key] || BookOpen;
                    const total = getTotalForCategory(key);
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          setActiveCategory(key);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="flex items-center gap-2.5 p-3.5 bg-[#1e1f26] border border-[#282934] rounded-xl text-left hover:border-[#383946] hover:bg-[#25262f] transition-all group"
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
                          style={{ background: cat.color + '1a', border: `1px solid ${cat.color}2a` }}
                        >
                          <Icon className="w-3.5 h-3.5" style={{ color: cat.color }} strokeWidth={2} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#d5d9e0] truncate">{cat.label}</p>
                          <p className="text-[11px] text-[#7d8490] mt-0.5">{total} questions</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
}
