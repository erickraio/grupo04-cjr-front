"use client";

import { useRef, useState } from "react";
import Navbar from "../components/navbar";
import Image from "next/image";

const usuarioLogadoId = 1;
//Dados de teste:
const avaliacoes = [
   
    { id: 1, id_usuario: 1, nome: "Selena Gomez", nota: 5, comentario: "Não é por nada não, mas essa garota arrasa!", img: "/images/rosto.png" },
    { id: 2, id_usuario: 2, nome: "Sofia Figueiredo", nota: 5, comentario: "Adorei o produto. Funcionou muito na minha pele.", img: "/images/rosto.png" },
    { id: 3, id_usuario: 3, nome: "Pedro Freitas", nota: 4, comentario: "A qualidade é incrível.", img: "/images/rosto.png" },
    { id: 4, id_usuario: 4, nome: "Sofia", nota: 5, comentario: "Muito bom", img: "/images/rosto.png" },
    { id: 5, id_usuario: 5, nome: "Sofia", nota: 5, comentario: "Produto de qualidade!", img: "/images/rosto.png" },
];

// Thumbnails do produto principal
const thumbnails = [
    "/images/brownie.png",
    "/images/brownie2.png",
    "/images/brownieinformação.png",
    "/images/brownie.png",
];

const produtosMesmaLoja = [
    { id: 1, nome: "Brownie Trad.", preco: "R$3,80", status: "INDISPONÍVEL", img: "/images/brownie.png" },
    { id: 2, nome: "Brownie Doce L.", preco: "R$4,70", status: "DISPONÍVEL", img: "/images/brownie.png" },
    { id: 3, nome: "Brownie Nozes", preco: "R$4,70", status: "DISPONÍVEL", img: "/images/brownie.png" },
    { id: 4, nome: "Brownie Cookies", preco: "R$4,70", status: "DISPONÍVEL", img: "/images/brownie.png" },
    { id: 5, nome: "Brownie Mé.", preco: "R$4,70", status: "DISPONÍVEL", img: "/images/brownie.png" },
];

export default function ProdutosEspecificos() {
    // Referências para os carrosséis
    const avaliacoesRef = useRef(null);
    const lojaRef = useRef(null);

    // Estado para thumbnail selecionado
    const [selectedThumb, setSelectedThumb] = useState(0);

    // Estados para o drag (arrastar)
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    // Funções para o scroll puxando
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
        const walk = (x - startX) * 1;
        ref.current.scrollLeft = scrollLeft - walk;
    };

    return (
        <div className="bg-[#f6f3e4] min-h-screen pb-12 flex flex-col items-center font-sans">
            <Navbar />

            <div className="w-full mt-16 max-w-[1200px] px-8 flex flex-col gap-16 mt-8">

                {/* Bloco 1: Produto */}
                <div className="flex flex-col md:flex-row gap-12">

                    {/* Lado esquerdo: Seta + Imagens + Imagem Principal */}
                    <div className="flex flex-row gap-4 h-[420px] md:w-1/2">

                        {/* Seta de voltar + coluna de thumbnails */}
                        <div className="flex flex-col items-center gap-3">

                            {thumbnails.map((src, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedThumb(i)}
                                    className={`w-[130px] h-[120px] bg-white rounded-2xl shadow-sm overflow-hidden border-2 transition-all ${selectedThumb === i ? "border-[#6A38F3]" : "border-transparent hover:border-gray-300"}`}
                                >
                                    <Image
                                        src={src}
                                        alt={`imagem ${i + 1}`}
                                        width={130}
                                        height={120}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>

                        {/* Imagem Principal com logo CJR sobreposto */}
                        <div className="flex-1 bg-white rounded-3xl shadow-sm relative overflow-hidden flex items-center justify-center">
                            <Image
                                src={thumbnails[selectedThumb]}
                                alt="Produto principal"
                                fill
                                className="object-contain p-4"
                            />
                            {/* Logo CJR no canto superior direito */}
                            <div className="absolute top-4 right-4 w-[52px] h-[52px] rounded-full overflow-hidden shadow-md border-2 border-white z-10">
                                <Image
                                    src="/images/cjr.png"
                                    alt="Logo CJR"
                                    width={52}
                                    height={52}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Lado direito: Informações */}
                    <div className="flex flex-col w-full md:w-1/2 gap-6 justify-start">
                        <div className="flex justify-between items-start">
                            <h1 className="text-4xl font-extrabold text-[#000000]">Brownie Meio Amargo</h1>
                            <div className="flex gap-2">
                                <div className="w-[27px] h-[27px] bg-[#6A38F3] rounded-full flex items-center justify-center">
                                    <Image src="/images/lapis1.png" alt="lapis" width={17} height={17} />
                                </div>
                                <div className="w-[27px] h-[27px] bg-[#C6E700] rounded-full flex items-center justify-center">
                                    <Image src="/images/estrela3.png" alt="estrela3" width={16} height={16} />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1 text-[#000000] font-bold">
                                <Image src="/images/estrela.png" alt="estrela1" width={17} height={17} />
                                4.5 <span className="text-gray-500 font-normal">| 15 reviews</span>
                            </span>
                            <span className="text-[#6A38F3]">mercado</span>
                            <span className="text-[#6A38F3]">3 disponíveis</span>
                        </div>

                        <p className="text-5xl font-bold text-gray-900">R$4,70</p>

                        <div className="flex flex-col gap-2 mt-4">
                            <h3 className="font-bold text-xl text-gray-800 uppercase tracking-wide">Descrição</h3>
                            <div className="text-gray-700 leading-relaxed overflow-y-auto max-h-[220px] pr-1">
                                <p className="uppercase font-semibold">BROWNIE MEIO AMARGO 80g</p>
                                <p>Recheado com uma ganache de chocolate meio amargo bem cremosa, esse brownie conquistou o coração de muita gente!</p>
                                <br />
                                <p>Achocolatado em pó, farinha de trigo enriquecida com ferro e ácido fólico, chocolate meio amargo, açúcar cristal, manteiga, água, creme de leite, ovo em pó, glucose em pó, emulsificante: lecitina de soja, conservantes: sorbato de potássio, propionato de cálcio e conservante para doces (sal refinado sem iodo, açúcar refinado, conservantes INS 202 e INS 211 e acidulante INS 330) e antioxidante: sal não iodado, amido de milho, antioxidantes INS 321 e INS 319.</p>
                                <br />
                                <p>CONTÉM GLÚTEN.<br />CONTÉM LACTOSE.<br />ALÉRGICOS: CONTÉM OVO E DERIVADOS DE LEITE, TRIGO E SOJA.</p>
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
                                        {/* Foto de perfil com fallback */}
                                        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                            <Image
                                                src={avaliacao.img}
                                                alt={avaliacao.nome}
                                                width={64}
                                                height={64}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <p className="font-bold text-xl text-gray-900">{avaliacao.nome}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex gap-1">
                                            {Array.from({ length: avaliacao.nota }).map((_, index) => (
                                                <Image
                                                    key={index}
                                                    src="/images/estrela2.png"
                                                    alt="Estrela"
                                                    width={22}
                                                    height={22}
                                                />
                                            ))}
                                        </div>
                                          {/* Lápis: só aparece se o usuário logado for o dono do comentário */}
                                        {usuarioLogadoId === avaliacao.id_usuario && (
                                        <button className="w-[27px] h-[27px] bg-[#fcfbf7] rounded-full flex items-center justify-center">
                                            <Image src="/images/lapis2.png" alt="Editar" width={17} height={17} />
                                        </button>)}
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
                    <div
                        ref={lojaRef}
                        onMouseDown={(e) => startDragging(e, lojaRef)}
                        onMouseLeave={stopDragging}
                        onMouseUp={stopDragging}
                        onMouseMove={(e) => onDrag(e, lojaRef)}
                        className={`flex flex-row gap-6 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] select-none ${isDragging ? "cursor-grabbing snap-none" : "cursor-grab snap-x"}`}
                    >
                        {produtosMesmaLoja.map((produto) => (
                            <div key={produto.id} className="pointer-events-none min-w-[220px] snap-start">
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
        <div className="bg-white rounded-[2rem] p-5 shadow-sm flex flex-col gap-3 relative pointer-events-auto cursor-pointer hover:border-gray-200 border border-transparent transition-all">
            {/* Logo CJR no canto superior direito */}
            <div className="absolute top-4 right-4 w-[48px] h-[48px] bg-white rounded-full z-10 overflow-hidden shadow-sm border border-gray-100 flex items-center justify-center">
                <Image
                    src="/images/cjr.png"
                    alt="Logo cjr"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Imagem do produto */}
            <div className="w-full h-36 bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center">
                <Image
                    src={data.img}
                    alt={data.nome}
                    width={160}
                    height={144}
                    className="w-full h-full object-contain"
                />
            </div>

            <div className="flex flex-col gap-1 mt-1">
                <h3 className="font-extrabold text-lg text-gray-900 truncate">{data.nome}</h3>
                <p className="font-bold text-xl text-gray-900">{data.preco}</p>
                <p className={`text-xs font-bold mt-1 uppercase ${isDisponivel ? 'text-[#C6E700]' : 'text-[#AF052A]'}`}>
                    {data.status}
                </p>
            </div>
        </div>
    );
}