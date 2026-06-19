'use client';

import { useRef, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('@StockIO:token') || null;
}

function resolverUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  if (url.startsWith('/images')) return url;
  return `${API_URL}${url}`;
}

interface ImagemProduto {
  id: number;
  url_imagem: string;
  ordem: number;
}

interface ModalEditarProdutoProps {
  isOpen: boolean;
  onClose: () => void;
  produtoId: number;
  onProdutoAtualizado?: () => void;
}

export default function ModalEditarProduto({
  isOpen,
  onClose,
  produtoId,
  onProdutoAtualizado,
}: ModalEditarProdutoProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [nome, setNome] = useState('');
  const [idCategoria, setIdCategoria] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [estoque, setEstoque] = useState(0);

  const [categorias, setCategorias] = useState<{ id: number; nome: string }[]>([]);

  const [imagensExistentes, setImagensExistentes] = useState<ImagemProduto[]>([]);
  const [novasImagens, setNovasImagens] = useState<(File | null)[]>([null, null, null, null]);
  const [prevsImagens, setPrevsImagens] = useState<(string | null)[]>([null, null, null, null]);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    if (isOpen) {
      carregarDados();
    }
  }, [isOpen, produtoId]);

  async function carregarDados() {
    setLoading(true);
    try {
      const [resProduto, resCategorias] = await Promise.all([
        fetch(`${API_URL}/produtos/${produtoId}`),
        fetch(`${API_URL}/category`),
      ]);

      if (!resProduto.ok) {
        alert('Erro ao carregar dados do produto.');
        onClose();
        return;
      }

      const produto = await resProduto.json();
      const cats = await resCategorias.json();

      setNome(produto.nome || '');
      setDescricao(produto.descricao || '');
      setPreco(produto.preco ? String(produto.preco).replace('.', ',') : '');
      setEstoque(produto.estoque || 0);
      setIdCategoria(produto.id_categoria ? String(produto.id_categoria) : '');

      const imgs = (produto.imagens || []).sort((a: ImagemProduto, b: ImagemProduto) => a.ordem - b.ordem);
      setImagensExistentes(imgs);

      setCategorias(cats || []);
      setNovasImagens([null, null, null, null]);
      setPrevsImagens([null, null, null, null]);
    } catch {
      alert('Erro ao carregar dados.');
      onClose();
    } finally {
      setLoading(false);
    }
  }

  function handleImagemChange(index: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const novas = [...novasImagens];
    const novosPrevs = [...prevsImagens];
    novas[index] = file;
    novosPrevs[index] = URL.createObjectURL(file);
    setNovasImagens(novas);
    setPrevsImagens(novosPrevs);
  }

  function getImagemSrc(index: number): string {
    if (prevsImagens[index]) return prevsImagens[index]!;
    const existente = imagensExistentes[index];
    if (existente) return resolverUrl(existente.url_imagem);
    return '';
  }

  function temImagemNoSlot(index: number): boolean {
    return !!prevsImagens[index] || !!imagensExistentes[index];
  }

  async function handleSalvar() {
    if (!nome.trim() || !preco) {
      alert('Nome e preço são obrigatórios!');
      return;
    }
    setSaving(true);
    try {
      const token = getToken();

      const res = await fetch(`${API_URL}/produtos/${produtoId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: nome.trim(),
          descricao: descricao.trim(),
          preco: parseFloat(preco.replace(',', '.')),
          estoque,
          id_categoria: Number(idCategoria) || null,
        }),
      });

      if (!res.ok) throw new Error('Erro ao atualizar produto');

      for (let i = 0; i < novasImagens.length; i++) {
        const file = novasImagens[i];
        if (!file) continue;
        const formData = new FormData();
        formData.append('imagem', file);
        formData.append('ordem', String(i + 1));
        const imgRes = await fetch(`${API_URL}/produtos/${produtoId}/imagens`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        if (!imgRes.ok) console.error(`Erro ao enviar imagem ${i + 1}`);
      }

      handleFechar();
      onProdutoAtualizado?.();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar produto.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeletar() {
    if (!confirm('Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.')) return;
    setDeleting(true);
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/produtos/${produtoId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Erro ao deletar produto');
      onClose();
      router.push('/');
    } catch (err) {
      console.error(err);
      alert('Erro ao deletar produto.');
      setDeleting(false);
    }
  }

  function handleFechar() {
    setNome('');
    setDescricao('');
    setPreco('');
    setEstoque(0);
    setIdCategoria('');
    setImagensExistentes([]);
    setNovasImagens([null, null, null, null]);
    setPrevsImagens([null, null, null, null]);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-[#EDEDED] w-[90%] max-w-[500px] rounded-[2rem] p-8 shadow-2xl relative max-h-[95vh] overflow-y-auto scrollbar-hide">

        <button onClick={handleFechar} className="absolute top-6 right-6 text-black hover:text-gray-500 transition-colors">
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-center text-black mb-6 mt-1">
          Editar Produto
        </h2>

        {loading ? (
          <div className="flex justify-center py-16">
            <p className="text-gray-500 animate-pulse">Carregando produto...</p>
          </div>
        ) : (
          <>
            {/* Upload de imagens */}
            <div className="mb-6">
              <input
                type="file"
                ref={inputRefs[0]}
                className="hidden"
                accept="image/*"
                onChange={(e) => handleImagemChange(0, e)}
              />
              <div
                onClick={() => inputRefs[0].current?.click()}
                className="w-full border-[2px] border-dashed border-[#7C3AED] rounded-2xl h-[120px] flex flex-col items-center justify-center cursor-pointer hover:bg-purple-50/40 transition-colors mb-3 overflow-hidden"
              >
                {getImagemSrc(0) ? (
                  <img src={getImagemSrc(0)} alt="Preview principal" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                    <span className="text-sm text-gray-500 mt-2">Anexe as fotos do seu produto</span>
                  </>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <input
                      type="file"
                      ref={inputRefs[i]}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleImagemChange(i, e)}
                    />
                    <div
                      onClick={() => inputRefs[i].current?.click()}
                      className="border-[2px] border-dashed border-[#7C3AED] rounded-2xl h-[90px] flex items-center justify-center cursor-pointer hover:bg-purple-50/40 transition-colors overflow-hidden"
                    >
                      {getImagemSrc(i) ? (
                        <img src={getImagemSrc(i)} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                      ) : (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                          <circle cx="12" cy="13" r="4" />
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Formulário */}
            <div className="flex flex-col gap-3 mb-4">
              <input
                type="text"
                placeholder="Nome do produto"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full px-5 py-3 rounded-full bg-white text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] shadow-sm"
              />

              <div className="relative">
                <select
                  value={idCategoria}
                  onChange={(e) => setIdCategoria(e.target.value)}
                  className="w-full px-5 py-3 rounded-full bg-white text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] shadow-sm appearance-none cursor-pointer"
                >
                  <option value="" disabled>Selecione uma categoria</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nome}
                    </option>
                  ))}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
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
                className="w-full px-5 py-3 rounded-2xl bg-white text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] shadow-sm resize-none"
              />

              <input
                type="text"
                placeholder="Preço do produto"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                className="w-full px-5 py-3 rounded-full bg-white text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] shadow-sm"
              />
            </div>

            {/* Controle de estoque */}
            <div className="flex items-center justify-center gap-6 mb-6">
              <button
                onClick={() => setEstoque((prev) => Math.max(0, prev - 1))}
                className="w-10 h-10 relative hover:scale-110 transition-transform cursor-pointer"
              >
                <Image src="/Menos-token.png" alt="Diminuir" fill className="object-contain" />
              </button>

              <span className="text-2xl font-bold text-black w-8 text-center">{estoque}</span>

              <button
                onClick={() => setEstoque((prev) => prev + 1)}
                className="w-10 h-10 relative hover:scale-110 transition-transform cursor-pointer"
              >
                <Image src="/Mais-token.png" alt="Aumentar" fill className="object-contain" />
              </button>
            </div>

            {/* Botão Deletar */}
            <button
              onClick={handleDeletar}
              disabled={deleting}
              className="w-full bg-[#FF0000] text-white font-bold text-sm py-3 rounded-full shadow-md hover:bg-red-700 transition-colors mb-6 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {deleting ? 'Excluindo...' : 'DELETAR PRODUTO'}
            </button>

            {/* Botão Salvar */}
            <button
              onClick={handleSalvar}
              disabled={saving}
              className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold py-3.5 rounded-full shadow-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
