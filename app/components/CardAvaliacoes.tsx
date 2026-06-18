'use client';

import React from 'react';
import Image from 'next/image';
import {useRouter} from 'next/navigation';

interface CardAvaliacaoProps {
  data: any;
  usuarioLogadoId?: number; 
  abrirModalEdicao?: (avaliacao: any) => void;
  isDragging?: boolean;
}

export default function CardAvaliacao({ data, usuarioLogadoId, abrirModalEdicao, isDragging }: CardAvaliacaoProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => { 
        if (!isDragging) router.push(`/avaliacao/${data.id}`); 
      }}
      className="bg-[#fcfbf7] hover:bg-[#f5f4ef] transition-colors rounded-[2.5rem] p-8 min-w-[450px] shadow-sm snap-start flex flex-col gap-4 border border-gray-100 cursor-pointer"
    >
      <div className="flex justify-between items-center">
        
        <div className="flex items-center gap-4">
          <div
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/perfil/${data.id_usuario}`);
            }}
            className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 cursor-pointer hover:opacity-80 transition"
          >
            <img
              src={data.usuario?.foto_perfil_url || "/images/rosto.png"}
              alt={data.usuario?.nome ?? "usuário"}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="font-bold text-xl text-gray-900">
            {data.usuario?.nome ?? data.usuario?.username ?? "Usuário"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {Array.from({ length: data.nota || 0 }).map((_, index) => (
              <Image key={index} src="/images/estrela2.png" alt="Estrela" width={22} height={22} />
            ))}
          </div>
          
          {usuarioLogadoId === data.id_usuario && abrirModalEdicao && (
            <button
              onClick={(e) => { 
                e.stopPropagation(); 
                abrirModalEdicao(data); 
              }}
              className="w-[27px] h-[27px] bg-[#fcfbf7] rounded-full flex items-center justify-center hover:bg-gray-200 transition cursor-pointer"
            >
              <Image src="/images/lapis2.png" alt="Editar" width={17} height={17} />
            </button>
          )}
        </div>
      </div>

      <p className="text-gray-700 text-lg">{data.comentario}</p>
    </div>
  );
}