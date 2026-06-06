import React from "react";
import { Trend } from "../types";
import { TrendingUp, AlertCircle, Sparkles, Smile, Frown, Meh, BarChart2 } from "lucide-react";
import { motion } from "motion/react";

interface TrendListProps {
  trends: Trend[];
  onSelectKeyword: (keyword: string) => void;
}

export default function TrendList({ trends, onSelectKeyword }: TrendListProps) {
  const getSentimentIcon = (sentiment: Trend["sentiment"]) => {
    switch (sentiment) {
      case "positive":
        return <Smile className="w-4 h-4 text-[#22D3EE]" />;
      case "negative":
        return <Frown className="w-4 h-4 text-rose-400" />;
      default:
        return <Meh className="w-4 h-4 text-slate-400" />;
    }
  };

  const getSentimentLabel = (sentiment: Trend["sentiment"]) => {
    switch (sentiment) {
      case "positive":
        return { text: "Otimista / Construtivo", bg: "bg-cyan-500/10 text-[#22D3EE] border-cyan-500/25" };
      case "negative":
        return { text: "Crítica / Alerta", bg: "bg-rose-500/10 text-rose-400 border-rose-500/20" };
      default:
        return { text: "Neutro / Informativo", bg: "bg-slate-800 text-slate-400 border-slate-700" };
    }
  };

  return (
    <div className="bg-[#0F1219] rounded-2xl border border-slate-800 p-6 shadow-xl" id="trend-list-panel">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center space-x-2.5">
          <div className="bg-cyan-500/10 text-cyan-400 p-2 rounded-xl border border-cyan-500/20">
            <TrendingUp className="w-5 h-5 text-[#22D3EE]" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white tracking-tight uppercase">Tendências Emergentes</h2>
            <p className="text-slate-400 text-xs">Picos repentinos de pesquisa ativa no Google Trends Brasil</p>
          </div>
        </div>
        <span className="bg-slate-800 text-slate-300 text-[10px] font-mono tracking-wider px-2.5 py-0.5 rounded-md border border-slate-700 uppercase font-black">
          {trends.length} TOPICS
        </span>
      </div>

      <div className="space-y-4">
        {trends.map((trend, index) => {
          const badge = getSentimentLabel(trend.sentiment);
          return (
            <motion.div
              key={trend.id || index}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group border border-slate-800/80 hover:border-cyan-500/40 bg-[#0B0E14] hover:bg-cyan-500/[0.02] rounded-xl p-4 transition-all duration-200 cursor-pointer"
              onClick={() => onSelectKeyword(trend.keyword)}
              id={`trend-item-${trend.id || index}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
                {/* Content */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-slate-800 text-slate-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-slate-700 uppercase">
                      {trend.category}
                    </span>
                    <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded border text-[10px] font-medium ${badge.bg}`}>
                      {getSentimentIcon(trend.sentiment)}
                      <span>{badge.text}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-white group-hover:text-[#22D3EE] transition-colors duration-150 inline-block">
                    {trend.keyword}
                  </h3>

                  <p className="text-slate-400 text-xs leading-relaxed">
                    {trend.description}
                  </p>
                </div>

                {/* Score badge & Volume info */}
                <div className="bg-[#0F1219] group-hover:bg-[#0B0E14] border border-slate-800/60 group-hover:border-slate-700/60 rounded-xl p-3 min-w-[130px] flex flex-col justify-between shrink-0">
                  <div className="text-right">
                    <span className="block text-[10px] text-slate-500 font-mono">VOLUME ESTIMADO</span>
                    <span className="text-white font-black text-xs">{trend.searchVolume}</span>
                  </div>
                  
                  <div className="text-right mt-1.5">
                    <span className="block text-[10px] text-slate-500 font-mono">CRESCIMENTO</span>
                    <span className="text-cyan-400 font-black text-xs">{trend.growthRate}</span>
                  </div>
                </div>
              </div>

              {/* Discover Score Gauge */}
              <div className="mt-4 pt-3.5 border-t border-slate-800/75 group-hover:border-slate-805 flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 h-4 mb-1">
                    <span>POTENCIAL GOOGLE DISCOVER</span>
                    <span className="font-bold text-slate-300">{trend.discoverScore}%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        trend.discoverScore >= 90 
                          ? "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]" 
                          : trend.discoverScore >= 75 
                          ? "bg-purple-500" 
                          : "bg-slate-600"
                      }`}
                      style={{ width: `${trend.discoverScore}%` }}
                    />
                  </div>
                </div>

                <div className="shrink-0 flex items-center space-x-1.5 text-[10px] font-bold text-[#22D3EE] bg-cyan-950/20 border border-cyan-500/20 px-3 py-1 rounded-lg hover:bg-cyan-500 hover:text-black transition-all duration-200">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Gerar Pauta</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
