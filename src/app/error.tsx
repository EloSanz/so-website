"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive">
                <AlertCircle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
                <h1 className="text-4xl font-extrabold tracking-tight italic">Kernel Panic</h1>
                <p className="text-muted-foreground max-w-md mx-auto">
                    ¡Quilombo en el Kernel! Se nos prendió fuego el procesador. Tirate un "reset" y rezale a Stallman para que esto arranque.
                </p>
            </div>
            <button
                onClick={() => reset()}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-destructive text-destructive-foreground font-bold hover:scale-[1.02] transition-all"
            >
                <RefreshCcw className="w-4 h-4" />
                Intentar Re-ejecutar
            </button>
        </div>
    );
}
