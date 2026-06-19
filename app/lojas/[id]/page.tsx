'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '../../components/navbar';
import CardProduto from '../../components/CardProdutos'; 
import Image from 'next/image';
import CardAvaliacao from '../../components/CardAvaliacoes';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function resolverUrl(url?: string): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  if (url.startsWith('/images')) return url;
  return `${API_URL}${url}`;
}
import { jwtDecode } from 'jwt-decode';
import ModalEditarAvaliacao from '../../components/ModalEditarAvaliacao';
import ModalAvaliarLoja from '../../components/ModalAvaliarLoja';
// ── NOVO IMPORT ──
import ModalCriarProduto from '../../components/ModalCriarProduto'; 

interface ProdutoProps {
  id: number;
  nome: string;
  preco: number;
  estoque: number;
  imagens?: { url_imagem: string }[];
}

interface AvalProps {
  id: number;
  id_loja: number;
  id_usuario: number;
  nota: number;
  comentario: string;
}

export default function Loja() {
  const router = useRouter();
  const params = useParams();
  const idLoja = params.id;

  const [usuarioLogadoId, setUsuarioLogadoId] = useState<number | null>(null);
  const [usuarioLogado, setUsuarioLogado] = useState(false);
  
  // Estados das Modais
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [modalavaliacaoAberto, setModalAvaliacaoAberto] = useState(false);
  const [modalCriarProdutoAberto, setModalCriarProdutoAberto] = useState(false); // ── NOVO ESTADO ──

  const avaliacoesRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [avaliacaoEditando, setAvaliacaoEditando] = useState<AvalProps | null>(null);

  const [loja, setLoja] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);

  // 1. Verifica quem está logado
  useEffect(() => {
    const token = localStorage.getItem('@StockIO:token');
    if (token) {
      setUsuarioLogado(true);
      try {
        const decoded: any = jwtDecode(token);
        // Usa o 'sub' (padrão JWT) ou o 'id' dependendo de como o back-end mandou
        setUsuarioLogadoId(Number(decoded.sub || decoded.id)); 
      } catch (error) {
        console.error("Erro ao decodificar o token de login:", error);
      }
    }
  }, []);

  // 2. Busca os dados da loja (separado para podermos chamar novamente após criar produto/avaliar)
  const fetchLoja = async () => {
    if (!idLoja) return;
    try {
      setCarregando(true);
      const resposta = await fetch(`http://localhost:3001/lojas/${idLoja}`);
      if (!resposta.ok) throw new Error("Loja não encontrada");
      const dados = await resposta.json();
      setLoja(dados);
    } catch (error) {
      console.error('Erro ao buscar loja:', error);
      setLoja(null);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    fetchLoja();
  }, [idLoja]);

  // Funções de arrastar (Carrossel)
  const startDragging = (e: any, ref: any) => {
    if (!ref.current) return;
    setIsDragging(true);
    setStartX(e.pageX - ref.current.offsetLeft);
    setScrollLeft(ref.current.scrollLeft);
  };
  const stopDragging = () => setIsDragging(false);  
  const onDrag = (e: any, ref: any) => {
    if (!isDragging || !ref.current) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    ref.current.scrollLeft = scrollLeft - (x - startX);
  };

  const handleAbrirModalEdicao = (avaliacao: AvalProps) => {
    setAvaliacaoEditando(avaliacao);
    setModalEdicaoAberto(true);
  }

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f3e4] dark:bg-[#1A1A1A] transition-colors duration-300">
        <p className="text-xl font-medium text-black dark:text-white animate-pulse">Carregando loja...</p>
      </div>
    )
  }

  if (!loja) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f6f3e4] dark:bg-[#1A1A1A] gap-4 transition-colors duration-300">
        <p className="text-xl font-bold text-black dark:text-white">Loja não encontrada.</p>
        <button onClick={() => router.push('/')} className="px-6 py-3 bg-[#6A38F3] hover:bg-purple-700 text-white font-bold cursor-pointer rounded-full transition-colors shadow-md">
          Voltar para a Home
        </button>
      </div>
    )
  }

  const avaliacoes = loja.avaliacoes || [];
  const totalavaliacoes = avaliacoes.length;
  
  // ── VERIFICAÇÃO DE DONO DA LOJA ──
  const isOwner = usuarioLogadoId !== null && loja.id_dono === usuarioLogadoId; 

  const mediaNota = totalavaliacoes > 0 
    ? avaliacoes.reduce((acc: number, curr: any) => acc + curr.nota, 0) / totalavaliacoes
    : 0;

  const estrelas = Array.from({length: 5}, (_, index) => {
    const numeroEstrela = index + 1;
    if (mediaNota >= numeroEstrela) return 100;
    else if (mediaNota > numeroEstrela - 1 ) return Math.round((mediaNota - (numeroEstrela - 1)) * 100);
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#f6f3e4] dark:bg-[#1A1A1A] transition-colors duration-300 pb-20">
      <div className="absolute top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      {/* BANNER DA LOJA */}
      <div className="relative w-full h-[480px] flex items-center justify-center overflow-hidden">
        <Image
          src={resolverUrl(loja?.banner_url) || '/images/steambanner.jpg'}
          alt={`Banner da loja ${loja?.nome}`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/80" />
        <div className="absolute z-10 flex flex-col items-center text-center mt-12">
          <h1 className="text-6xl md:text-7xl font-semibold text-white tracking-wide drop-shadow-md">
            {loja?.nome}
          </h1>
          {loja?.descricao && (
            <p className="text-lg text-gray-200 mt-2 max-w-2xl px-4">{loja.descricao}</p>
          )}
          
          <div className="flex gap-3 items-center text-xl mt-4">
            <div className="flex gap-1">
              {estrelas.map((porcentagem, i) => {
                const gradienteId = `loja-${loja?.id || 'nova'}-gradiente-${i}`; 
                return (
                <svg key={i} width="24" height="24" viewBox="0 0 24 24" stroke="#151d29" strokeWidth="1">
                  <defs>
                    <linearGradient id={gradienteId} x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset={`${porcentagem}%`} stopColor="#FBBF24"/>
                      <stop offset={`${porcentagem}%`} stopColor="#4B5563"/>
                    </linearGradient>
                  </defs>
                  <polygon
                    points="12,0 14.6,8.4 23.5,8.4 16.3,13.7 19,21.8 12,16.8 5,21.8 7.7,13.7 0.5,8.4 9.4,8.4"
                    fill={`url(#${gradienteId})`}
                    />
                </svg>
                );
              })}
            </div>
            <span className="text-sm font-bold text-[#FBBF24]">
              {mediaNota.toFixed(1)} / 5 ({totalavaliacoes === 1 ? 'Avaliação' : 'Avaliações'})
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        
        {/* SEÇÃO PRODUTOS */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-extrabold text-black dark:text-white transition-colors duration-300">Produtos</h2>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300">da loja</span>
            </div>

            {/* ── BOTÃO ADICIONAR PRODUTO (SÓ APARECE PARA O DONO DA LOJA) ── */}
            {isOwner && (
              <button
                onClick={() => setModalCriarProdutoAberto(true)}
                className="w-[36px] h-[36px] bg-[#6A38F3] rounded-full flex items-center justify-center hover:bg-purple-700 transition cursor-pointer shadow-md hover:scale-105"
                title="Adicionar novo produto"
              >
                <Image
                  src="/images/mais.png"
                  alt="Adicionar Produto"
                  width={18}
                  height={18}
                />
              </button>
            )}
          </div>

          {(!loja?.produtos || loja.produtos.length === 0) ? (
            <p className="text-gray-500 dark:text-gray-400 italic transition-colors duration-300">Esta loja ainda não possui nenhum produto cadastrado.</p>
          ) : (
            <div className="flex gap-6 overflow-x-auto pb-6 pt-2 scrollbar-hide">
              {loja.produtos.map((produto: ProdutoProps) => (
                <div key={produto.id} className="min-w-[220px] md:min-w-[260px]">
                  <CardProduto data={{ ...produto, loja: { id: loja.id, nome: loja.nome, logo_url: loja.logo_url } }} />
                </div>
              ))}
            </div>
          )}
        </section>
          
        {/* SEÇÃO AVALIAÇÕES */}
        <section>
          <div className="flex flex-col mt-16 gap-6">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white transition-colors duration-300">Avaliações</h2>
              
              {/* Botão de Avaliar Loja (Aparece para quem está logado) */}
              {usuarioLogado && (
                <button
                  onClick={() => setModalAvaliacaoAberto(true)}
                  className="w-[36px] h-[36px] bg-[#6A38F3] rounded-full flex items-center justify-center hover:bg-purple-700 transition cursor-pointer shadow-md hover:scale-105"
                  title="Avaliar esta loja"
                >
                  <Image
                    src="/images/mais.png"
                    alt="Adicionar Avaliação"
                    width={18}
                    height={18}
                  />
                </button>
              )}
            </div>
      
            <div
              ref={avaliacoesRef}
              onMouseDown={(e) => startDragging(e, avaliacoesRef)}
              onMouseLeave={stopDragging}
              onMouseUp={stopDragging}
              onMouseMove={(e) => onDrag(e, avaliacoesRef)}
              className={`flex flex-row gap-6 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] select-none ${
                isDragging ? "cursor-grabbing snap-none" : "cursor-grab snap-x"
              }`}
            >
              {loja?.avaliacoes?.map((avaliacao: any) => (
                <CardAvaliacao 
                  key={avaliacao.id} 
                  data={avaliacao} 
                  usuarioLogadoId={usuarioLogadoId || undefined}
                  isDragging={isDragging}
                  abrirModalEdicao={handleAbrirModalEdicao}
                  tipo="loja"
                />
              ))}

              {(!loja?.avaliacoes || loja.avaliacoes.length === 0) && (
                <div className="text-gray-500 dark:text-gray-400 italic mt-4 transition-colors duration-300">Nenhuma avaliação ainda. Seja o primeiro!</div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* ── MODAIS ── */}

      <ModalAvaliarLoja
        isOpen={modalavaliacaoAberto}
        onClose={() => setModalAvaliacaoAberto(false)}
        nomeLoja={loja?.nome}
        idLoja={loja?.id}
        onAvaliacaoCriada={fetchLoja} // Atualiza a página após avaliar
      />

      <ModalEditarAvaliacao
        isOpen={modalEdicaoAberto}
        avaliacao={avaliacaoEditando}
        onClose={() => setModalEdicaoAberto(false)}
        onAvaliacaoAtualizada={fetchLoja} // Atualiza a página após editar
      />

      <ModalCriarProduto
        isOpen={modalCriarProdutoAberto}
        onClose={() => setModalCriarProdutoAberto(false)}
        idLoja={loja?.id}
        onProdutoCriado={fetchLoja} // Atualiza a página após criar produto
      />
    </div>
  );
}