import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization helper for Gemini
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

// Check key availability
app.get("/api/config", (req, res) => {
  const hasKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";
  res.json({
    hasKey,
    appUrl: process.env.APP_URL || "http://localhost:3000",
  });
});

// Mock/simulation data generator for Brazilian context
function generateSimulatedReport(category: string): any {
  const techSimData = {
    timestamp: new Date().toISOString(),
    marketSummary: "O algoritmo do Google Discover está priorizando análises aprofundadas sobre o impacto de IA Generativa local na América Latina e dicas práticas de finanças pessoais digitais. O público busca ativamente guias práticos focados em utilidade imediata e alertas de golpes cibernéticos sazonais.",
    topTags: ["Inovação IA", "Segurança Digital", "Criptoeconomia", "Gadgets 2026", "Carreiras Tech"],
    trends: [
      {
        id: "trend-tech-1",
        keyword: "Aparelhos inteligentes com IA integrada",
        category: "Tecnologia",
        searchVolume: "+150k buscas",
        growthRate: "+320% nas últimas 24h",
        discoverScore: 92,
        sentiment: "positive",
        description: "Grande pico de buscas por dispositivos inteligentes para o lar e smartphones com tradução inteligente offline após anúncios de grandes marcas de hardware.",
        sourceUrls: ["https://trends.google.com"]
      },
      {
        id: "trend-tech-2",
        keyword: "Fraudes com Pix clonado e Inteligência Artificial",
        category: "Seguronça",
        searchVolume: "+80k buscas",
        growthRate: "Avanço exponencial",
        discoverScore: 88,
        sentiment: "negative",
        description: "Notícias de novos golpes que imitam vozes de parentes por áudio gerado de IA assustam internautas brasileiros. Google Discover mostrando alta tração de guias de prevenção.",
        sourceUrls: ["https://trends.google.com"]
      },
      {
        id: "trend-tech-3",
        keyword: "Ações de tecnologia em queda no Brasil",
        category: "Economia",
        searchVolume: "+50k buscas",
        growthRate: "+150% de interesse",
        discoverScore: 75,
        sentiment: "neutral",
        description: "Movimentos de taxas de juros americanas causam instabilidade no mercado de startups tecnológicas brasileiras.",
        sourceUrls: ["https://trends.google.com"]
      },
      {
        id: "trend-tech-4",
        keyword: "Lançamento de novo sistema de IA nacional",
        category: "Inovação",
        searchVolume: "+120k buscas",
        growthRate: "+210% esta semana",
        discoverScore: 95,
        sentiment: "positive",
        description: "Consórcio de universidades brasileiras lança modelo de linguagem optimizado para o português brasileiro e focado em serviços públicos.",
        sourceUrls: ["https://trends.google.com"]
      }
    ],
    suggestions: [
      {
        id: "pauta-tech-1",
        title: "Perigo Real: Como identificar golpes com clones de voz criados por Inteligência Artificial no WhatsApp?",
        subTitle: "Especialistas apontam técnicas simples para proteger familiares de golpes com áudios clonados hiper-realistas.",
        category: "Tecnologia",
        trendSource: "Fraudes com Pix clonado e Inteligência Artificial",
        editorialAngle: "Guia Rápido & Educacional",
        whyItWillTrend: "Combina alta urgência social com utilidade pública direta. O algoritmo do Discover impulsiona guias de segurança com altos cliques devido ao fator de autopreservação.",
        discoverProbability: 95,
        seoKeywords: ["golpe clone de voz", "seguranca whatsapp ia", "golpe do pix clonado", "como evitar golpes de ia"],
        targetAudience: "Público geral, famílias, idosos e usuários ativos de redes sociais",
        suggestedStructure: [
          "O que é o golpe do clone de voz por IA?",
          "Como os criminosos capturam e replicam amostras de voz",
          "3 testes rápidos para comprovar se o áudio é falso",
          "O que fazer imediatamente se você for vítima"
        ],
        urgency: "crítica"
      },
      {
        id: "pauta-tech-2",
        title: "O Guia dos Novos Eletrônicos com IA no Brasil: Vale a pena investir nessas promessas ou é puro Marketing?",
        subTitle: "Nós testamos os assistentes embarcados e mostramos o que realmente funciona no dia a dia.",
        category: "Tecnologia",
        trendSource: "Aparelhos inteligentes com IA integrada",
        editorialAngle: "Análise Crítica e Teste de Produto",
        whyItWillTrend: "Consumidores estão confusos se devem pagar mais por aparelhos com selo 'IA'. Conteúdos contra-intuitivos ou reviews práticos têm alto CTR.",
        discoverProbability: 89,
        seoKeywords: ["celular com inteligencia artificial", "casa inteligente ia vale a pena", "tecnologia brasileira 2026"],
        targetAudience: "Entusiastas de eletrônicos, consumidores buscando novos celulares",
        suggestedStructure: [
          "O boom dos selos de IA em eletrônicos",
          "Funcionalidades reais vs. Promessas de marketing",
          "Nossos testes rápidos: Tradução de voz e busca visual",
          "Veredito: Esperar ou comprar agora?"
        ],
        urgency: "alta"
      },
      {
        id: "pauta-tech-3",
        title: "IA Grátis Desenvolvida no Brasil: Conheça o modelo oficial em português e como testar",
        subTitle: "Criada por cientistas locais, a nova inteligência entende as nossas gírias e as leis do nosso país.",
        category: "Inovação",
        trendSource: "Lançamento de novo sistema de IA nacional",
        editorialAngle: "Exclusivo & Divulgação Tecnológica",
        whyItWillTrend: "Ufania nacional e curiosidade tecnológica. Notícias sobre tecnologias soberanas ganham enorme compartilhamento editorial orgânico.",
        discoverProbability: 92,
        seoKeywords: ["ia brasileira gratis", "inteligencia artificial brasil", "como usar ia nacional"],
        targetAudience: "Estudantes, profissionais em desenvolvimento, nerds de tecnologia",
        suggestedStructure: [
          "O marco histórico da IA totalmente brasileira",
          "Por que ela é mais precisa para brasileiros que os concorrentes estrangeiros",
          "Passo a passo simples para testar online gratuitamente",
          "Aplicações futuras nas escolas e postos de saúde"
        ],
        urgency: "alta"
      }
    ],
    top10: [
      {
        position: 1,
        theme: "Alerta de golpes cibernéticos com simulação de voz por IA",
        angle: "Como se defender do assustador roubo de voz digital que esvazia contas no Brasil.",
        estimatedTraffic: "350k+ visualizações estimadas",
        growthTrend: "up",
        hook: "A sua própria voz pode ser usada para desviar dinheiro do Pix de parentes. Proteja-se hoje com essa palavra-passe."
      },
      {
        position: 2,
        theme: "Análise da IA Nacional",
        angle: "Passo a passo para usar a nova ferramenta brasileira que rivaliza com gigantes de IA mundiais.",
        estimatedTraffic: "220k+ visualizações estimadas",
        growthTrend: "up",
        hook: "Ela entende as piadas e trejeitos do Brasil como nenhuma outra. Teste gratuitamente a ferramenta."
      },
      {
        position: 3,
        theme: "Eletrônicos com IA no lar brasileiro",
        angle: "Quais gadgets realmente economizam tempo na cozinha e automação residencial em 2026.",
        estimatedTraffic: "180k+ visualizações estimadas",
        growthTrend: "stable",
        hook: "Nesse guia desvendamos a verdade sobre as geladeiras com IA: utilidade real ou eletrônico de luxo sem utilidade?"
      },
      {
        position: 4,
        theme: "Mudanças no algoritmo do Google Discover",
        angle: "Formatos que as redações devem postar para surfar a nova onda do Discover do Google.",
        estimatedTraffic: "140k+ visualizações estimadas",
        growthTrend: "up",
        hook: "Sua redação está perdendo cliques? Mude para esses três formatos de pauta imediatamente."
      },
      {
        position: 5,
        theme: "Queda de investimento em startups",
        angle: "O reflexo prático no mercado de emprego para programadores juniores no Brasil.",
        estimatedTraffic: "110k+ visualizações estimadas",
        growthTrend: "down",
        hook: "Não basta saber codar: como se diferenciar na fase de contratações enxutas."
      }
    ]
  };

  const generalSimData = {
    timestamp: new Date().toISOString(),
    marketSummary: "A atenção do internauta hoje no Brasil está pulverizada entre receitas e debates sobre economia e lifestyle saudável na rede social. Pautas com forte apelo visual, fáceis de consumir e focadas em responder dúvidas urgentes do dia-a-dia estão alcançando as melhores posições do Discover.",
    topTags: ["Economia Doméstica", "Truques de Cozinha", "Famosos & Viral", "Dicas de Viagem", "Saúde em Dia"],
    trends: [
      {
        id: "trend-gen-1",
        keyword: "Redução do preço dos combustíveis e alimentos",
        category: "Economia Doméstica",
        searchVolume: "+250k buscas",
        growthRate: "+410% de interesse",
        discoverScore: 96,
        sentiment: "positive",
        description: "Novas medidas governamentais e queda internacional do barril de petróleo têm grande impacto em cidades brasileiras. Muita busca comparativa e aplicativos de desconto.",
        sourceUrls: ["https://trends.google.com"]
      },
      {
        id: "trend-gen-2",
        keyword: "Nova receita viral de café da manhã rápido",
        category: "Gastronomia",
        searchVolume: "+180k buscas",
        growthRate: "+180% nas últimas 12h",
        discoverScore: 94,
        sentiment: "positive",
        description: "Mistura com tapioca e ovos que imita quitutes tradicionais com zero glúten viraliza no TikTok e salta nas buscas do Google.",
        sourceUrls: ["https://trends.google.com"]
      },
      {
        id: "trend-gen-3",
        keyword: "Sintomas de nova virose respiratória saonal",
        category: "Saúde",
        searchVolume: "+140k buscas",
        growthRate: "Alta de temporada",
        discoverScore: 85,
        sentiment: "negative",
        description: "Mudanças repentinas de temperatura no Sudeste brasileiro provocam aumento na busca por tratamentos caseiros e vacinação.",
        sourceUrls: ["https://trends.google.com"]
      }
    ],
    suggestions: [
      {
        id: "pauta-gen-1",
        title: "Gasolina barata: 5 truques científicos de direção para fazer o combustível render até 30% mais",
        subTitle: "Evite os erros mais comuns no trânsito que sugam energia do carro e encarecem a conta municipal.",
        category: "Economia Doméstica",
        trendSource: "Redução do preço dos combustíveis e alimentos",
        editorialAngle: "Lista de Dicas Práticas",
        whyItWillTrend: "Apelo massivo. Todo proprietário de veículo busca economizar, e dicas com fundamentação científica que de fato comprovam eficácia têm alto CTR.",
        discoverProbability: 97,
        seoKeywords: ["como economizar combustivel", "gasolina barata trucos", "como fazer gasolina render"],
        targetAudience: "Motoristas de aplicativo, motoristas particulares, proprietários de veículos em geral",
        suggestedStructure: [
          "O peso do combustível no bolso do brasileiro",
          "O erro da 'embreagem livre' e outras falsas dicas",
          "5 hábitos respaldados por engenheiros mecânicos",
          "Calibrar os pneus economiza gasolina de fato?"
        ],
        urgency: "baixa"
      },
      {
        id: "pauta-gen-2",
        title: "Crepioca Crocante de Forno: O café da manhã de 5 minutos sem trigo que está fazendo sucesso nas cozinhas",
        subTitle: "Substituto do pão de sal leva poucos ingredientes, é fofo por dentro e super crocante.",
        category: "Gastronomia",
        trendSource: "Nova receita viral de café da manhã rápido",
        editorialAngle: "Instrucional / Receita Prática",
        whyItWillTrend: "Receitas de 5 minutos sem glúten são campeãs de recomendação do Google Discover. Pessoas salvam para ler depois ou executam imediatamente.",
        discoverProbability: 95,
        seoKeywords: ["crepioca de forno rapida", "refeicoes sem gluten em 5 minutos", "cafe da manha saudavel receita"],
        targetAudience: "Praticantes de dieta low carb, mães buscando refeições rápidas, entusiastas de comida saudável",
        suggestedStructure: [
          "O que faz essa crepioca viralizar tanto?",
          "Lista curta de ingredientes baratos",
          "Passo a passo simples em um único recipiente",
          "Opções de acompanhamento e recheio leve"
        ],
        urgency: "média"
      }
    ],
    top10: [
      {
        position: 1,
        theme: "Receita rápida de Crepioca Fit",
        angle: "O passo a passo com fotos para fazer o lanche saudável mais falado da semana.",
        estimatedTraffic: "400k+ visualizações estimadas",
        growthTrend: "up",
        hook: "Mude o seu café da manhã clássico por essa opção de apenas 5 minutos que combate o inchaço."
      },
      {
        position: 2,
        theme: "Economia no trânsito brasileiro",
        angle: "Guia definitivo para calibrar, dirigir e economizar no posto de combustível.",
        estimatedTraffic: "320k+ visualizações estimadas",
        growthTrend: "up",
        hook: "Acelerou rápido na saída do semáforo? Descubra o quanto você joga de reais fora por mês."
      },
      {
        position: 3,
        theme: "Virose e prevenção em clima seco",
        angle: "Chás caseiros e xaropes recomendados por médicos para aliviar gargantas secas.",
        estimatedTraffic: "200k+ visualizações estimadas",
        growthTrend: "up",
        hook: "Seu filho começou com tosse? Saiba quando correr ao hospital ou como aliviar os primeiros sintomas em casa."
      }
    ]
  };

  return category === "Tecnologia" ? techSimData : generalSimData;
}

// Trends API with real-time browser grounding through Gemini Search
app.post("/api/trends", async (req, res) => {
  const { category = "Geral", region = "BR" } = req.body;
  const ai = getGeminiClient();

  // If no API client, provide simulated high-quality data
  if (!ai) {
    console.log("Using simulated data for trends search due to missing or placeholder API key.");
    const report = generateSimulatedReport(category);
    return res.json({
      simulated: true,
      report,
    });
  }

  try {
    const prompt = `
      Você é um especialista em jornalismo, Cool Hunter e estrategista de SEO para portais de notícias do Brasil.
      Sua missão é realizar uma pesquisa minuciosa da web utilizando o mecanismo de busca sobre os "temas mais buscados hoje", "notícias quentes", "tendências do Google Trends" e "tópicos virais nas redes sociais" no Brasil (Ano 2026), focados na categoria "${category}".
      
      Após a busca, compile as informações em um relatório estratégico em formato JSON estruturado EXATAMENTE com as seguintes diretrizes para o Google Discover e Alerta de Notícias:
      
      1. Identifique 3 a 5 palavras-chave ou tópicos que estão explodindo em termos de volume de busca e engajamento ("trends").
      2. Crie sugestões de pautas de notícias inovadoras de alto impacto, bem formatadas ("suggestions"). Cada pauta sugerida deve ter um título ultra-atraente (click do bem), subtítulo, por que vai estourar no Google Discover, as sub-estruturas sugeridas (H2s), urgência e tags de SEO.
      3. Monte uma lista com o TOP 5 de temas jornalísticos e as propostas de abordagem ("top10" - contendo as 5 posições) previstas para entrarem nas mais acessadas e de maior engajamento.

      Retorne APENAS um objeto JSON válido, sem markdown ou caracteres extras ao redor, contendo os campos correspondentes descritos no schema.
    `;

    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            marketSummary: { type: Type.STRING, description: "Breve resumo sobre o comportamento do Discover atual para esta busca" },
            topTags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Tags em ascensão proeminente" },
            trends: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  keyword: { type: Type.STRING, description: "Palavra-chave trending" },
                  category: { type: Type.STRING },
                  searchVolume: { type: Type.STRING, description: "Volume ou intensidade das pesquisas ex: +100k pesquisas" },
                  growthRate: { type: Type.STRING, description: "Porcentagem de crescimento" },
                  discoverScore: { type: Type.INTEGER, description: "Score de 0 a 100 de chance de Discover" },
                  sentiment: { type: Type.STRING, description: "Sentiment do termo: positive, neutral, negative" },
                  description: { type: Type.STRING, description: "O que gerou a febre de buscas" }
                },
                required: ["id", "keyword", "category", "searchVolume", "growthRate", "discoverScore", "sentiment", "description"]
              }
            },
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING, description: "Manchete jornalística explosiva e recomendada (CTR máximo)" },
                  subTitle: { type: Type.STRING, description: "Gancho complementar" },
                  category: { type: Type.STRING },
                  trendSource: { type: Type.STRING, description: "De qual tendência veio" },
                  editorialAngle: { type: Type.STRING, description: "Estilo da abordagem" },
                  whyItWillTrend: { type: Type.STRING, description: "Por que as pessoas vão clicar" },
                  discoverProbability: { type: Type.INTEGER, description: "0 a 100" },
                  seoKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                  targetAudience: { type: Type.STRING },
                  suggestedStructure: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Seções h2 sugeridas" },
                  urgency: { type: Type.STRING, description: "baixa | média | alta | crítica" }
                },
                required: ["id", "title", "subTitle", "category", "trendSource", "editorialAngle", "whyItWillTrend", "discoverProbability", "seoKeywords", "targetAudience", "suggestedStructure", "urgency"]
              }
            },
            top10: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  position: { type: Type.INTEGER },
                  theme: { type: Type.STRING },
                  angle: { type: Type.STRING },
                  estimatedTraffic: { type: Type.STRING },
                  growthTrend: { type: Type.STRING, description: "up, stable, ou down" },
                  hook: { type: Type.STRING }
                },
                required: ["position", "theme", "angle", "estimatedTraffic", "growthTrend", "hook"]
              }
            }
          },
          required: ["marketSummary", "topTags", "trends", "suggestions", "top10"]
        }
      }
    });

    const text = result.text;
    if (!text) {
      throw new Error("Empty response from Gemini API");
    }

    const report = JSON.parse(text.trim());
    return res.json({
      simulated: false,
      report,
      groundingChunks: result.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    });

  } catch (error: any) {
    console.error("Gemini Search Grounding error, falling back to simulated data: ", error.message);
    const report = generateSimulatedReport(category);
    return res.json({
      simulated: true,
      error: error.message,
      report,
    });
  }
});

// Editorial Article draft generator based on suggested Pitch/Pauta
app.post("/api/write-article", async (req, res) => {
  const { pautaTitle, editorialAngle, keywords, outline } = req.body;
  const ai = getGeminiClient();

  const mockArticle = `
# ${pautaTitle}

*Por Cool Hunter Editor - Publicado no Alerta de Notícias*

## O gancho do momento
Nas últimas horas, um volume imenso de pesquisas tomou conta do Google e de feeds sociais do país. Trata-se do rápido aumento nas discussões sobre as palavras-chave **${keywords?.join(", ") || "tendências"}**. E o ângulo que as redações mais bem-sucedidas estão aproveitando é o de um **${editorialAngle || "guia educativo prático"}**.

Neste artigo, trazemos uma estrutura impecável de conteúdo para responder todas as dúvidas do público que utiliza mecanismos de pesquisas, focado em atingir o topo das listagens e permanecer na primeira tela do Google Discover.

---

${outline?.map((h2: string) => `
## ${h2}
Aqui o redator editorial deve desenvolver este tópico de forma simples e de fácil leitura, usando frases de no máximo três linhas e quebrando em listas de marcadores (bullet-points) sempre que cabível. 
- **O que focar:** Responda de forma direta e rápida nos primeiros dois parágrafos o que o usuário quer saber para agradar a métrica de retenção inicial do navegador.
- **Inserções de palavras chaves:** Use estrategicamente os sinônimos de ${keywords?.join(", ") || "assuntos em alta"}.
`).join("\n")}

---

## 3 Segredos exclusivos para esta pauta bombar no Discover:
1. **Imagem de Capa com Alto Contraste:** Imagens vibrantes com foco no centro (sem textos poluindo) convertem até 60% mais no feed orgânico.
2. **URL Curta e Escaneável:** Evite datas ou caracteres longos na slug do seu portal. Utilize termos diretos da matéria.
3. **Mantenha a Atualidade:** Use dados coletados no Google Trends Brasil para dar precisão à sua escrita.
  `;

  if (!ai) {
    return res.json({
      simulated: true,
      articleText: mockArticle.trim()
    });
  }

  try {
    const prompt = `
      Você é o redator sênior do Cool Hunter Trends. Sua pauta de notícias selecionada foi: "${pautaTitle}".
      O ângulo editorial solicitado é: "${editorialAngle}".
      Palavras-chave vitais de SEO a incluir: ${keywords?.join(", ") || "trends"}.
      A estrutura sugerida recomendada para o artigo é:
      ${outline?.map((item: string) => `- ${item}`).join("\n") || "- Introdução\n- O que saber\n- Vantagens\n- Conclusão"}

      Escreva um artigo de blog jornalístico altamente envolvente em Português do Brasil com tamanho aproximado de 500 a 700 palavras, desenhado especificamente para atrair cliques orgânicos volumosos no Google Discover.
      O artigo deve ser formatado em Markdown, contendo títulos claros (H2, H3), uma introdução magnética, parágrafos curtos altamente escaneáveis pelo leitor móvel, inserções ricas das palavras-chave fornecidas de forma natural e dicas de autoridade jornalística exclusivas do Cool Hunter para esse assunto.
    `;

    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    const articleText = result.text || mockArticle;

    return res.json({
      simulated: false,
      articleText: articleText.trim()
    });

  } catch (error: any) {
    console.error("Gemini write article error, falling back: ", error.message);
    return res.json({
      simulated: true,
      error: error.message,
      articleText: mockArticle.trim()
    });
  }
});

// Vite server middleware configuration or static assets rendering
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on http://localhost:${PORT}`);
  });
}

startServer();
