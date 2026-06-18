'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Navbar from '../../components/navbar';

export default function CategoriaEspecifica() {
  const params = useParams();
  const idCategoria = params.id;

  // Lista de subcategorias
  const subcategorias = ['Celulares', 'Notebooks', 'TVs', 'Acessórios', 'Outros'];

  // 1. Mock: Grid Principal
  const produtosMock = [
    { id: 1, nome: 'Comp. Lenovo', preco: 'R$3.899,99', status: 'DISPONÍVEL', disponivel: true },
    { id: 2, nome: 'Comp. Samsung', preco: 'R$8.549,99', status: 'INDISPONÍVEL', disponivel: false },
    { id: 3, nome: 'Iphone 15', preco: 'R$4.769,10', status: 'DISPONÍVEL', disponivel: true },
    { id: 4, nome: 'Smart Tv Philips', preco: 'R$1.229,00', status: 'DISPONÍVEL', disponivel: true },
    { id: 5, nome: 'Xbox Series X', preco: 'R$3.599,99', status: 'DISPONÍVEL', disponivel: true },
  ];

  // 2. Mock: Lojas
  const lojasMock = [
    { id: 1, nome: 'abtec', categoria: 'eletrônicos' },
    { id: 2, nome: 'Repiit', categoria: 'eletrônicos' },
    { id: 3, nome: 'Bersay', categoria: 'eletrônicos' },
    { id: 4, nome: 'electree', categoria: 'eletrônicos' },
    { id: 5, nome: 'Speed X', categoria: 'eletrônicos' },
    { id: 6, nome: 'Next Computer', categoria: 'eletrônicos' },
    { id: 7, nome: 'Outra Loja', categoria: 'eletrônicos' },
  ];

  // 3. Mock: Mais Populares
  const popularesMock = [
    { id: 1, nome: 'Comp. Lenovo', preco: 'R$3.899,99', status: 'DISPONÍVEL', disponivel: true },
    { id: 2, nome: 'Comp. Samsung', preco: 'R$8.549,99', status: 'INDISPONÍVEL', disponivel: false },
    { id: 3, nome: 'Smart Tv Philips', preco: 'R$1.229,00', status: 'DISPONÍVEL', disponivel: true },
    { id: 4, nome: 'Xbox Series X', preco: 'R$3.599,99', status: 'DISPONÍVEL', disponivel: true },
    { id: 5, nome: 'Headset Gamer', preco: 'R$899,99', status: 'INDISPONÍVEL', disponivel: false },
  ];

  // 4. Mock: Recém Adicionados
  const recentesMock = [
    { id: 1, nome: 'Micro SD', preco: 'R$179,90', status: 'DISPONÍVEL', disponivel: true },
    { id: 2, nome: 'Playstation 5', preco: 'R$4.992,98', status: 'DISPONÍVEL', disponivel: true },
    { id: 3, nome: 'Iphone 15', preco: 'R$4.769,10', status: 'DISPONÍVEL', disponivel: true },
    { id: 4, nome: 'Iphone 4', preco: 'R$469,99', status: 'DISPONÍVEL', disponivel: true },
    { id: 5, nome: 'Nintendo 3DS', preco: 'R$2.089,99', status: 'INDISPONÍVEL', disponivel: false },
  ];

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
              O universo da <span className="font-extrabold">tecnologia</span> <br />
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
              {subcategorias.map((sub, index) => (
                <button 
                  key={index}
                  className="bg-white dark:bg-[#2A2A2A] text-[#A78BFA] dark:text-[#A78BFA] font-medium px-6 py-2.5 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:bg-[#7C3AED] hover:text-white dark:hover:bg-[#7C3AED] dark:hover:text-white transition-colors duration-300 cursor-pointer"
                >
                  {sub}
                </button>
              ))}
            </div>
            <div className="relative">
              <select className="appearance-none bg-white dark:bg-[#2A2A2A] text-[#A78BFA] dark:text-[#A78BFA] font-medium text-xl w-[240px] md:w-[320px] pl-8 pr-14 py-3 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.03)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7C3AED] transition-colors duration-300">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {produtosMock.map((produto) => (
              <div key={produto.id} className="bg-white dark:bg-[#2A2A2A] w-full rounded-[2rem] p-5 flex flex-col shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md border border-transparent dark:hover:border-gray-700 transition-all cursor-pointer">
                <div className="relative w-full h-[180px] flex items-center justify-center mb-4">
                  <div className="absolute top-0 right-0 w-10 h-10 bg-white dark:bg-[#3A3A3A] rounded-full border border-gray-100 dark:border-transparent shadow-sm flex items-center justify-center z-10 overflow-hidden transition-colors duration-300">
                     <span className="text-[9px] font-bold text-gray-400 dark:text-gray-300 transition-colors duration-300">Loja</span>
                  </div>
                  <div className="w-full h-full relative flex items-center justify-center">
                     <div className="w-[80%] h-[80%] bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm border border-dashed border-gray-200 dark:border-gray-600 transition-colors duration-300">
                        Foto {produto.id}
                     </div>
                  </div>
                </div>
                <div className="flex flex-col mt-auto">
                  <h3 className="text-[18px] font-bold text-black dark:text-white leading-tight mb-1 transition-colors duration-300">{produto.nome}</h3>
                  <span className="text-[16px] font-bold text-black dark:text-white transition-colors duration-300">{produto.preco}</span>
                  <span className={`text-[11px] font-extrabold mt-1 tracking-wide transition-colors duration-300 ${produto.disponivel ? 'text-[#BDEB00] dark:text-[#D4F514]' : 'text-[#DC2626] dark:text-[#FF4D6D]'}`}>
                    {produto.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="w-full flex justify-center items-center gap-6 mt-16 text-2xl font-light text-gray-500 dark:text-gray-400 transition-colors duration-300">
            <button className="hover:text-black dark:hover:text-white transition-colors">&lt;</button>
            <span className="font-bold text-black dark:text-white cursor-pointer transition-colors duration-300">1</span>
            <span className="hover:text-black dark:hover:text-white transition-colors cursor-pointer">2</span>
            <span className="hover:text-black dark:hover:text-white transition-colors cursor-pointer">3</span>
            <span className="hover:text-black dark:hover:text-white transition-colors cursor-pointer">4</span>
            <span className="hover:text-black dark:hover:text-white transition-colors cursor-pointer">5</span>
            <button className="hover:text-black dark:hover:text-white transition-colors">&gt;</button>
          </div>
        </div>
      </section>

      {/* ============================================== */}
      {/* 4. PRINCIPAIS LOJAS (Fundo Preto)              */}
      {/* ============================================== */}
      <section className="bg-black dark:bg-[#111111] w-full py-16 px-6 md:px-12 flex justify-center overflow-hidden transition-colors duration-300">
        <div className="max-w-[1200px] w-full">
          <h2 className="text-white text-3xl font-bold mb-12">Principais Lojas</h2>
          <div className="flex gap-8 md:gap-12 overflow-x-auto scrollbar-hide pb-4 items-start">
            {lojasMock.map((loja) => (
              <div key={loja.id} className="flex flex-col items-center gap-4 min-w-[120px] cursor-pointer group">
                <div className="w-[120px] h-[120px] bg-white dark:bg-[#2A2A2A] rounded-full flex items-center justify-center overflow-hidden border-2 border-transparent group-hover:border-[#7C3AED] transition-all duration-300">
                  <span className="text-black dark:text-white font-bold text-sm transition-colors duration-300">Logo {loja.nome}</span>
                </div>
                <div className="text-center">
                  <p className="text-white font-medium text-lg">{loja.nome}</p>
                  <p className="text-[#7C3AED] dark:text-[#9b73f8] text-sm transition-colors duration-300">{loja.categoria}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================== */}
      {/* 5. MAIS POPULARES E RECÉM ADICIONADOS          */}
      {/* ============================================== */}
      <section className="bg-[#F6F5ED] dark:bg-[#1A1A1A] w-full pt-16 pb-12 px-6 md:px-12 flex justify-center transition-colors duration-300">
        <div className="max-w-[1200px] w-full flex flex-col gap-16">
          
          {/* Mais populares */}
          <div>
            <h2 className="text-black dark:text-white text-3xl font-bold mb-8 transition-colors duration-300">Mais populares</h2>
            <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
              {popularesMock.map((produto) => (
                <div key={produto.id} className="bg-white dark:bg-[#2A2A2A] min-w-[220px] flex-1 rounded-[2rem] p-5 flex flex-col shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md border border-transparent dark:hover:border-gray-700 transition-all cursor-pointer">
                  <div className="relative w-full h-[180px] flex items-center justify-center mb-4">
                    <div className="absolute top-0 right-0 w-10 h-10 bg-white dark:bg-[#3A3A3A] rounded-full border border-gray-100 dark:border-transparent shadow-sm flex items-center justify-center z-10 overflow-hidden transition-colors duration-300">
                       <span className="text-[9px] font-bold text-gray-400 dark:text-gray-300 transition-colors duration-300">Loja</span>
                    </div>
                    <div className="w-full h-full relative flex items-center justify-center">
                       <div className="w-[80%] h-[80%] bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm border border-dashed border-gray-200 dark:border-gray-600 transition-colors duration-300">
                          Foto {produto.id}
                       </div>
                    </div>
                  </div>
                  <div className="flex flex-col mt-auto">
                    <h3 className="text-[18px] font-bold text-black dark:text-white leading-tight mb-1 transition-colors duration-300">{produto.nome}</h3>
                    <span className="text-[16px] font-bold text-black dark:text-white transition-colors duration-300">{produto.preco}</span>
                    <span className={`text-[11px] font-extrabold mt-1 tracking-wide transition-colors duration-300 ${produto.disponivel ? 'text-[#BDEB00] dark:text-[#D4F514]' : 'text-[#DC2626] dark:text-[#FF4D6D]'}`}>
                      {produto.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recém adicionados */}
          <div>
            <h2 className="text-black dark:text-white text-3xl font-bold mb-8 transition-colors duration-300">Recém adicionados</h2>
            <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
              {recentesMock.map((produto) => (
                <div key={produto.id} className="bg-white dark:bg-[#2A2A2A] min-w-[220px] flex-1 rounded-[2rem] p-5 flex flex-col shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md border border-transparent dark:hover:border-gray-700 transition-all cursor-pointer">
                  <div className="relative w-full h-[180px] flex items-center justify-center mb-4">
                    <div className="absolute top-0 right-0 w-10 h-10 bg-white dark:bg-[#3A3A3A] rounded-full border border-gray-100 dark:border-transparent shadow-sm flex items-center justify-center z-10 overflow-hidden transition-colors duration-300">
                       <span className="text-[9px] font-bold text-gray-400 dark:text-gray-300 transition-colors duration-300">Loja</span>
                    </div>
                    <div className="w-full h-full relative flex items-center justify-center">
                       <div className="w-[80%] h-[80%] bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm border border-dashed border-gray-200 dark:border-gray-600 transition-colors duration-300">
                          Foto {produto.id}
                       </div>
                    </div>
                  </div>
                  <div className="flex flex-col mt-auto">
                    <h3 className="text-[18px] font-bold text-black dark:text-white leading-tight mb-1 transition-colors duration-300">{produto.nome}</h3>
                    <span className="text-[16px] font-bold text-black dark:text-white transition-colors duration-300">{produto.preco}</span>
                    <span className={`text-[11px] font-extrabold mt-1 tracking-wide transition-colors duration-300 ${produto.disponivel ? 'text-[#BDEB00] dark:text-[#D4F514]' : 'text-[#DC2626] dark:text-[#FF4D6D]'}`}>
                      {produto.status}
                    </span>
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