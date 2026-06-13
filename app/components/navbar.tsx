'use client';
import React, {useEffect, useState} from 'react';
import {User, LogOut} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
    useEffect(() => {
        const token = localStorage.getItem("@StockIO:token");
        if (token){
            setLogado(true);
        }
        setUserId(getUserIdFromToken());
    }, [])

    const handleLogout = () => {
        localStorage.removeItem("@StockIO:token");
        setLogado(false);
        router.push("/login");
    }

        return (
            <nav className="flex justify-between items-center bg-black px-10 h-[70px] w-full box-border select-none">
                <div className="flex items-center">
                    <Link href="/">
                        <img src="/stockio.png" alt="Logo Stockio" className="h-10 w-auto object-contain"/>
                    </Link>
                </div>

                <div className="flex items-center">
                    {logado?(
                        <div className="flex items-center gap-6">
                            <button 
                               onClick={() => router.push(`/perfil/${userId}`)}
                                className="text-white transition-colors cursor-pointer"
                                title="Perfil"
                                >
                                    <User size={20} strokeWidth={2} /> 
                            </button>

                            <button 
                                onClick={handleLogout}
                                className="text-white transition-colors cursor-pointer"
                                title="Sair"
                                >
                                    <LogOut size={20} strokeWidth={2} />
                            </button>

                        </div>
                    ) : (
                        <div className="flex items-center gap-6">
                            <Link 
                                href="/login"
                                className="text-[#f6f3e4] font-bold text-sm transition-colors cursor-pointer"
                            >
                                Login
                            </Link>
                            <Link
                                href="/cadastro"
                                className="text-[#6a38f3] bg-[#f6f3e4] font-bold text-sm transition-colors cursor-pointer rounded-2xl px-4 py-1"
                            >
                                Cadastro
                            </Link>
                        </div>
                    )}
                </div>
            </nav>
        );
    }   