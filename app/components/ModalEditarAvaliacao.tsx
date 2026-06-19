"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("@StockIO:token") || null;
}

type Avaliacao = {
  id: number;
  id_usuario: number;
  nota: number;
  comentario?: string;
};

type ModalEditarAvaliacaoProps = {
  isOpen: boolean;
  onClose: () => void;
  avaliacao: Avaliacao | null;
  nomeProduto?: string;
  onAvaliacaoAtualizada: () => void;
};

export default function ModalEditarAvaliacao({
  isOpen,
  onClose,
  avaliacao,
  nomeProduto,
  onAvaliacaoAtualizada,
}: ModalEditarAvaliacaoProps) {
  const [modalNota, setModalNota] = useState(0);
  const [modalComentario, setModalComentario] = useState("");

  useEffect(() => {
    if (avaliacao) {
      setModalNota(avaliacao.nota);
      setModalComentario(avaliacao.comentario || "");
    }
  }, [avaliacao]);

  if (!isOpen || !avaliacao) return null;

  async function handleSalvarAvaliacao() {
    const token = getToken();
    try {
      const res = await fetch(`${API_URL}/aval-produto/${avaliacao!.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nota: modalNota, comentario: modalComentario }),
      });

      if (res.ok) {
        onAvaliacaoAtualizada();
        onClose();
      } else {
        alert("Erro ao atualizar a avaliação.");
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDeletarAvaliacao() {
    const token = getToken();
    if (!confirm("Tem certeza que deseja deletar sua avaliação?")) return;

    try {
      const res = await fetch(`${API_URL}/aval-produto/${avaliacao!.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        onAvaliacaoAtualizada();
        onClose();
      } else {
        alert("Erro ao deletar a avaliação.");
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#ebebeb] dark:bg-[#2A2A2A] w-full max-w-[650px] rounded-[2.5rem] p-10 flex flex-col items-center gap-6 relative shadow-2xl transition-colors duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 text-black dark:text-white hover:opacity-60 text-3xl font-light transition-colors cursor-pointer">✕</button>
        <h2 className="text-2xl font-normal text-black dark:text-gray-200 mt-2 transition-colors duration-300">
          Você está editando a avaliação de <span className="font-semibold text-black dark:text-white transition-colors duration-300">{nomeProduto}</span>
        </h2>

        <div className="flex gap-2 my-2">
          {[1, 2, 3, 4, 5].map((estrela) => (
            <button key={estrela} onClick={() => setModalNota(estrela)} className="transition-transform hover:scale-110 cursor-pointer">
              {estrela <= modalNota ? (
                <svg className="w-14 h-14 text-[#6A38F3]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
              ) : (
                <svg className="w-14 h-14 text-[#6A38F3]" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
              )}
            </button>
          ))}
        </div>

        <div className="w-full bg-white dark:bg-[#1A1A1A] rounded-2xl p-6 min-h-[220px] shadow-inner flex flex-col transition-colors duration-300">
          <textarea
            value={modalComentario}
            onChange={(e) => setModalComentario(e.target.value)}
            placeholder="Avaliação do produto"
            className="w-full flex-1 bg-transparent outline-none resize-none text-gray-700 dark:text-white dark:placeholder-gray-500 text-base font-light transition-colors duration-300"
          />
        </div>

        <div className="w-full flex flex-col gap-4 mt-4 px-12">
          <button onClick={handleDeletarAvaliacao} className="w-full py-3 bg-[#FF0000] text-white font-semibold rounded-full shadow-md text-sm tracking-wider uppercase hover:opacity-90 transition cursor-pointer">DELETAR</button>
          <button onClick={handleSalvarAvaliacao} className="w-full py-3 bg-[#6A38F3] text-white font-semibold rounded-full shadow-lg text-sm tracking-wider uppercase hover:opacity-90 transition cursor-pointer">Salvar</button>
        </div>
      </div>
    </div>
  );
}