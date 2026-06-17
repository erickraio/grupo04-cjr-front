'use client';

import React, { useEffect, useState, Suspense, useRef } from 'react';
import { ChevronLeft, Mail, Plus, Star, X } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '../../components/navbar';
import ModalAdicionarLoja from '../../components/ModalAdicionarLoja';
import ModalEditarLoja from '../../components/ModalEditarLoja'; 
import Image from 'next/image';

const cameraImg = "/camera.png";

function CameraIcon() {
  return (
    <Image 
      src={cameraImg} 
      alt="Ícone de Câmera" 
      width={24} 
      height={24}
      className="w-6 h-6 object-contain"
    />
  );
}

function PerfilContent() {
  const router = useRouter();
  const params = useParams();
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

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [senhaAntiga, setSenhaAntiga] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  // ESTADOS DAS MODAIS DE LOJA AQUI
  const [isAddLojaModalOpen, setIsAddLojaModalOpen] = useState(false);
  const [isEditLojaModalOpen, setIsEditLojaModalOpen] = useState(false); // <-- ADICIONADO
  const [lojaSelecionada, setLojaSelecionada] = useState<any>(null);     // <-- ADICIONADO

  const handleSalvarSenha = async () => {
    if (novaSenha !== confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    try {
      const token = localStorage.getItem("@StockIO:token");
      
      const response = await fetch(`http://localhost:3001/user/${userData.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          senhaAntiga: senhaAntiga, 
          senha: novaSenha          
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao atualizar a senha");
      }

      alert("Senha atualizada com sucesso!");
      setIsPasswordModalOpen(false);
      setSenhaAntiga('');
      setNovaSenha('');
      setConfirmarSenha('');

    } catch (err: any) {
      console.error("Erro ao alterar senha:", err);
      alert(err.message || "Não foi possível alterar a senha.");
    }
  };

  useEffect(() => {
    async function fetchPerfil() {
      try {
        const token = localStorage.getItem("@StockIO:token");
        const urlId = params?.id as string; 
        
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
  }, [router, params?.id]); 

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

  const handleDeletarConta = async () => {
    const confirmacao = window.confirm("Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.");
    
    if (!confirmacao) return;
    try {
      const token = localStorage.getItem("@StockIO:token");
      
      const response = await fetch(`http://localhost:3001/user/${userData.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao deletar a conta.");
      }
      alert("Sua conta foi deletada com sucesso.");
      localStorage.removeItem("@StockIO:token");
      setIsEditModalOpen(false);
      router.push('/login');
    } catch (err: any) {
      console.error("Erro ao deletar conta:", err);
      alert(err.message || "Não foi possível deletar a conta.");
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
      <div className="h-[200px] bg-black w-full relative flex items-center px-10">
        <button onClick={() => router.back()} className="text-white hover:text-gray-300 transition-colors">
          <ChevronLeft size={40} strokeWidth={1.5} />
        </button>
      </div>
      <div className="max-w-6xl mx-auto px-10 relative">

        <div className="absolute -top-24 left-10 z-10">
          <div className="w-48 h-48 rounded-full border-4 border-[#f6f3e4] overflow-hidden bg-gray-300 shadow-md">
            <img 
              src={userData.foto_perfil_url || "/default-avatar.png"} 
              alt={userData.nome} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
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

        {(lojas.length > 0 || isOwner) && (
          <div className="mb-14">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-black">Lojas</h2>
              {isOwner && (
                <button 
                  onClick={() => setIsAddLojaModalOpen(true)}
                  className="bg-[#7c3aed] text-white p-2 rounded-full hover:bg-purple-700 transition-colors shadow-md cursor-pointer">
                  <Plus size={24} />
                </button>
              )}
            </div>
            {lojas.length > 0 ? (
              <div className="flex gap-6 overflow-x-auto pb-4">
                {lojas.map((loja: any) => (
                  <div 
                    key={loja.id} 
                    // EVENTO DE CLIQUE ADICIONADO AQUI 👇
                    onClick={() => {
                      setLojaSelecionada({ id: loja.id, nome: loja.nome, categoria: 'beleza' });
                      setIsEditLojaModalOpen(true);
                    }}
                    className="min-w-[400px] bg-white rounded-3xl p-6 shadow-sm flex justify-between items-center border border-gray-100 cursor-pointer hover:border-purple-200 transition-all shrink-0"
                  >
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
{todasAvaliacoes.length > 0 && (
  <div>
    <h2 className="text-3xl font-bold text-black mb-6">Avaliações</h2>
    <div className="flex flex-col gap-5">
      {todasAvaliacoes.filter((av, index, self) =>
        index === self.findIndex((t) =>
          t.id === av.id && !!t.id_loja === !!av.id_loja
        )
      ).map((av: any) => (
        <div key={av.id_loja ? `loja-${av.id}` : `produto-${av.id}`} className="bg-white rounded-3xl p-6 shadow-sm flex gap-6 border border-gray-100">
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
              <button 
                onClick={() => {
                  if (av.id_loja) {
                    router.push(`/aval-loja/${av.id}`);
                  } else {
                    router.push(`/avaliacao/${av.id}`); 
                  }
                }}
                className="text-[#7c3aed] font-medium text-sm hover:underline cursor-pointer"
              >
                ver mais
              </button>
            </div>

          </div>
        </div>
      ))}
    </div>
  </div>
)}
      </div>
      
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#f3f0e0] w-full max-w-md rounded-[32px] p-8 relative shadow-2xl border border-gray-200 mx-4">
            
            <button 
              onClick={() => setIsEditModalOpen(false)} 
              className="absolute top-6 right-6 text-black hover:opacity-60 transition-opacity cursor-pointer"
            >
              <X size={24} />
            </button>

            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

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
              <button 
                onClick={handleDeletarConta}
                className="w-full py-3 border border-red-500 text-red-600 rounded-full font-semibold hover:bg-red-50 transition-colors cursor-pointer">
                Deletar conta
              </button>

              <button 
                  onClick={() => {
                    setIsEditModalOpen(false); 
                    setIsPasswordModalOpen(true); 
                  }}
                  className="w-full py-3 border border-purple-500 text-purple-600 rounded-full font-semibold hover:bg-purple-50 transition-colors cursor-pointer">
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

      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-[420px] bg-[#F2F2F2] rounded-[2.5rem] p-8 shadow-2xl mx-4 flex flex-col items-center">
            
            <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
              <button 
                onClick={() => { setIsPasswordModalOpen(false); setIsEditModalOpen(true); }} 
                className="text-black hover:text-gray-500 transition-colors cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button 
                onClick={() => setIsPasswordModalOpen(false)} 
                className="text-black hover:text-gray-500 transition-colors cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mt-8 mb-8">
              <img src="/key-token.png" alt="Ícone de Chave Roxa" className="w-[120px] h-[120px] object-contain" />
            </div>

            <div className="w-full flex flex-col gap-4 mb-10 px-2">
              <input 
                type="password" placeholder="Senha Antiga" value={senhaAntiga} onChange={(e) => setSenhaAntiga(e.target.value)}
                className="w-full px-6 py-3.5 rounded-full bg-white text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] shadow-sm"
              />
              <input 
                type="password" placeholder="Nova Senha" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)}
                className="w-full px-6 py-3.5 rounded-full bg-white text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] shadow-sm"
              />
              <input 
                type="password" placeholder="Confirmar Senha" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)}
                className="w-full px-6 py-3.5 rounded-full bg-white text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] shadow-sm"
              />
            </div>

            <button 
              onClick={handleSalvarSenha}
              className="w-full max-w-[280px] bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-medium py-3.5 px-6 rounded-full shadow-[0px_4px_14px_rgba(124,58,237,0.4)] transition-all cursor-pointer"
            >
              Salvar Senha
            </button>
          
          </div>
        </div>
      )}

      {/* COMPONENTES RENDERIZADOS AQUI NO FINAL 👇 */}
      <ModalAdicionarLoja 
        isOpen={isAddLojaModalOpen} 
        onClose={() => setIsAddLojaModalOpen(false)} 
        userId={userData.id} 
      />

      <ModalEditarLoja 
        isOpen={isEditLojaModalOpen} 
        onClose={() => setIsEditLojaModalOpen(false)} 
        lojaDados={lojaSelecionada} 
      />

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