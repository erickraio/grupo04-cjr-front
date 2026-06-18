'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function CardProduto({ data }: { data: any }) {
  // Ajustando para os nomes prováveis do backend (banco de dados)
  const isDisponivel = data.estoque > 0; // Exemplo: se tem quantidade, está disponível

  const urlImagem = data?.imagens?.[0]?.url_imagem || '/images/steamdeck.png'; // Imagem do produto ou placeholder
  
  return (
     <Link href={`/produto-especifico/${data.id}`}> 
    <div className="bg-white dark:bg-[#2A2A2A] rounded-3xl p-4 md:p-5 shadow-[0px_4px_15px_rgba(0,0,0,0.02)] flex flex-col relative border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300 cursor-pointer">
      
      {/* Área da Imagem do Produto (Espaço Disponível) */}
      <div className="relative w-full h-[160px] bg-gray-50 dark:bg-gray-800 rounded-2xl mb-4 flex items-center justify-center text-gray-300 dark:text-gray-500 text-xs mt-4 transition-colors duration-300">
         <Image src={urlImagem} alt={data.nome} fill className="object-contain" />
      </div>

      {/* Informações de Texto */}
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-bold text-black dark:text-white leading-tight truncate transition-colors duration-300">{data.nome}</h3>
        
        <p className="text-xl font-bold text-black dark:text-white flex items-baseline gap-1 mt-1 transition-colors duration-300">
          R$ {data.preco} 
        </p>
        
        <span className={`text-[11px] font-bold mt-1 tracking-wide transition-colors duration-300 ${isDisponivel ? 'text-[#B5D400] dark:text-[#D4F514]' : 'text-[#E53E3E] dark:text-[#FF4D6D]'}`}>
          {isDisponivel ? 'DISPONÍVEL' : 'INDISPONÍVEL'}
        </span>
      </div>
    </div>
    </Link>
  );
}