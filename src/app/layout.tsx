import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import PWARegister from "@/components/PWARegister";

export const metadata: Metadata = {
  title: "StudyFlow - Organiza tu vida universitaria",
  description: "Plataforma profesional para estudiantes universitarios: planifica tareas, registra progreso, toma notas y estudia con la técnica Pomodoro",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "StudyFlow",
  },
  applicationName: "StudyFlow",
  themeColor: "#4F46E5",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4F46E5" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="StudyFlow" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="antialiased">
        <PWARegister />
        <Providers>
          <Sidebar />
          <MobileNav />
          <div className="md:ml-72 pt-16 md:pt-0 pb-16 md:pb-0">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
