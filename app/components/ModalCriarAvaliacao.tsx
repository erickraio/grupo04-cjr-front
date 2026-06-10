'use client';

import { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

function getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('@StockIO:token') || null;
}

function getUserIdFromToken(): number | null {
    const token = getToken();
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.sub ?? null;
    } catch {
        return null;
    }
}

interface ModalCriarAvaliacaoProps {
    isOpen: boolean;
    onClose: () => void;
    nomeProduto?: string;
    idProduto: number;
    onAvaliacaoCriada?: () => void;
}

export default function ModalCriarAvaliacao({
    isOpen,
    onClose,
    nomeProduto = '',
    idProduto,
    onAvaliacaoCriada,
}: ModalCriarAvaliacaoProps) {

    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comentario, setComentario] = useState('');
    const [carregando, setCarregando] = useState(false);

    if (!isOpen) return null;

    function handleFechar() {
        setRating(0);
        setHoverRating(0);
        setComentario('');
        onClose();
    }

    async function handleAvaliar() {
        if (rating === 0) {
            alert('Selecione uma nota antes de avaliar!');
            return;
        }

        const usuarioId = getUserIdFromToken();
        if (!usuarioId) {
            alert('Você precisa estar logado para avaliar.');
            return;
        }

        setCarregando(true);
        try {
            const token = getToken();

            const res = await fetch(`${API_URL}/aval-produto/${idProduto}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id_produto: idProduto,
                    id_usuario: usuarioId,
                    nota: rating,
                    comentario: comentario.trim() || null,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || `Erro ${res.status} ao criar avaliação`);
            }

            alert('Avaliação enviada com sucesso!');
            handleFechar();
            onAvaliacaoCriada?.();
        } catch (err: any) {
            console.error(err);
            alert(err.message || 'Não foi possível enviar a avaliação.');
        } finally {
            setCarregando(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

            {/* Container Principal */}
            <div className="bg-[#EBEBEB] w-[90%] max-w-[650px] p-8 md:p-10 rounded-[2rem] shadow-2xl relative">

                {/* Botão Fechar */}
                <button
                    onClick={handleFechar}
                    className="absolute top-6 right-6 text-black hover:text-gray-600 transition-colors"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                {/* Título */}
                <h2 className="text-[22px] md:text-2xl font-light text-center text-gray-800 mb-8 mt-2">
                    Você está avaliando <span className="font-bold text-black ml-1 text-2xl md:text-3xl">{nomeProduto}</span>
                </h2>

                {/* Estrelas interativas */}
                <div className="flex justify-center gap-2 md:gap-4 mb-8">
                    {[1, 2, 3, 4, 5].map((star) => {
                        const isFilled = star <= (hoverRating || rating);
                        return (
                            <button
                                key={star}
                                type="button"
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                                className="focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                            >
                                <svg
                                    width="55"
                                    height="55"
                                    viewBox="0 0 24 24"
                                    className={`transition-colors duration-200 ${isFilled ? 'fill-[#7C3AED] text-[#7C3AED]' : 'fill-transparent text-[#7C3AED]'}`}
                                    stroke="currentColor"
                                    strokeWidth="1"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                </svg>
                            </button>
                        );
                    })}
                </div>

                {/* Textarea */}
                <textarea
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    placeholder="Avaliação da loja"
                    rows={10}
                    className="w-full bg-white rounded-2xl p-6 text-sm text-gray-700 shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#7C3AED] mb-8"
                />

                {/* Botão Avaliar */}
                <div className="flex flex-col items-center">
                    <button
                        onClick={handleAvaliar}
                        disabled={carregando}
                        className="bg-[#7C3AED] w-[70%] text-white font-medium text-sm md:text-base py-3 rounded-full shadow-md hover:bg-purple-700 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {carregando ? 'Enviando...' : 'Avaliar'}
                    </button>
                </div>

            </div>
        </div>
    );
}