'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('@StockIO:token') || null;
}

interface ModalAdicionarLojaProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  onLojaCriada?: () => void;
}

export default function ModalAdicionarLoja({ isOpen, onClose, userId, onLojaCriada }: ModalAdicionarLojaProps) {
  const [novaLojaNome, setNovaLojaNome] = useState('');
  const [idCategoria, setIdCategoria] = useState('');
  const [fotoPerfilFile, setFotoPerfilFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [categorias, setCategorias] = useState<{ id: number; nome: string }[]>([]);
  const [carregando, setCarregando] = useState(false);

  const fotoPerfilRef = useRef<HTMLInputElement>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchCategorias();
    }
  }, [isOpen]);

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

  async function handleCriarLoja() {
    if (!novaLojaNome.trim()) {
      alert('O nome da loja é obrigatório!');
      return;
    }

    setCarregando(true);
    try {
      const token = getToken();
      const formData = new FormData();
      formData.append('nome', novaLojaNome.trim());
      formData.append('id_dono', String(userId));
      if (idCategoria) formData.append('id_categoria', idCategoria);
      if (bannerFile) formData.append('banner', bannerFile);
      if (logoFile) formData.append('logo', logoFile);
      if (fotoPerfilFile) formData.append('foto', fotoPerfilFile);

      const response = await fetch(`${API_URL}/lojas`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao criar loja.');
      }

      setNovaLojaNome('');
      setIdCategoria('');
      setFotoPerfilFile(null);
      setLogoFile(null);
      setBannerFile(null);
      onClose();
      onLojaCriada?.();
    } catch (err: any) {
      console.error('Erro ao criar loja:', err);
      alert(err.message || 'Não foi possível criar a loja.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-[500px] bg-[#EAEAEA] rounded-[2rem] p-8 shadow-2xl mx-4 flex flex-col items-center">

        <div className="absolute top-6 right-6">
          <button
            onClick={onClose}
            className="text-black hover:text-gray-500 transition-colors cursor-pointer"
          >
            <X size={28} />
          </button>
        </div>

        <h2 className="text-[28px] font-extrabold text-black mb-8 mt-2">Adicionar loja</h2>

        <div className="w-full flex flex-col gap-4 mb-6">
          <input
            type="text"
            placeholder="Nome da loja"
            value={novaLojaNome}
            onChange={(e) => setNovaLojaNome(e.target.value)}
            className="w-full px-6 py-4 rounded-full bg-white text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] shadow-sm font-medium"
          />

          <div className="relative w-full">
            <select
              value={idCategoria}
              onChange={(e) => setIdCategoria(e.target.value)}
              className="w-full px-6 py-4 rounded-full bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] shadow-sm appearance-none font-medium cursor-pointer"
            >
              <option value="" disabled>Selecione uma categoria</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nome}
                </option>
              ))}
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
              <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col gap-3 mb-8">

          <input type="file" ref={fotoPerfilRef} className="hidden" accept="image/*" onChange={(e) => setFotoPerfilFile(e.target.files?.[0] || null)} />
          <div
            onClick={() => fotoPerfilRef.current?.click()}
            className="w-full border-[2px] border-dashed border-[#7C3AED] rounded-2xl py-6 flex flex-col items-center justify-center cursor-pointer hover:bg-purple-50/50 transition-colors bg-transparent"
          >
            <img src="/envio-foto.png" alt="Upload" className="w-8 h-10 mb-2 object-contain" />
            <span className="text-gray-700 font-medium text-sm">
              {fotoPerfilFile ? fotoPerfilFile.name : 'Anexe a foto de perfil de sua loja'}
            </span>
          </div>

          <input type="file" ref={logoRef} className="hidden" accept=".svg, image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} />
          <div
            onClick={() => logoRef.current?.click()}
            className="w-full border-[2px] border-dashed border-[#7C3AED] rounded-2xl py-6 flex flex-col items-center justify-center cursor-pointer hover:bg-purple-50/50 transition-colors bg-transparent"
          >
            <img src="/envio-foto.png" alt="Upload" className="w-8 h-10 mb-2 object-contain" />
            <span className="text-gray-700 font-medium text-sm">
              {logoFile ? logoFile.name : 'Anexe a logo em SVG de sua loja'}
            </span>
          </div>

          <input type="file" ref={bannerRef} className="hidden" accept="image/*" onChange={(e) => setBannerFile(e.target.files?.[0] || null)} />
          <div
            onClick={() => bannerRef.current?.click()}
            className="w-full border-[2px] border-dashed border-[#7C3AED] rounded-2xl py-6 flex flex-col items-center justify-center cursor-pointer hover:bg-purple-50/50 transition-colors bg-transparent"
          >
            <img src="/envio-foto.png" alt="Upload" className="w-8 h-10 mb-2 object-contain" />
            <span className="text-gray-700 font-medium text-sm">
              {bannerFile ? bannerFile.name : 'Anexe o banner de sua loja'}
            </span>
          </div>

        </div>

        <button
          onClick={handleCriarLoja}
          disabled={carregando}
          className="w-full max-w-[280px] bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold py-4 px-6 rounded-full shadow-[0px_4px_14px_rgba(124,58,237,0.4)] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {carregando ? 'Adicionando...' : 'Adicionar'}
        </button>
      </div>
    </div>
  );
}
