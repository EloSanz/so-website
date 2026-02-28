"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { MobileHeader } from "@/components/MobileHeader";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SidebarProvider, useSidebar } from "@/components/SidebarContext";
import { PanelLeftOpen, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isSidebarOpen, toggleSidebar, isZenMode, toggleZenMode } = useSidebar();

  return (
    <div className={cn(
      "flex flex-col lg:flex-row h-screen overflow-hidden bg-background text-foreground transition-all duration-500 relative",
      isZenMode ? "justify-center" : ""
    )}>
      {isZenMode && (
        <>
          <style dangerouslySetInnerHTML={{
            __html: `
            * { scrollbar-width: none !important; -ms-overflow-style: none !important; }
            *::-webkit-scrollbar { display: none !important; }
          `}} />
          <button
            onClick={toggleZenMode}
            className="fixed right-8 top-8 z-[60] flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-xs hover:bg-primary/20 transition-all opacity-20 hover:opacity-100"
          >
            <Monitor className="w-4 h-4" />
            Salir de Modo Zen
          </button>
        </>
      )}

      {!isSidebarOpen && !isZenMode && (
        <button
          onClick={toggleSidebar}
          className="fixed left-4 top-4 z-[60] p-2.5 rounded-xl bg-card border border-border shadow-2xl text-muted-foreground hover:text-primary hover:scale-110 transition-all hidden lg:flex group items-center"
          title="Mostrar camino a la gloria"
        >
          <PanelLeftOpen className="w-5 h-5" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 text-xs font-bold whitespace-nowrap">
            Mostrar camino
          </span>
        </button>
      )}

      {!isZenMode && <Sidebar />}

      <div className={cn(
        "flex-1 flex flex-col min-w-0 h-full overflow-hidden transition-all duration-500",
        isZenMode ? "max-w-4xl mx-auto items-center" : "w-full"
      )}>
        {!isZenMode && <MobileHeader />}
        <main className={cn(
          "flex-1 w-full overflow-y-auto scroll-smooth no-scrollbar",
          isZenMode ? "px-6 md:px-0" : ""
        )}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={cn(
        inter.className,
        "antialiased selection:bg-primary/10 selection:text-primary"
      )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <LayoutContent>{children}</LayoutContent>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
