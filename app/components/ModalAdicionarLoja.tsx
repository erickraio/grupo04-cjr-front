'use client';

import React, { useState, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalAdicionarLojaProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number; // Recebe o ID do utilizador logado para associar a loja
}

export default function ModalAdicionarLoja({ isOpen, onClose, userId }: ModalAdicionarLojaProps) {
  // Estados transferidos da página principal
  const [novaLojaNome, setNovaLojaNome] = useState('');
  const [novaLojaCategoria, setNovaLojaCategoria] = useState('');
  const [fotoPerfilFile, setFotoPerfilFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const fotoPerfilRef = useRef<HTMLInputElement>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Lógica de criação da loja transferida para cá
  const handleCriarLoja = async () => {
    if (!novaLojaNome.trim()) {
      alert("O nome da loja é obrigatório!");
      return;
    }

    try {
      const token = localStorage.getItem("@StockIO:token");

      const response = await fetch('http://localhost:3001/lojas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nome: novaLojaNome,
          descricao: "", // A descrição estava no estado antigo, mas não na UI
          id_dono: userId,
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao criar loja.");
      }

      alert("Loja criada com sucesso!");
      
      // Limpa os dados e fecha a modal
      setNovaLojaNome('');
      setNovaLojaCategoria('');
      setFotoPerfilFile(null);
      setLogoFile(null);
      setBannerFile(null);
      onClose();

      window.location.reload(); // Recarrega para mostrar a nova loja

    } catch (err: any) {
      console.error("Erro ao criar loja:", err);
      alert(err.message || "Não foi possível criar a loja.");
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-[500px] bg-[#EAEAEA] dark:bg-[#2A2A2A] rounded-[2rem] p-8 shadow-2xl mx-4 flex flex-col items-center transition-colors duration-300">
        
        <div className="absolute top-6 right-6">
          <button 
            onClick={onClose} 
            className="text-black dark:text-white hover:text-gray-500 dark:hover:text-gray-300 transition-colors cursor-pointer"
          >
            <X size={28} />
          </button>
        </div>

        <h2 className="text-[28px] font-extrabold text-black dark:text-white mb-8 mt-2 transition-colors duration-300">Adicionar loja</h2>

        <div className="w-full flex flex-col gap-4 mb-6">
          <input 
            type="text" 
            placeholder="Nome da loja" 
            value={novaLojaNome} 
            onChange={(e) => setNovaLojaNome(e.target.value)}
            className="w-full px-6 py-4 rounded-full bg-white dark:bg-[#1A1A1A] text-gray-700 dark:text-white placeholder:text-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] shadow-sm font-medium transition-colors duration-300"
          />
          
          <div className="relative w-full">
            <select 
              value={novaLojaCategoria} 
              onChange={(e) => setNovaLojaCategoria(e.target.value)}
              className="w-full px-6 py-4 rounded-full bg-white dark:bg-[#1A1A1A] text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED] shadow-sm appearance-none font-medium cursor-pointer transition-colors duration-300"
            >
              <option value="" disabled>Categoria</option>
              <option value="beleza">Beleza</option>
              <option value="eletronicos">Eletrônicos</option>
              <option value="roupas">Roupas</option>
              <option value="outros">Outros</option>
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400 transition-colors duration-300">
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
            className="w-full border-[2px] border-dashed border-[#7C3AED] rounded-2xl py-6 flex flex-col items-center justify-center cursor-pointer hover:bg-purple-50/50 dark:hover:bg-[#7C3AED]/10 transition-colors bg-transparent"
          >
            <img src="/envio-foto.png" alt="Upload" className="w-8 h-10 mb-2 object-contain" />
            <span className="text-gray-700 dark:text-gray-300 font-medium text-sm transition-colors duration-300">
              {fotoPerfilFile ? fotoPerfilFile.name : "Anexe a foto de perfil de sua loja"}
            </span>
          </div>

          <input type="file" ref={logoRef} className="hidden" accept=".svg, image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} />
          <div 
            onClick={() => logoRef.current?.click()}
            className="w-full border-[2px] border-dashed border-[#7C3AED] rounded-2xl py-6 flex flex-col items-center justify-center cursor-pointer hover:bg-purple-50/50 dark:hover:bg-[#7C3AED]/10 transition-colors bg-transparent"
          >
            <img src="/envio-foto.png" alt="Upload" className="w-8 h-10 mb-2 object-contain" />
            <span className="text-gray-700 dark:text-gray-300 font-medium text-sm transition-colors duration-300">
              {logoFile ? logoFile.name : "Anexe a logo em SVG de sua loja"}
            </span>
          </div>

          <input type="file" ref={bannerRef} className="hidden" accept="image/*" onChange={(e) => setBannerFile(e.target.files?.[0] || null)} />
          <div 
            onClick={() => bannerRef.current?.click()}
            className="w-full border-[2px] border-dashed border-[#7C3AED] rounded-2xl py-6 flex flex-col items-center justify-center cursor-pointer hover:bg-purple-50/50 dark:hover:bg-[#7C3AED]/10 transition-colors bg-transparent"
          >
            <img src="/envio-foto.png" alt="Upload" className="w-8 h-10 mb-2 object-contain" />
            <span className="text-gray-700 dark:text-gray-300 font-medium text-sm transition-colors duration-300">
              {bannerFile ? bannerFile.name : "Anexe o banner de sua loja"}
            </span>
          </div>

        </div>

        <button 
          onClick={handleCriarLoja}
          className="w-full max-w-[280px] bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold py-4 px-6 rounded-full shadow-[0px_4px_14px_rgba(124,58,237,0.4)] transition-all cursor-pointer"
        >
          Adicionar
        </button>
      </div>
    </div>
  );
}