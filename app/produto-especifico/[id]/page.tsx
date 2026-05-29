"use client";

import { useRef, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "../../components/navbar";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const IMAGE_FALLBACK = "/images/brownie.png"; // Imagem padrão se o banco estiver vazio

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


type ImagemProduto = {
  id: number;
 url_imagem: string;
  id_produto: number;
};

type Produto = {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
  id_loja: number;
  categoria?: { nome: string };
  imagens?: ImagemProduto[]; // Módulo de imagens acoplado via include
};

type Avaliacao = {
  id: number;
  id_usuario: number;
  nota: number;
  comentario?: string;
  usuario?: { nome: string; username: string; foto_perfil_url:string };
};

export default function ProdutosEspecificos() {
  const params = useParams();
  const PRODUTO_ID = Number(params?.id) || 7; /// coloque um id default para achar um produto enquanto não tem conexão com a pagina inicial

  const avaliacoesRef = useRef(null);
  const lojaRef = useRef(null);

  const [selectedThumb, setSelectedThumb] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Dados do banco
  const [produto, setProduto] = useState<Produto | null>(null);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [produtosMesmaLoja, setProdutosMesmaLoja] = useState<Produto[]>([]);
  const [usuarioLogadoId, setUsuarioLogadoId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Controle dos modais
  const [modalEditarProdutoOpen, setModalEditarProdutoOpen] = useState(false);
  const [modalEditarEstrelasOpen, setModalEditarEstrelasOpen] = useState(false);
  const [avaliacaoSelecionada, setAvaliacaoSelecionada] = useState<Avaliacao | null>(null);

  useEffect(() => {
    setUsuarioLogadoId(getUserIdFromToken());
    fetchProduto();
    fetchAvaliacoes();
    // Reinicia o índice da imagem quando o produto mudar
    setSelectedThumb(0);
  }, [PRODUTO_ID]);

  async function fetchProduto() {
    try {
      const res = await fetch(`${API_URL}/produtos/${PRODUTO_ID}`);
      if (!res.ok) throw new Error();
      const data: Produto = await res.json();
      setProduto(data);
      fetchProdutosMesmaLoja(data.id_loja, data.id);
    } catch {
      console.error("Erro ao buscar produto");
    } finally {
      setLoading(false);
    }
  }

  async function fetchAvaliacoes() {
    try {
      const res = await fetch(`${API_URL}/aval-produto/produto/${PRODUTO_ID}`);
      if (!res.ok) throw new Error();
      setAvaliacoes(await res.json());
    } catch {
      console.error("Erro ao buscar avaliações");
    }
  }

  async function fetchProdutosMesmaLoja(idLoja: number, idAtual: number) {
    try {
      const res = await fetch(`${API_URL}/produtos`);
      if (!res.ok) throw new Error();
      const todos: Produto[] = await res.json();
      setProdutosMesmaLoja(todos.filter((p) => p.id_loja === idLoja && p.id !== idAtual));
    } catch {
      console.error("Erro ao buscar produtos da mesma loja");
    }
  }

  const notaMedia =
    avaliacoes.length > 0
      ? (avaliacoes.reduce((acc, av) => acc + av.nota, 0) / avaliacoes.length).toFixed(1)
      : "0";

  const startDragging = (e: any, ref: any) => {
    if (!ref.current) return;
    setIsDragging(true);
    setStartX(e.pageX - ref.current.offsetLeft);
    setScrollLeft(ref.current.scrollLeft);
  };
  const stopDragging = () => setIsDragging(false);
  const onDrag = (e: any, ref: any) => {
    if (!isDragging || !ref.current) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    ref.current.scrollLeft = scrollLeft - (x - startX);
  };

  if (loading) {
    return (
      <div className="bg-[#f6f3e4] min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Carregando produto...</p>
      </div>
    );
  }

  // 2. Extração das imagens reais do produto (se não houver nenhuma, usa o array padrão)
  const listaImagens = produto?.imagens && produto.imagens.length > 0
    ? produto.imagens.map(img => img.url_imagem)
    : [IMAGE_FALLBACK];

  return (
    <div className="bg-[#f6f3e4] min-h-screen pb-12 flex flex-col items-center font-sans">
      <Navbar />

      <div className="w-full mt-16 max-w-[1200px] px-8 flex flex-col gap-16 mt-8">

        {/* Bloco 1: Produto */}
        <div className="flex flex-col md:flex-row gap-12">

          <div className="flex flex-row gap-4 h-[420px] md:w-1/2">
            {/* Miniaturas Laterais Dinâmicas */}
            <div className="flex flex-col items-center gap-3 overflow-y-auto pr-1">
              {listaImagens.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedThumb(i)}
                  className={`w-[130px] h-[120px] bg-white rounded-2xl shadow-sm overflow-hidden border-2 transition-all flex-shrink-0 ${selectedThumb === i ? "border-[#6A38F3]" : "border-transparent hover:border-gray-300"}`}
                >
                  <Image src={src} alt={`imagem ${i + 1}`} width={130} height={120} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Imagem de Destaque Dinâmica baseada no Clique */}
            <div className="flex-1 bg-white rounded-3xl shadow-sm relative overflow-hidden flex items-center justify-center">
              <Image 
                src={listaImagens[selectedThumb] || IMAGE_FALLBACK} 
                alt="Produto principal" 
                fill 
                className="object-contain p-4" 
              />
              <div className="absolute top-4 right-4 w-[52px] h-[52px] rounded-full overflow-hidden shadow-md border-2 border-white z-10">
                <Image src="/images/cjr.png" alt="Logo CJR" width={52} height={52} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          <div className="flex flex-col w-full md:w-1/2 gap-6 justify-start">
            <div className="flex justify-between items-start">
              <h1 className="text-4xl font-extrabold text-[#000000]">{produto?.nome ?? "Produto"}</h1>
              <div className="flex gap-2">
                <button
                  onClick={() => setModalEditarProdutoOpen(true)}
                  className="w-[27px] h-[27px] bg-[#6A38F3] rounded-full flex items-center justify-center hover:opacity-80 transition"
                >
                  <Image src="/images/lapis1.png" alt="lapis" width={17} height={17} />
                </button>
                <button
                  onClick={() => setModalEditarEstrelasOpen(true)}
                  className="w-[27px] h-[27px] bg-[#C6E700] rounded-full flex items-center justify-center hover:opacity-80 transition"
                >
                  <Image src="/images/estrela3.png" alt="estrela3" width={16} height={16} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1 text-[#000000] font-bold">
                <Image src="/images/estrela.png" alt="estrela1" width={17} height={17} />
                {notaMedia} <span className="text-gray-500 font-normal">| {avaliacoes.length} reviews</span>
              </span>
              <span className="text-[#6A38F3]">{produto?.categoria?.nome ?? "categoria"}</span>
              <span className="text-[#6A38F3]">{produto?.estoque ?? 0} disponíveis</span>
            </div>

            <p className="text-5xl font-bold text-gray-900">
              R${produto ? Number(produto.preco).toFixed(2).replace(".", ",") : "0,00"}
            </p>

            <div className="flex flex-col gap-2 mt-4">
              <h3 className="font-bold text-xl text-gray-800 uppercase tracking-wide">Descrição</h3>
              <div className="text-gray-700 leading-relaxed overflow-y-auto max-h-[220px] pr-1">
                <p>{produto?.descricao ?? ""}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bloco de Avaliações */}
        <div className="flex flex-col mt-20 gap-6">
          <h2 className="text-3xl font-extrabold text-gray-900">Avaliações</h2>

          <div
            ref={avaliacoesRef}
            onMouseDown={(e) => startDragging(e, avaliacoesRef)}
            onMouseLeave={stopDragging}
            onMouseUp={stopDragging}
            onMouseMove={(e) => onDrag(e, avaliacoesRef)}
            className={`flex flex-row gap-6 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] select-none ${isDragging ? "cursor-grabbing snap-none" : "cursor-grab snap-x"}`}
          >
            {avaliacoes.map((avaliacao) => (
              <div key={avaliacao.id} className="bg-[#fcfbf7] rounded-[2.5rem] p-8 min-w-[450px] shadow-sm snap-start flex flex-col gap-4 border border-gray-100 pointer-events-none">
                <div className="flex justify-between items-center pointer-events-auto">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                      <Image
                        src={avaliacao.usuario?.foto_perfil_url || "/images/rosto.png"}
                        alt={avaliacao.usuario?.nome ?? "usuário"}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="font-bold text-xl text-gray-900">
                      {avaliacao.usuario?.nome ?? avaliacao.usuario?.username ?? "Usuário"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      {Array.from({ length: avaliacao.nota }).map((_, index) => (
                        <Image key={index} src="/images/estrela2.png" alt="Estrela" width={22} height={22} />
                      ))}
                    </div>
                    {usuarioLogadoId === avaliacao.id_usuario && (
                      <button
                        onClick={() => setAvaliacaoSelecionada(avaliacao)}
                        className="w-[27px] h-[27px] bg-[#fcfbf7] rounded-full flex items-center justify-center hover:opacity-70 transition"
                      >
                        <Image src="/images/lapis2.png" alt="Editar" width={17} height={17} />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-gray-700 text-lg pointer-events-auto">{avaliacao.comentario}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bloco da Mesma Loja */}
        {produtosMesmaLoja.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl font-extrabold text-gray-900">Da mesma loja</h2>
            <div
              ref={lojaRef}
              onMouseDown={(e) => startDragging(e, lojaRef)}
              onMouseLeave={stopDragging}
              onMouseUp={stopDragging}
              onMouseMove={(e) => onDrag(e, lojaRef)}
              className={`flex flex-row gap-6 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] select-none ${isDragging ? "cursor-grabbing snap-none" : "cursor-grab snap-x"}`}
            >
              {produtosMesmaLoja.map((p) => (
                <div key={p.id} className="pointer-events-none min-w-[220px] snap-start">
                  <CardProduto data={p} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAIS (Ocultos até serem importados) */}
    </div>
  );
}

// 3. Componente CardProduto atualizado com imagem dinâmica do banco
function CardProduto({ data }: { data: Produto }) {
  const isDisponivel = data.estoque > 0;
  
  // Pega a primeira imagem do array do banco se existir, caso contrário usa a padrão
  const imagemCard = data.imagens && data.imagens.length > 0 
    ? data.imagens[0].url_imagem
    : IMAGE_FALLBACK;

  return (
    <div className="bg-white rounded-[2rem] p-5 shadow-sm flex flex-col gap-3 relative pointer-events-auto cursor-pointer hover:border-gray-200 border border-transparent transition-all">
      <div className="absolute top-4 right-4 w-[48px] h-[48px] bg-white rounded-full z-10 overflow-hidden shadow-sm border border-gray-100 flex items-center justify-center">
        <Image src="/images/cjr.png" alt="Logo cjr" width={48} height={48} className="w-full h-full object-cover" />
      </div>
      <div className="w-full h-36 bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center relative">
        <Image 
          src={imagemCard} 
          alt={data.nome} 
          fill
          className="w-full h-full object-contain p-2" 
        />
      </div>
      <div className="flex flex-col gap-1 mt-1">
        <h3 className="font-extrabold text-lg text-gray-900 truncate">{data.nome}</h3>
        <p className="font-bold text-xl text-gray-900">R${Number(data.preco).toFixed(2).replace(".", ",")}</p>
        <p className={`text-xs font-bold mt-1 uppercase ${isDisponivel ? "text-[#C6E700]" : "text-[#AF052A]"}`}>
          {isDisponivel ? "DISPONÍVEL" : "INDISPONÍVEL"}
        </p>
      </div>
    </div>
  );
}