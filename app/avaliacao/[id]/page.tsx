'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/app/components/navbar";
import Image from 'next/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function resolverUrl(url?: string): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  if (url.startsWith('/images')) return url;
  return `${API_URL}${url}`;
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("@StockIO:token") || null;
}

function getUserIdFromToken(): number | null {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub ?? null;
  } catch {
    return null;
  }
}

type SubComentario = {
  id: number;
  id_usuario: number;
  comentario: string;
  created_at: string;
  updated_at: string;
  usuario?: { nome: string; username: string; foto_perfil_url: string; };
};

type AvaliacaoData = {
  id: number;
  nota: number;
  comentario: string;
  id_usuario: number;
  usuario?: { nome: string; username: string; foto_perfil_url: string; };
  comentarios?: SubComentario[];
};

function calcularTempoPassado(dataIso: string) {
  const data = new Date(dataIso);
  const agora = new Date();
  const diffMs = agora.getTime() - data.getTime();
  const diffSegundos = Math.floor(diffMs / 1000);
  const diffMinutos = Math.floor(diffSegundos / 60);
  const diffHoras = Math.floor(diffMinutos / 60);
  const diffDias = Math.floor(diffHoras / 24);

  if (diffDias > 0) return `${diffDias}d`;
  if (diffHoras > 0) return `${diffHoras}h`;
  if (diffMinutos > 0) return `${diffMinutos}m`;
  return "Agora";
}

export default function TelaAvaliacaoIdentica() {
  const params = useParams();
  const router = useRouter();
  const idAvaliacao = params?.id;

  const [dados, setDados] = useState<AvaliacaoData | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [idUsuarioLogado, setIdUsuarioLogado] = useState<number | null>(null);

  const [novoComentario, setNovoComentario] = useState("");

  const [modalEditComentarioOpen, setModalEditComentarioOpen] = useState(false);
  const [comentarioSendoEditado, setComentarioSendoEditado] = useState<SubComentario | null>(null);
  const [textoComentarioEditar, setTextoComentarioEditar] = useState("");

  const carregarDados = async () => {
    try {
      const response = await fetch(`${API_URL}/aval-produto/${idAvaliacao}`);
      if (!response.ok) throw new Error("Erro ao carregar");
      const data = await response.json();
      setDados(data);
    } catch (err) {
      console.error(err);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    setIdUsuarioLogado(getUserIdFromToken());
    if (idAvaliacao) carregarDados();
  }, [idAvaliacao]);

  async function handleAdicionarComentario(e: React.FormEvent) {
    e.preventDefault();
    if (!novoComentario.trim()) return;
    const token = getToken();

    try {
      const res = await fetch(`${API_URL}/aval-produto/${idAvaliacao}/comentario`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comentario: novoComentario }),
      });

      if (res.ok) {
        setNovoComentario("");
        carregarDados();
      } else {
        alert("Erro ao adicionar comentário.");
      }
    } catch (err) {
      console.error(err);
    }
  }

  function abrirModalEditarComentario(subCom: SubComentario) {
    setComentarioSendoEditado(subCom);
    setTextoComentarioEditar(subCom.comentario);
    setModalEditComentarioOpen(true);
  }

  async function handleSalvarComentarioEditado() {
    if (!comentarioSendoEditado) return;
    const token = getToken();

    try {
      const res = await fetch(`${API_URL}/aval-produto/comentario/${comentarioSendoEditado.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comentario: textoComentarioEditar }),
      });

      if (res.ok) {
        setModalEditComentarioOpen(false);
        carregarDados();
      } else {
        alert("Erro ao editar o comentário.");
      }
    } catch (err) {
      console.error(err);
    }
  }

  if (carregando) {
    return (
      <div className="bg-[#f6f3e4] dark:bg-[#1A1A1A] min-h-screen flex items-center justify-center transition-colors duration-300">
        <p className="text-gray-500 dark:text-gray-400 text-lg transition-colors duration-300">Carregando detalhes...</p>
      </div>
    );
  }

  const listaDeComentarios = dados?.comentarios || [];

  return (
    <div className="bg-[#f6f3e4] dark:bg-[#1A1A1A] min-h-screen flex flex-col font-sans transition-colors duration-300">
      <Navbar />

      {/* SECÇÃO PRINCIPAL (CABEÇALHO DA AVALIAÇÃO) */}
      <div className="bg-[#000000] dark:bg-[#111111] text-white pt-24 pb-16 px-8 flex justify-center w-full shadow-md transition-colors duration-300">
        <div className="w-full max-w-[900px] flex flex-col gap-6 relative">
          <button onClick={() => router.back()} className="absolute -left-12 top-2 hover:opacity-70 transition text-2xl font-bold cursor-pointer">‹</button>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div
                onClick={() => router.push(`/perfil/${dados?.id_usuario}`)}
                className="w-14 h-14 rounded-full overflow-hidden bg-gray-600 dark:bg-gray-700 flex-shrink-0 cursor-pointer hover:opacity-80 transition"
              >
                <img src={resolverUrl(dados?.usuario?.foto_perfil_url) || "/images/rosto.png"} alt="Perfil" className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{dados?.usuario?.nome || "Usuário"}</h2>
                <span className="text-xs text-gray-400">Avaliação Principal</span>
              </div>
            </div>

            <div className="flex gap-1">
              {Array.from({ length: dados?.nota || 5 }).map((_, i) => (
                <Image key={i} src="/images/estrela2.png" alt="Estrela" width={20} height={20} />
              ))}
            </div>
          </div>

          <p className="text-xl font-light text-gray-200 dark:text-gray-300 pl-2 leading-relaxed transition-colors duration-300">{dados?.comentario || "Sem comentário principal."}</p>
        </div>
      </div>

      {/* ÁREA DE COMENTÁRIOS DA COMUNIDADE */}
      <div className="flex-1 flex flex-col items-center py-12 px-8 w-full">
        <div className="w-full max-w-[800px] flex flex-col gap-8">
          
          <div className="flex flex-col gap-6 pl-6 border-l-2 border-gray-300/40 dark:border-gray-700/50 transition-colors duration-300">
            {listaDeComentarios.map((sub) => {
              const foiEditado = Math.abs(new Date(sub.updated_at).getTime() - new Date(sub.created_at).getTime()) > 1000;

              return (
                <div key={sub.id} className="flex flex-col gap-2 bg-white/40 dark:bg-[#2A2A2A] p-4 rounded-2xl shadow-sm relative transition-colors duration-300">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div
                        onClick={() => router.push(`/perfil/${sub.id_usuario}`)}
                        className="w-10 h-10 rounded-full overflow-hidden bg-gray-300 dark:bg-gray-700 cursor-pointer hover:opacity-80 transition"
                      >
                        <img src={resolverUrl(sub.usuario?.foto_perfil_url) || "/images/rosto.png"} alt="Foto" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900 dark:text-white text-base transition-colors duration-300">{sub.usuario?.nome || "Usuário"}</span>
                          {foiEditado && (
                            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wider italic transition-colors duration-300">editado</span>
                          )}
                        </div>
                        <span className="text-[11px] text-gray-400 font-light transition-colors duration-300">
                          {calcularTempoPassado(sub.created_at)}
                        </span>
                      </div>
                    </div>

                    {idUsuarioLogado === sub.id_usuario && (
                      <button onClick={() => abrirModalEditarComentario(sub)} className="w-[24px] h-[24px] bg-gray-100 dark:bg-[#3A3A3A] hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors duration-300 cursor-pointer">
                        <Image src="/images/lapis2.png" alt="Editar" width={14} height={14} />
                      </button>
                    )}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-base font-light pl-13 mt-1 whitespace-pre-wrap transition-colors duration-300">{sub.comentario}</p>
                </div>
              );
            })}

            {listaDeComentarios.length === 0 && (
              <p className="text-gray-400 dark:text-gray-500 italic text-center py-4 transition-colors duration-300">Nenhum comentário por aqui ainda.</p>
            )}
          </div>

          {/* INPUT PARA NOVO COMENTÁRIO */}
          <div className="mt-6 w-full">
            {idUsuarioLogado ? (
              <form onSubmit={handleAdicionarComentario} className="w-full bg-white dark:bg-[#2A2A2A] rounded-full px-6 py-4 shadow-sm flex items-center justify-between border border-gray-200 dark:border-transparent transition-colors duration-300">
                <input 
                  type="text" 
                  value={novoComentario} 
                  onChange={(e) => setNovoComentario(e.target.value)} 
                  placeholder="Adicionar comentário..." 
                  className="w-full bg-transparent outline-none text-gray-700 dark:text-white font-light placeholder-gray-400 dark:placeholder-gray-500 text-base transition-colors duration-300" 
                />
                <button type="submit" className="text-[#6A38F3] hover:opacity-70 transition pl-2 cursor-pointer">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
                </button>
              </form>
            ) : (
              <div className="w-full py-4 text-center text-gray-500 dark:text-gray-400 italic bg-white/60 dark:bg-[#2A2A2A] rounded-full border border-gray-200 dark:border-transparent shadow-sm transition-colors duration-300">
                Você precisa estar logado para comentar...
              </div>
            )}
          </div>

        </div>
      </div>

      {/* MODAL EDITAR COMENTÁRIO */}
      {modalEditComentarioOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#ebebeb] dark:bg-[#2A2A2A] w-full max-w-[650px] rounded-[2.5rem] p-10 flex flex-col items-center gap-6 relative shadow-2xl transition-colors duration-300">
            <button onClick={() => setModalEditComentarioOpen(false)} className="absolute top-6 right-6 text-black dark:text-white hover:opacity-60 text-3xl font-light transition-colors cursor-pointer">✕</button>

            <div className="w-full mt-4 bg-white dark:bg-[#1A1A1A] rounded-2xl p-6 min-h-[220px] shadow-inner flex flex-col transition-colors duration-300">
              <textarea 
                value={textoComentarioEditar} 
                onChange={(e) => setTextoComentarioEditar(e.target.value)} 
                placeholder="Comentário" 
                className="w-full flex-1 bg-transparent outline-none resize-none text-gray-700 dark:text-white dark:placeholder-gray-500 text-base font-light transition-colors duration-300" 
              />
            </div>

            <div className="w-full flex flex-col gap-4 mt-2 px-12">
              <button onClick={handleSalvarComentarioEditado} className="w-full py-3 bg-[#6A38F3] text-white font-semibold rounded-full shadow-lg text-sm tracking-wider uppercase hover:opacity-90 transition cursor-pointer">
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}