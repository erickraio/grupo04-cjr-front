"use client";

import { useRef, useState } from "react";
import Navbar from "../components/navbar";
import Image  from "next/image";


//Dados de teste:
const avaliacoes = [
    { id: 1, nome: "Selena Gomez", nota: 5, comentario: "Não é por nada não, mas essa garota arrasa!" },
    { id: 2, nome: "Sofia Figueiredo", nota: 5, comentario: "Adorei o produto. Funcionou muito na minha pele." },
    { id: 3, nome: "Pedro Freitas", nota: 4, comentario: "A qualidade é incrível." },
    { id: 4, nome: "Sofia", nota: 5, comentario: "Muito bom" },
    { id: 5, nome: "Sofia", nota: 5, comentario: "Produto de qualidade!" },
];

const produtosMesmaLoja = [
    { id: 1, nome: "Brownie Trad.", preco: "R$3,80", status: "INDISPONÍVEL", lojaNome: "CJR" },
    { id: 2, nome: "Brownie Doce L.", preco: "R$4,70", status: "DISPONÍVEL", lojaNome: "CJR" },
    { id: 3, nome: "Brownie Nozes", preco: "R$4,70", status: "DISPONÍVEL", lojaNome: "CJR" },
    { id: 4, nome: "Brownie Meio A.", preco: "R$4,70", status: "DISPONÍVEL", lojaNome: "CJR" },
];

export default function ProdutosEspecificos() {
    // Referências para os carrosséis
    const avaliacoesRef = useRef(null);
    const lojaRef = useRef(null);

    // Estados para o drag (arrastar)
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    // Funções  para o scroll puxando
    const startDragging = (e, ref) => {
        if (!ref.current) return;
        setIsDragging(true);
        setStartX(e.pageX - ref.current.offsetLeft);
        setScrollLeft(ref.current.scrollLeft);
    };

    const stopDragging = () => {
        setIsDragging(false);
    };

    const onDrag = (e, ref) => {
        if (!isDragging || !ref.current) return;
        e.preventDefault();
        const x = e.pageX - ref.current.offsetLeft;
        const walk = (x - startX) * 1; //  define a velocidade do arrasto
        ref.current.scrollLeft = scrollLeft - walk;
    };

    return (
        <div className="bg-[#f6f3e4] min-h-screen pb-12 flex flex-col items-center font-sans">
            <Navbar />

            <div className="w-full  mt-16 max-w-[1200px] px-8 flex flex-col gap-16 mt-8">

            
                {/* Bloco 1: Produto */}
                
                <div className="flex flex-col md:flex-row gap-12">
                    {/* Lado esquerdo: Imagens */}
                    <div className="flex flex-row gap-4 h-[552px] w-[704.88px] md:w-1/2">
                        <div className="flex flex-col gap-4">
                            <div className="w-[130.48716735839844px] h-[132.36473083496094px] bg-white rounded-2xl shadow-sm cursor-pointer border-2 border-transparent hover:border-gray-300"></div>
                            <div className="w-[130.48716735839844px] h-[132.36473083496094px] bg-white rounded-2xl shadow-sm cursor-pointer border-2 border-transparent hover:border-gray-300"></div>
                            <div className="w-[130.48716735839844px] h-[132.36473083496094px] bg-white rounded-2xl shadow-sm cursor-pointer border-2 border-transparent hover:border-gray-300"></div>
                        </div>
                        <div className="flex-1 bg-white rounded-3xl shadow-sm w-[553.8946533203125px] h-[552px] lg:h-[500px] flex items-center justify-center"></div>
                    </div>

                    {/* Lado direito: Informações */}
                    <div className="flex flex-col w-full md:w-1/2 gap-6 justify-start">
                        <div className="flex justify-between items-start">
                            <h1 className="text-4xl font-extrabold text-[#000000]">Brownie Meio Amargo</h1>
                            <div className="flex gap-2">
                                <div className="w-[27px] h-[27px] bg-[#6A38F3] rounded-full flex items-center justify-center"></div>
                                <div className="w-[27px] h-[27px] bg-[#C6E700] rounded-full flex items-center justify-center"></div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1 text-[#000000] font-bold w-[112px] h-[17px]">
                                <img src="/images/estrela.png" alt="estrela1" />
                                 4.5 <span className="text-gray-500 font-normal w-[112px] h-[17px] ">| 15 reviews</span></span>
                            <span className="text-[#6A38F3] w-[65px] h-[17px] ">mercado</span>
                            <span className="text-[#6A38F3] w-[96px] h-[17px]">3 disponíveis</span>
                        </div>

                        <p className="text-5xl font-bold text-gray-900">R$4,70</p>

                        <div className="flex flex-col gap-2 mt-4">
                            <h3 className="font-bold text-xl text-gray-800 uppercase tracking-wide">Descrição</h3>
                            <p className="text-gray-700 leading-relaxed w-[418px] h-[180px]  overflow-y-auto">
                                <span className="uppercase font-semibold">BROWNIE MEIO AMARGO 80g</span><br />
                                Recheado com uma ganache de chocolate meio amargo bem cremosa.<br />
                                CONTÉM GLÚTEN.<br />
                                CONTÉM LACTOSE.
                            </p>
                        </div>
                    </div>
                </div>

                
                {/* Bloco de Avaliações  */}
              
                <div className="flex flex-col mt-20 gap-6">
                    <h2 className="text-3xl font-extrabold text-gray-900 ">Avaliações</h2>
                       
                        {/* Habilita o scroll horizontal via mouse drag (click & pull) :*/}
                    <div 
                        ref={avaliacoesRef}
                        onMouseDown={(e) => startDragging(e, avaliacoesRef)}
                        onMouseLeave={stopDragging}
                        onMouseUp={stopDragging}
                        onMouseMove={(e) => onDrag(e, avaliacoesRef)}
                        className={`flex flex-row gap-6 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] select-none ${isDragging ? "cursor-grabbing snap-none" : "cursor-grab snap-x"}`}
                    >

                         {/*Pega informacoes dos dados e joga no carrossel :*/}
                        {avaliacoes.map((avaliacao) => (
                            <div key={avaliacao.id} className="bg-[#fcfbf7] rounded-[2.5rem] p-8 min-w-[450px] shadow-sm snap-start flex flex-col gap-4 border border-gray-100 pointer-events-none">
                                <div className="flex justify-between items-center pointer-events-auto">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-gray-300"></div>
                                        <p className="font-bold text-xl text-gray-900">{avaliacao.nome}</p>
                                    </div>
                                   <div className="flex gap-1 text-yellow-400">
                                    {/*Pega a nota e coloca a quantidade de estrela de nota :*/}
                                    {Array.from({ length: avaliacao.nota }).map((_, index) => (
                                        <Image 
                                            key={index} 
                                            src="/images/estrela2.png"
                                            alt="Estrela2"
                                            width={20} 
                                            height={20} />
                                    ))}
                                </div>
                                </div>
                                <p className="text-gray-700 text-lg pointer-events-auto">{avaliacao.comentario}</p>
                            </div>
                        ))}
                    </div>
                </div>

                
                {/* Bloco da Mesma Loja */}
                
                <div className="flex flex-col gap-6">
                    <h2 className="text-3xl font-extrabold text-gray-900">Da mesma loja</h2>
                         {/* Habilita o scroll horizontal via mouse drag (click & pull) :*/}
                    <div 
                        ref={lojaRef}
                        onMouseDown={(e) => startDragging(e, lojaRef)}
                        onMouseLeave={stopDragging}
                        onMouseUp={stopDragging}
                        onMouseMove={(e) => onDrag(e, lojaRef)}
                        className={`flex flex-row gap-6 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] select-none ${isDragging ? "cursor-grabbing snap-none" : "cursor-grab snap-x"}`}
                    >

                         {/*Pega informacoes dos dados e joga no carrossel :*/}
                        {produtosMesmaLoja.map((produto) => (
                            <div key={produto.id} className="pointer-events-none min-w-[250px] snap-start">
                                <CardProduto data={produto} />
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}


// Card de produto

function CardProduto({ data }) {
    const isDisponivel = data.status === "DISPONÍVEL";

    return (
        <div className="bg-white rounded-[2rem] p-6 shadow-sm flex flex-col gap-4 relative pointer-events-auto cursor-pointer hover:border-gray-200 border border-transparent transition-all">
            <div className="absolute top-4 right-4 bg-blue-900 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                {data.lojaNome}
            </div>
            
            <div className="w-full h-40 bg-gray-50 rounded-2xl flex items-center justify-center"></div>
            
            <div className="flex flex-col gap-1 mt-2">
                <h3 className="font-extrabold text-lg text-gray-900 truncate">{data.nome}</h3>
                <p className="font-bold text-xl text-gray-900">{data.preco}</p>
                <p className={`text-xs font-bold mt-1 uppercase ${isDisponivel ? 'text-[#C6E700]' : 'text-[#AF052A]'}`}>
                    {data.status}
                </p>
            </div>
        </div>
    );
}