import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import TrendList from "./components/TrendList";
import PautaGrid from "./components/PautaGrid";
import Top10Sidebar from "./components/Top10Sidebar";
import { CoolHunterReport, Trend, PautaSuggestion } from "./types";
import { 
  Compass, 
  Sparkles, 
  Search, 
  BookOpen, 
  Cpu, 
  AlertCircle, 
  Copy, 
  Check, 
  Download, 
  X, 
  ArrowRight, 
  Zap, 
  TrendingUp,
  FileText,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [hasKey, setHasKey] = useState<boolean>(false);
  const [isSimulated, setIsSimulated] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("Geral");
  const [customQuery, setCustomQuery] = useState<string>("");
  const [activeSearchTerm, setActiveSearchTerm] = useState<string>("");
  
  // App data state
  const [report, setReport] = useState<CoolHunterReport | null>(null);
  
  // Article generation state
  const [isWritingArticle, setIsWritingArticle] = useState<boolean>(false);
  const [draftedArticle, setDraftedArticle] = useState<string | null>(null);
  const [draftedArticleTitle, setDraftedArticleTitle] = useState<string>("");
  const [draftedKeywords, setDraftedKeywords] = useState<string[]>([]);
  const [copied, setCopied] = useState<boolean>(false);

  // Load config & initial trends
  useEffect(() => {
    async function checkConfig() {
      try {
        const response = await fetch("/api/config");
        const configData = await response.json();
        setHasKey(configData.hasKey);
      } catch (err) {
        console.error("Erro ao verificar configuração: ", err);
      }
    }
    checkConfig();
  }, []);

  // Fetch report whenever category or custom search changes
  useEffect(() => {
    fetchTrends(activeSearchTerm || selectedCategory);
  }, [selectedCategory, activeSearchTerm]);

  const fetchTrends = async (nicheOrKeyword: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/trends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: nicheOrKeyword }),
      });
      const data = await response.json();
      setIsSimulated(!!data.simulated);
      if (data.report) {
        setReport(data.report);
      }
    } catch (err) {
      console.error("Erro ao buscar tendências: ", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (customQuery.trim()) {
      setActiveSearchTerm(customQuery.trim());
      setSelectedCategory(""); // clear pill filter visually
    }
  };

  const handleClearCustomSearch = () => {
    setCustomQuery("");
    setActiveSearchTerm("");
    setSelectedCategory("Geral");
  };

  const handleSelectKeyword = (keyword: string) => {
    setCustomQuery(keyword);
    setActiveSearchTerm(keyword);
    setSelectedCategory(""); // deselect standard options
    // Smooth scroll page to suggestions or top
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const handleDraftArticle = async (pauta: PautaSuggestion) => {
    setIsWritingArticle(true);
    setDraftedArticleTitle(pauta.title);
    setDraftedKeywords(pauta.seoKeywords || []);
    setDraftedArticle(null); // clear old draft
    
    try {
      const response = await fetch("/api/write-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pautaTitle: pauta.title,
          editorialAngle: pauta.editorialAngle,
          keywords: pauta.seoKeywords,
          outline: pauta.suggestedStructure
        }),
      });
      const data = await response.json();
      if (data.articleText) {
        setDraftedArticle(data.articleText);
      } else {
        setDraftedArticle("Não foi possível gerar o rascunho. Tente novamente.");
      }
    } catch (err) {
      console.error("Erro ao gerar artigo: ", err);
      setDraftedArticle("Erro ao conectar com o serviço de redação inteligente.");
    } finally {
      setIsWritingArticle(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (draftedArticle) {
      navigator.clipboard.writeText(draftedArticle);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadArticle = () => {
    if (!draftedArticle) return;
    const element = document.createElement("a");
    const file = new Blob([draftedArticle], { type: "text/markdown;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = `${draftedArticleTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-200 font-sans flex flex-col selection:bg-cyan-500 selection:text-black">
      
      {/* Sleek App Header */}
      <Header 
        hasKey={hasKey}
        isSimulated={isSimulated}
        isLoading={isLoading}
        selectedCategory={selectedCategory}
        setSelectedCategory={(cat) => {
          setSelectedCategory(cat);
          setActiveSearchTerm("");
          setCustomQuery("");
        }}
        onRefresh={() => fetchTrends(activeSearchTerm || selectedCategory || "Geral")}
      />

      {/* Main Container */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Custom Hunter Input Block */}
        <section className="bg-[#0F1219] p-5 rounded-2xl border border-slate-850 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4" id="custom-search-panel">
          <div className="space-y-1">
            <h2 className="text-sm font-black uppercase tracking-widest text-cyan-400 flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#22D3EE] animate-pulse" />
              Pesquisa Customizada de Nichos
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Digite uma marca, assunto regional ou celebridade para forçar a IA a varrer o Google Discover e criar ganchos editoriais exclusivos na hora.
            </p>
          </div>

          <form onSubmit={handleCustomSearch} className="flex items-center gap-2 w-full md:max-w-md shrink-0">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text"
                placeholder="Exemplo: 'Casas Bahia', 'Carros Elétricos', 'Neymar'..."
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                className="w-full bg-[#0B0E14] border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs font-medium text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 placeholder:text-slate-600 transition-all"
              />
              {activeSearchTerm && (
                <button
                  type="button"
                  onClick={handleClearCustomSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 hover:text-white"
                >
                  Limpar
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white font-bold text-xs rounded-xl transition-all shrink-0 cursor-pointer"
            >
              Buscar
            </button>
          </form>
        </section>

        {/* Dynamic State HUD */}
        {activeSearchTerm && (
          <div className="bg-cyan-950/20 border border-cyan-500/30 rounded-xl px-4 py-3.5 text-xs text-cyan-400 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse" />
              <span>
                Exibindo resultados customizados do "Cool Hunter" para: <strong className="text-white uppercase">"{activeSearchTerm}"</strong>
              </span>
            </div>
            <button 
              onClick={handleClearCustomSearch}
              className="text-[10px] uppercase font-black tracking-wider text-slate-400 hover:text-white border border-slate-705 px-3 py-1 rounded bg-[#0B0E14] cursor-pointer"
            >
              Voltar ao Feed Padrão
            </button>
          </div>
        )}

        {/* Loading Indicator Page Overlay or Block */}
        {isLoading && (
          <div className="w-full py-20 flex flex-col items-center justify-center space-y-4 bg-[#0F1219]/45 rounded-2xl border border-slate-800/50">
            <Compass className="w-12 h-12 text-[#22D3EE] animate-spin" />
            <div className="text-center space-y-1">
              <p className="text-xs uppercase font-mono tracking-widest text-slate-400">Varrendo a Web de Notícias...</p>
              <p className="text-[10px] text-slate-500 max-w-sm">Mapeando ganchos, subreddits, trending topics e estimativas de audiência do Discover Brasil.</p>
            </div>
          </div>
        )}

        {/* Content Panel Grid */}
        {!isLoading && report && (
          <div className="space-y-6">
            
            {/* Market Trend Overview Section */}
            <div className="bg-[#0F1219] rounded-2xl border border-slate-800 p-6 flex flex-col md:flex-row gap-5 items-start md:items-center">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono tracking-wider font-extrabold text-cyan-400 uppercase bg-cyan-950/40 border border-cyan-800/40 px-2.5 py-0.5 rounded-full">
                    RESUMO ANALÍTICO DISCOVER
                  </span>
                  <span className="text-slate-500 text-[10px] font-mono flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Gerado recentemente
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-200 leading-relaxed">
                  {report.marketSummary}
                </p>
              </div>

              {/* Tag stream */}
              <div className="w-full md:w-auto md:max-w-xs space-y-2 shrink-0">
                <span className="block text-[10px] text-slate-500 font-mono uppercase font-bold">TAGS SELECIONADAS EM ALTA</span>
                <div className="flex flex-wrap gap-1.5">
                  {report.topTags.map((tag, i) => (
                    <span 
                      key={tag + i} 
                      onClick={() => handleSelectKeyword(tag)}
                      className="bg-[#0B0E14] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[10px] px-2.5 py-1 rounded-md font-semibold cursor-pointer transition-all duration-150"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Two-Column split details layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Emerging Trend list column (70% on lg screen) */}
              <div className="lg:col-span-2 space-y-6">
                <TrendList 
                  trends={report.trends} 
                  onSelectKeyword={handleSelectKeyword} 
                />
              </div>

              {/* Top10 accessed sidebar predictor (30%) */}
              <div className="lg:col-span-1">
                <Top10Sidebar 
                  items={report.top10} 
                  onSelectTheme={handleSelectKeyword} 
                />
              </div>

            </div>

            {/* Pauta Sugestions IA full-width widget */}
            {report.suggestions && report.suggestions.length > 0 && (
              <section id="pautas-suggested-section" className="pt-2">
                <PautaGrid 
                  suggestions={report.suggestions} 
                  onDraftArticle={handleDraftArticle} 
                />
              </section>
            )}

          </div>
        )}

      </main>

      {/* Elegant Drawer / Modal Overlay for drafted news articles */}
      <AnimatePresence>
        {(isWritingArticle || draftedArticle) && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0F1219] border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl"
            >
              
              {/* Header */}
              <div className="border-b border-slate-800/80 px-6 py-4 flex items-center justify-between bg-[#0B0E14] rounded-t-2xl">
                <div className="flex items-center space-x-2.5">
                  <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse" />
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-450">Redator Editorial IA</span>
                    <h3 className="text-sm font-extrabold text-white line-clamp-1">{draftedArticleTitle}</h3>
                  </div>
                </div>
                <button 
                  onClick={() => { setDraftedArticle(null); setIsWritingArticle(false); }}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Loader */}
              {isWritingArticle && (
                <div className="flex-1 py-20 flex flex-col items-center justify-center space-y-4">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, ease: "linear", duration: 1.5 }}
                    className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full"
                  />
                  <div className="text-center space-y-1">
                    <p className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">Estruturando narrativa jornalística...</p>
                    <p className="text-[10px] text-slate-500 max-w-xs">Inserindo palavras-chave, criando chamadas para mobile e dividindo em intertítulos H2 altamente otimizados.</p>
                  </div>
                </div>
              )}

              {/* Draft Content body preview */}
              {draftedArticle && !isWritingArticle && (
                <>
                  <div className="flex-grow overflow-y-auto p-6 md:p-8 space-y-5 select-text">
                    
                    {/* SEO info badge list */}
                    <div className="bg-[#0B0E14] border border-slate-800 p-3.5 rounded-xl text-xs space-y-2">
                      <div className="flex items-center justify-between text-slate-400 font-mono text-[10px]">
                        <span>DENSIDADE DE PALAVRAS-CHAVE EXIGIDA</span>
                        <span className="text-cyan-450 uppercase font-bold">Discover Ready ✓</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {draftedKeywords.map((kw) => (
                          <span key={kw} className="bg-cyan-500/10 text-cyan-400 text-[10px] px-2 py-0.5 rounded border border-cyan-500/20 font-mono font-bold">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Article Markdown stylized container */}
                    <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed font-normal whitespace-pre-line space-y-4 md:text-sm">
                      {draftedArticle}
                    </div>

                  </div>

                  {/* Actions footer bar */}
                  <div className="border-t border-slate-800 px-6 py-4 bg-[#0B0E14] flex items-center justify-between gap-4 rounded-b-2xl">
                    <div className="text-[10px] text-slate-500 leading-snug font-mono max-w-xs hidden sm:block">
                      Artigo formatado para colar diretamente no WordPress, Blogger ou portais proprietários.
                    </div>

                    <div className="flex items-center space-x-2.5 ml-auto">
                      <button
                        onClick={handleCopyToClipboard}
                        className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-cyan-400" />
                            <span className="text-cyan-400 font-extrabold">Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar Markdown</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={handleDownloadArticle}
                        className="flex items-center space-x-1.5 bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs px-4 py-2.5 rounded-xl transition-all shadow-md shadow-cyan-950/20 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Baixar .MD</span>
                      </button>
                    </div>
                  </div>
                </>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-slate-850 bg-[#0F1219]/60 py-6 mt-12 bg-b font-mono">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2 sm:px-6 lg:px-8">
          <p className="text-[10px] text-slate-500">
            Cool Hunter Trends • Plataforma profissional de inteligência e escuta algorítmica de tendências.
          </p>
          <p className="text-[9px] text-slate-600">
            Powered by Gemini 3.5 Models under high-fidelity Search Grounding integration layer.
          </p>
        </div>
      </footer>

    </div>
  );
}
