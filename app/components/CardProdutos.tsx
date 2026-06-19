'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// ── Resolve qualquer formato de URL de imagem ──────────────
function resolverUrl(url?: string): string {
  if (!url) return '/images/steamdeck.png';
  if (url.startsWith("http")) return url;        
  if (url.startsWith("/images")) return url;     
  return `${API_URL}${url}`;                     
}

export default function CardProduto({ data }: { data: any }) {
  const isDisponivel = data.estoque > 0;
  
  const urlImagem = data?.imagens?.[0]?.url_imagem 
    ? resolverUrl(data.imagens[0].url_imagem) 
    : '/images/steamdeck.png';
    
  const logoLoja = data.loja?.logo_url 
    ? resolverUrl(data.loja.logo_url) 
    : "/images/cjr.png";

  return (
    <div className="bg-white dark:bg-[#2A2A2A] rounded-[2rem] p-5 shadow-[0px_4px_15px_rgba(0,0,0,0.02)] flex flex-col relative border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300 h-full">
      
      {/* Botão arredondado da Loja (estilo espelhado da tela de Lojas) */}
      <Link href={`/lojas/${data.id_loja}`}>
        <div className="absolute top-4 right-4 w-[50px] h-[50px] rounded-full flex items-center justify-center shadow-sm border-[4px] border-[#F6F5ED] dark:border-[#1A1A1A] bg-black dark:bg-[#3A3A3A] text-white font-bold text-center overflow-hidden cursor-pointer hover:scale-105 transition-transform z-10">
          <img src={resolverUrl(logoLoja)} alt="Logo da loja" className="w-full h-full object-cover" />
        </div>
      </Link>

      {/* Link para o Produto */}
      <Link href={`/produto-especifico/${data.id}`} className="block">
        <div className="w-full h-36 bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden flex items-center justify-center transition-colors duration-300">
          <img src={resolverUrl(urlImagem)} alt={data.nome} className="w-full h-full object-contain p-2" />
        </div>

        <div className="flex flex-col gap-1 mt-1">
          <h3 className="font-extrabold text-lg text-gray-900 dark:text-white truncate transition-colors duration-300">{data.nome}</h3>
          <p className="font-bold text-xl text-gray-900 dark:text-white transition-colors duration-300">R${Number(data.preco).toFixed(2).replace(".", ",")}</p>
          <p className={`text-xs font-bold mt-1 uppercase transition-colors duration-300 ${isDisponivel ? "text-[#C6E700] dark:text-[#D4F514]" : "text-[#AF052A] dark:text-[#FF4D6D]"}`}>
            {isDisponivel ? "DISPONÍVEL" : "INDISPONÍVEL"}
          </p>
        </div>
      </Link>
      
    </div>
  );
}