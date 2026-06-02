'use client';

import { useState, useEffect } from 'react';

interface ModalEditarAvaliacaoProps {
  isOpen: boolean;
  onClose: () => void;
  nomeLoja?: string;
  // Propriedades preparadas para receber a avaliação já existente do banco de dados
  notaAtual?: number;
  textoAtual?: string;
}

export default function ModalEditarAvaliacao({ 
  isOpen, 
  onClose, 
  nomeLoja = "Rare Beauty",
  notaAtual = 0,
  textoAtual = ""
}: ModalEditarAvaliacaoProps) {
  
  // Estados para as estrelas e texto
  const [rating, setRating] = useState(notaAtual);
  const [hoverRating, setHoverRating] = useState(0);
  const [comentario, setComentario] = useState(textoAtual);

  // Garante que a modal sempre abra com os dados atualizados
  useEffect(() => {
    if (isOpen) {
      setRating(notaAtual);
      setComentario(textoAtual);
    }
  }, [isOpen, notaAtual, textoAtual]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      
      {/* Container Principal */}
      <div className="bg-[#EBEBEB] w-[90%] max-w-[650px] p-8 md:p-10 rounded-[2rem] shadow-2xl relative">
        
        {/* Botão Fechar (X) */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-black hover:text-gray-600 transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Título */}
        <h2 className="text-[22px] md:text-2xl font-light text-center text-gray-800 mb-8 mt-2">
          Você está avaliando <span className="font-bold text-black ml-1 text-2xl md:text-3xl">{nomeLoja}</span>
        </h2>

        {/* ========================================== */}
        {/* SISTEMA DE ESTRELAS INTERATIVAS            */}
        {/* ========================================== */}
        <div className="flex justify-center gap-2 md:gap-4 mb-8">
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = star <= (hoverRating || rating);
            
            return (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="focus:outline-none transition-transform hover:scale-110 cursor-pointer"
              >
                <svg 
                  width="55" 
                  height="55" 
                  viewBox="0 0 24 24" 
                  className={`transition-colors duration-200 ${isFilled ? 'fill-[#7C3AED] text-[#7C3AED]' : 'fill-transparent text-[#7C3AED]'}`}
                  stroke="currentColor" 
                  strokeWidth="1" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </button>
            );
          })}
        </div>

        {/* ========================================== */}
        {/* CAIXA DE TEXTO (TEXTAREA)                  */}
        {/* ========================================== */}
        <textarea 
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Avaliação da loja" 
          rows={10}
          className="w-full bg-white rounded-2xl p-6 text-sm text-gray-700 shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#7C3AED] mb-8"
        />

        {/* ========================================== */}
        {/* BOTÕES EMPILHADOS                          */}
        {/* ========================================== */}
        <div className="flex flex-col items-center gap-4">
          <button className="bg-[#FF0000] w-[70%] text-white font-medium text-sm md:text-base py-3 rounded-full shadow-md hover:bg-red-700 transition-colors cursor-pointer uppercase">
            Deletar
          </button>
          
          <button className="bg-[#7C3AED] w-[70%] text-white font-medium text-sm md:text-base py-3 rounded-full shadow-md hover:bg-purple-700 transition-colors cursor-pointer">
            Salvar
          </button>
        </div>

      </div>
    </div>
  );
}