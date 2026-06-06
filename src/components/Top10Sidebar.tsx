import React from "react";
import { Top10Pitch } from "../types";
import { Flame, ArrowUpRight, ArrowRight, ArrowDownRight, Info, Award } from "lucide-react";
import { motion } from "motion/react";

interface Top10SidebarProps {
  items: Top10Pitch[];
  onSelectTheme: (theme: string) => void;
}

export default function Top10Sidebar({ items, onSelectTheme }: Top10SidebarProps) {
  const getTrendIcon = (trend: Top10Pitch["growthTrend"]) => {
    switch (trend) {
      case "up":
        return <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400 font-extrabold" />;
      case "down":
        return <ArrowDownRight className="w-3.5 h-3.5 text-rose-450" />;
      default:
        return <ArrowRight className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  const getTrendBadge = (trend: Top10Pitch["growthTrend"]) => {
    switch (trend) {
      case "up":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
      case "down":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      default:
        return "bg-slate-800 text-slate-400 border-slate-700";
    }
  };

  // Sort items by position
  const sortedItems = [...items].sort((a, b) => a.position - b.position);

  return (
    <div className="bg-[#0F1219] text-white rounded-2xl p-6 border border-slate-800 shadow-2xl" id="top-10-sidebar-panel">
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="bg-cyan-500 text-black p-2 rounded-xl flex items-center justify-center font-bold shadow-[0_0_12px_rgba(34,211,238,0.4)]">
            <Award className="w-5 h-5 font-bold" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-[#22D3EE] tracking-tight uppercase flex items-center gap-1">
              Top 10 Acessadas
            </h2>
            <p className="text-slate-400 text-xs mt-0.5">Assuntos previstos para liderar a audiência total</p>
          </div>
        </div>
        <span className="text-[10px] bg-cyan-950/55 text-cyan-400 px-2 py-0.5 rounded border border-cyan-800 font-mono font-bold shrink-0">
          AI SELECTED
        </span>
      </div>

      <div className="space-y-3.5">
        {sortedItems.map((item, idx) => {
          return (
            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
              key={item.position || idx}
              onClick={() => onSelectTheme(item.theme)}
              className="group relative bg-[#0B0E14] hover:bg-[#0F1219] border border-slate-800/80 hover:border-cyan-500/40 rounded-xl p-3.5 transition-all duration-200 cursor-pointer"
              id={`top-10-item-${item.position}`}
            >
              <div className="flex items-start space-x-3">
                {/* Ranking circle badge */}
                <span className={`w-7 h-7 rounded-lg font-mono text-xs font-black border flex items-center justify-center shrink-0 ${
                  item.position <= 3 
                    ? "bg-cyan-500/15 border-cyan-500 text-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.2)]" 
                    : "bg-[#0F1219] border-slate-800 text-slate-400"
                }`}>
                  #{item.position}
                </span>

                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono text-slate-400 truncate">
                      {item.estimatedTraffic}
                    </span>
                    <span className={`inline-flex items-center space-x-0.5 px-1.5 py-0.5 rounded border text-[8px] font-mono font-bold uppercase tracking-wider ${getTrendBadge(item.growthTrend)}`}>
                      {getTrendIcon(item.growthTrend)}
                      <span>{item.growthTrend}</span>
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors duration-150 leading-tight uppercase tracking-wide">
                    {item.theme}
                  </h3>

                  <p className="text-[10px] leading-relaxed text-slate-400 line-clamp-2">
                    {item.angle}
                  </p>

                  <div className="bg-[#0F1219] rounded-lg p-2.5 border border-slate-800/60 text-[9px] text-slate-400 flex items-start space-x-1.5 mt-2">
                    <Flame className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-200">Gancho/Hook:</span> {item.hook}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-5 pt-4 border-t border-slate-850 text-[10px] text-slate-400 flex items-start space-x-2 p-3 bg-[#0B0E14] rounded-xl border border-slate-800">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Esta escala analisa tráfego viral, crescimento orgânico no Google Discover e sentimentos públicos ativos no TikTok, Twitter e portais de notícias para compor o top predictions.
        </p>
      </div>

    </div>
  );
}
