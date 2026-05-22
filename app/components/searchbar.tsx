'use client';
import React, {useState} from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({onSearch}: SearchBarProps) {
    const [query, setQuery] = useState("");

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" && onSearch) {
            onSearch(query);
        }
    };
    return (
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
    )
}
