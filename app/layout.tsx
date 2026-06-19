import { League_Spartan } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider"; 

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
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={leagueSpartan.className}>
        {/* Envolvendo toda a aplicação com o ThemeProvider */}
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}