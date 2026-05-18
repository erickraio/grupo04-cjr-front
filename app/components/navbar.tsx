    import React from 'react';
    import {User, LogOut} from 'lucide-react';
    import Link from 'next/link';

    interface NavbarProps {
        logado: boolean;
        onLogin?: () => void;
        onRegister?: () => void;
        onProfile?: () => void;
        onLogout?: () => void;
    }

    export default function Navbar({ logado, onLogin, onRegister, onProfile, onLogout }: NavbarProps) {
        return (
            <nav className="flex justify-between items-center bg-black px-10 h-[70px] w-full box-border select-none">
                <div className="flex items-center">
                    <img src="/stockio.png" alt="Logo Stockio" className="h-10 w-auto object-contain"/>
                </div>

                <div className="flex items-center">
                    {logado?(
                        <div className="flex items-center gap-6">
                            <button 
                                onClick={onProfile}
                                className="text-white transition-colors cursor-pointer"
                                title="Perfil"
                                >
                                    <User size={20} strokeWidth={2} /> 
                            </button>

                            <button 
                                onClick={onLogout}
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