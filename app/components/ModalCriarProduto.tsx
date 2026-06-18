'use client';

import { useRef, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('@StockIO:token') || null;
}

interface ModalCriarProdutoProps {
  isOpen: boolean;
  onClose: () => void;
  idLoja: number;
  onProdutoCriado?: () => void;
}

export default function ModalCriarProduto({
  isOpen,
  onClose,
  idLoja,
  onProdutoCriado,
}: ModalCriarProdutoProps) {

  // ── Campos do formulário ──────────────────────────────────
  const [nome, setNome]                 = useState('');
  const [subcategoria, setSubcategoria] = useState('');
  const [descricao, setDescricao]       = useState('');
  const [preco, setPreco]               = useState('');
  const [estoque, setEstoque]           = useState(0);
  const [carregando, setCarregando]     = useState(false);

  // ── Categorias do banco ───────────────────────────────────
  const [categorias, setCategorias] = useState<{ id: number; nome: string }[]>([]);

 useEffect(() => {
    async function fetchCategorias() {
      try {
        const res = await fetch(`${API_URL}/category`);
        console.log('Status categorias:', res.status);
        const data = await res.json();
        console.log('Dados categorias:', data);
        if (!res.ok) throw new Error();
        setCategorias(data);
      } catch {
        console.error('Erro ao buscar categorias');
      }
    }
    fetchCategorias();
  }, []);

  // ── Imagens ───────────────────────────────────────────────
  const [imgPrincipal, setImgPrincipal]         = useState<File | null>(null);
  const [prevPrincipal, setPrevPrincipal]       = useState<string | null>(null);
  const [imgsSecundarias, setImgsSecundarias]   = useState<(File | null)[]>([null, null, null]);
  const [prevsSecundarias, setPrevsSecundarias] = useState<(string | null)[]>([null, null, null]);

  // ── Refs dos inputs de arquivo ────────────────────────────
  const inputPrincipalRef = useRef<HTMLInputElement>(null);
  const inputsSecundariosRef = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  if (!isOpen) return null;

 
  function handlePrincipalChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgPrincipal(file);
    setPrevPrincipal(URL.createObjectURL(file));
  }

  function handleSecundariaChange(index: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const novasImgs   = [...imgsSecundarias];
    const novosPreves = [...prevsSecundarias];
    novasImgs[index]   = file;
    novosPreves[index] = URL.createObjectURL(file);
    setImgsSecundarias(novasImgs);
    setPrevsSecundarias(novosPreves);
  }

  // ── Submit ────────────────────────────────────────────────
  async function handleAdicionar() {
    if (!nome.trim() || !preco) {
      alert('Nome e preço são obrigatórios!');
      return;
    }
    setCarregando(true);
    try {
      const token = getToken();

      // 1. Cria o produto
      const resProduto = await fetch(`${API_URL}/produtos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome,
          descricao,
          preco: parseFloat(preco.replace(',', '.')),
          estoque,
          id_loja: idLoja,
          id_categoria: Number(subcategoria),
        }),
      });
   if (!resProduto.ok) {
  const errorData = await resProduto.json();
  throw new Error(JSON.stringify(errorData));
}
      const produtoCriado = await resProduto.json();

      // 2. Upload das imagens em sequência
      const todasImagens = [imgPrincipal, ...imgsSecundarias].filter(Boolean) as File[];
      for (let i = 0; i < todasImagens.length; i++) {
        const formData = new FormData();
        formData.append('imagem', todasImagens[i]);
        formData.append('id_produto', String(produtoCriado.id));
        formData.append('ordem', String(i + 1));
        await fetch(`${API_URL}/produtos/${produtoCriado.id}/imagens`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
      }

      alert('Produto criado com sucesso!');
      handleFechar();
      onProdutoCriado?.();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Não foi possível criar o produto.');
    } finally {
      setCarregando(false);
    }
  }

  function handleFechar() {
    setNome('');
    setSubcategoria('');
    setDescricao('');
    setPreco('');
    setEstoque(0);
    setImgPrincipal(null);
    setPrevPrincipal(null);
    setImgsSecundarias([null, null, null]);
    setPrevsSecundarias([null, null, null]);
    onClose();
  }

  function CameraIcon({ size = 28 }: { size?: number }) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
     <div className="bg-[#EDEDED] dark:bg-[#2A2A2A] w-[90%] max-w-[500px] rounded-[2rem] p-8 shadow-2xl relative max-h-[1020px] transition-colors duration-300">

        {/* Botão fechar */}
        <button onClick={handleFechar} className="absolute top-6 right-6 text-black dark:text-white hover:text-gray-500 dark:hover:text-gray-300 transition-colors cursor-pointer">
          <X size={24} />
        </button>

        {/* Título */}
        <h2 className="text-2xl font-bold text-center text-black dark:text-white mb-6 mt-1 transition-colors duration-300">
          Adicionar Produto
        </h2>

        {/*Bloco para comentar*/}
        <div>
          {/* Upload imagem principal */}
          <input
            type="file"
            ref={inputPrincipalRef}
            className="hidden"
            accept="image/*"
            onChange={handlePrincipalChange}
          />
          <div
            onClick={() => inputPrincipalRef.current?.click()}
            className="w-full border-[2px] border-dashed border-[#7C3AED] rounded-2xl h-[120px] flex flex-col items-center justify-center cursor-pointer hover:bg-purple-50/40 dark:hover:bg-[#7C3AED]/10 transition-colors mb-3 overflow-hidden"
          >
            {prevPrincipal ? (
              <img src={prevPrincipal} alt="Preview principal" className="w-full h-full object-cover" />
            ) : (
              <>
                <CameraIcon size={32} />
                <span className="text-sm text-gray-500 dark:text-gray-400 mt-2 transition-colors duration-300">Anexe as fotos do seu produto</span>
              </>
            )}
          </div>

          {/* 3 slots de imagens secundárias */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[0, 1, 2].map((i) => (
              <div key={i}>
                <input
                  type="file"
                  ref={inputsSecundariosRef[i]}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleSecundariaChange(i, e)}
                />
                <div
                  onClick={() => inputsSecundariosRef[i].current?.click()}
                  className="border-[2px] border-dashed border-[#7C3AED] rounded-2xl h-[90px] flex items-center justify-center cursor-pointer hover:bg-purple-50/40 dark:hover:bg-[#7C3AED]/10 transition-colors overflow-hidden"
                >
                  {prevsSecundarias[i] ? (
                    <img src={prevsSecundarias[i]!} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                  ) : (
                    <CameraIcon size={22} />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Campos do formulário */}
          <div className="flex flex-col gap-3 mb-4">

            <input
              type="text"
              placeholder="Nome do produto"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-5 py-3 rounded-full bg-white dark:bg-[#1A1A1A] text-gray-700 dark:text-white placeholder:text-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] shadow-sm transition-colors duration-300"
            />

            {/* Combobox de subcategorias puxado do banco */}
            <div className="relative">
              <select
                value={subcategoria}
                onChange={(e) => setSubcategoria(e.target.value)}
                className="w-full px-5 py-3 rounded-full bg-white dark:bg-[#1A1A1A] text-gray-500 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] shadow-sm appearance-none cursor-pointer transition-colors duration-300"
              >
                <option value="" disabled>Subcategoria</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nome}
                  </option>
                ))}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 dark:text-gray-500 transition-colors duration-300">
                <svg width="12" height="7" viewBox="0 0 12 7" fill="none">
                  <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            <textarea
              placeholder="Descrição do produto"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={3}
              className="w-full px-5 py-3 rounded-2xl bg-white dark:bg-[#1A1A1A] text-gray-700 dark:text-white placeholder:text-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] shadow-sm resize-none transition-colors duration-300"
            />

            <input
              type="text"
              placeholder="Preço do produto"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              className="w-full px-5 py-3 rounded-full bg-white dark:bg-[#1A1A1A] text-gray-700 dark:text-white placeholder:text-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] shadow-sm transition-colors duration-300"
            />
          </div>
        </div>

        {/* Controle de estoque */}
        <div className="flex items-center justify-center gap-6 mb-6">
          <button
            onClick={() => setEstoque((prev) => Math.max(0, prev - 1))}
            className="w-10 h-10 relative hover:scale-110 transition-transform cursor-pointer"
          >
             <Image src="/Menos-token.png" alt="Diminuir quantidade" fill className="object-contain" />
          </button>

          <span className="text-2xl font-bold text-black dark:text-white w-8 text-center transition-colors duration-300">{estoque}</span>
          <button
            onClick={() => setEstoque((prev) => prev + 1)}
             className="w-10 h-10 relative hover:scale-110 transition-transform cursor-pointer"
          >
             <Image src="/Mais-token.png" alt="Aumentar quantidade" fill className="object-contain" />
            +
          </button>
        </div>

        {/*Botão avançar*/}
        <div>
          <button
            onClick={handleAdicionar}
            disabled={carregando}
            className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold py-3.5 rounded-full shadow-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {carregando ? 'Adicionando...' : 'Adicionar'}
          </button>
        </div>

      </div>
    </div>
  );
}