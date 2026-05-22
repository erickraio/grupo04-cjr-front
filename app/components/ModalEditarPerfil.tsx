"use client";

import Image from "next/image";

interface ModalEditarPerfilProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalEditarPerfil({ isOpen, onClose }: ModalEditarPerfilProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      
      {/* Container Principal do Modal */}
      <div className="relative w-full max-w-[420px] bg-[#F2F2F2] rounded-[2.5rem] p-8 shadow-2xl mx-4 flex flex-col items-center">
        
        {/* Botão de Fechar no Topo */}
        <div className="absolute top-6 right-6">
          <button onClick={onClose} className="text-black hover:text-gray-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Foto de Perfil com Ícone de Câmera */}
        <div className="relative mt-4 mb-8">
          {/* Círculo da Imagem de Perfil */}
          <div className="w-[120px] h-[120px] rounded-full overflow-hidden border-4 border-[#F2F2F2] shadow-sm relative">
             {/* NOTA: Coloquei um fundo colorido provisório. 
                 Quando tiver a imagem, substitua esta div pela tag <Image /> do Next.js. */}
            <div className="w-full h-full bg-[#E5B5A8]"></div>
          </div>
          
          {/* Ícone de Câmera sobreposto */}
          <button className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-black">
              <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
              <path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 01-3 3h-15a3 3 0 01-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 001.11-.71l.822-1.315a2.942 2.942 0 012.332-1.39zM6.75 12.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0zm12-1.5a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Campos de Input */}
        <div className="w-full flex flex-col gap-4 mb-8 px-2">
          <input 
            type="text" 
            placeholder="Nome" 
            className="w-full px-6 py-3.5 rounded-full bg-white text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] shadow-sm"
          />
          <input 
            type="text" 
            placeholder="Username" 
            className="w-full px-6 py-3.5 rounded-full bg-white text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] shadow-sm"
          />
          <input 
            type="email" 
            placeholder="Email" 
            className="w-full px-6 py-3.5 rounded-full bg-white text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] shadow-sm"
          />
        </div>

        {/* Botões de Ação */}
        <div className="w-full flex flex-col gap-3 px-2">
          {/* Botão Deletar Conta (Borda Vermelha) */}
          <button className="w-full bg-transparent border-[1.5px] border-[#991B1B] text-[#991B1B] hover:bg-red-50 font-medium py-3 px-6 rounded-full transition-colors">
            Deletar conta
          </button>
          
          {/* Botão Alterar Senha (Borda Roxa) */}
          <button className="w-full bg-transparent border-[1.5px] border-[#7C3AED] text-[#7C3AED] hover:bg-purple-50 font-medium py-3 px-6 rounded-full transition-colors">
            Alterar senha
          </button>

          {/* Botão Salvar (Fundo Roxo) */}
          <button className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-medium py-3.5 px-6 rounded-full shadow-[0px_4px_14px_rgba(124,58,237,0.4)] transition-all mt-1">
            Salvar
          </button>
        </div>

      </div>
    </div>
  );
}