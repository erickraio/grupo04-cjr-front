'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalEditarLojaProps {
  isOpen: boolean;
  onClose: () => void;
  lojaDados?: {
    id: number;
    nome: string;
    categoria: string;
  };
}

export default function ModalEditarLoja({ isOpen, onClose, lojaDados }: ModalEditarLojaProps) {
  // Estados para os campos
  const [nomeLoja, setNomeLoja] = useState(lojaDados?.nome || '');
  const [categoria, setCategoria] = useState(lojaDados?.categoria || '');
  
  // Referências para os inputs de arquivo
  const fotoPerfilRef = useRef<HTMLInputElement>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);

  // Atualiza os campos quando a modal abre com dados específicos
  useEffect(() => {
    if (isOpen && lojaDados) {
      setNomeLoja(lojaDados.nome);
      setCategoria(lojaDados.categoria);
    }
  }, [isOpen, lojaDados]);

  if (!isOpen) return null;

  // Ícone de Upload (reutilizado do adicionar loja)
  const UploadIcon = () => (
    <svg width="24" height="28" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 0H2C0.9 0 0.01 0.9 0.01 2L0 26C0 27.1 0.89 28 1.99 28H22C23.1 28 24 27.1 24 26V10L14 0ZM11 22V15.83L8.41 18.41L7 17L12 12L17 17L15.59 18.41L13 15.83V22H11ZM13 11V1.5L22.5 11H13Z" fill="#7C3AED"/>
    </svg>
  );

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
      
      {/* Container Principal */}
      <div className="bg-[#EBEBEB] w-[90%] max-w-[480px] p-8 rounded-[2.5rem] shadow-2xl relative max-h-[95vh] overflow-y-auto scrollbar-hide">
        
        {/* Botão Fechar (X) */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-8 text-black hover:text-gray-600 transition-colors cursor-pointer"
        >
          <X size={32} strokeWidth={1.5} />
        </button>

        {/* Título */}
        <h2 className="text-3xl font-bold text-center text-black mb-8 mt-2">Editar loja</h2>

        {/* ========================================== */}
        {/* INPUTS DE TEXTO E SELEÇÃO                  */}
        {/* ========================================== */}
        <div className="flex flex-col gap-4 mb-6">
          <input 
            type="text" 
            placeholder="Nome da loja" 
            value={nomeLoja}
            onChange={(e) => setNomeLoja(e.target.value)}
            className="w-full bg-white rounded-full px-6 py-3.5 text-base text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]" 
          />

          <div className="relative">
            <select 
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="appearance-none w-full bg-white rounded-full px-6 py-3.5 text-base text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] cursor-pointer"
            >
              <option value="" disabled>Categoria</option>
              <option value="beleza">Beleza</option>
              <option value="mercado">Mercado</option>
              <option value="moda">Moda</option>
              <option value="eletronicos">Eletrônicos</option>
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* ÁREAS DE UPLOAD DE ARQUIVOS                */}
        {/* ========================================== */}
        <div className="flex flex-col gap-3 mb-8">
          
          <div 
            onClick={() => fotoPerfilRef.current?.click()}
            className="w-full h-[95px] border-[1.5px] border-dashed border-[#7C3AED] rounded-2xl flex flex-col items-center justify-center bg-transparent cursor-pointer hover:bg-purple-50 transition-colors"
          >
            <UploadIcon />
            <span className="text-xs text-gray-600 mt-2">Anexe a foto de perfil de sua loja</span>
            <input type="file" ref={fotoPerfilRef} className="hidden" accept="image/*" />
          </div>

          <div 
            onClick={() => logoRef.current?.click()}
            className="w-full h-[95px] border-[1.5px] border-dashed border-[#7C3AED] rounded-2xl flex flex-col items-center justify-center bg-transparent cursor-pointer hover:bg-purple-50 transition-colors"
          >
            <UploadIcon />
            <span className="text-xs text-gray-600 mt-2">Anexe a logo em SVG de sua loja</span>
            <input type="file" ref={logoRef} className="hidden" accept=".svg, image/*" />
          </div>

          <div 
            onClick={() => bannerRef.current?.click()}
            className="w-full h-[95px] border-[1.5px] border-dashed border-[#7C3AED] rounded-2xl flex flex-col items-center justify-center bg-transparent cursor-pointer hover:bg-purple-50 transition-colors"
          >
            <UploadIcon />
            <span className="text-xs text-gray-600 mt-2">Anexe o banner de sua loja</span>
            <input type="file" ref={bannerRef} className="hidden" accept="image/*" />
          </div>

        </div>

        {/* ========================================== */}
        {/* BOTÕES DE AÇÃO                             */}
        {/* ========================================== */}
        <div className="flex flex-col gap-4 items-center">
          <button className="w-[80%] bg-[#FF0000] text-white font-bold py-3 rounded-full shadow-md hover:bg-red-700 transition-colors cursor-pointer uppercase tracking-wider text-sm">
            Deletar
          </button>
          
          <button className="w-[80%] bg-[#7C3AED] text-white font-bold py-3 rounded-full shadow-md hover:bg-purple-700 transition-colors cursor-pointer text-sm">
            Salvar
          </button>
        </div>

      </div>
    </div>
  );
}