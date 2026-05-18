"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import api from "../services/api";
import Link from "next/link";


export default function Login() {
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isLoading) return;
        setIsLoading(true);



        try {
            const response = await api.post("/auth/login", {
                email: email,
                password: password,
            });
            const token = response.data.access_token;
            localStorage.setItem("@StockIO:token", token);
            alert("Login realizado com sucesso!");
        }
        catch (error: any) {
            const mensagemErro = error.response?.data?.message || "Erro ao conectar com o servidor";
            alert(mensagemErro);


        } finally {
            setIsLoading(false);
        };

    }
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    return (
        //Fundo do site 
        <div className="bg-[#f6f3e4] min-h-screen flex">
            {/*Lado Direito da tela */}
            <div className="w-1/2 flex flex-col justify-start px-24 pt-8">
                {/*Imagem da logo*/}
                <Image
                    src="/images/logo_stock.io.png"
                    alt="logo da Stock.io"
                    width={421}
                    height={267}
                    className="-mt-16"

                />
                <Image
                    src="/images/mascote_login.png"
                    alt="mascote"
                    width={512.5516357421875}
                    height={1118.5}


                />



            </div>
            {/*Lado Esquerdo da tela */}
            <div className="w-1/2 flex flex-col justify-center ">
                {/*Bloco preto onde fica  as informações  */}
                <div className="bg-[#171918] p-10 rounded-[3rem] w-[654px] h-[1068px]   mt-24 flex  flex-col  items-center">
                    {/*Bloco para o formulário */}
                    <div className="bg-[#171918] p-8 w-[504px] h-[402px]  flex flex-col justify-center ">
                        <h2 className="text-white text-3xl font-extrabold text-center mb-8 uppercase tracking-wide">
                            Bem vindo de volta!
                        </h2>
                        {/*barra email*/}
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className=" bg-[#f6f3e4] text-gray-900 px-6 py-3 rounded-full mb-4 outline-none"
                            type="email"
                            placeholder="Email"
                        />
                        {/*barra senha*/}

                        <div className="relative w-full">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-[#f6f3e4] text-gray-900 placeholder-gray-400 px-6 py-3 rounded-full w-full outline-none pr-12"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                {showPassword ? (
                                    <EyeOff size={20} /> //  olho fechado
                                ) : (
                                    <Eye size={20} />    //  olho aberto
                                )}
                            </button>
                        </div>

                        {/*Link esqueceu a senha*/}
                        <div className="text-center mt-8 mb-8">
                            <Link
                                href="/recuperar-senha"
                                className="text-[#ffffff]  text-sm underline decoration-gray-500 hover:text-gray-500 ">
                                Esqueceu sua senha?
                            </Link>
                        </div>

                        {/* Botão Entrar */}
                        <button
                            onClick={handleLogin}
                            disabled={isLoading}
                            className="bg-[#6A38F3] text-white font-bold text-lg py-3 rounded-full w-full mb-8 hover:bg-[#652cd4] transition-all uppercase tracking-wider">
                            {isLoading ? "Carregando..." : "Entrar"}
                        </button>

                        {/* Parte que leva ao cadastro */}
                        <p className="text-white text-sm">Não possui uma conta?
                            <Link
                                className="text-[#6A38F3] text-sm font-bold hover:underline"
                                href="/cadastro"
                            > Cadastre-se</Link>
                        </p>
                    </div>
                </div>

            </div>


        </div>


    );



}