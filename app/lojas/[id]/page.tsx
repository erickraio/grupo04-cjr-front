'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '../../components/navbar';
import CardProduto from '../../components/CardProdutos'; 
import Image from 'next/image';
import { AnyCaaRecord } from 'dns';
import CardAvaliacao from '../../components/CardAvaliacoes';
import {jwtDecode} from 'jwt-decode';
import ModalEditarAvaliacao from '../../components/ModalEditarAvaliacao';
import ModalAvaliarLoja from '../../components/ModalAvaliarLoja';

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
  const [usuarioLogadoId, setUsuarioLogadoId] = useState<number | null>(null);
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [modalavaliacaoAberto, setModalAvaliacaoAberto] = useState(false);

  const [usuarioLogado, setUsuarioLogado] = useState(false);
  

  useEffect(() => {
    const token = localStorage.getItem('@StockIO:token');
    if (token) {
      setUsuarioLogado(true);
    try {
      const decoded: any = jwtDecode(token);

      setUsuarioLogadoId(Number(decoded.id)); 
    } catch (error) {
      console.error("Erro ao decodificar o token de login:", error);
    }
  }
}, []);
  const router = useRouter();
  const params = useParams();
  const idLoja = params.id 
  const avaliacoesRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [avaliacaoEditando, setAvaliacaoEditando] = useState<AvalProps | null>(null);

    const startDragging = (e: any, ref: any) => {
    if (!ref.current) return;
    setIsDragging(true);
    setStartX(e.pageX - ref.current.offsetLeft);
    setScrollLeft(ref.current.scrollLeft);
  };

  const stopDragging = () => {
    setIsDragging(false);
  };  

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
  
  const [loja, setLoja] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);
 
  useEffect(() => {
    if (!idLoja)  return;
    
    async function fetchLoja() {
      try {
        setCarregando(true);
        const resposta = await fetch(`http://localhost:3001/lojas/${idLoja}`);
        const dados = await resposta.json();
        console.log('Dados da loja:', dados);
        setLoja(dados);
      } catch (error) {
        console.error('Erro ao buscar loja:', error);
      } finally {
        setCarregando(false);
      }
    }
    fetchLoja();
  }, [idLoja]);

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <p className="text-xl font-medium text-black animate-pulse">Carregando...</p>
      </div>
    )
  }

  if (!loja) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF7] gap-4">
        <p className="text-xl font-bold text-black">Loja não encontrada.</p>
        <button onClick={() => router.push('/')} className="px-4 py-2 bg-blue-500 text-white cursor-pointer rounded-xl transition">
          Voltar para a Home page.
        </button>
      </div>
    )
  }

  const avaliacoes = loja.avaliacoes || [];
  const totalavaliacoes = avaliacoes.length;

  const mediaNota = totalavaliacoes > 0 
  ? avaliacoes.reduce((acc: number, curr: any) => acc + curr.nota, 0) / totalavaliacoes
  : 0;

  const estrelas = Array.from({length: 5}, (_, index) => {
    const numeroEstrela = index + 1;

    if (mediaNota >= numeroEstrela) {
      return 100;
    } else if (mediaNota > numeroEstrela - 1 ){
      return Math.round((mediaNota - (numeroEstrela - 1)) * 100);
    } return 0;
  })
  return (
    <div className="min-h-screen bg-[#f6f3e4]">
      <div className="absolute top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      <div className="relative w-full h-[480px] flex items-center justify-center overflow-hidden">

        <Image
          src={loja?.banner_url || '/images/steambanner.jpg'}
          alt={`Banner da loja ${loja?.nome}`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/60" />
        <div className="absolute z-10 flex flex-col items-center text-center mt-12">
          <h1 className="text-6xl md:text-7xl font-semibold text-white tracking-wide drop-shadow-md">
            {loja?.nome}
            {loja?.descricao && (
              <p className="text-lg text-white mt-2">{loja.descricao}</p>
            )}
          </h1>
          
          <div className="flex gap-3 items-center text-xl">
            <div className="flex gap-1">
              {estrelas.map((porcentagem, i) => {
                const gradienteId = `loja-${loja?.id || 'nova'}-gradiente-${i}`; 
                
                return (
                <svg
                  key={i}
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  stroke="#151d29"
                  strokeWidth="1"
                >
                  <defs>
                    <linearGradient id={gradienteId} x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset={`${porcentagem}%`} stopColor="#FBBF24"/>
                      <stop offset={`${porcentagem}%`} stopColor="#D1D5DB"/>
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
        <section>
        <div className="flex items-baseline gap-2 mb-8">
          <h2 className="text-3xl font-extrabold text-black">Produtos</h2>
          <span className="text-sm font-medium text-gray-500">melhor avaliados</span>
        </div>

        
        <div className="flex gap-6 overflow-x-auto pb-6 pt-2 scrollbar-hide">
          {loja?.produtos?.map((produto: ProdutoProps) => (
            <div key={produto.id} className="min-w-[220px] md:min-w-[260px]">
              <CardProduto data={produto} />
            </div>
          ))}
        </div>
        </section>
          
        <section>
          <div className="flex flex-col mt-20 gap-6">
            <div className="flex items-center gap-4">
<h2 className="text-3xl font-extrabold text-gray-900">Avaliações</h2>
      {usuarioLogado && (
        <button
          onClick={() => setModalAvaliacaoAberto(true)}
          className="w-[36px] h-[36px] bg-[#6A38F3] rounded-full flex items-center justify-center hover:bg-gray-200 transition cursor-pointer"
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
      />
    ))}

    {(!loja?.avaliacoes || loja.avaliacoes.length === 0) && (
      <div className="text-gray-500 italic mt-4">Nenhuma avaliação ainda. Seja o primeiro!</div>
    )}
  </div>
</div>
        </section>
      </main>
      {modalavaliacaoAberto && (
        <ModalAvaliarLoja
          isOpen={modalavaliacaoAberto}
          onClose={() => setModalAvaliacaoAberto(false)}
          nomeLoja={loja?.nome}
          idLoja={loja?.id}
        />
      )}

      {modalEdicaoAberto && (
        <ModalEditarAvaliacao
          isOpen={modalEdicaoAberto}
          avaliacao={avaliacaoEditando}
          onClose={() => setModalEdicaoAberto(false)}
          onAvaliacaoAtualizada={() => {
          }}
        />
      )}
    </div>
  );
}