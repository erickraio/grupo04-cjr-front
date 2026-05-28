'use client';

import { useState, useEffect } from "react";
import Navbar from "./components/navbar";
import Image from "next/image";


// ==========================================
// COMPONENTE PRINCIPAL (PÁGINA)import {useState} from "react";
import Searchbar from "./components/searchbar";
import axios from "axios";
// ==========================================

export default function Home() {
  const [produtosFiltrados, setProdutosFiltrados] = useState<any[] | null>(null);
  const [carregando,setCarregando] = useState(false);

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
    
    // Ícone padrão caso a categoria não tenha imagem específica
    return '/icon-placeholder.png'; 
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setProdutosFiltrados(null);
      return;
    }
    setCarregando(true);
    try {
      const response = await axios.get(`http://localhost:3001/produtos?busca=${(query)}`);
      setProdutosFiltrados(response.data);
      console.log("Busca realizada com sucesso:", response.data);
      console.log("Termo pesquisado:", query);
      console.log("Produtos retornados:", response.data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setCarregando(false);
    }
  };
  // 1. Estados para guardar os dados do banco
  const [categorias, setCategorias] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [lojas, setLojas] = useState([]);

  // 2. Efeito para buscar os dados ao carregar a página
  useEffect(() => {
    const carregarDados = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL; 

        // Dispara as três requisições ao mesmo tempo
        const [resCategorias, resProdutos, resLojas] = await Promise.all([
          fetch(`${baseUrl}/category`),
          fetch(`${baseUrl}/produtos`),
          fetch(`${baseUrl}/lojas`)
        ]);

        // Converte as respostas para JSON
        const dataCategorias = await resCategorias.json();
        const dataProdutos = await resProdutos.json();
        const dataLojas = await resLojas.json();

        // Atualiza os estados com os dados reais
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
    <main className="min-h-screen bg-[#F6F5ED]">

        {/* NAVBAR */}
      <Navbar />
      
      {/* 1. SESSÃO PRETA (HERO)  */}
      <section className="bg-black w-full pt-28 px-6 md:px-12 flex justify-center relative overflow-hidden">
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

      {/* 2. SESSÃO BEGE (CONTEÚDO PRINCIPAL) */}
      <section className="w-full px-6 md:px-12 py-8 flex justify-center">
        <div className="max-w-6xl w-full flex flex-col gap-12">
          
          {/* Barra de Pesquisa */}
          <div className="flex flex-col items-end w-full gap-2">
            <Searchbar onSearch={handleSearch} produtos={produtosFiltrados} />
            {carregando && <span className="text-sm text-[#7C3AED] animate-pulse">Buscando produtos...</span>}
          </div>

          {/* Categorias */}
          <div>
            <h2 className="text-2xl font-bold text-black mb-6">Categoria</h2>
            
            <div className="flex gap-4 md:gap-6 overflow-x-auto pb-6 pt-2 scrollbar-hide">
               {categorias.map((categoria: any) => (
                 <div key={categoria.id} className="flex flex-col items-center gap-3 min-w-[110px] cursor-pointer group">
                    
                    {/* Quadrado Branco do Ícone */}
                    <div className="w-[100px] h-[100px] bg-white rounded-[2rem] flex items-center justify-center shadow-[0px_4px_15px_rgba(0,0,0,0.03)] border border-transparent group-hover:border-indigo-100 transition-colors">
                      <Image 
                        src={getCategoriaIcone(categoria.nome)} 
                        alt={`Ícone ${categoria.nome}`} 
                        width={46} 
                        height={46} 
                        className="object-contain"
                      />
                    </div>
                    
                    {/* Nome da Categoria */}
                    <span className="text-[15px] font-semibold text-black">{categoria.nome}</span>
                 </div>
               ))}
            </div>
          </div>

          {/* ============================================== */}
          {/* 3. PRODUTOS E LOJAS                            */}
          {/* ============================================== */}

          {/* Produtos: Todos */}
          <div className="mt-4">
            <div className="flex items-baseline gap-3 mb-6">
              <h2 className="text-3xl font-bold text-black">Produtos</h2>
              <span className="text-sm font-medium text-[#7C3AED]">todos</span>
            </div>
            
            <div className="flex gap-6 overflow-x-auto pb-6 pt-2 scrollbar-hide">
                {produtos.map((produto: any) => (
                <div key={produto.id} className="min-w-[220px] md:min-w-[260px]">
                <CardProduto data={produto} />
              </div>
              ))}
            </div>
          </div>


          {/* Secção Lojas */}
          <div className="mt-12 mb-20">
            <div className="flex justify-between items-end mb-8">
              <h2 className="text-3xl font-bold text-black">Lojas</h2>
              
              {/* Botão de Filtro */}
              <button className="flex items-center gap-12 bg-white rounded-full px-6 py-2 shadow-sm text-[#A78BFA] font-medium text-lg border border-transparent hover:border-indigo-100 transition-all">
                filtros
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            
            {/* Lista Horizontal de Lojas */}
            <div className="flex gap-6 md:gap-10 overflow-x-auto pb-4 scrollbar-hide">
              {lojas.map((loja: any) => (
                <div key={loja.id} className="flex flex-col items-center gap-3 min-w-[130px] cursor-pointer">
                  {/* Círculo da Loja */}
                  <div className={`w-[130px] h-[130px] rounded-full flex items-center justify-center shadow-sm border-[6px] border-[#F6F5ED] bg-black text-white font-bold text-center p-2`}>
                     <span>{loja.nome}</span>
                  </div>
                  
                  <div className="flex flex-col items-center leading-tight">
                    <span className="text-lg font-medium text-black">{loja.nome}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </section>

    </main>
  );
}

// ==========================================
// COMPONENTE DE CARD DE PRODUTO 
// ==========================================

function CardProduto({ data }: { data: any }) {
  // Ajustando para os nomes prováveis do backend (banco de dados)
  const isDisponivel = data.quantidade > 0; // Exemplo: se tem quantidade, está disponível
  
  return (
    <div className="bg-white rounded-3xl p-4 md:p-5 shadow-[0px_4px_15px_rgba(0,0,0,0.02)] flex flex-col relative border border-transparent hover:border-gray-200 transition-all cursor-pointer">
      
      {/* Área da Imagem do Produto (Espaço Disponível) */}
      <div className="relative w-full h-[160px] bg-gray-50 rounded-2xl mb-4 flex items-center justify-center text-gray-300 text-xs mt-4">
         <span>Imagem: {data.nome}</span>
      </div>

      {/* Informações de Texto */}
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-bold text-black leading-tight truncate">{data.nome}</h3>
        
        <p className="text-xl font-bold text-black flex items-baseline gap-1 mt-1">
          R$ {data.preco} 
        </p>
        
        <span className={`text-[11px] font-bold mt-1 tracking-wide ${isDisponivel ? 'text-[#B5D400]' : 'text-[#E53E3E]'}`}>
          {isDisponivel ? 'DISPONÍVEL' : 'INDISPONÍVEL'}
        </span>
      </div>
    </div>
  );
}