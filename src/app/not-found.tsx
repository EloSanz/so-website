import Link from "next/link";
import { Terminal, MoveLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive">
                <Terminal className="w-8 h-8" />
            </div>
            <div className="space-y-2">
                <h1 className="text-4xl font-extrabold tracking-tight italic">404: Stack Overflow</h1>
                <p className="text-muted-foreground max-w-md mx-auto">
                    El segmento de memoria solicitado no existe o lo desasignó el kernel porque te mandaste una macana.
                </p>
            </div>
            <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-foreground text-background font-bold hover:scale-[1.02] transition-all"
            >
                <MoveLeft className="w-4 h-4" />
                Pegar la vuelta al Inicio
            </Link>
        </div>
    );
}
