"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "../components/navbar";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const IMAGE_FALLBACK = "/images/brownie.png";

// ── Resolve qualquer formato de URL de imagem ──────────────
function resolverUrl(url: string | undefined): string {
  if (!url) return IMAGE_FALLBACK;
  if (url.startsWith("http")) return url;        // URL completa
  if (url.startsWith("/images")) return url;     // imagem local Next.js
  return `${API_URL}${url}`;                     // caminho relativo do backend
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("@StockIO:token") || null;
}

interface Produto {
  id: number;
  nome: string;
  preco: number;
  estoque: number;
  imagens?: { url_imagem: string }[];
}

interface ItemCarrinho {
  id: number;
  produto_id: number;
  quantidade: number;
  produto: Produto;
}

export default function Carrinho() {
  const router = useRouter();
  const [itens, setItens] = useState<ItemCarrinho[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCarrinho();
  }, []);

  async function fetchCarrinho() {
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/carrinho`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setItens(data);
    } catch (error) {
      console.error("Erro ao buscar carrinho:", error);
    } finally {
      setLoading(false);
    }
  }

  async function alterarQuantidade(idItem: number, novaQuantidade: number) {
    if (novaQuantidade < 1) return;
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/carrinho/${idItem}`, {
        method: "PATCH", 
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantidade: novaQuantidade }),
      });

      if (res.ok) {
        setItens((prev) =>
          prev.map((item) =>
            item.id === idItem ? { ...item, quantidade: novaQuantidade } : item
          )
        );
      }
    } catch (error) {
      console.error("Erro ao alterar quantidade:", error);
    }
  }

  async function removerItem(idItem: number) {
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/carrinho/${idItem}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setItens((prev) => prev.filter((item) => item.id !== idItem));
      }
    } catch (error) {
      console.error("Erro ao remover item:", error);
    }
  }

  const valorTotal = itens.reduce(
    (acc, item) => acc + Number(item.produto.preco) * item.quantidade,
    0
  );

  if (loading) {
    return (
      <div className="bg-[#f6f3e4] dark:bg-[#1A1A1A] min-h-screen flex items-center justify-center transition-colors duration-300">
        <p className="text-gray-500 dark:text-gray-400 text-lg font-sans transition-colors duration-300">Carregando seu carrinho...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#f6f3e4] dark:bg-[#1A1A1A] min-h-screen pb-12 flex flex-col items-center font-sans transition-colors duration-300">
      <Navbar />

      <div className="w-full max-w-[1200px] px-8 flex flex-col gap-8 mt-28">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white transition-colors duration-300">Seu Carrinho</h1>

        {itens.length === 0 ? (
          <div className="bg-white dark:bg-[#2A2A2A] rounded-[2.5rem] p-12 text-center shadow-sm flex flex-col items-center gap-6 border border-transparent dark:border-gray-700 transition-colors duration-300">
            <p className="text-xl text-gray-500 dark:text-gray-400 transition-colors duration-300">O seu carrinho está vazio no momento.</p>
            <button
              onClick={() => router.push("/")}
              className="bg-[#6A38F3] hover:bg-[#5B1EE0] text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md active:scale-[0.99]"
            >
              Bora ver uns produtos ➔
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Lista de Produtos */}
            <div className="flex-1 flex flex-col gap-4 w-full">
              {itens.map((item) => {
                const imagemUrl = item.produto.imagens && item.produto.imagens.length > 0
                  ? resolverUrl(item.produto.imagens[0].url_imagem)
                  : IMAGE_FALLBACK;

                return (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-[#2A2A2A] rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-6 border border-gray-50 dark:border-transparent transition-colors duration-300"
                  >
                    <div className="flex items-center gap-6 w-full sm:w-auto">
                      <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden flex items-center justify-center relative flex-shrink-0 transition-colors duration-300">
                        <img
                          src={imagemUrl}
                          alt={item.produto.nome}
                          className="w-full h-full object-contain p-2"
                        />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-xl text-gray-900 dark:text-white transition-colors duration-300">
                          {item.produto.nome}
                        </h3>
                        <p className="text-lg font-bold text-[#6A38F3] dark:text-[#9b73f8] mt-1 transition-colors duration-300">
                          R${Number(item.produto.preco).toFixed(2).replace(".", ",")}
                        </p>
                      </div>
                    </div>

                    {/* Controles de Quantidade e Deletar */}
                    <div className="flex items-center gap-6 justify-between w-full sm:w-auto border-t sm:border-t-0 border-gray-100 dark:border-gray-700 pt-4 sm:pt-0 transition-colors duration-300">
                      
                      <div className="flex items-center bg-gray-100 dark:bg-[#1A1A1A] rounded-xl p-1 transition-colors duration-300">
                        <button
                          onClick={() => alterarQuantidade(item.id, item.quantidade - 1)}
                          className="w-8 h-8 font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#3A3A3A] rounded-lg transition-colors duration-300 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-10 text-center font-bold text-gray-800 dark:text-white transition-colors duration-300">
                          {item.quantidade}
                        </span>
                        <button
                          onClick={() => alterarQuantidade(item.id, item.quantidade + 1)}
                          className="w-8 h-8 font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#3A3A3A] rounded-lg transition-colors duration-300 cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removerItem(item.id)}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors duration-300 text-red-500 dark:text-red-400 font-semibold text-sm flex items-center gap-1 cursor-pointer"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Resumo do Pedido */}
            <div className="w-full lg:w-[380px] bg-white dark:bg-[#2A2A2A] rounded-[2.5rem] p-8 shadow-sm flex flex-col gap-6 border border-gray-50 dark:border-transparent transition-colors duration-300">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white transition-colors duration-300">Resumo</h2>
              
              <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4 text-gray-600 dark:text-gray-400 transition-colors duration-300">
                <span>Quantidade de itens</span>
                <span className="font-bold text-gray-900 dark:text-white transition-colors duration-300">
                  {itens.reduce((acc, item) => acc + item.quantidade, 0)}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-lg text-gray-800 dark:text-gray-300 font-medium transition-colors duration-300">Total</span>
                <span className="text-3xl font-black text-gray-950 dark:text-white transition-colors duration-300">
                  R${valorTotal.toFixed(2).replace(".", ",")}
                </span>
              </div>

              <button
                onClick={() => router.push("/checkout")}
                className="w-full bg-[#6A38F3] hover:bg-[#5B1EE0] text-white py-4 rounded-xl font-extrabold text-lg transition-all shadow-md active:scale-[0.99] cursor-pointer"
              >
                Finalizar Compra ➔
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}