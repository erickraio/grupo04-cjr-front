'use client';

import { useState } from 'react';

interface ModalAvaliarLojaProps {
  isOpen: boolean;
  onClose: () => void;
  nomeLoja?: string; // Permite que a tela da loja envie o nome dela dinamicamente
}

export default function ModalAvaliarLoja({ isOpen, onClose, nomeLoja = "Rare Beauty" }: ModalAvaliarLojaProps) {
  // Estado que guarda a nota final clicada
  const [rating, setRating] = useState(0);
  // Estado que guarda a nota temporária enquanto o mouse passa por cima
  const [hoverRating, setHoverRating] = useState(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      
      {/* Container Principal da Modal */}
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
            // A estrela deve ser preenchida se o número dela for menor ou igual ao Hover atual ou ao Clique
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
                {/* SVG no formato da sua estrela vazada */}
                <svg 
                  width="55" 
                  height="55" 
                  viewBox="0 0 24 24" 
                  // O Tailwind altera o preenchimento (fill) dinamicamente aqui:
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
          placeholder="Avaliação da loja" 
          rows={10}
          className="w-full bg-white rounded-2xl p-6 text-sm text-gray-700 shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#7C3AED] mb-8"
        />

        {/* ========================================== */}
        {/* BOTÃO AVALIAR                              */}
        {/* ========================================== */}
        <div className="flex justify-center">
          <button className="bg-[#7C3AED] w-[80%] text-white font-medium text-lg py-3.5 rounded-full shadow-md hover:bg-purple-700 transition-colors cursor-pointer">
            Avaliar
          </button>
        </div>

      </div>
    </div>
  );
}