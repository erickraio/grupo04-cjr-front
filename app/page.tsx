'use client';
import Navbar from "./components/navbar";
import Image from "next/image";
import {useState} from "react";
import Searchbar from "./components/searchbar";
import axios from "axios";

// ==========================================
// MOCK DATA: Dados preparados para o Backend
// Substituir estas listas pelos dados reais
// ==========================================

const categorias = [
  { id: 1, nome: "Mercado", imagem: "/mercado-token.png" },
  { id: 2, nome: "Farmácia", imagem: "/farmacia-token.png" },
  { id: 3, nome: "Beleza", imagem: "/beleza-token.png" },
  { id: 4, nome: "Moda", imagem: "/moda-token.png" },
  { id: 5, nome: "Eletrônicos", imagem: "/eletronico-token.png" },
  { id: 6, nome: "Jogos", imagem: "/jogos-token.png" },
  { id: 7, nome: "Brinquedos", imagem: "/brinquedos-token.png" },
  { id: 8, nome: "Casa", imagem: "/casas-token.png" },
];

const produtosAvaliados = [
  { id: 1, nome: "Brownie Meio A.", preco: "R$4,70", unidade: "", status: "DISPONÍVEL", lojaNome: "CJR" },
  { id: 2, nome: "Brownie Trad.", preco: "R$3,80", unidade: "", status: "INDISPONÍVEL", lojaNome: "CJR" },
  { id: 3, nome: "Nozes", preco: "R$29,99", unidade: "/kg", status: "DISPONÍVEL", lojaNome: "d'carts" },
  { id: 4, nome: "Banana", preco: "R$3,99", unidade: "/kg", status: "DISPONÍVEL", lojaNome: "MAU MAR" },
  { id: 5, nome: "Limão Siciliano", preco: "R$17,99", unidade: "/kg", status: "INDISPONÍVEL", lojaNome: "MAU MAR" },
];

const produtosBaratos = [
  { id: 1, nome: "Limpador Facial", preco: "R$74,99", unidade: "", status: "DISPONÍVEL", lojaNome: "creamy" },
  { id: 2, nome: "Blush", preco: "R$199,99", unidade: "", status: "INDISPONÍVEL", lojaNome: "Rare B." },
  { id: 3, nome: "Sérum Facial", preco: "R$99,90", unidade: "", status: "DISPONÍVEL", lojaNome: "creamy" },
  { id: 4, nome: "Iluminador", preco: "R$249,90", unidade: "", status: "DISPONÍVEL", lojaNome: "Rare B." },
  { id: 5, nome: "Body Splash", preco: "R$179,99", unidade: "", status: "INDISPONÍVEL", lojaNome: "VS" },
];

const produtosRecentes = [
  { id: 1, nome: "Saia", preco: "R$75,99", unidade: "", status: "DISPONÍVEL", lojaNome: "chic" },
  { id: 2, nome: "New Balance", preco: "R$399,99", unidade: "", status: "INDISPONÍVEL", lojaNome: "Sneaker" },
  { id: 3, nome: "Bota", preco: "R$115,90", unidade: "", status: "DISPONÍVEL", lojaNome: "Sneaker" },
  { id: 4, nome: "Bolsa", preco: "R$349,90", unidade: "", status: "DISPONÍVEL", lojaNome: "chic" },
  { id: 5, nome: "Calça Jeans", preco: "R$159,99", unidade: "", status: "INDISPONÍVEL", lojaNome: "chic" },
];

const lojas = [
  { id: 1, nome: "CJR", categoria: "mercado", cor: "bg-[#0A2540]" },
  { id: 2, nome: "Rare Beauty", categoria: "beleza", cor: "bg-[#FFF0ED]" },
  { id: 3, nome: "The Croc Brew", categoria: "mercado", cor: "bg-[#E6F0FF]" },
  { id: 4, nome: "Mini Reno", categoria: "casa", cor: "bg-[#2D2D2D]" },
  { id: 5, nome: "amoca", categoria: "moda", cor: "bg-white" },
  { id: 6, nome: "Repiit", categoria: "eletrônicos", cor: "bg-white" },
  { id: 7, nome: "Repiit", categoria: "eletrônicos", cor: "bg-white" },
  { id: 8, nome: "Repiit", categoria: "eletrônicos", cor: "bg-white" },
  { id: 9, nome: "Repiit", categoria: "eletrônicos", cor: "bg-white" },
  { id: 10, nome: "Repiit", categoria: "eletrônicos", cor: "bg-white" },
];

// ==========================================
// COMPONENTE PRINCIPAL (PÁGINA)
// ==========================================

export default function Home() {
  const [produtosFiltrados, setProdutosFiltrados] = useState<any[] | null>(null);
  const [carregando,setCarregando] = useState(false);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setProdutosFiltrados(null);
      return;
    }
    setCarregando(true);
    try {
      const response = await axios.get(`http://localhost:3001/produtos?busca=${(query)}`);
      setProdutosFiltrados(response.data);
      console.log("Busca realizada com sucesso:", response.data);
      console.log("Termo pesquisado:", query);
      console.log("Produtos retornados:", response.data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F6F5ED]">

        {/* NAVBAR */}
      <Navbar />
      
      {/* 1. SESSÃO PRETA (HERO) - Mantida exatamente igual */}
      <section className="bg-black w-full pt-28 px-6 md:px-12 flex justify-center relative overflow-hidden">
        <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between">
          <div className="w-full md:w-1/2 z-20 text-center md:text-left pb-16 md:pb-28 mt-8">
            <h1 className="text-white text-4xl md:text-5xl lg:text-[66px] font-semibold leading-[1] tracking-tight">
              Do CAOS à organização, <br />
              em alguns cliques
            </h1>
          </div>
          <div className="w-full md:w-[600px] flex justify-center md:justify-end mt-10 md:mt-0 relative h-[400px] md:h-[600px] lg:h-[700px] -mb-32 md:-mb-70 z-10">
            <Image 
              src="/hero-illustration.png" 
              alt="Personagem do Stock.io organizando caixas" 
              fill 
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain object-bottom md:object-right-bottom"
              priority 
            />
          </div>
        </div>
      </section>

      {/* 2. SESSÃO BEGE (CONTEÚDO PRINCIPAL) */}
      <section className="w-full px-6 md:px-12 py-8 flex justify-center">
        <div className="max-w-6xl w-full flex flex-col gap-12">
          
          {/* Barra de Pesquisa */}
          <div className="flex flex-col items-end w-full gap-2">
            <Searchbar onSearch={handleSearch} produtos={produtosFiltrados} />
            {carregando && <span className="text-sm text-[#7C3AED] animate-pulse">Buscando produtos...</span>}
          </div>

          {/* Categorias*/}
        <div>
            <h2 className="text-2xl font-bold text-black mb-6">Categoria</h2>
            
            <div className="flex gap-4 md:gap-8 overflow-x-auto pb-6 pt-2 scrollbar-hide">
               {categorias.map((categoria) => (
                 <div key={categoria.id} className="flex flex-col items-center gap-4 min-w-[104px] cursor-pointer group">
                    
                    <div className="w-[104px] h-[92px] bg-white rounded-3xl flex items-center justify-center shadow-[0px_4px_12px_rgba(0,0,0,0.03)] border border-transparent group-hover:border-indigo-100 transition-colors">
                      <Image 
                        src={categoria.imagem} 
                        alt={`Ícone ${categoria.nome}`} 
                        width={40} 
                        height={40} 
                        style={{ width: 'auto', height: 'auto' }}
                      />
                    </div>
                    
                    <span className="text-sm font-semibold text-black">{categoria.nome}</span>
                 </div>
                 
               ))}
            </div>
          </div>

          {/* ============================================== */}
          {/* 3. PRODUTOS E LOJAS (CÓDIGO NOVO ABAIXO)       */}
          {/* ============================================== */}

          {/* Produtos: Melhores Avaliados */}
          <div className="mt-4">
            <div className="flex items-baseline gap-3 mb-6">
              <h2 className="text-3xl font-bold text-black">Produtos</h2>
              <span className="text-sm font-medium text-[#7C3AED]">melhores avaliados</span>
            </div>
            
            <div className="flex gap-6 overflow-x-auto pb-6 pt-2 scrollbar-hide">
                {produtosAvaliados.map((produto) => (
                <div key={produto.id} className="min-w-[220px] md:min-w-[260px]">
                <CardProduto data={produto} />
              </div>
              ))}
            </div>
          </div>

          {/* Produtos: Mais Baratos */}
          {/* Produtos: Mais Baratos */}
          <div className="mt-6">
            <div className="flex items-baseline gap-3 mb-6">
              <h2 className="text-3xl font-bold text-black">Produtos</h2>
              <span className="text-sm font-medium text-[#7C3AED]">mais baratos</span>
            </div>
            
            <div className="flex gap-6 overflow-x-auto pb-6 pt-2 scrollbar-hide">
              {produtosBaratos.map((produto) => (
                <div key={produto.id} className="min-w-[220px] md:min-w-[260px]">
                  <CardProduto data={produto} />
                </div>
              ))}
            </div>
          </div>

          {/* Produtos: Recém Adicionados */}
          {/* Produtos: Recém Adicionados */}
          <div className="mt-6">
            <div className="flex items-baseline gap-3 mb-6">
              <h2 className="text-3xl font-bold text-black">Produtos</h2>
              <span className="text-sm font-medium text-[#7C3AED]">recém adicionados</span>
            </div>
            
            <div className="flex gap-6 overflow-x-auto pb-6 pt-2 scrollbar-hide">
              {produtosRecentes.map((produto) => (
                <div key={produto.id} className="min-w-[220px] md:min-w-[260px]">
                  <CardProduto data={produto} />
                </div>
              ))}
            </div>
          </div>

          {/* Secção Lojas */}
          {/* Secção Lojas */}
          <div className="mt-12 mb-20">
            <div className="flex justify-between items-end mb-8">
              <h2 className="text-3xl font-bold text-black">Lojas</h2>
              
              {/* Botão de Filtro */}
              <button className="flex items-center gap-12 bg-white rounded-full px-6 py-2 shadow-sm text-[#A78BFA] font-medium text-lg border border-transparent hover:border-indigo-100 transition-all">
                filtros
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            
            {/* Lista Horizontal de Lojas */}
            <div className="flex gap-6 md:gap-10 overflow-x-auto pb-4 scrollbar-hide">
              {lojas.map((loja) => (
                <div key={loja.id} className="flex flex-col items-center gap-3 min-w-[130px] cursor-pointer">
                  {/* Círculo da Loja */}
                  <div className={`w-[130px] h-[130px] rounded-full flex items-center justify-center shadow-sm border-[6px] border-[#F6F5ED] ${loja.cor} text-white font-bold text-center p-2`}>
                     {loja.cor.includes('bg-white') ? <span className="text-black">{loja.nome}</span> : <span>{loja.nome}</span>}
                  </div>
                  
                  <div className="flex flex-col items-center leading-tight">
                    <span className="text-lg font-medium text-black">{loja.nome}</span>
                    <span className="text-sm text-[#7C3AED]">{loja.categoria}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </section>

    </main>
  );
}

// ==========================================
// COMPONENTE DE CARD DE PRODUTO 
// ==========================================

function CardProduto({ data }: { data: any }) {
  // Define a cor do status dinamicamente
  const isDisponivel = data.status === "DISPONÍVEL";
  
  return (
    <div className="bg-white rounded-3xl p-4 md:p-5 shadow-[0px_4px_15px_rgba(0,0,0,0.02)] flex flex-col relative border border-transparent hover:border-gray-200 transition-all cursor-pointer">
      
      {/* Aqui a gente chama a sua Navbar como DESLOGADO para testar */}
      <Navbar/>
      {/* Selo (Badge) Redondo da Loja no Canto Superior Direito */}
      <div className="absolute -top-3 -right-3 w-12 h-12 bg-black rounded-full border-4 border-white flex items-center justify-center z-10 shadow-sm overflow-hidden text-[10px] text-white font-bold text-center">
        {/* Futuramente: <Image src={data.lojaLogoUrl} ... /> */}
        {data.lojaNome}
      </div>

      {/* Área da Imagem do Produto (Espaço Disponível) */}
      <div className="relative w-full h-[160px] bg-gray-50 rounded-2xl mb-4 flex items-center justify-center text-gray-300 text-xs">
         <span>Imagem: {data.nome}</span>
         {/* Futuramente: <Image src={data.imagemUrl} alt={data.nome} fill className="object-contain p-2" /> */}
      </div>

      {/* Informações de Texto */}
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-bold text-black leading-tight truncate">{data.nome}</h3>
        
        <p className="text-xl font-bold text-black flex items-baseline gap-1 mt-1">
          {data.preco}
          {data.unidade && <span className="text-sm text-[#7C3AED] font-medium">{data.unidade}</span>}
        </p>
        
        <span className={`text-[11px] font-bold mt-1 tracking-wide ${isDisponivel ? 'text-[#B5D400]' : 'text-[#E53E3E]'}`}>
          {data.status}
        </span>
      </div>

    </div>
  );

  
}

