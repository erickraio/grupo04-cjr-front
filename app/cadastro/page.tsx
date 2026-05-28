'use client';

import {useRouter} from 'next/navigation';
import {useState} from 'react';
import {registerUser} from '../services/api';


export default function Cadastro() {

    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async () => {
        console.log("Botao apertado", formData);
        if (formData.password !== formData.confirmPassword) {
            alert("As senhas não coincidem!");
            return;
        }

        try {
            const {name, username, email, password} = formData;
            const res = await registerUser({name, username, email, password});
            alert("Conta criada com sucesso!");
            router.push('/login');
            router.refresh();
        } catch (error: any) {
            alert(error.message || "Erro ao criar conta");
        }
    }

    return (
        <div className="bg-[#f6f3e4] min-h-screen flex items-end">
            <div className="bg-[#000000] h-[105vh] ml-20 rounded-t-[55px] w-1/2">
                <h1 className="text-4xl text-[#f6f3e4] text-center font-bold pb-20 pt-20 ">CRIE SUA CONTA</h1>
                <div className=" text-center">
                <ul>
                    <li>
                        <input 
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            type="text" placeholder="Nome Completo" className="w-4/5 px-3 py-1.5 bg-[#f6f3e4] text-black rounded-full "/>
                    </li>
                    <li>
                        <input 
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            type="email" placeholder="Username" className="w-4/5 mt-5 px-3 py-1.5 bg-[#f6f3e4] text-black rounded-full "/>
                    </li>
                    <li>
                        <input 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            type="email" placeholder="Email" className="w-4/5 mt-5 px-3 py-1.5 bg-[#f6f3e4] text-black rounded-full "/>
                    </li>
                    <li>
                        <input 
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            type="password" placeholder="Senha" className="w-4/5 mt-5 px-3 py-1.5 bg-[#f6f3e4] text-black rounded-full "/>
                    </li>
                    <li>
                        <input 
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            type="password" placeholder="Confirmar Senha" className="w-4/5 mt-5 px-3 py-1.5 bg-[#f6f3e4] text-black rounded-full "/>
                    </li>
                    <li>
                        <button 
                            onClick={handleSubmit}
                            className="w-4/5 mt-5 px-3 py-1.5 bg-[#6a38f3] text-white rounded-full font-bold">CRIAR CONTA</button>
                    </li>
                </ul> 
                    <p className="text-left w-4/5 mx-auto mt-4">Já possui uma conta? <a href="/login" className="text-[#6a38f3] hover:underline">Faça login</a></p>
                </div>
            </div>
        <div className="w-1/2 flex flex-col items-center justify-end overflow-hidden relative">
            <img src="/images/logocadastro.png" alt="Logo Cadastro" className="w-64 mb-8 object-cover object-top origin-top"/>
            <img 
                src="/images/mascote_login.png" 
                alt="mascote"
                width={512}
                height={1118}
                className="h-auto max-h-[85vh] w-auto object-contain" 
            />
        </div>
            <div>
            </div>
        </div>
    );
}