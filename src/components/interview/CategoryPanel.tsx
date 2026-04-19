import { Coffee, Leaf, Database, Layers, Table2, Server } from 'lucide-react';
import { TopicSection } from './TopicSection';

interface TopicData {
  label: string;
  questions: string[];
}

interface CategoryData {
  label: string;
  icon: string;
  color: string;
  topics: Record<string, TopicData>;
}

interface CategoryPanelProps {
  categoryKey: string;
  data: CategoryData;
}

const iconMap: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  coffee: Coffee,
  leaf: Leaf,
  database: Database,
  layers: Layers,
  table: Table2,
  server: Server,
};

function getTotalQuestions(topics: Record<string, TopicData>): number {
  return Object.values(topics).reduce((sum, t) => sum + t.questions.length, 0);
}

export function CategoryPanel({ categoryKey, data }: CategoryPanelProps) {
  const IconComponent = iconMap[data.icon] || Coffee;
  const totalQuestions = getTotalQuestions(data.topics);
  const topicKeys = Object.keys(data.topics);

  return (
    <div id={`category-${categoryKey}`} className="space-y-4">
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
          style={{ background: data.color + '22', border: `1px solid ${data.color}33` }}
        >
          <IconComponent className="w-4.5 h-4.5" style={{ color: data.color }} strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-bold text-[#f1f3f5] leading-tight">{data.label}</h2>
          <p className="text-[12px] text-[#7d8490] mt-0.5">
            {topicKeys.length} topics &middot; {totalQuestions} questions
          </p>
        </div>
      </div>

      <div className="space-y-2.5">
        {topicKeys.map((topicKey, idx) => (
          <TopicSection
            key={topicKey}
            topicKey={topicKey}
            label={data.topics[topicKey].label}
            questions={data.topics[topicKey].questions}
            accentColor={data.color}
            defaultOpen={idx === 0}
          />
        ))}
      </div>
    </div>
  );
}
