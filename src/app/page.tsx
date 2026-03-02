import Link from "next/link";
import { learningPlan } from "@/lib/data/learningPlan";
import { ChevronRight, Terminal, BookOpen, Activity, Cpu, Share2, Database, HardDrive, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const icons = [BookOpen, Activity, Cpu, Share2, Database, HardDrive];

export default function Home() {
  return (
    <div className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-8 lg:p-12 space-y-16">
      <div className="space-y-6 max-w-3xl">
        <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
          Sistemas <span className="text-primary italic">Operativos</span> para Valientes
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Si llegaste hasta acá, preparate el mate porque lo que viene es un viaje de ida al corazón del Kernel. No es para cualquiera, pero si entendés esto, el Final es tuyo (bueno, casi).
        </p>

        <div className="p-8 rounded-[2.5rem] bg-primary/5 border border-primary/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-500">
            <Terminal className="w-16 h-16 text-primary" />
          </div>
          <div className="relative z-10 space-y-4">
            <h2 className="text-2xl font-bold text-foreground">¿Por qué sufrir con Sistemas Operativos, Punteros y C?</h2>
            <p className="text-muted-foreground leading-relaxed text-base">
              Saber de <strong className="text-foreground font-bold italic">indirección, gestión de memoria y punteros</strong> no es solo para pasar la materia. Es lo que te define como un <strong className="text-foreground font-bold italic text-primary/90">buen profesional de backend</strong>. Dominar estos conceptos te va a dar una ventaja competitiva brutal al trabajar con <span className="font-bold text-primary">Java (Spring Boot), Python o Go</span>.
            </p>
            <p className="text-sm text-muted-foreground/80 italic">
              "En las entrevistas de trabajo y en la optimización de sistemas críticos, el que entiende qué pasa debajo del capó es el que marca la diferencia."
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <Link
            href="/modules/1"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-foreground text-background font-bold hover:scale-[1.02] transition-all shadow-xl shadow-foreground/10"
          >
            Empezar la Carrera
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/modules/1"
            className="px-8 py-4 rounded-2xl bg-muted font-bold hover:bg-border transition-colors border border-border/50"
          >
            ¿Qué onda la materia?
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
        {learningPlan.map((module, index) => {
          const Icon = icons[index] || BookOpen;
          return (
            <Link
              key={module.id}
              href={`/modules/${module.id}`}
              className="group relative p-8 rounded-[2rem] bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Icon className="w-24 h-24" />
              </div>

              <div className="relative space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <Icon className="w-6 h-6" />
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-primary/60 group-hover:text-primary transition-colors">
                    {module.unit}
                  </div>
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors leading-tight">
                    {module.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {module.advancedFocus}
                  </p>
                </div>

                <div className="pt-4 flex items-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 transition-transform duration-300">
                  Ver detalle <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
