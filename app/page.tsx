'use client';

import { useState, useEffect, useRef } from "react"; 
import Navbar from "./components/navbar";
import Image from "next/image";

// ==========================================
// COMPONENTE PRINCIPAL (PÁGINA)
import Searchbar from "./components/searchbar";
import axios from "axios";
import Link from "next/link";
import CardProdutos from "./components/CardProdutos";
// ==========================================

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Função para resolver o caminho correto da imagem
function resolverUrl(url: string | undefined): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  if (url.startsWith('/images')) return url;
  return `${API_URL}${url}`;
}

export default function Home() {
  const [produtosFiltrados, setProdutosFiltrados] = useState<any[] | null>(null);
  const [carregando, setCarregando] = useState(false);

  // 1. Estados para guardar os dados do banco
  const [categorias, setCategorias] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [lojas, setLojas] = useState([]);

  // ==========================================
  // CONFIGURAÇÃO DOS REFS E LOGICA DE ARRASTAR
  // ==========================================
  const categoriasRef = useRef<HTMLDivElement>(null);
  const produtosRef = useRef<HTMLDivElement>(null);
  const lojasRef = useRef<HTMLDivElement>(null);

  // Lógica do Clique e Arrasta
  const criarFuncoesCarrossel = (ref: React.RefObject<HTMLDivElement | null>) => {
    const handleMouseDown = (e: React.MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      el.dataset.isDown = 'true';
      el.dataset.startX = String(e.pageX - el.offsetLeft);
      el.dataset.scrollLeft = String(el.scrollLeft);
    };

    const handleMouseLeaveOrUp = () => {
      const el = ref.current;
      if (!el) return;
      el.dataset.isDown = 'false';
    };

    const handleMouseMove = (e: React.MouseEvent) => {
      const el = ref.current;
      if (!el || el.dataset.isDown !== 'true') return;
      e.preventDefault();
      
      const x = e.pageX - el.offsetLeft;
      const walk = (x - Number(el.dataset.startX || 0)); 
      el.scrollLeft = Number(el.dataset.scrollLeft || 0) - walk;
    };

    return {
      onMouseDown: handleMouseDown,
      onMouseLeave: handleMouseLeaveOrUp,
      onMouseUp: handleMouseLeaveOrUp,
      onMouseMove: handleMouseMove,
      // Removemos o onWheel daqui para tratar direto no useEffect abaixo!
    };
  };

  const eventosCategorias = criarFuncoesCarrossel(categoriasRef);
  const eventosProdutos = criarFuncoesCarrossel(produtosRef);
  const eventosLojas = criarFuncoesCarrossel(lojasRef);

  // EFEITO MÁGICO: Trava o scroll vertical da página quando estiver rolando o carrossel
  useEffect(() => {
    const applyWheelListener = (ref: React.RefObject<HTMLDivElement | null>) => {
      const el = ref.current;
      if (!el) return;

      const handleNativeWheel = (e: WheelEvent) => {
        if (e.deltaY !== 0) {
          e.preventDefault(); // <-- TRAVA O SCROLL DA PÁGINA AQUI!
          el.scrollLeft += e.deltaY; // Rola o carrossel horizontalmente
        }
      };

      // O "passive: false" é o que permite o e.preventDefault() funcionar no scroll
      el.addEventListener('wheel', handleNativeWheel, { passive: false });

      return () => {
        el.removeEventListener('wheel', handleNativeWheel);
      };
    };

    const cleanupCat = applyWheelListener(categoriasRef);
    const cleanupProd = applyWheelListener(produtosRef);
    const cleanupLoj = applyWheelListener(lojasRef);

    return () => {
      if (cleanupCat) cleanupCat();
      if (cleanupProd) cleanupProd();
      if (cleanupLoj) cleanupLoj();
    };
  }, []);
  // ==========================================

  // Função para mapear o nome da categoria para o ícone correto
  const getCategoriaIcone = (nome: string) => {
    const nomeFormatado = nome.toLowerCase();

    if (nomeFormatado.includes('mercado')) return '/mercado-token.png';
    if (nomeFormatado.includes('farmácia') || nomeFormatado.includes('farmacia')) return '/farmacia-token.png';
    if (nomeFormatado.includes('beleza')) return '/beleza-token.png';
    if (nomeFormatado.includes('moda')) return '/moda-token.png';
    if (nomeFormatado.includes('eletrônico') || nomeFormatado.includes('eletronico')) return '/eletronico-token.png';
    if (nomeFormatado.includes('jogo')) return '/jogos-token.png';
    if (nomeFormatado.includes('brinquedo')) return '/brinquedos-token.png';
    if (nomeFormatado.includes('casa')) return '/casas-token.png';

    return '/icon-placeholder.png';
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setProdutosFiltrados(null);
      return;
    }
    setCarregando(true);
    try {
      const response = await axios.get(`${API_URL}/produtos?busca=${(query)}`);
      setProdutosFiltrados(response.data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setCarregando(false);
    }
  };
  
  // Efeito para buscar os dados ao carregar a página
  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [resCategorias, resProdutos, resLojas] = await Promise.all([
          fetch(`${API_URL}/category`),
          fetch(`${API_URL}/produtos`),
          fetch(`${API_URL}/lojas`)
        ]);

        const dataCategorias = await resCategorias.json();
        const dataProdutos = await resProdutos.json();
        const dataLojas = await resLojas.json();

        setCategorias(dataCategorias);
        setProdutos(dataProdutos);
        setLojas(dataLojas);

      } catch (error) {
        console.error("Erro ao buscar dados do backend:", error);
      }
    };

    carregarDados();
  }, []);

  return (
    <main className="min-h-screen bg-[#f6f3e4] dark:bg-[#1A1A1A] transition-colors duration-300">

      {/* NAVBAR */}
      <Navbar />

      {/* 1. SESSÃO PRETA (HERO)  */}
      <section className="bg-black dark:bg-[#111111] w-full pt-28 px-6 md:px-12 flex justify-center relative overflow-hidden transition-colors duration-300">
        <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between">
          <div className="w-full md:w-1/2 z-20 text-center md:text-left pb-16 md:pb-28 mt-8">
            <h1 className="text-white text-4xl md:text-5xl lg:text-[66px] font-semibold leading-[1] tracking-tight">
              Do CAOS à organização, <br />
              em alguns cliques
            </h1>
          </div>
          <div className="w-full md:w-[600px] flex justify-center md:justify-end mt-10 md:mt-0 relative h-[400px] md:h-[600px] lg:h-[700px] -mb-32 md:-mb-70 z-10">
            <Image
              src="/hero-illustration.png"
              alt="Personagem do Stock.io organizando caixas"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain object-bottom md:object-right-bottom"
              priority
            />
          </div>
        </div>
      </section>

      {/* 2. SESSÃO BEGE/ESCURA (CONTEÚDO PRINCIPAL) */}
      <section className="w-full px-6 md:px-12 py-8 flex justify-center">
        <div className="max-w-6xl w-full flex flex-col gap-12">

          {/* Barra de Pesquisa */}
          <div className="flex flex-col items-end w-full gap-2">
            <Searchbar onSearch={handleSearch} produtos={produtosFiltrados} />
            {carregando && <span className="text-sm text-[#7C3AED] dark:text-[#9b73f8] animate-pulse">Buscando produtos...</span>}
          </div>

          {/* Categorias */}
          <div>
            <h2 className="text-2xl font-bold text-black dark:text-white mb-6 transition-colors">Categoria</h2>

            <div 
              ref={categoriasRef}
              {...eventosCategorias}
              className="flex gap-4 md:gap-6 overflow-x-auto pb-6 pt-2 scrollbar-hide cursor-grab active:cursor-grabbing select-none"
            >
              {categorias.map((categoria: any) => (
                <Link href={`/categoria/${categoria.id}`} key={categoria.id} draggable="false">
                  <div className="flex flex-col items-center gap-3 min-w-[110px] cursor-pointer group pointer-events-none">
                    {/* Quadrado Branco/Escuro do Ícone */}
                    <div className="w-[100px] h-[100px] bg-white dark:bg-[#2A2A2A] rounded-[2rem] flex items-center justify-center shadow-[0px_4px_15px_rgba(0,0,0,0.03)] border border-transparent group-hover:border-indigo-100 dark:group-hover:border-gray-600 transition-colors">
                      <Image
                        src={getCategoriaIcone(categoria.nome)}
                        alt={`Ícone ${categoria.nome}`}
                        width={46}
                        height={46}
                        className="object-contain"
                        draggable="false"
                      />
                    </div>
                    {/* Nome da Categoria */}
                    <span className="text-[15px] font-semibold text-black dark:text-white transition-colors">{categoria.nome}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Produtos: Todos */}
          <div className="mt-4">
            <div className="flex items-baseline gap-3 mb-6">
              <h2 className="text-3xl font-bold text-black dark:text-white transition-colors">Produtos</h2>
              <span className="text-sm font-medium text-[#7C3AED] dark:text-[#9b73f8] transition-colors">todos</span>
            </div>

            <div 
              ref={produtosRef}
              {...eventosProdutos}
              className="flex gap-6 overflow-x-auto pb-6 pt-2 scrollbar-hide cursor-grab active:cursor-grabbing select-none"
            >
              {Array.isArray(produtos) && produtos.map((produto: any) => (
                <div key={produto.id} className="min-w-[220px] md:min-w-[260px]" draggable="false">
                  <CardProdutos data={produto} />
                </div>
              ))}
            </div>
          </div>

          {/* Secção Lojas */}
          <div className="mt-12 mb-20">
            <div className="flex justify-between items-end mb-8">
              <h2 className="text-3xl font-bold text-black dark:text-white transition-colors">Lojas</h2>
              
              {/* Botão de Filtro */}
              <button className="flex items-center gap-12 bg-white dark:bg-[#2A2A2A] rounded-full px-6 py-2 shadow-sm text-[#A78BFA] dark:text-[#9b73f8] font-medium text-lg border border-transparent hover:border-indigo-100 dark:hover:border-gray-600 transition-all">
                filtros
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Lista Horizontal de Lojas */}
            <div 
              ref={lojasRef}
              {...eventosLojas}
              className="flex gap-6 md:gap-10 overflow-x-auto pb-4 scrollbar-hide cursor-grab active:cursor-grabbing select-none"
            >
              {lojas.map((loja: any) => (
                <Link href={`/lojas/${loja.id}`} key={loja.id} draggable="false">
                  <div className="flex flex-col items-center gap-3 min-w-[130px] cursor-pointer pointer-events-none">
                    {/* Círculo da Loja com Imagem Dinâmica */}
                    <div className="w-[130px] h-[130px] rounded-full flex items-center justify-center shadow-sm border-[6px] border-[#F6F5ED] dark:border-[#1A1A1A] bg-black text-white font-bold text-center overflow-hidden transition-colors">
                      {loja.logo_url ? (
                        <img 
                          src={resolverUrl(loja.logo_url)} 
                          alt={`Logo ${loja.nome}`} 
                          className="w-full h-full object-cover" 
                          draggable="false"
                        />
                      ) : (
                        <span className="p-2">{loja.nome}</span>
                      )}
                    </div>

                    <div className="flex flex-col items-center leading-tight">
                      <span className="text-lg font-medium text-black dark:text-white transition-colors duration-300">{loja.nome}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </section>

    </main>
  );
}