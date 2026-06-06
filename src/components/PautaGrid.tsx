import React, { useState } from "react";
import { PautaSuggestion } from "../types";
import { Sparkles, Users, Key, Menu, AlertTriangle, ChevronDown, ChevronUp, FileText } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PautaGridProps {
  suggestions: PautaSuggestion[];
  onDraftArticle: (suggestion: PautaSuggestion) => void;
}

export default function PautaGrid({ suggestions, onDraftArticle }: PautaGridProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getUrgencyBadge = (urgency: PautaSuggestion["urgency"]) => {
    switch (urgency) {
      case "crítica":
        return "bg-rose-500/15 text-rose-450 border-rose-500/30 font-extrabold";
      case "alta":
        return "bg-amber-500/15 text-amber-400 border-amber-500/25 font-bold";
      case "média":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 font-semibold";
      default:
        return "bg-slate-800 text-slate-400 border-slate-700";
    }
  };

  return (
    <div className="bg-[#0F1219] rounded-2xl border border-slate-800 p-6 shadow-xl" id="pautas-grid-panel">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center space-x-2.5">
          <div className="bg-cyan-500/10 text-[#22D3EE] p-2 rounded-xl border border-cyan-500/20">
            <FileText className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white tracking-tight uppercase">Pautas Sugeridas por IA</h2>
            <p className="text-slate-400 text-xs">Ideias de artigos otimizados para viralizar no Discover hoje</p>
          </div>
        </div>
        <span className="text-slate-400 text-xs font-mono font-bold tracking-widest uppercase bg-slate-800 px-2 py-0.5 rounded border border-slate-750">
          Sugestões Editoriais
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suggestions.map((pauta, index) => {
          const isExpanded = expandedId === pauta.id;
          return (
            <motion.div
              key={pauta.id || index}
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`border rounded-xl p-5 transition-all duration-200 flex flex-col justify-between ${
                isExpanded 
                  ? "border-cyan-500 bg-[#0F1219]/90 ring-1 ring-cyan-500/30" 
                  : "border-slate-800/80 bg-[#0B0E14] hover:border-slate-700 hover:shadow-lg hover:shadow-cyan-950/10"
              }`}
              id={`pauta-card-${pauta.id || index}`}
            >
              <div>
                {/* Upper tags & Urgency */}
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] font-mono bg-slate-800 border border-slate-705 text-slate-300 px-2 py-0.5 rounded uppercase font-bold">
                    Origem: {pauta.trendSource || "Trends"}
                  </span>

                  <div className="flex items-center space-x-1.5 text-xs">
                    <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full border tracking-wide font-mono ${getUrgencyBadge(pauta.urgency)}`}>
                      Urgência: {pauta.urgency}
                    </span>
                  </div>
                </div>

                {/* Main dynamic title and subtitle */}
                <h3 className="text-base font-extrabold text-white leading-snug hover:text-cyan-400 transition-colors duration-150">
                  {pauta.title}
                </h3>
                
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-semibold">
                  {pauta.subTitle}
                </p>

                {/* Why it trends excerpt */}
                <div className="mt-4 bg-[#0F1219] rounded-lg p-3.5 border border-slate-800/60 text-xs text-slate-300 flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-cyan-450 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white">Fator Discover: </span>
                    {pauta.whyItWillTrend}
                  </div>
                </div>

                {/* Expandable detailed SEO parameters */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden mt-4 pt-4 border-t border-slate-800 space-y-3"
                    >
                      {/* Editorial angle and target */}
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="bg-[#0F1219] p-2.5 rounded-lg border border-slate-800">
                          <span className="block text-[10px] text-slate-500 font-mono uppercase mb-0.5">ÂNGULO EDITORIAL</span>
                          <span className="font-extrabold text-slate-200">{pauta.editorialAngle}</span>
                        </div>
                        <div className="bg-[#0F1219] p-2.5 rounded-lg border border-slate-800">
                          <span className="block text-[10px] text-slate-500 font-mono uppercase mb-0.5">PÚBLICO-ALVO</span>
                          <span className="font-extrabold text-slate-200 flex items-center gap-1">
                            <Users className="w-3 h-3 text-slate-400" />
                            {pauta.targetAudience}
                          </span>
                        </div>
                      </div>

                      {/* SEO Tag list */}
                      <div>
                        <span className="block text-[10px] text-slate-500 font-mono uppercase mb-1.5 font-bold">PALAVRAS-CHAVE RECOMENDADAS</span>
                        <div className="flex flex-wrap gap-1.5">
                          {pauta.seoKeywords.map((tag) => (
                            <span key={tag} className="bg-cyan-500/10 text-cyan-400 text-[10px] px-2 py-0.5 rounded-md border border-cyan-500/20 font-mono font-bold">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Suggested article subheadings outline */}
                      <div>
                        <span className="block text-[10px] text-slate-500 font-mono uppercase mb-1.5 font-bold">ESTRUTURA DA MATÉRIA (H2s)</span>
                        <div className="space-y-1">
                          {pauta.suggestedStructure.map((head, i) => (
                            <div key={i} className="flex items-center space-x-2 text-xs text-slate-300 bg-[#0F1219] p-1.5 rounded-md border border-slate-800/60">
                              <span className="bg-slate-800 border border-slate-705 text-cyan-400 font-mono w-5 h-5 flex items-center justify-center rounded text-[9px] font-black shrink-0">
                                H2.{i+1}
                              </span>
                              <span className="font-medium truncate">{head}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action and expand Button bar */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => toggleExpand(pauta.id)}
                  className="flex items-center space-x-1 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer transition-colors"
                  id={`btn-expand-details-${pauta.id}`}
                >
                  {isExpanded ? (
                    <>
                      <span>Recolher Detalhes</span>
                      <ChevronUp className="w-4 h-4 text-cyan-450" />
                    </>
                  ) : (
                    <>
                      <span>Análise de SEO & Roteiro</span>
                      <ChevronDown className="w-4 h-4 text-cyan-450" />
                    </>
                  )}
                </button>

                <button
                  onClick={() => onDraftArticle(pauta)}
                  className="flex items-center space-x-1.5 bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs px-3.5 py-1.5 rounded-lg transition-all duration-200 shadow-md shadow-cyan-950/20 cursor-pointer"
                  id={`btn-draft-article-${pauta.id}`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Rascunhar Artigo</span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
