"use client";

import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("@StockIO:token") || null;
}

type ModalCriarAvaliacaoProps = {
  isOpen: boolean;
  onClose: () => void;
  idProduto: number;
  nomeProduto?: string;
  onAvaliacaoCriada: () => void;
};

export default function ModalCriarAvaliacao({
  isOpen,
  onClose,
  idProduto,
  nomeProduto,
  onAvaliacaoCriada,
}: ModalCriarAvaliacaoProps) {
  const [criarNota, setCriarNota] = useState(0);
  const [criarComentario, setCriarComentario] = useState("");

  if (!isOpen) return null;

  async function handleCriarAvaliacao() {
    if (criarNota === 0) {
      alert("Por favor, selecione pelo menos uma estrela para avaliar!");
      return;
    }
    const token = getToken();
    try {
      const res = await fetch(`${API_URL}/aval-produto/${idProduto}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nota: criarNota, comentario: criarComentario }),
      });

      if (res.ok) {
        setCriarNota(0);
        setCriarComentario("");
        onAvaliacaoCriada();
        onClose();
      } else {
        alert("Erro ao criar a avaliação. Você já avaliou este produto?");
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#ebebeb] w-full max-w-[650px] rounded-[2.5rem] p-10 flex flex-col items-center gap-6 relative shadow-2xl">
        <button onClick={onClose} className="absolute top-6 right-6 text-black hover:opacity-60 text-3xl font-light">✕</button>
        <h2 className="text-2xl font-normal text-black mt-2">
          Você está avaliando <span className="font-semibold">{nomeProduto}</span>
        </h2>

        <div className="flex gap-2 my-2">
          {[1, 2, 3, 4, 5].map((estrela) => (
            <button key={estrela} onClick={() => setCriarNota(estrela)} className="transition-transform hover:scale-110 w-14 h-14">
              <svg viewBox="0 0 138 132" fill={estrela <= criarNota ? "#8A38F5" : "none"} xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path d="M64.2949 3.67505C65.6449 -0.558235 71.6355 -0.55837 72.9854 3.67505L85.5371 43.0422C86.2758 45.3589 88.4337 46.9267 90.8652 46.9133L132.185 46.6858C136.628 46.6617 138.478 52.3594 134.869 54.9514L101.308 79.054C99.3329 80.4724 98.5084 83.0094 99.2725 85.3176L112.258 124.544C113.654 128.763 108.807 132.283 105.227 129.652L87.4395 116.578L71.9326 105.181C69.9734 103.741 67.3059 103.741 65.3467 105.181L32.0527 129.652C28.4723 132.283 23.6263 128.763 25.0225 124.544L38.0068 85.3176C38.7709 83.0093 37.9465 80.4724 35.9717 79.054L2.41016 54.9514C-1.19912 52.3594 0.652166 46.6613 5.0957 46.6858L46.4141 46.9133C48.8456 46.9267 51.0045 45.3589 51.7432 43.0422L64.2949 3.67505Z" stroke="#8A38F5" strokeWidth="5"/>
              </svg>
            </button>
          ))}
        </div>

        <div className="w-full bg-white rounded-2xl p-6 min-h-[220px] shadow-inner flex flex-col">
          <textarea
            value={criarComentario}
            onChange={(e) => setCriarComentario(e.target.value)}
            placeholder="Avaliação da loja"
            className="w-full flex-1 outline-none resize-none text-gray-700 text-base font-light placeholder-gray-400"
          />
        </div>

        <div className="w-full flex flex-col gap-4 mt-4 px-12">
          <button onClick={handleCriarAvaliacao} className="w-full py-3 bg-[#6A38F3] text-white font-semibold rounded-full shadow-lg text-sm tracking-wider uppercase hover:opacity-90 transition-all">
            Avaliar
          </button>
        </div>
      </div>
    </div>
  );
}