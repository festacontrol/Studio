import React from "react";
import { Compass, Flame, Sparkles, RefreshCw, AlertCircle, Cpu } from "lucide-react";

interface HeaderProps {
  hasKey: boolean;
  isSimulated: boolean;
  isLoading: boolean;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  onRefresh: () => void;
}

const CATEGORIES = ["Geral", "Tecnologia", "Entretenimento", "Negócios", "Esportes"];

export default function Header({
  hasKey,
  isSimulated,
  isLoading,
  selectedCategory,
  setSelectedCategory,
  onRefresh,
}: HeaderProps) {
  return (
    <header className="border-b border-slate-800 bg-[#0F1219] sticky top-0 z-40" id="app-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-cyan-400 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.45)] text-black font-black text-xl shrink-0">
              C
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-black tracking-tight text-white uppercase">
                  COOL<span className="text-cyan-400">HUNTER</span>
                </h1>
                <span className="bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  V.2.4 LIVE PULSE
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-0.5">
                Inteligência editorial de tendências do Google Discover & Pautas Virais no Brasil
              </p>
            </div>
          </div>

          {/* Connection Status Badge & Refresh Button */}
          <div className="flex items-center space-x-3 self-end md:self-auto">
            <div 
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                hasKey && !isSimulated
                  ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/20"
              }`}
            >
              <Cpu className={`w-3.5 h-3.5 ${hasKey && !isSimulated ? "text-cyan-400" : "text-amber-400"}`} />
              <span>
                {hasKey && !isSimulated ? (
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
                    Google Search Grounding: Ativo
                  </span>
                ) : (
                  "Demonstração Ativa (Insira GEMINI_API_KEY)"
                )}
              </span>
            </div>

            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center space-x-1.5 bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs px-4 py-2 rounded-lg transition-all duration-200 shadow-[0_0_15px_rgba(34,211,238,0.3)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              id="btn-refresh-trends"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>Atualizar</span>
            </button>
          </div>
        </div>

        {/* Category filters */}
        <div className="flex items-center space-x-2 mt-5 overflow-x-auto pb-1 no-scrollbar">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-widest pr-2 flex items-center gap-1 shrink-0">
            <Flame className="w-3.5 h-3.5 text-cyan-400" />
            <span>Filtros:</span>
          </div>
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide transition-all duration-200 shrink-0 border cursor-pointer ${
                selectedCategory === category
                  ? "bg-[#22D3EE]/10 text-[#22D3EE] border-[#22D3EE]/50 shadow-[0_0_8px_rgba(34,211,238,0.2)]"
                  : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white hover:bg-slate-700"
              }`}
              id={`filter-${category.toLowerCase()}`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Informational banner when running without keys */}
        {(!hasKey || isSimulated) && (
          <div className="mt-4 bg-[#0F1219]/90 border border-slate-800 rounded-xl p-4 flex items-start space-x-3 text-xs text-slate-300 shadow-md animate-fade-in">
            <AlertCircle className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white">Você está navegando no modo de simulação avançada.</p>
              <p className="mt-1 leading-relaxed text-slate-400">
                Seu servidor de tendências está pronto! Para carregar buscas reais do Google Trends ao vivo do Brasil e gerar pautas inéditas baseadas em notícias correntes via IA, vá no painel de <strong className="text-white">Settings &gt; Secrets</strong> do AI Studio, adicione o secret <code className="bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-cyan-400 font-mono">GEMINI_API_KEY</code> e atualize o painel!
              </p>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
