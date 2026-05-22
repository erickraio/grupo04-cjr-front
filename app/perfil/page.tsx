'use client';

import React, { useEffect, useState, Suspense, useRef } from 'react';
import { ChevronLeft, Mail, Plus, Star, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '../components/navbar';
import Image from 'next/image';
import cameraImg from '../../public/camera.png';
function CameraIcon() {
  return (
    <Image 
      src={cameraImg} 
      alt="Ícone de Câmera" 
      className="w-6 h-6 object-contain"
    />
  );
}
function PerfilContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editNome, setEditNome] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editFotoUrl, setEditFotoUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  useEffect(() => {
    async function fetchPerfil() {
      try {
        const token = localStorage.getItem("@StockIO:token");
        const urlId = searchParams.get('id');
        if (!token && !urlId) {
          router.push('/login');
          return;
        }
        let loggedInUserId = null;
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            loggedInUserId = payload.sub || payload.id;
          } catch (jwtError) {
            console.error("Erro ao decodificar token antigo/inválido:", jwtError);
            localStorage.removeItem("@StockIO:token");
          }
        }
        const targetUserId = urlId ? parseInt(urlId) : loggedInUserId;
        if (!targetUserId) {
          router.push('/login');
          return;
        }
        setIsOwner(loggedInUserId !== null && targetUserId === loggedInUserId);
        const headers: HeadersInit = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        const response = await fetch(`http://localhost:3001/user/${targetUserId}`, { headers });
        if (!response.ok) throw new Error("Usuário não encontrado");
        const data = await response.json();
        setUserData(data);
        setEditNome(data.nome || '');
        setEditUsername(data.username || '');
        setEditEmail(data.email || '');
        setEditFotoUrl(data.foto_perfil_url || '');
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    }
    fetchPerfil();
  }, [router, searchParams]);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setEditFotoUrl(URL.createObjectURL(file));
    }
  };
const handleSaveProfile = async () => {
  try {
    const token = localStorage.getItem("@StockIO:token");
    if (!token) {
      alert("Sua sessão expirou. Faça login novamente.");
      router.push('/login');
      return;
    }
    const formData = new FormData();
    formData.append('name', editNome);
    formData.append('username', editUsername);
    formData.append('email', editEmail);
        if (selectedFile) {
      formData.append('foto_perfil', selectedFile);
    }
    const response = await fetch(`http://localhost:3001/user/${userData.id}`, {
      method: 'PATCH', 
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro ao atualizar perfil");
    }

    const updatedUser = await response.json();
    setUserData(updatedUser);
    setIsEditModalOpen(false);
    setSelectedFile(null);
    alert("Perfil atualizado com sucesso!");

  } catch (err: any) {
    console.error("Erro ao salvar perfil:", err);
    alert(err.message || "Não foi possível salvar as alterações.");
  }
};
  if (loading) return <div className="min-h-screen bg-[#f6f3e4] flex items-center justify-center font-bold text-black">Carregando perfil...</div>;
  if (!userData) return <div className="min-h-screen bg-[#f6f3e4] flex items-center justify-center font-bold text-black">Usuário não encontrado.</div>;
  const lojas = userData.lojas || [];
  const produtos = lojas.flatMap((loja: any) => loja.produtos || []); 
  const todasAvaliacoes = [...(userData.avaliacoes_produto || []), ...(userData.avaliacoes_loja || [])];
  return (
    <div className="min-h-screen w-full bg-[#f6f3e4] font-sans pb-20 relative">
      <Navbar />
      {/* HEADER PRETO */}
      <div className="h-[200px] bg-black w-full relative flex items-center px-10">
        <button onClick={() => router.back()} className="text-white hover:text-gray-300 transition-colors">
          <ChevronLeft size={40} strokeWidth={1.5} />
        </button>
      </div>
      {/* ÁREA DO PERFIL */}
      <div className="max-w-6xl mx-auto px-10 relative">

        {/* Foto de Perfil */}
        <div className="absolute -top-24 left-10 z-10">
          <div className="w-48 h-48 rounded-full border-4 border-[#f6f3e4] overflow-hidden bg-gray-300 shadow-md">
            <img 
              src={userData.foto_perfil_url || "/default-avatar.png"} 
              alt={userData.nome} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        {/* Informações de Texto e Botão de Editar */}
        <div className="pt-32 pb-12 relative flex justify-between items-start">
          <div>
            <h1 className="text-5xl font-bold text-black tracking-tight">{userData.nome}</h1>
            <p className="text-gray-600 text-xl mt-1">@ {userData.username}</p>
            <div className="flex items-center gap-2 text-gray-500 mt-2">
              <Mail size={18} />
              <span className="text-lg">{userData.email}</span>
            </div>
          </div>

          {isOwner && (
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="bg-[#7c3aed] text-white px-8 py-2 rounded-full font-semibold hover:bg-purple-700 transition-colors"
            >
              Editar Perfil
            </button>
          )}
        </div>

        {/* PRODUTOS */}
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

        {/* LOJAS */}
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

        {/* AVALIAÇÕES */}
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
      {/* MODAL DE EDITAR PERFIL (Renderizado condicionalmente) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#f3f0e0] w-full max-w-md rounded-[32px] p-8 relative shadow-2xl border border-gray-200 mx-4">
            
            {/* Botão Fechar */}
            <button 
              onClick={() => setIsEditModalOpen(false)} 
              className="absolute top-6 right-6 text-black hover:opacity-60 transition-opacity"
            >
              <X size={24} />
            </button>

            {/* Input de Arquivo Escondido */}
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {/* Avatar Central com Botão de Câmera */}
            <div className="flex flex-col items-center mb-8 relative">
              <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gray-300 shadow-md relative group">
                <img 
                  src={editFotoUrl || "/default-avatar.png"} 
                  alt="Pré-visualização" 
                  className="w-full h-full object-cover"
                />
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-[-12px] bg-white p-3 rounded-full shadow-md hover:scale-105 transition-transform border border-gray-100 flex items-center justify-center"
              >
                <CameraIcon />
              </button>
            </div>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Nome"
                value={editNome}
                onChange={(e) => setEditNome(e.target.value)}
                className="w-full bg-[#e8e5d5] placeholder-gray-500 text-black px-6 py-4 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#7c3aed]/20 transition-all font-medium"
              />
              <input 
                type="text" 
                placeholder="Username"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                className="w-full bg-[#e8e5d5] placeholder-gray-500 text-black px-6 py-4 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#7c3aed]/20 transition-all font-medium"
              />
              <input 
                type="email" 
                placeholder="Email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="w-full bg-[#e8e5d5] placeholder-gray-500 text-black px-6 py-4 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#7c3aed]/20 transition-all font-medium"
              />
            </div>
            <div className="mt-8 space-y-3">
              <button className="w-full py-3 border border-red-500 text-red-600 rounded-full font-semibold hover:bg-red-50 transition-colors">
                Deletar conta
              </button>
              <button className="w-full py-3 border border-purple-500 text-purple-600 rounded-full font-semibold hover:bg-purple-50 transition-colors">
                Alterar senha
              </button>
              <button 
                onClick={handleSaveProfile}
                className="w-full py-4 bg-[#7c3aed] text-white rounded-full font-bold shadow-lg hover:bg-purple-700 transition-colors pt-4"
              >
                Salvar
              </button>
            </div>

          </div>
        </div>
      )}
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