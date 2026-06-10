'use client';

import Image from 'next/image';
import { useState } from 'react'; 

interface ModalEditarProdutoProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalEditarProduto({ isOpen, onClose }: ModalEditarProdutoProps) {
  // 2. Criamos o estado da quantidade começando em 3
  const [quantidade, setQuantidade] = useState(3);

  if (!isOpen) return null;

  // Função para diminuir (não deixa passar de zero)
  const diminuirQuantidade = () => {
    if (quantidade > 0) {
      setQuantidade(quantidade - 1);
    }
  };

  // Função para aumentar
  const aumentarQuantidade = () => {
    setQuantidade(quantidade + 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-[#EBEBEB] w-[90%] max-w-[450px] p-6 rounded-[2rem] shadow-2xl relative max-h-[95vh] overflow-y-auto scrollbar-hide">
        
        {/* Botão Fechar */}
        <button onClick={onClose} className="absolute top-6 right-6 text-black hover:text-gray-600 transition-colors cursor-pointer">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-center text-black mb-6">Editar Produto</h2>

        {/* Upload de Fotos */}
        <div className="w-full mb-5 flex flex-col gap-2">
          <div className="w-full h-24 border-2 border-dashed border-[#7C3AED] rounded-2xl flex flex-col items-center justify-center bg-transparent cursor-pointer hover:bg-purple-50 transition-colors">
            <div className="relative w-8 h-8 mb-1">
              <Image src="/Foto-token.png" alt="Adicionar foto" fill className="object-contain" />
            </div>
            <span className="text-[10px] text-gray-500">Anexe as fotos do seu produto</span>
          </div>

          <div className="flex gap-2">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex-1 h-20 border-2 border-dashed border-[#7C3AED] rounded-2xl flex items-center justify-center bg-transparent cursor-pointer hover:bg-purple-50 transition-colors">
                <div className="relative w-8 h-8">
                  <Image src="/Foto-token.png" alt="Adicionar foto" fill className="object-contain" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Formulário */}
        <div className="flex flex-col gap-3 mb-5">
          <input type="text" defaultValue="Brownie Meio Amargo" className="w-full bg-white rounded-full px-5 py-3 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]" />
          
          <div className="relative">
            <select className="appearance-none w-full bg-white rounded-full px-5 py-3 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] cursor-pointer">
              <option>Doce</option>
              <option>Salgado</option>
              <option>Bebida</option>
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>

          <textarea rows={3} defaultValue="BROWNIE MEIO AMARGO 80g&#10;Recheado com uma ganache de chocolate meio amargo bem cremosa, esse brownie conquistou o coração de muita gente! ..." className="w-full bg-white rounded-2xl px-5 py-3 text-xs text-gray-600 shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#7C3AED]" />
          
          <input type="text" defaultValue="R$4,70" className="w-full bg-white rounded-full px-5 py-3 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]" />
        </div>

        {/* Botão Deletar */}
        <button className="w-full bg-[#FF0000] text-white font-bold text-sm py-3 rounded-full shadow-md hover:bg-red-700 transition-colors mb-6 cursor-pointer">
          DELETAR
        </button>

        {/* Contador e Botão Salvar */}
        <div className="flex flex-col items-center gap-6 pb-2">
          
          {/* ========================================== */}
          {/* CONTADOR INTERATIVO                        */}
          {/* ========================================== */}
          <div className="flex items-center gap-8">
            <button onClick={diminuirQuantidade} className="w-10 h-10 relative hover:scale-110 transition-transform cursor-pointer">
              <Image src="/Menos-token.png" alt="Diminuir quantidade" fill className="object-contain" />
            </button>
            
            {/* O número agora é uma variável do React */}
            <span className="text-[#7C3AED] text-[40px] font-light leading-none">
              {quantidade}
            </span>
            
            <button onClick={aumentarQuantidade} className="w-10 h-10 relative hover:scale-110 transition-transform cursor-pointer">
              <Image src="/Mais-token.png" alt="Aumentar quantidade" fill className="object-contain" />
            </button>
          </div>

          <button className="bg-[#7C3AED] text-white font-medium text-sm px-16 py-2.5 rounded-full shadow-md hover:bg-purple-700 transition-colors cursor-pointer">
            Salvar
          </button>

        </div>
      </div>
    </div>
  );
}