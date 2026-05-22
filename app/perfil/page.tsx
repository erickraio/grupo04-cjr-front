'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { ChevronLeft, Mail, Plus, Star } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '../components/navbar';

function PerfilContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    async function fetchPerfil() {
      try {
        const token = localStorage.getItem("@StockIO:token");
        if (!token) {
          router.push('/login');
          return;
        }

        const payload = JSON.parse(atob(token.split('.')[1]));
        const loggedInUserId = payload.sub || payload.id;

        const urlId = searchParams.get('id');
        const targetUserId = urlId ? parseInt(urlId) : loggedInUserId;

        setIsOwner(targetUserId === loggedInUserId);

        const response = await fetch(`http://localhost:3001/user/${targetUserId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error("Usuário não encontrado");
        
        const data = await response.json();
        setUserData(data);

      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchPerfil();
  }, [router, searchParams]);

  if (loading) return <div className="min-h-screen bg-[#f6f3e4] flex items-center justify-center font-bold text-black">Carregando perfil...</div>;
  if (!userData) return <div className="min-h-screen bg-[#f6f3e4] flex items-center justify-center font-bold text-black">Usuário não encontrado.</div>;

  const lojas = userData.lojas || [];
  const produtos = lojas.flatMap((loja: any) => loja.produtos || []); 
  
  const avaliacoesProduto = userData.avaliacoes_produto || [];
  const avaliacoesLoja = userData.avaliacoes_loja || [];
  const todasAvaliacoes = [...avaliacoesProduto, ...avaliacoesLoja];

  return (
    <div className="min-h-screen w-full bg-[#f6f3e4] font-sans pb-20">
      
      {/* NAVBAR */}
      <Navbar />

      {/* HEADER PRETO */}
      <div className="h-[200px] bg-black w-full relative flex items-center px-10">
        <button onClick={() => router.back()} className="text-white hover:text-gray-300 transition-colors">
          <ChevronLeft size={40} strokeWidth={1.5} />
        </button>
      </div>

      {/* ÁREA DO PERFIL (Foto e Infos) */}
      <div className="max-w-6xl mx-auto px-10 relative -mt-24">
        
        <div className="flex flex-col md:flex-row justify-between md:items-end mb-12">
          
          {/* Esquerda: Foto e Textos */}
          <div className="flex flex-col">
            {/* Foto de Perfil */}
            <div className="w-48 h-48 rounded-full border-[6px] border-[#f6f3e4] overflow-hidden bg-gray-300 shadow-md z-10 shrink-0">
              <img 
                src={userData.foto_perfil_url || "/default-avatar.png"} 
                alt={userData.nome} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Informações de Texto */}
            <div className="mt-4">
              <h1 className="text-5xl font-bold text-black tracking-tight">{userData.nome}</h1>
              <p className="text-gray-600 text-xl mt-1">@{userData.username}</p>
              <div className="flex items-center gap-2 text-gray-500 mt-2">
                <Mail size={18} />
                <span className="text-lg">{userData.email}</span>
              </div>
            </div>
          </div>

          {/* Direita: Botão de Editar Perfil */}
          {isOwner && (
            <div className="mt-6 md:mt-0 md:pb-6 flex items-end">
              <button className="bg-[#7c3aed] text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors shadow-md cursor-pointer">
                Editar Perfil
              </button>
            </div>
          )}
        </div>
        {produtos.length > 0 && (
          <div className="mb-14">
            <h2 className="text-3xl font-bold text-black mb-6">Produtos</h2>
            <div className="flex gap-6 overflow-x-auto pb-4">
              {produtos.map((prod: any) => (
                <div key={prod.id} className="min-w-[220px] bg-white rounded-3xl p-4 shadow-sm flex flex-col items-center border border-gray-100">
                  <div className="w-full h-48 bg-gray-100 rounded-2xl mb-4 overflow-hidden flex items-center justify-center">
                    <img 
                      src={prod.imagens && prod.imagens.length > 0 ? prod.imagens[0].url_imagem : "/produto-placeholder.png"} 
                      alt={prod.nome} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <h3 className="font-bold text-lg w-full text-left text-black truncate">{prod.nome}</h3>
                  <p className="font-semibold text-md w-full text-left text-gray-800">R$ {prod.preco.toFixed(2).replace('.', ',')}</p>
                  <p className={`text-xs font-bold w-full text-left mt-1 ${prod.estoque > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {prod.estoque > 0 ? 'DISPONÍVEL' : 'INDISPONÍVEL'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SEÇÃO: LOJAS */}
        {(lojas.length > 0 || isOwner) && (
          <div className="mb-14">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-black">Lojas</h2>
              {isOwner && (
                <button className="bg-[#7c3aed] text-white p-2 rounded-full hover:bg-purple-700 transition-colors shadow-md">
                  <Plus size={24} />
                </button>
              )}
            </div>
            {lojas.length > 0 ? (
              <div className="flex gap-6 overflow-x-auto pb-4">
                {lojas.map((loja: any) => (
                  <div key={loja.id} className="min-w-[400px] bg-white rounded-3xl p-6 shadow-sm flex justify-between items-center border border-gray-100">
                    <div>
                      <h3 className="text-3xl font-light text-black">{loja.nome}</h3>
                      <p className="text-[#7c3aed] text-lg font-medium mt-1">beleza</p> 
                    </div>
                    <div className="w-24 h-24 rounded-full bg-[#fdf8f6] flex items-center justify-center border border-pink-100 overflow-hidden shrink-0">
                      {loja.logo_url ? <img src={loja.logo_url} alt="Logo" className="w-full h-full object-cover"/> : <span className="text-xs text-pink-800 text-center px-2">{loja.nome}</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-lg">Você ainda não possui nenhuma loja cadastrada.</p>
            )}
          </div>
        )}

        {/* SEÇÃO: AVALIAÇÕES */}
        {todasAvaliacoes.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-black mb-6">Avaliações</h2>
            <div className="flex flex-col gap-5">
              {todasAvaliacoes.map((av: any) => (
                <div key={av.id} className="bg-white rounded-3xl p-6 shadow-sm flex gap-6 border border-gray-100">
                  <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 bg-gray-200 border-2 border-white shadow-sm">
                     <img src={userData.foto_perfil_url || "/default-avatar.png"} alt={userData.nome} className="w-full h-full object-cover" />
                  </div>
                  <div className="w-full">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-black">{userData.nome}</h3>
                        <span className="text-xs text-[#7c3aed] bg-purple-50 px-3 py-1 rounded-full font-medium inline-block mt-1">
                          {av.id_loja ? 'Avaliação de Loja' : 'Avaliação de Produto'}
                        </span>
                      </div>
                      <div className="flex gap-1 text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={20} fill={i < av.nota ? "currentColor" : "none"} strokeWidth={i < av.nota ? 0 : 1} stroke="currentColor" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 mt-3 mb-4 text-base leading-relaxed">{av.comentario}</p>
                    <div className="flex justify-end">
                      <button className="text-[#7c3aed] font-medium text-sm hover:underline">ver mais</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function Perfil() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f6f3e4] flex items-center justify-center font-bold text-black">Carregando...</div>}>
      <PerfilContent />
    </Suspense>
  );
}