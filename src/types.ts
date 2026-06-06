export interface Trend {
  id: string;
  keyword: string;
  category: string;
  searchVolume: string;
  growthRate: string;
  discoverScore: number; // 0-100%
  sentiment: 'positive' | 'negative' | 'neutral';
  description: string;
  sourceUrls?: string[];
}

export interface PautaSuggestion {
  id: string;
  title: string;
  subTitle: string;
  category: string;
  trendSource: string;
  editorialAngle: string;
  whyItWillTrend: string;
  discoverProbability: number; // 0-100%
  seoKeywords: string[];
  targetAudience: string;
  suggestedStructure: string[];
  urgency: 'baixa' | 'média' | 'alta' | 'crítica';
}

export interface Top10Pitch {
  position: number;
  theme: string;
  angle: string;
  estimatedTraffic: string;
  growthTrend: 'up' | 'stable' | 'down';
  hook: string;
}

export interface CoolHunterReport {
  timestamp: string;
  marketSummary: string;
  topTags: string[];
  trends: Trend[];
  suggestions: PautaSuggestion[];
  top10: Top10Pitch[];
}
