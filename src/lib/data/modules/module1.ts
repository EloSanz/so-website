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
                description: '¿Quién manda acá? El multiprocesamiento define si hay una **jerarquía** entre los procesadores o si son todos iguales. Esto afecta tanto a quién decide qué proceso corre cada uno, como a la forma en que acceden a la memoria RAM.',
                items: [
                    'Simétrico (SMP) vs Asimétrico: En SMP todos los procesadores son "colegas" (iguales); cualquiera puede ejecutar cualquier tarea del SO y todos ven la misma RAM. En Asimétrico (Master-Slave), un procesador jefe reparte el laburo y los demás obedecen, manejando tareas específicas.',
                    'UMA vs NUMA: [[UMA|Uniform Memory Access]] es "igualdad para todos", donde cualquier CPU tarda lo mismo en acceder a cualquier parte de la RAM. En [[NUMA|Non-Uniform Memory Access (cada CPU tiene su propio rancho local)]], cada CPU tiene su propio banco de memoria local más rápido.',
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
                    'Salvado de Contexto: Antes de atender el grito, el SO guarda qué estaba haciendo para poder volver después sin romper nada.',
                    'Interrupciones Enmascarables: La CPU puede "ignorar" o postergar estas señales si está haciendo algo muy importante (se usa un Bit de Máscara). Típico de E/S común.',
                    'Interrupciones No Enmascarables (NMI): Son "gritos" que no se pueden ignorar. Se reservan para eventos críticos como errores de paridad de memoria o fallos de energía (Power Failure).',
                    'Manejo Secuencial: Las interrupciones se atienden de a una. Si llega una mientras se atiende otra, queda pendiente hasta que la actual termine. Simple, pero rígido.',
                    'Manejo Anidado (Nesting): Una interrupción de mayor prioridad puede interrumpir a la actual. Es vital para sistemas de tiempo real donde el teclado no puede esperar a que termine la impresora.',
                    'Prioridades: El hardware (como el [[ PIC | Programmable Interrupt Controller: Chip encargado de gestionar las interrupciones de hardware y enviarlas a la CPU según su prioridad. ]] o [[ APIC | Advanced Programmable Interrupt Controller: Versión avanzada y multinúcleo del PIC, necesaria para sistemas modernos y SMP. ]]) decide quién pasa primero basándose en niveles de prioridad fijos o configurables.'
                ],
                highlight: 'Dato de Final: ¿Pueden ocurrir a la vez? Sí, pero se atienden según la **Prioridad**. Si son de igual prioridad, suele ganar la que llegó primero o la que tiene el número de IRQ más bajo.'
            }
        },
    ],
    examQuestions: [
        {
            type: 'V/F',
            question: 'La concurrencia y el paralelismo son exactamente el mismo concepto y requieren de múltiples procesadores para funcionar.',
            answer: 'Falso',
            explanation: 'Son distintos. La concurrencia da la ilusión de simultaneidad intercalando tareas muy rápido (puede ocurrir en un solo núcleo mediante multiprogramación). El paralelismo implica que dos o más tareas se ejecutan físicamente al mismo tiempo real, lo cual requiere hardware multi-núcleo o multiprocesador.'
        },
        {
            type: 'V/F',
            question: 'En una arquitectura NUMA, todos los procesadores acceden a todas las partes de la memoria principal exactamente a la misma velocidad.',
            answer: 'Falso',
            explanation: 'Ese es el modelo UMA (Uniform Memory Access). En NUMA (Non-Uniform Memory Access), cada procesador tiene memoria local que es mucho más rápida de acceder que la memoria conectada a los otros procesadores.'
        },
        {
            type: 'V/F',
            question: 'Un fallo en el driver de video en un Sistema Operativo Monolítico puro provocará la caída total (Kernel Panic / Pantalla Azul) del sistema.',
            answer: 'Verdadero',
            explanation: 'En un SO Monolítico, los drivers y el kernel se ejecutan en el mismo espacio vital de memoria (kernel space). Si falla un componente, corrompe toda la estructura y hace caer todo el sistema.'
        },
        {
            type: 'Desarrollo',
            question: '¿Cuál es la principal diferencia entre un Sistema de Tiempo Real Crítico (Hard RT) y uno Blando (Soft RT)?',
            answer: 'En el Tiempo Real Crítico (Hard RT), no cumplir un deadline exacto (tardar de más) implica una falla catastrófica del sistema (ej. un freno ABS o un marcapasos). En el Blando (Soft RT), si se pasa el deadline, se degrada la calidad del servicio pero el sistema no colapsa (ej. un poco de lag en un streaming de video).',
        },
        {
            type: 'Desarrollo',
            question: 'Compará la técnica de Polling (encuesta permanente) contra el uso de Interrupciones.',
            answer: 'En el Polling, el procesador gasta ciclos constantemente preguntando a los periféricos si necesitan atención, perdiendo muchísimo tiempo de trabajo útil. Con el modelo de Interrupciones, la CPU hace lo suyo hasta que un dispositivo le envía una señal física forzándola a detenerse y atender el requerimiento, optimizando radicalmente el uso del tiempo.',
        },
        {
            type: 'Desarrollo',
            question: 'Explicá qué sucede cuando se presiona una tecla o llega una interrupción de hardware, utilizando el concepto de Vector de Interrupciones.',
            answer: 'El hardware envía una señal (IRQ), la CPU interrumpe lo que está haciendo, guarda su contexto para no perder datos, y utiliza esa IRQ para consultar el Vector de Interrupciones. Esta es una tabla en RAM de donde obtiene la dirección exacta en memoria de la Rutina de Atención a Interrupción (RAI o handler) para ese dispositivo. Luego, ejecuta ese código y vuelve a lo que estaba haciendo.',
        },
        {
            type: 'V/F',
            question: '¿Una interrupción de tipo NMI (Non-Maskable Interrupt) puede ser ignorada por el procesador si este se encuentra ejecutando una sección crítica de código?',
            answer: 'Falso',
            explanation: 'Las NMI, por definición, no son enmascarables. El hardware de la CPU garantiza que se atiendan de forma inmediata, ya que suelen estar asociadas a fallos críticos de hardware (como pérdida de energía o errores de memoria) que no permiten postergación.'
        },
        {
            type: 'V/F',
            question: 'En el manejo secuencial de interrupciones, ¿una interrupción de alta prioridad puede detener la ejecución de una RAI de baja prioridad que ya estaba en curso?',
            answer: 'Falso',
            explanation: 'Eso ocurre en el manejo ANIDADO. En el secuencial, las interrupciones se atienden estrictamente de a una; cualquier otra interrupción queda pendiente hasta que la actual finalice, sin importar su prioridad.'
        },
        {
            type: 'Desarrollo',
            question: '¿Cuáles son las dos condiciones principales para que ocurra el anidamiento (nesting) de interrupciones?',
            answer: '1. Que la nueva interrupción tenga un nivel de prioridad MAYOR a la que se está ejecutando. 2. Que el sistema (hardware y SO) soporte y tenga habilitadas las interrupciones anidadas, permitiendo que la CPU sea interrumpida mientras ya está dentro de una RAI.'
        }
    ],
    lab: {
        language: 'C (A puro pulmón)',
        task: 'Armate un mini-shell que no se rompa al primer fork(). Si no usás wait() te quedan procesos zombie y el profe te liquida.',
    },
    conversation: {
        id: 'debate-kernel',
        title: 'La Gran Pelea: Monolítico vs Microkernel',
        topic: 'Tanenbaum vs Torvalds (1992 USENET Archive)',
        messages: [
            {
                role: 'expert',
                name: 'Andrew Tanenbaum',
                message: 'Linus, Linux es un anacronismo. Escribir un kernel monolítico en 1991 es un error de diseño gigante. Es como volver a los 70. El futuro es el Microkernel: modular, elegante y robusto. Linux es obsoleto antes de nacer.',
            },
            {
                role: 'student',
                name: 'Linus Torvalds',
                message: 'Andrew, desde un punto de vista teórico-académico, capaz tenés razón. Pero desde el punto de vista práctico, los microkernels son un desastre de performance. Linux funciona ACÁ Y AHORA, y es rápido. Tus microkernels son un sueño de laboratorio que nadie usa.',
                isRight: true,
            },
            {
                role: 'expert',
                name: 'Andrew Tanenbaum',
                message: '¡La performance no es excusa para un diseño pobre! Si un driver de video falla en Linux, se cae TODO el sistema. En un Microkernel, el driver es un proceso más. La seguridad y la portabilidad valen más que unos milisegundos.',
            },
            {
                role: 'student',
                name: 'Linus Torvalds',
                message: 'Portabilidad es lo que hacés cuando no podés hacer que tu SO corra bien en ningún lado. Mi kernel es monolítico porque es lo que hace que el hardware rinda al máximo. Avísame cuando MINIX sea algo más que un juguete para estudiantes de Sistemas.',
                isRight: true,
            }
        ],
        conclusion: {
            winner: 'Linus Torvalds',
            explanation: 'Aunque Tanenbaum tenía razón técnica sobre la robustez (Microkernel), Linus ganó "en la calle". El enfoque pragmático y performante del kernel monolítico de Linux permitió que escalara y dominara el mundo, mientras que los microkernels puros quedaron relegados a nichos específicos o investigación, demostrando que en Sistemas Operativos, la velocidad y la adopción real mandan sobre la elegancia teórica.'
        }
    },
    challenge: {
        id: 'shell-basico',
        title: 'Desafío Práctico: C (A puro pulmón)',
        description: 'Implementar un mini-shell básico en C que use fork(), execvp() y wait().',
        task: 'Tu tarea es escribir un programa en C que lea una línea de comando del usuario, cree un proceso hijo para ejecutar ese comando y espere a que termine antes de pedir el siguiente comando. El shell debe terminar si el usuario escribe "exit".',
        hints: [
            'Usá `fgets` para leer la entrada del usuario.',
            'Recordá limpiar el salto de línea (`\\n`) al final del comando.',
            'Usá `strtok` para separar el comando de sus argumentos.',
            'No te olvides del `wait(NULL)` para evitar procesos zombies.'
        ],
        solutionCode: {
            language: 'c',
            code: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/wait.h>

int main() {
    char command[100];
    char *args[10];

    while (1) {
        printf("so-shell> ");
        if (fgets(command, sizeof(command), stdin) == NULL) break;
        
        // Limpiar el \\n
        command[strcspn(command, "\\n")] = 0;

        if (strcmp(command, "exit") == 0) break;

        if (fork() == 0) {
            // Proceso Hijo
            char *token = strtok(command, " ");
            int i = 0;
            while (token != NULL) {
                args[i++] = token;
                token = strtok(NULL, " ");
            }
            args[i] = NULL;
            execvp(args[0], args);
            perror("Error en execvp");
            exit(1);
        } else {
            // Proceso Padre
            wait(NULL);
        }
    }
    return 0;
}`
        }
    },
    animations: [
        {
            id: 'interrupt',
            title: 'El Viaje de la Interrupción',
            description: 'Mirá cómo el hardware le pega el grito al kernel y el handler trata de que no explote nada.',
        }
    ],
};
