'use client';
import React, { useEffect, useState } from 'react';
import { User, LogOut, Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

function getUserIdFromToken(): number | null {
    const token = localStorage.getItem("@StockIO:token");
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.sub ?? null;
    } catch {
        return null;
    }
}

export default function Navbar() {
    const [logado, setLogado] = useState(false);
    const router = useRouter();
    const [userId, setUserId] = useState<number | null>(null);
    
    // Hooks para o Dark Mode
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true); // Evita erros de hidratação entre servidor e cliente
        const token = localStorage.getItem("@StockIO:token");
        if (token){
            setLogado(true);
        }
        setUserId(getUserIdFromToken());
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("@StockIO:token");
        setLogado(false);
        router.push("/login");
    }

    return (
        <nav className="flex justify-between items-center bg-black dark:bg-[#111111] px-10 h-[70px] w-full box-border select-none transition-colors duration-300">
            <div className="flex items-center">
                <Link href="/">
                    <img src="/stockio.png" alt="Logo Stockio" className="h-10 w-auto object-contain"/>
                </Link>
            </div>

            <div className="flex items-center gap-6">
                
                {/* BOTÃO DE TEMA (Sempre Visível) */}
                {mounted && (
                    <button 
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="text-white hover:text-gray-300 transition-colors cursor-pointer flex items-center justify-center p-2 rounded-full"
                        title={theme === 'dark' ? "Mudar para Modo Claro" : "Mudar para Modo Escuro"}
                    >
                        {theme === 'dark' ? <Sun size={22} strokeWidth={2} /> : <Moon size={22} strokeWidth={2} />}
                    </button>
                )}

                {/* Separador Visual */}
                <div className="w-[1px] h-8 bg-gray-700"></div>

                {/* Lógica de Autenticação */}
                {logado ? (
                    <div className="flex items-center gap-6">
                        <button 
                            onClick={() => router.push(`/perfil/${userId}`)}
                            className="text-white hover:text-gray-300 transition-colors cursor-pointer"
                            title="Perfil"
                        >
                            <User size={22} strokeWidth={2} /> 
                        </button>

                        <button 
                            onClick={handleLogout}
                            className="text-white hover:text-red-400 transition-colors cursor-pointer"
                            title="Sair"
                        >
                            <LogOut size={22} strokeWidth={2} />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-6">
                        <Link 
                            href="/login"
                            className="text-[#f6f3e4] hover:text-white font-bold text-sm transition-colors cursor-pointer"
                        >
                            Login
                        </Link>
                        <Link
                            href="/cadastro"
                            className="text-[#6a38f3] bg-[#f6f3e4] hover:bg-white font-bold text-sm transition-colors cursor-pointer rounded-2xl px-5 py-1.5 shadow-sm"
                        >
                            Cadastro
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}