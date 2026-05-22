"use client";

import Image from "next/image";

// Tipagem das propriedades que o Modal vai receber
interface ModalAlterarSenhaProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalAlterarSenha({ isOpen, onClose }: ModalAlterarSenhaProps) {
  // Se o modal não estiver aberto, não renderiza nada
  if (!isOpen) return null;

  return (
    // Fundo escuro semi-transparente que cobre a tela toda
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      
      {/* Container Principal do Modal (Caixa Cinza/Branca) */}
      <div className="relative w-full max-w-[420px] bg-[#F2F2F2] rounded-[2.5rem] p-8 shadow-2xl mx-4 flex flex-col items-center">
        
        {/* Botões do Topo (Voltar e Fechar) */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
          <button onClick={onClose} className="text-black hover:text-gray-500 transition-colors">
            {/* Ícone de Seta (Voltar) */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={onClose} className="text-black hover:text-gray-500 transition-colors">
            {/* Ícone de X (Fechar) */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Ícone da Chave */}
        <div className="mt-8 mb-8">
          <Image 
            src="/key-token.png" 
            alt="Ícone de Chave Roxa" 
            width={120} 
            height={120} 
            className="object-contain"
          />
        </div>

        {/* Campos de Input */}
        <div className="w-full flex flex-col gap-4 mb-10 px-2">
          <input 
            type="password" 
            placeholder="Senha Antiga" 
            className="w-full px-6 py-3.5 rounded-full bg-white text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] shadow-sm"
          />
          <input 
            type="password" 
            placeholder="Nova Senha" 
            className="w-full px-6 py-3.5 rounded-full bg-white text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] shadow-sm"
          />
          <input 
            type="password" 
            placeholder="Confirmar Senha" 
            className="w-full px-6 py-3.5 rounded-full bg-white text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] shadow-sm"
          />
        </div>

        {/* Botão de Salvar */}
        <button className="w-full max-w-[280px] bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-medium py-3.5 px-6 rounded-full shadow-[0px_4px_14px_rgba(124,58,237,0.4)] transition-all">
          Salvar Senha
        </button>

      </div>
    </div>
  );
}