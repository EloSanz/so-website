import Link from "next/link";
import { learningPlan } from "@/lib/data/learningPlan";
import { ChevronRight, Terminal, BookOpen, Activity, Cpu, Share2, Database, HardDrive, ArrowRight, ExternalLink, Heart, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

const icons = [BookOpen, Activity, Cpu, Share2, Database, HardDrive];

const bibliography = [
  {
    title: 'Fundamentos de Sistemas Operativos',
    author: 'Gunnar Wolf — Universidad de México',
    url: 'https://drive.google.com/open?id=1B-ehY8etZ5vDTzjRorjWqJ69Bz76zFB1&usp=drive_fs',
    type: 'libro' as const,
  },
  {
    title: 'Apunte de Sistemas Operativos',
    author: 'Autor desconocido',
    url: 'https://drive.google.com/open?id=1maYzqJGx_UeV5iff6NCnEkLNoDKvPSjv&usp=drive_fs',
    type: 'apunte' as const,
  },
  {
    title: 'Apunte 1C2025 — Comisión Jueves con Rivalta',
    author: 'Marcos León Rodríguez',
    url: 'https://drive.google.com/open?id=1r-iwG1g6XE3ig2bDs5be4c4VVfrCwkmV&usp=drive_fs',
    type: 'apunte' as const,
  },
  {
    title: 'Apunte 1C2025 — Comisión Jueves con Rivalta',
    author: 'Vladimir Francisco',
    url: 'https://drive.google.com/open?id=1raM5uzV9DBi4cBDC7rbdTknqemNNhhHe&usp=drive_fs',
    type: 'apunte' as const,
  },
  {
    title: 'Apunte provisto por la UTN',
    author: 'Autor desconocido — UTN',
    url: 'https://drive.google.com/open?id=1AEzNlu6HSiGbm2tyt5v9lpdnhiLILTI3&usp=drive_fs',
    type: 'apunte' as const,
  },
  {
    title: 'Contenido de la plataforma MIEL',
    author: 'Docentes de la UNLAM',
    url: 'https://drive.google.com/open?id=1HEWHYX9z43A8QDBO3mDbIvHmK16i-R6-&usp=drive_fs',
    type: 'plataforma' as const,
  },
  {
    title: 'Apunte 1C2025 — Comisión Miércoles Noche (3900)',
    author: 'Tiago Pujia',
    url: '',
    type: 'apunte' as const,
  },
];

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
              &quot;En las entrevistas de trabajo y en la optimización de sistemas críticos, el que entiende qué pasa debajo del capó es el que marca la diferencia.&quot;
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

      {/* ═══════════ Bibliografía & Kudos ═══════════ */}
      <section className="pb-16 space-y-8">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-border" />
          <div className="flex items-center gap-2 text-muted-foreground">
            <Heart className="w-4 h-4 text-red-400" />
            <span className="text-xs font-bold uppercase tracking-widest">Bibliografía & Kudos</span>
            <Heart className="w-4 h-4 text-red-400" />
          </div>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="p-8 rounded-[2.5rem] bg-primary/5 border border-primary/10 space-y-3">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold">Agradecimientos</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed text-sm">
            El estudio de este cuaderno fue dado por las clases de los docentes, el contenido que se encuentra en MIEL, y diversos libros y apuntes que mencionamos a continuación. Gracias a todos los que comparten conocimiento libre.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bibliography.map((item, index) => (
            <a
              key={index}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold group-hover:text-primary transition-colors leading-tight">
                    {item.title}
                  </h3>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary shrink-0 mt-0.5 transition-colors" />
                </div>
                <p className="text-xs text-muted-foreground">{item.author}</p>
                <span className={cn(
                  "inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full",
                  item.type === 'libro' && "bg-amber-500/10 text-amber-500",
                  item.type === 'apunte' && "bg-blue-500/10 text-blue-500",
                  item.type === 'plataforma' && "bg-emerald-500/10 text-emerald-500",
                )}>
                  {item.type}
                </span>
              </div>
            </a>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground/60 pt-4">
          Hecho con 🧉 y muchas noches sin dormir · Sistemas Operativos — UNLAM 1C2025
        </p>
      </section>
    </div>
  );
}
