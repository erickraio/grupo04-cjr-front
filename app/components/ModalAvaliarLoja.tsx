'use client';

import { useState } from 'react';

interface ModalAvaliarLojaProps {
  isOpen: boolean;
  onClose: () => void;
  nomeLoja?: string; // Permite que a tela da loja envie o nome dela dinamicamente
  onAvaliacaoCriada?: (nota: number, comentario: string) => void;
  idLoja: string | number; // Callback para enviar a avaliação criada
}

export default function ModalAvaliarLoja({ isOpen, onClose, nomeLoja = "Rare Beauty", idLoja }: ModalAvaliarLojaProps) {
  // Estado que guarda a nota final clicada
  const [rating, setRating] = useState(0);
  // Estado que guarda a nota temporária enquanto o mouse passa por cima
  const [hoverRating, setHoverRating] = useState(0);
  const [comentario, setComentario] = useState("");
  const [enviando, setEnviando] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (rating === 0) {
      alert("Por favor, selecione uma nota antes de enviar sua avaliação.");
      return;
    }
    if (!comentario.trim()) {
      alert("Por favor, escreva um comentário antes de enviar sua avaliação.");
      return;
    }
    try {
      setEnviando(true);
      const token = localStorage.getItem('@StockIO:token');
      const response = await fetch('http://localhost:3001/aval-loja/' + idLoja, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
      }, 
        body: JSON.stringify({
          nota: rating,
          comentario: comentario
        }),
      });
      if (!response.ok) throw new Error("Erro ao enviar avaliação");
      alert("Avaliação enviada com sucesso!");
      setRating(0);
      setComentario("");
      onClose();
  }   catch (error) {
    console.error("Erro ao enviar avaliação:", error);
    alert("Ocorreu um erro ao enviar sua avaliação. Por favor, tente novamente.");
  } finally {
    setEnviando(false);
  }
}

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      
      {/* Container Principal da Modal */}
      <div className="bg-[#EBEBEB] dark:bg-[#2A2A2A] w-[90%] max-w-[650px] p-8 md:p-10 rounded-[2rem] shadow-2xl relative transition-colors duration-300">
        
        {/* Botão Fechar (X) */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Título */}
        <h2 className="text-[22px] md:text-2xl font-light text-center text-gray-800 dark:text-gray-200 mb-8 mt-2 transition-colors duration-300">
          Você está avaliando <span className="font-bold text-black dark:text-white ml-1 text-2xl md:text-3xl transition-colors duration-300">{nomeLoja}</span>
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
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          className="w-full bg-white dark:bg-[#1A1A1A] rounded-2xl p-6 text-sm text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#7C3AED] mb-8 transition-colors duration-300"
        />

        {/* =========================================== */}
        {/* BOTÃO AVALIAR                               */}
        {/* =========================================== */}
        <div className="flex justify-center">
          <button 
            onClick={handleSubmit}
            disabled={enviando}
            className="bg-[#7C3AED] w-[80%] text-white font-medium text-lg py-3.5 rounded-full shadow-md hover:bg-purple-700 transition-colors cursor-pointer"
          >
            {enviando ? "Enviando..." : "Avaliar"}
          </button>
        </div>

      </div>
    </div>
  );
}