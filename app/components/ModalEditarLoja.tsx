'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('@StockIO:token') || null;
}

function resolverUrl(url: string | undefined): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  if (url.startsWith('/images')) return url;
  return `${API_URL}${url}`;
}

interface ModalEditarLojaProps {
  isOpen: boolean;
  onClose: () => void;
  lojaDados?: any;
  onLojaAtualizada?: () => void;
}

export default function ModalEditarLoja({ isOpen, onClose, lojaDados, onLojaAtualizada }: ModalEditarLojaProps) {
  // Estados de texto
  const [nomeLoja, setNomeLoja] = useState('');
  const [idCategoria, setIdCategoria] = useState('');
  const [categorias, setCategorias] = useState<{ id: number; nome: string }[]>([]);
  
  // Estados de carregamento
  const [salvando, setSalvando] = useState(false);
  const [deletando, setDeletando] = useState(false);

  // Estados de Arquivos (Uploads)
  const [fotoPerfilFile, setFotoPerfilFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  // Estados de Previews
  const [previewFoto, setPreviewFoto] = useState('');
  const [previewLogo, setPreviewLogo] = useState('');
  const [previewBanner, setPreviewBanner] = useState('');

  // Referências
  const fotoPerfilRef = useRef<HTMLInputElement>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchCategorias();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && lojaDados) {
      setNomeLoja(lojaDados.nome || '');
      setIdCategoria(String(lojaDados.id_categoria || ''));
      
      setPreviewFoto(resolverUrl(lojaDados.foto_url));
      setPreviewLogo(resolverUrl(lojaDados.logo_url));
      setPreviewBanner(resolverUrl(lojaDados.banner_url));

      setFotoPerfilFile(null);
      setLogoFile(null);
      setBannerFile(null);
    }
  }, [isOpen, lojaDados]);

  async function fetchCategorias() {
    try {
      const res = await fetch(`${API_URL}/category`);
      if (res.ok) {
        setCategorias(await res.json());
      }
    } catch {
      console.error('Erro ao buscar categorias');
    }
  }

  if (!isOpen) return null;

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFotoPerfilFile(e.target.files[0]);
      setPreviewFoto(URL.createObjectURL(e.target.files[0]));
    }
  };
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setLogoFile(e.target.files[0]);
      setPreviewLogo(URL.createObjectURL(e.target.files[0]));
    }
  };
  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setBannerFile(e.target.files[0]);
      setPreviewBanner(URL.createObjectURL(e.target.files[0]));
    }
  };

  // Enviar os dados
  const handleSalvar = async () => {
    if (!nomeLoja.trim()) {
      alert("O nome da loja é obrigatório!");
      return;
    }

    setSalvando(true);
    try {
      const token = getToken();
      const formData = new FormData();
      
      // 1. Envia o nome da loja
      formData.append('nome', nomeLoja);
      
      // 2. Envia o ID da categoria selecionada se ela existir
      if (idCategoria) {
        formData.append('id_categoria', idCategoria);
      }
      
      // 3. Envia os arquivos de mídia esperados pelo Back-end
      if (fotoPerfilFile) formData.append('foto_url', fotoPerfilFile);
      if (logoFile) formData.append('logo_url', logoFile);
      if (bannerFile) formData.append('banner_url', bannerFile);

      const response = await fetch(`${API_URL}/lojas/${lojaDados.id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: formData, 
      });

      if (!response.ok) throw new Error("Erro ao atualizar loja.");

      alert("Loja atualizada com sucesso!");
      onClose();
      if (onLojaAtualizada) onLojaAtualizada();
      else window.location.reload(); 
    } catch (err: any) {
      console.error(err);
      alert("Não foi possível salvar as alterações.");
    } finally {
      // O finally serve apenas para resetar o estado de carregamento do botão
      setSalvando(false);
    }
  };

  // Deletar a loja
  const handleDeletar = async () => {
    const confirmar = window.confirm("Tem a certeza que deseja APAGAR esta loja? Todos os produtos e avaliações associados também serão apagados permanentemente!");
    if (!confirmar) return;

    setDeletando(true);
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/lojas/${lojaDados.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Erro ao deletar loja.");

      alert("Loja apagada com sucesso.");
      onClose();
      window.location.href = '/'; 
    } catch (err: any) {
      console.error(err);
      alert("Erro ao tentar excluir a loja.");
      setDeletando(false);
    }
  };

  const UploadIcon = () => (
    <svg width="24" height="28" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 0H2C0.9 0 0.01 0.9 0.01 2L0 26C0 27.1 0.89 28 1.99 28H22C23.1 28 24 27.1 24 26V10L14 0ZM11 22V15.83L8.41 18.41L7 17L12 12L17 17L15.59 18.41L13 15.83V22H11ZM13 11V1.5L22.5 11H13Z" fill="#7C3AED"/>
    </svg>
  );

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#EBEBEB] dark:bg-[#2A2A2A] w-[90%] max-w-[480px] p-8 rounded-[2.5rem] shadow-2xl relative max-h-[95vh] overflow-y-auto scrollbar-hide transition-colors duration-300">
        
        <button onClick={onClose} className="absolute top-6 right-8 text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer">
          <X size={32} strokeWidth={1.5} />
        </button>

        <h2 className="text-3xl font-bold text-center text-black dark:text-white mb-8 mt-2 transition-colors duration-300">Editar loja</h2>

        <div className="flex flex-col gap-4 mb-6">
          <input 
            type="text" placeholder="Nome da loja" value={nomeLoja} onChange={(e) => setNomeLoja(e.target.value)}
            className="w-full bg-white dark:bg-[#1A1A1A] rounded-full px-6 py-3.5 text-base text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] transition-colors duration-300" 
          />

          <div className="relative">
            <select value={idCategoria} onChange={(e) => setIdCategoria(e.target.value)} className="appearance-none w-full bg-white dark:bg-[#1A1A1A] rounded-full px-6 py-3.5 text-base text-gray-700 dark:text-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] cursor-pointer transition-colors duration-300">
              <option value="" disabled>Selecione uma categoria</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.nome}</option>
              ))}
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 dark:text-gray-500 transition-colors duration-300">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 mb-8">
          {/* FOTO PERFIL */}
          <div onClick={() => fotoPerfilRef.current?.click()} className="w-full h-[95px] border-[1.5px] border-dashed border-[#7C3AED] rounded-2xl flex flex-col items-center justify-center bg-transparent cursor-pointer hover:bg-purple-50 dark:hover:bg-[#7C3AED]/10 transition-colors overflow-hidden relative">
            {previewFoto ? <img src={previewFoto} alt="Preview Foto" className="absolute inset-0 w-full h-full object-cover opacity-60" /> : null}
            <UploadIcon />
            <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 mt-2 z-10 transition-colors duration-300">Anexe a foto de perfil de sua loja</span>
            <input type="file" ref={fotoPerfilRef} onChange={handleFotoChange} className="hidden" accept="image/*" />
          </div>

          {/* LOGO */}
          <div onClick={() => logoRef.current?.click()} className="w-full h-[95px] border-[1.5px] border-dashed border-[#7C3AED] rounded-2xl flex flex-col items-center justify-center bg-transparent cursor-pointer hover:bg-purple-50 dark:hover:bg-[#7C3AED]/10 transition-colors overflow-hidden relative">
            {previewLogo ? <img src={previewLogo} alt="Preview Logo" className="absolute inset-0 w-full h-full object-contain p-2 opacity-60" /> : null}
            <UploadIcon />
            <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 mt-2 z-10 transition-colors duration-300">Anexe a logo em SVG de sua loja</span>
            <input type="file" ref={logoRef} onChange={handleLogoChange} className="hidden" accept=".svg, image/*" />
          </div>

          {/* BANNER */}
          <div onClick={() => bannerRef.current?.click()} className="w-full h-[95px] border-[1.5px] border-dashed border-[#7C3AED] rounded-2xl flex flex-col items-center justify-center bg-transparent cursor-pointer hover:bg-purple-50 dark:hover:bg-[#7C3AED]/10 transition-colors overflow-hidden relative">
            {previewBanner ? <img src={previewBanner} alt="Preview Banner" className="absolute inset-0 w-full h-full object-cover opacity-60" /> : null}
            <UploadIcon />
            <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 mt-2 z-10 transition-colors duration-300">Anexe o banner de sua loja</span>
            <input type="file" ref={bannerRef} onChange={handleBannerChange} className="hidden" accept="image/*" />
          </div>
        </div>

        <div className="flex flex-col gap-4 items-center">
          <button onClick={handleDeletar} disabled={deletando} className="w-[80%] bg-[#FF0000] text-white font-bold py-3 rounded-full shadow-md hover:bg-red-700 transition-colors cursor-pointer uppercase tracking-wider text-sm disabled:opacity-60">
            {deletando ? 'Excluindo...' : 'Deletar'}
          </button>
          
          <button onClick={handleSalvar} disabled={salvando} className="w-[80%] bg-[#7C3AED] text-white font-bold py-3 rounded-full shadow-md hover:bg-purple-700 transition-colors cursor-pointer text-sm disabled:opacity-60">
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>
        </div>

      </div>
    </div>
  );
}