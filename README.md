# Sistemas Operativos - Deep Dive 🚀

Una plataforma educativa moderna, interactiva y "al hueso" para entender cómo corren los sistemas operativos por dentro. Sin vueltas, con simuladores reales y laboratorios prácticos.

## 📚 Currículum del Curso

El proyecto está estructurado en 6 módulos clave, diseñados para llevarte de "no entiendo nada de hardware" a "puedo buildear mi propio shell":

1. **Módulo 1: Arquitectura y el Kernel** - El laburo sucio del kernel, traps, interrupciones y el vector de interrupciones.
2. **Módulo 2: Administración de Procesos** - Forks, execs, waits y el ciclo de vida de un proceso (New, Ready, Running, Waiting, Terminated).
3. **Módulo 3: Planificación de CPU (Scheduling)** - Round Robin, SJF (Shortest Job First) y cómo el SO reparte el tiempo de cómputo.
4. **Módulo 4: Concurrencia y Sincronismo** - Race conditions, semáforos, mutex y el drama de los filósofos comensales (Deadlocks).
5. **Módulo 5: Administración de Memoria** - Paginación, segmentación y la magia de la Memoria Virtual.
6. **Módulo 6: Sistemas de Entradas/Salidas** - Drivers, manejadores de interrupciones y cómo el SO habla con el disco y el teclado.

## ✨ Características Principales

- **Simuladores Interactivos**: Visualizá algoritmos complejos como Round Robin o Paginación de Memoria en tiempo real con componentes construidos en Framer Motion.
- **Laboratorios Guiados**: Guías paso a paso para laboratorios en C y Shell.
- **Preguntas de Examen**: Cuestionarios integrados al final de cada módulo para validar lo aprendido (V/F y Desarrollo).
- **Glosario Dinámico**: Términos técnicos explicados de forma sencilla y directa.

## 🛠️ Stack Tecnológico

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Lógica**: React 19 & TypeScript
- **Animaciones**: Framer Motion & Lucide Icons
- **Estilos**: TailwindCSS / CSS Modules
- **QA & Calidad**: [React Doctor](https://react.doctor) (Utilizado para asegurar que el código siga las mejores prácticas de la industria).

## 🚀 Empezando

Primero, instalá las dependencias:

```bash
npm install
```

Luego, corre el servidor de desarrollo:

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) en tu navegador para ver el resultado.

---

*Desarrollado con ❤️ para estudiantes de Sistemas Operativos que quieren entender qué pasa atrás de la pantalla.*
