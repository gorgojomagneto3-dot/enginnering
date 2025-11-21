import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "StudyFlow - Organiza tu vida universitaria",
  description: "Plataforma profesional para estudiantes universitarios: planifica tareas, registra progreso, toma notas y estudia con la técnica Pomodoro",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        <Providers>
          <Sidebar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
