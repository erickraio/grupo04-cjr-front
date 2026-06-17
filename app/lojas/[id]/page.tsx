'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '../../components/navbar';
import CardProduto from '../../components/CardProdutos'; 
import Image from 'next/image';
import { AnyCaaRecord } from 'dns';

interface ProdutoProps {
  id: number;
  nome: string;
  preco: number;
  estoque: number;
  imagens?: { url_imagem: string }[];
}

export default function Loja() {
  const router = useRouter();
  const params = useParams();
  const idLoja = params.id 
  
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
          </h1>
          
          <div className="flex gap-1 mt-3 text-[#FBBF24] text-xl">
            {`${"★".repeat(loja?.estrelas || 0)}${"☆".repeat(5 - (loja?.estrelas || 0))}`}
          </div>
        </div>
      </div>


      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        
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
      </main>
    </div>
  );
}