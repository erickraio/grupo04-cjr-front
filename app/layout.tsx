import { League_Spartan } from "next/font/google";
import "./globals.css";

// Configurando a fonte
const leagueSpartan = League_Spartan({ 
  subsets: ["latin"],
  // É bom importar os pesos normais e o 600 que o Figma pediu
  weight: ["400", "500", "600", "700"], 
});

export const metadata = {
  title: "Stock.io",
  description: "Do CAOS à organização, em alguns cliques",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      {/* Aplicando a fonte no corpo inteiro do site */}
      <body className={leagueSpartan.className}>
        {children}
      </body>
    </html>
  );
}