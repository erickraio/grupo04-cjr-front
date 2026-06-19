'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../../components/navbar';
import CardProdutos from '../../components/CardProdutos';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const ITEMS_POR_PAGINA = 10;

function resolverUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  if (url.startsWith('/images')) return url;
  return `${API_URL}${url}`;
}

export default function CategoriaEspecifica() {
  const params = useParams();
  const idCategoria = Number(params.id);

  const [categoria, setCategoria] = useState<any>(null);
  const [todosProdutos, setTodosProdutos] = useState<any[]>([]);
  const [lojas, setLojas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  const [busca, setBusca] = useState('');
  const [ordenarPor, setOrdenarPor] = useState('');
  const [subcategoriaSelecionada, setSubcategoriaSelecionada] = useState<number | null>(null);
  const [paginaAtual, setPaginaAtual] = useState(1);

  useEffect(() => {
    carregarDados();
  }, [idCategoria]);

  useEffect(() => {
    setPaginaAtual(1);
  }, [busca, ordenarPor, subcategoriaSelecionada]);

  async function carregarDados() {
    setLoading(true);
    setErro('');
    try {
      const [resCat, resProds, resLojas] = await Promise.all([
        fetch(`${API_URL}/category/${idCategoria}`),
        fetch(`${API_URL}/produtos`),
        fetch(`${API_URL}/lojas`),
      ]);

      if (!resCat.ok) {
        setErro('Categoria não encontrada.');
        setLoading(false);
        return;
      }

      const dataCat = await resCat.json();
      const dataProds = await resProds.json();
      const dataLojas = await resLojas.json();

      setCategoria(dataCat);
      setTodosProdutos(dataProds);
      setLojas(dataLojas);
    } catch {
      setErro('Erro ao carregar dados do servidor.');
    } finally {
      setLoading(false);
    }
  }

  const subcategoriaIds = (categoria?.subcategorias || []).map((s: any) => s.id);
  const produtosDaCategoria = todosProdutos.filter(
    (p: any) => p.id_categoria === idCategoria || subcategoriaIds.includes(p.id_categoria)
  );

  const produtosPorSub = subcategoriaSelecionada
    ? produtosDaCategoria.filter((p: any) => p.id_categoria === subcategoriaSelecionada)
    : produtosDaCategoria;

  const produtosBuscados = busca
    ? produtosPorSub.filter((p: any) =>
        p.nome.toLowerCase().includes(busca.toLowerCase())
      )
    : produtosPorSub;

  const produtosOrdenados = [...produtosBuscados].sort((a: any, b: any) => {
    if (ordenarPor === 'menor-preco') return a.preco - b.preco;
    if (ordenarPor === 'maior-preco') return b.preco - a.preco;
    return 0;
  });

  const totalPaginas = Math.ceil(produtosOrdenados.length / ITEMS_POR_PAGINA);
  const produtosPagina = produtosOrdenados.slice(
    (paginaAtual - 1) * ITEMS_POR_PAGINA,
    paginaAtual * ITEMS_POR_PAGINA
  );

  const populares = [...produtosDaCategoria]
    .sort((a: any, b: any) => (b.estoque || 0) - (a.estoque || 0))
    .slice(0, 8);

  const recentes = [...produtosDaCategoria]
    .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 8);

  const subcategorias = categoria?.subcategorias || [];

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F6F5ED] dark:bg-[#1A1A1A] transition-colors duration-300">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-gray-500 dark:text-gray-400 text-lg animate-pulse transition-colors duration-300">Carregando...</p>
        </div>
      </main>
    );
  }

  if (erro) {
    return (
      <main className="min-h-screen bg-[#F6F5ED] dark:bg-[#1A1A1A] transition-colors duration-300">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <p className="text-gray-500 dark:text-gray-400 text-lg transition-colors duration-300">{erro}</p>
          <button
            onClick={carregarDados}
            className="bg-[#7C3AED] text-white px-6 py-2 rounded-full hover:bg-[#6A38F3] transition-colors shadow-md"
          >
            Tentar novamente
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F6F5ED] dark:bg-[#1A1A1A] transition-colors duration-300">
      <Navbar />

      {/* ============================================== */}
      {/* 1. HERO SECTION                                */}
      {/* ============================================== */}
      <section className="bg-[#0A0A0A] w-full pt-8 px-6 md:px-12 flex justify-center overflow-hidden">
        <div className="max-w-[1200px] w-full flex flex-col md:flex-row items-center justify-between">
          <div className="w-full md:w-[55%] z-20 text-center md:text-left pb-8 md:pb-22 mt-12">
            <h1 className="text-white text-[40px] md:text-[64px] font-bold leading-[1.1] tracking-tight">
              O universo de <span className="font-extrabold">{categoria?.nome || '...'}</span> <br />
              em um só lugar
            </h1>
          </div>
          <div className="w-full md:w-[45%] flex justify-center md:justify-end relative h-[500px] md:h-[650px] overflow-hidden -mb-16 md:-mb-24 z-10">
            <div className="relative w-full h-full max-w-[700px] translate-y-12 md:translate-y-36">
              <Image
                src="/boneco-categoria.png"
                alt="Mascote Stock.io"
                fill
                className="object-contain object-top"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================== */}
      {/* 2. BARRA DE PESQUISA E FILTROS                 */}
      {/* ============================================== */}
      <section className="w-full px-6 md:px-12 py-10 flex flex-col items-center gap-6 -mt-6">
        <div className="max-w-[1200px] w-full flex flex-col gap-6">
          <div className="w-full flex justify-end">
            <div className="w-full md:w-[500px] relative">
              <input
                type="text"
                placeholder="Procurar por..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full bg-white dark:bg-[#2A2A2A] rounded-full py-4 pl-8 pr-14 shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-gray-700 dark:text-white placeholder:text-[#A78BFA] focus:outline-none focus:ring-2 focus:ring-[#7C3AED] transition-colors duration-300"
              />
              <button className="absolute right-6 top-1/2 -translate-y-1/2 text-[#A78BFA] hover:text-[#7C3AED] dark:hover:text-[#9b73f8] transition-colors cursor-pointer">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </div>
          </div>
          <div className="w-full flex flex-wrap items-center justify-between gap-4 mt-2">
            <div className="flex flex-wrap gap-3 md:gap-4">
              {subcategorias.length > 0 && (
                <button
                  onClick={() => setSubcategoriaSelecionada(null)}
                  className={`px-6 py-2.5 rounded-full font-medium transition-colors cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.03)] ${
                    subcategoriaSelecionada === null
                      ? 'bg-[#7C3AED] text-white'
                      : 'bg-white dark:bg-[#2A2A2A] text-[#A78BFA] hover:bg-[#7C3AED] hover:text-white dark:hover:bg-[#7C3AED] dark:hover:text-white'
                  }`}
                >
                  Todas
                </button>
              )}
              {subcategorias.map((sub: any) => (
                <button
                  key={sub.id}
                  onClick={() => setSubcategoriaSelecionada(sub.id)}
                  className={`px-6 py-2.5 rounded-full font-medium transition-colors cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.03)] ${
                    subcategoriaSelecionada === sub.id
                      ? 'bg-[#7C3AED] text-white'
                      : 'bg-white dark:bg-[#2A2A2A] text-[#A78BFA] hover:bg-[#7C3AED] hover:text-white dark:hover:bg-[#7C3AED] dark:hover:text-white'
                  }`}
                >
                  {sub.nome}
                </button>
              ))}
            </div>
            <div className="relative">
              <select
                value={ordenarPor}
                onChange={(e) => setOrdenarPor(e.target.value)}
                className="appearance-none bg-white dark:bg-[#2A2A2A] text-[#A78BFA] font-medium text-xl w-[240px] md:w-[320px] pl-8 pr-14 py-3 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.03)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7C3AED] transition-colors duration-300"
              >
                <option value="">ordenar por</option>
                <option value="menor-preco">Menor Preço</option>
                <option value="maior-preco">Maior Preço</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#A78BFA]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================== */}
      {/* 3. GRID DE PRODUTOS PRINCIPAL                  */}
      {/* ============================================== */}
      <section className="w-full px-6 md:px-12 pb-20 flex justify-center">
        <div className="max-w-[1200px] w-full mt-4">
          {produtosPagina.length === 0 ? (
            <div className="text-center py-20 text-gray-500 dark:text-gray-400 transition-colors duration-300">
              <p className="text-lg">Nenhum produto encontrado nesta categoria.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {produtosPagina.map((produto: any) => (
                  <CardProdutos key={produto.id} data={produto} />
                ))}
              </div>

              {totalPaginas > 1 && (
                <div className="w-full flex justify-center items-center gap-6 mt-16 text-2xl font-light text-gray-500 dark:text-gray-400 transition-colors duration-300">
                  <button
                    onClick={() => setPaginaAtual((p) => Math.max(1, p - 1))}
                    disabled={paginaAtual === 1}
                    className="hover:text-black dark:hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    &lt;
                  </button>
                  {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pag) => (
                    <span
                      key={pag}
                      onClick={() => setPaginaAtual(pag)}
                      className={`cursor-pointer transition-colors ${
                        pag === paginaAtual
                          ? 'font-bold text-black dark:text-white'
                          : 'hover:text-black dark:hover:text-white'
                      }`}
                    >
                      {pag}
                    </span>
                  ))}
                  <button
                    onClick={() => setPaginaAtual((p) => Math.min(totalPaginas, p + 1))}
                    disabled={paginaAtual === totalPaginas}
                    className="hover:text-black dark:hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    &gt;
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ============================================== */}
      {/* 4. PRINCIPAIS LOJAS (Fundo Preto)              */}
      {/* ============================================== */}
      {lojas.length > 0 && (
        <section className="bg-black dark:bg-[#111111] w-full py-16 px-6 md:px-12 flex justify-center overflow-hidden transition-colors duration-300">
          <div className="max-w-[1200px] w-full">
            <h2 className="text-white text-3xl font-bold mb-12">Principais Lojas</h2>
            <div className="flex gap-8 md:gap-12 overflow-x-auto scrollbar-hide pb-4 items-start">
              {lojas.map((loja: any) => (
                <Link href={`/lojas/${loja.id}`} key={loja.id}>
                  <div className="flex flex-col items-center gap-4 min-w-[120px] cursor-pointer group">
                    <div className="w-[120px] h-[120px] bg-white dark:bg-[#2A2A2A] rounded-full flex items-center justify-center overflow-hidden border-2 border-transparent group-hover:border-[#7C3AED] transition-all duration-300">
                      {loja.logo_url ? (
                        <img
                          src={resolverUrl(loja.logo_url)}
                          alt={loja.nome}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-black dark:text-white font-bold text-lg transition-colors duration-300">
                          {loja.nome.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="text-center">
                      <p className="text-white font-medium text-lg">{loja.nome}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================== */}
      {/* 5. MAIS POPULARES E RECÉM ADICIONADOS          */}
      {/* ============================================== */}
      {(populares.length > 0 || recentes.length > 0) && (
        <section className="bg-[#F6F5ED] dark:bg-[#1A1A1A] w-full pt-16 pb-12 px-6 md:px-12 flex justify-center transition-colors duration-300">
          <div className="max-w-[1200px] w-full flex flex-col gap-16">
            
            {populares.length > 0 && (
              <div>
                <h2 className="text-black dark:text-white text-3xl font-bold mb-8 transition-colors duration-300">Mais populares</h2>
                <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
                  {populares.map((produto: any) => (
                    <div key={produto.id} className="min-w-[220px] snap-start">
                      <CardProdutos data={produto} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {recentes.length > 0 && (
              <div>
                <h2 className="text-black dark:text-white text-3xl font-bold mb-8 transition-colors duration-300">Recém adicionados</h2>
                <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
                  {recentes.map((produto: any) => (
                    <div key={produto.id} className="min-w-[220px] snap-start">
                      <CardProdutos data={produto} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}