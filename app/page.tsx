import Navbar from "./components/navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col gap-10">
      
      {/* Aqui a gente chama a sua Navbar como DESLOGADO para testar */}
      <Navbar logado={false} />

      {/* Um conteúdo bobo no meio da tela só para não ficar vazio */}
      <main className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-black tracking-widest">STOCK.IO</h1>
        <p className="text-zinc-400 mt-2">Página de testes inicial</p>
      </main>

    </div>
  );
}