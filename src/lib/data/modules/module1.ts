import { Module } from '../types';

export const module1: Module = {
    id: '1',
    title: 'Arquitectura y el Laburo Sucio del Kernel',
    unit: 'El Filtro Inicial',
    advancedFocus: 'Acá es donde te das cuenta que las System Calls no son gratis. El cambio de contexto te mata si no lo manejás con carpa.',
    topics: [
        {
            id: 'historia',
            title: 'Historia y Evolución',
            content: {
                description: 'De mastodontes que ocupaban habitaciones a la compu que tenés en el bolsillo. La historia es un viaje de ida hacia la eficiencia.',
                items: [
                    'Proceso por Lotes (Batch): Un programa atrás del otro. El SPOOL (buffer en disco) salvó a la CPU de morir esperando a la impresora.',
                    'Multiprogramación: El gran salto. Dividir la RAM para que varios procesos "vivan" juntos y el micro nunca esté al pedo.',
                    'Era de los 8-bits: IBM PC y el nacimiento del DOS. Microsoft entra en escena y la informática llega a las casas.',
                    'Revolución Mobile: iOS y Android (basado en Linux). El SO ahora tiene que cuidar la batería como si fuera oro.'
                ],
                highlight: 'Dato de Color: En los 40 no había SO, eras vos contra los cables. Si te equivocabas en uno, tenías que empezar de cero.'
            }
        },
        {
            id: 'multiprocesamiento',
            title: 'Multiproceso y Memoria',
            content: {
                description: '¿Varios núcleos o varias CPUs? ¿Comparten todo o cada uno con su rancho? Acá se define la potencia real.',
                items: [
                    'Simétrico (SMP) vs Asimétrico: En SMP todos son iguales; en Asimétrico hay un "Master" y varios "Slaves" (como una GPU).',
                    'UMA vs NUMA: UMA es igualdad para todos; NUMA le da a cada CPU su banco de RAM rápido (ideal para servidores gigantes).',
                    'Concurrencia vs Paralelismo: Ojo acá. Concurrencia es alternar rápido (sensación de simultaneidad); Paralelismo es hacer dos cosas al mismo tiempo de verdad.',
                    'Cómputo Distribuido: Clústers (mismo lugar, alta velocidad) vs Grids (lejos, heterogéneos) y la Nube.'
                ],
                highlight: 'Pregunta de Examen: ¿Cuál es el objetivo de NUMA? Mejorar la performance evitando que todos los micreos se peleen por el mismo bus de memoria.'
            }
        },
        {
            id: 'funciones',
            title: 'Funciones del Kernel',
            content: {
                description: 'El kernel es el patovica y el psicólogo del sistema. Tiene que administrar todo sin que nadie se dé cuenta.',
                items: [
                    'Máquina Extendida: Abstracción pura. Vos no ves sectores de disco, ves archivos. El kernel te miente para que tu vida sea más fácil.',
                    'Administrador de Recursos: El SO reparte el micro, la RAM y los periféricos. Si hay conflicto, el kernel decide quién pasa.',
                    'Aislamiento y Seguridad: Evitar que el Chrome de tu hermano se meta en la memoria de tu home banking. El patovica no deja pasar a nadie sin permiso.',
                    'Inicialización (Boot): Desde que apretás el botón hasta que ves el desktop, el kernel está levantando el hardware del piso.'
                ],
                highlight: 'Concepto Clave: El SO existe para que el hardware sea usable. Sin él, estarías moviendo bits a mano con una palanquita.'
            }
        },
        {
            id: 'clasificacion',
            title: 'Tiempo Real y Virtuales',
            content: {
                description: 'No todos los SO sirven para lo mismo. Algunos tienen que ser ultra-precisos y otros son puras mentiras virtuales.',
                items: [
                    'Tiempo Real Crítico (Hard RT): Si tarda un milisegundo de más, el sistema falla (ej. frenos de un auto o un marcapasos).',
                    'Tiempo Real Blando (Soft RT): Se intenta cumplir el tiempo, pero si falla está "lento", no roto (ej. streaming de video).',
                    'Sistemas Virtuales: Una máquina virtual corriendo sobre hardware virtual que, a su vez, corre sobre hardware real. Abstracción extrema.',
                    'Propósito General vs Específicos: Windows/Linux vs el SO que maneja tu lavarropas o la centralita del motor.'
                ],
                highlight: 'Diferencia de Oro: En un sistema On-Line el retraso es molestia; en Tiempo Real el retraso es mal funcionamiento.'
            }
        },
        {
            id: 'arquitectura',
            title: 'Monolíticos vs Microkernel',
            content: {
                description: '¿Todo en un solo bloque o todo separado por servicios? La pelea eterna de Tanenbaum vs Torvalds.',
                items: [
                    'Monolítico (Linux): Todo el código del kernel vive en el mismo espacio. Es rapidísimo pero un driver roto te tira todo el sistema.',
                    'Microkernel (Minix/QNX): Solo lo básico va en el kernel.Drivers y FS son procesos comunes. Muy robusto y seguro.',
                    'Sistemas Híbridos: Lo que usa Windows y macOS. Tratan de meter lo crítico adentro y lo demás afuera para no perder velocidad.',
                    'Modularidad y Mantenimiento: El microkernel gana en limpieza, pero el monolítico gana en performance bruta.'
                ],
                highlight: 'Pregunta de Final: ¿Por qué el Microkernel es más robusto? Porque si el driver de video explota, el kernel sigue vivo y podés reiniciar el driver.'
            }
        },
        {
            id: 'interrupciones',
            title: 'El Show de las Interrupciones',
            content: {
                description: 'Sin interrupciones, la CPU sería un zombi preguntando "¿ya terminó?" cada dos segundos.',
                items: [
                    'Polling vs Interrupción: Polling es mirar el celu cada 5 segundos; Interrupción es que te suene una notificación.',
                    'Vector de Interrupciones: Una tabla en memoria que tiene las direcciones de las [[RAI (ES) / ISR (EN) | Rutina de Atención a Interrupción]].',
                    '[[RAI | Rutina de Atención a Interrupción]]: Es el pedazo de código del kernel que sabe qué hacer cuando llega un grito específico del hardware.',
                    'Traps (Excepciones): Cuando el software se manda una macana (ej. dividir por cero), el hardware genera un Trap para que el kernel tome el control.',
                    'Salvado de Contexto: Antes de atender el grito, el SO guarda qué estaba haciendo para poder volver después sin romper nada.'
                ],
                highlight: 'Pregunta de Final: ¿Qué es la [[RAI | Rutina de Atención a Interrupción]]? Es la Rutina de Atención a Interrupción. El Vector de Interrupciones es el índice, y la RAI es el contenido.'
            }
        },
        { id: 'lab', title: 'Laboratorio de Shell' },
    ],
    examQuestions: [
        {
            type: 'V/F',
            question: 'Los compiladores permiten convertir un programa en proceso.',
            answer: 'Falso',
            explanation: 'Los compiladores convierten el código fuente en un programa objeto. Es el Link-Editor el que genera el ejecutable, el cual al cargarse en memoria forma los procesos.'
        },
        {
            type: 'V/F',
            question: 'Para que se necesite la comunicación entre procesos, es necesario un sistema de multiprocesamiento.',
            answer: 'Falso',
            explanation: 'Lo que se necesita es que el sistema sea MULTIPROGRAMABLE (concurrente), aunque tenga un solo procesador.'
        },
        {
            type: 'V/F',
            question: 'En un sistema monoproceador multiprogramado, el SO puede atender una o más interrupciones en forma simultánea.',
            answer: 'Falso',
            explanation: 'No puede atenderlas en paralelo. Debe atender primero una y luego la otra, ya que solo cuenta con un procesador.'
        },
        {
            type: 'V/F',
            question: 'Es posible que se produzca una interrupción de impresora, una syscall y una interrupción interna al mismo tiempo en un monoprocesador.',
            answer: 'Falso',
            explanation: 'No pueden producirse una interrupción interna y una syscall al mismo tiempo porque hay un único proceso corriendo. En un multiprocesador sí podría pasar (una en cada core).'
        },
        {
            type: 'Desarrollo',
            question: 'Explique brevemente la técnica de spooling, sus ventajas y aplicaciones.',
            answer: 'El spooling (Simultaneous Peripheral Operations On-Line) usa el disco como buffer para dispositivos lentos. Permite que la CPU mande múltiples peticiones (ej. imprimir 5 archivos) y siga con su laburo sin esperar a que el fierro termine.',
        },
        {
            type: 'Desarrollo',
            question: '¿Qué es el vector de interrupciones?',
            answer: 'Es una tabla en memoria donde el SO tiene anotadas las direcciones de los "handlers" o RAI (Rutina de Atención a Interrupción) correspondientes a cada IRQ.',
        }
    ],
    lab: {
        language: 'C (A puro pulmón)',
        task: 'Armate un mini-shell que no se rompa al primer fork(). Si no usás wait() te quedan procesos zombie y el profe te liquida.',
    },
    animations: [
        {
            id: 'interrupt',
            title: 'El Viaje de la Interrupción',
            description: 'Mirá cómo el hardware le pega el grito al kernel y el handler trata de que no explote nada.',
        }
    ],
};
