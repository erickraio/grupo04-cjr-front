export default function Cadastro() {
    return (
        <div className="bg-[#f6f3e4] min-h-screen flex items-end">
            <div className="bg-[#000000] h-[90vh] ml-20 rounded-t-[55px]">
                <h1 className="text-4xl text-[#f6f3e4] flex text-center font-bold p-35 pb-9 md-90 pt-21">CRIE SUA CONTA</h1>
                <div className="mt-0.5 text-center">
                    <input type="text" placeholder="Nome Completo" className="w-120 px-3 py-1.5 bg-[#f6f3e4] text-black rounded-full "/>
                    <p/>
                    <input type="email" placeholder="Username" className="w-120 mt-5 px-3 py-1.5 bg-[#f6f3e4] text-black rounded-full "/>
                    <p/>
                    <input type="password" placeholder="Email" className="w-120 mt-5 px-3 py-1.5 bg-[#f6f3e4] text-black rounded-full "/>
                    <p/>
                    <input type="password" placeholder="Senha" className="w-120 mt-5 px-3 py-1.5 bg-[#f6f3e4] text-black rounded-full "/>
                    <p/>
                    <input type="password" placeholder="Confirmar Senha" className="w-120 mt-5 px-3 py-1.5 bg-[#f6f3e4] text-black rounded-full "/>
                    <p/>
                    <button className="w-120 mt-8 px-3 py-1.5 bg-[#6a38f3] text-white rounded-full font-bold">CRIAR CONTA</button>
                    <p className="text-left w-120 mx-auto mt-4">Já possui uma conta? <a href="/login" className="text-[#6a38f3] hover:underline">Faça login</a></p>
                </div>
            </div>
            <div className="flex-1 flex h-[90vh] items-end justify-center overflow-hidden">
                <img src="/images/boneca.png" alt="Boneca" className="h-135 w-85 object-cover object-top origin-top"/>
            </div>
        </div>
    );
}