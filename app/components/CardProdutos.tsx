'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function resolverUrl(url?: string): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  if (url.startsWith('/images')) return url;
  return `${API_URL}${url}`;
}

export default function CardProduto({ data }: { data: any }) {
  const isDisponivel = data.estoque > 0;
  const urlImagem = data?.imagens?.[0]?.url_imagem || '/images/steamdeck.png';
  const logoLoja = data.loja?.logo_url ? data.loja.logo_url : "/images/cjr.png";

  return (
    <div className="bg-white rounded-[2rem] p-5 shadow-sm flex flex-col gap-3 border border-transparent hover:border-gray-200 transition-all relative h-full">
      
      {/* Botão arredondado da Loja (estilo espelhado da tela de Lojas) */}
      <Link href={`/lojas/${data.id_loja}`}>
        <div className="absolute top-4 right-4 w-[50px] h-[50px] rounded-full flex items-center justify-center shadow-sm border-[4px] border-[#F6F5ED] bg-black text-white font-bold text-center overflow-hidden cursor-pointer hover:scale-105 transition-transform z-10">
          <img src={resolverUrl(logoLoja)} alt="Logo da loja" className="w-full h-full object-cover" />
        </div>
      </Link>

      {/* Link para o Produto */}
      <Link href={`/produto-especifico/${data.id}`} className="block">
        <div className="w-full h-36 bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center">
          <img src={resolverUrl(urlImagem)} alt={data.nome} className="w-full h-full object-contain p-2" />
        </div>

        <div className="flex flex-col gap-1 mt-1">
          <h3 className="font-extrabold text-lg text-gray-900 truncate">{data.nome}</h3>
          <p className="font-bold text-xl text-gray-900">R${Number(data.preco).toFixed(2).replace(".", ",")}</p>
          <p className={`text-xs font-bold mt-1 uppercase ${isDisponivel ? "text-[#C6E700]" : "text-[#AF052A]"}`}>
            {isDisponivel ? "DISPONÍVEL" : "INDISPONÍVEL"}
          </p>
        </div>
      </Link>
    </div>
  );
}