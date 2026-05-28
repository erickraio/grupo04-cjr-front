'use client';
import React, {useState} from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  produtos: any[] | null;
}

export default function SearchBar({onSearch, produtos}: SearchBarProps) {
    const [query, setQuery] = useState("");

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" && onSearch) {
            onSearch(query);
        }
    };
    return (
        <div className="relative w-full max-w-md">
        <div className="flex items-center bg-white border rounded-3xl px-4 py-2 w-full max-w-md">
            <input
                type="text"
                placeholder="Procurar por..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex outline-none text-black bg-transparent text-sm w-full"
            />
            <button 
                onClick={() => onSearch && onSearch(query)}
                className="cursor-pointer p-1"
            >
                <Search size={20} color="#6a38f3" />
            </button>
        </div>

        {produtos !== null && (
            <div className="absolute top-full w-full bg-white border border-gray-200 rounded-xl shadow-lg mt-2 z-10 p-2 max-h-60 overflow-y-auto">
                {produtos.length === 0 ? (
                    <p className="text-sm text-black italic p-2">Nenhum item encontrado.</p>
                ) : (
                    produtos.map((item: any) => (
                        <div
                            key={item.id}
                            className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
                        >
                            <div>
                                <span className="text-sm font-medium text-black">{item.nome} - </span>
                                {item.loja && (
                                    <span className="text-sm font-medium text-black">Vendido por: {item.loja.nome}</span>
                                )}
                            </div>
                            <span className="text-xs font-bold text-[#6a38f3]">R${item.preco.toFixed(2).replace('.', ',')}
                            </span>
                        </div>
                    ))
                )}
            </div>
        )}
        </div>
    )
}