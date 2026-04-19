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

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#1a1b22]">
      <Header onNavigateToAdmin={onNavigateToAdmin} />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

          <div className="mb-6">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-1.5 text-xs text-[#9ba1ad] hover:text-[#d5d9e0] transition-colors mb-5 group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              Back to IDE
            </button>

            <div className="flex items-start gap-4">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-[#5294d0]/15 rounded-2xl blur-xl scale-150" />
                <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4080b5] to-[#2a5580] flex items-center justify-center shadow-xl shadow-[#3a6d9e]/20">
                  <BookOpen className="w-5 h-5 text-white" strokeWidth={2} />
                </div>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#f1f3f5] leading-tight">
                  Interview Preparation
                </h1>
                <p className="text-sm text-[#9ba1ad] mt-1">
                  {totalQuestions} curated questions across {categoryKeys.length} topics for Java backend interviews
                </p>
              </div>
            </div>
          </div>

          <div className="relative mb-5">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5d6472] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search questions..."
              className="w-full pl-10 pr-10 py-2.5 bg-[#1e1f26] border border-[#282934] rounded-xl text-sm text-[#d5d9e0] placeholder-[#5d6472] focus:outline-none focus:border-[#5294d0]/50 focus:ring-1 focus:ring-[#5294d0]/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5d6472] hover:text-[#9ba1ad] transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {!isSearching && (
            <div className="flex items-center gap-2 flex-wrap mb-6">
              <button
                onClick={() => setActiveCategory('ALL')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                  activeCategory === 'ALL'
                    ? 'bg-[#5294d0] text-white shadow-sm shadow-[#5294d0]/20'
                    : 'bg-[#1e1f26] text-[#9ba1ad] hover:bg-[#25262f] hover:text-[#d5d9e0] border border-[#282934]'
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
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 border ${
                      isActive
                        ? 'text-white shadow-sm'
                        : 'bg-[#1e1f26] text-[#9ba1ad] hover:bg-[#25262f] hover:text-[#d5d9e0] border-[#282934]'
                    }`}
                    style={isActive ? {
                      background: cat.color,
                      borderColor: cat.color,
                      boxShadow: `0 2px 8px ${cat.color}30`,
                    } : undefined}
                  >
                    <Icon className="w-3 h-3" strokeWidth={2.5} />
                    <span className="hidden sm:inline">{cat.label}</span>
                    <span className="sm:hidden">{cat.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          )}

          {isSearching ? (
            <div className="space-y-3 animate-fade-in">
              <p className="text-xs text-[#7d8490] mb-4">
                {filteredSearchResults.length} result{filteredSearchResults.length !== 1 ? 's' : ''} for &ldquo;{searchQuery}&rdquo;
              </p>
              {filteredSearchResults.length === 0 ? (
                <div className="text-center py-16">
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
            <div className="space-y-8 animate-fade-in">
              {visibleCategories.map(key => (
                <div
                  key={key}
                  className="bg-[#1e1f26] border border-[#282934] rounded-2xl p-5 sm:p-6 hover:border-[#383946] transition-all duration-200"
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
          )}

          {!isSearching && activeCategory === 'ALL' && (
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
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

        </div>
      </div>

      <Footer />
    </div>
  );
}
