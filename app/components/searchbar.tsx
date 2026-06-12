'use client';

import React, { useState } from "react";
import { Search, X } from "lucide-react"; 
import Link from "next/link";

interface SearchBarProps {
    onSearch: (query: string) => void;
    produtos: any[] | null;
}

export default function SearchBar({ onSearch, produtos }: SearchBarProps) {
    const [query, setQuery] = useState("");

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" && onSearch) {
            onSearch(query);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        
        if (value.trim() === '') {
            onSearch('');
        }
    };

    const limparBusca = () => {
        setQuery('');
        onSearch('');
    };

    return (
        <div className="relative w-full max-w-md">
            <div className="flex items-center bg-white border border-gray-200 rounded-3xl px-4 py-2 w-full shadow-sm focus-within:border-[#6a38f3] focus-within:ring-1 focus-within:ring-[#6a38f3] transition-all">
                <input
                    type="text"
                    placeholder="Procurar por..."
                    value={query}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className="flex-1 outline-none text-black bg-transparent text-sm w-full"
                />
                {query && (
                    <button 
                        onClick={limparBusca}
                        className="cursor-pointer p-1 text-gray-400 hover:text-gray-600 transition-colors mr-1"
                    >
                        <X size={16} />
                    </button>
                )}

                <button
                    onClick={() => onSearch && onSearch(query)}
                    className="cursor-pointer p-1 bg-[#f4f0ff] rounded-full hover:bg-[#e9e0ff] transition-colors"
                >
                    <Search size={18} color="#6a38f3" />
                </button>
            </div>
            {produtos !== null && Array.isArray(produtos) && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-gray-100 rounded-2xl shadow-[0px_10px_30px_rgba(0,0,0,0.08)] z-50 p-2 max-h-72 overflow-y-auto">
                    {produtos.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-6 text-center">
                            <span className="text-gray-400 mb-2">
                                <Search size={24} />
                            </span>
                            <p className="text-sm text-gray-500 font-medium">Nenhum produto encontrado.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1">
                            {produtos.map((item: any) => (
                                <Link key={item.id} href={`/produto-especifico/${item.id}`}>
                                    <div className="flex justify-between items-center p-3 hover:bg-[#fcfaff] rounded-xl cursor-pointer transition-all border border-transparent hover:border-[#f0eaff]">
                                        <div className="flex flex-col truncate pr-4">
                                            <span className="text-sm font-bold text-gray-800 truncate">
                                                {item.nome}
                                            </span>
                                            {item.loja && (
                                                <span className="text-xs font-medium text-gray-500 truncate">
                                                    Vendido por: {item.loja.nome}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-sm font-extrabold text-[#6a38f3] whitespace-nowrap bg-[#f4f0ff] px-2 py-1 rounded-md">
                                            R$ {Number(item.preco || 0).toFixed(2).replace('.', ',')}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}