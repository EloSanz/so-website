import { Module } from '../types';

export const module2: Module = {
    id: '2',
    title: 'Procesos: Vida y Obra',
    unit: 'Entidades Activas',
    advancedFocus: 'Un proceso es mucho más que código; es un ecosistema vivo con registros, memoria y un DNI llamado PCB.',
    topics: [
        {
            id: 'programa-vs-proceso',
            title: 'Programa vs Proceso',
            content: {
                description: 'La diferencia entre una receta de cocina (estática) y el cocinero preparando el plato (dinámica).',
                items: [
                    'Programa: Entidad pasiva, un archivo en disco esperando ser llamado.',
                    'Proceso: Entidad activa, un programa cargado en RAM junto con su contexto de ejecución.',
                    'Dato: Un mismo programa puede generar varios procesos (ej: tres ventanas de Chrome).'
                ],
                highlight: 'Concepto clave: El programa es siempre igual, el proceso cambia de estado y datos constantemente.'
            }
        },
        {
            id: 'ciclo-codigo',
            title: 'Del Código al Cargador (Loader)',
            content: {
                description: '¿Cómo pasa un `.c` a ser un proceso corriendo?',
                items: [
                    'Compilador: Traduce código fuente a código objeto (lenguaje intermedio).',
                    'Link-Editor: Une los objetos con las bibliotecas (los #include) y genera el Ejecutable.',
                    'Loader: El módulo del SO que lee el ejecutable del disco y lo mete en la RAM.',
                    'Direccionamiento: El Loader puede traducir direcciones simbólicas a físicas si es necesario.'
                ]
            }
        },
        {
            id: 'pcb',
            title: 'PCB: El Bloque de Control',
            content: {
                description: 'Es el "DNI" o estructura de datos donde el SO anota todo sobre un proceso.',
                items: [
                    'Contexto de Ejecución: Registros de CPU, Stack Pointer y el Program Counter (PC).',
                    'Info de I/O: Archivos abiertos, sockets y dispositivos asignados.',
                    'Privilegios: ¿Qué tiene permitido hacer este proceso?',
                    'Estadísticas: Tiempo de CPU usado, prioridad, etc.'
                ],
                highlight: 'Sin el PCB, el cambio de contexto sería imposible porque no sabríamos dónde retomarlo.'
            }
        },
        {
            id: 'estados',
            title: 'Diagrama de los 5 Estados',
            content: {
                description: 'El ciclo de vida de un proceso desde que nace hasta que muere.',
                items: [
                    'NUEVO: Se está creando el PCB.',
                    'LISTO: Está en la cola esperando que el planificador le dé la CPU.',
                    'EJECUCIÓN: Está usando el procesador en este preciso instante.',
                    'BLOQUEADO: Esperando un evento externo (ej: que el usuario toque una tecla o termine la I/O).',
                    'TERMINADO: Ya no compite por CPU, pero el SO todavía tiene su PCB para estadísticas.'
                ],
                highlight: 'Pregunta de examen: Si un proceso en Ejecución agota su tiempo (Quantum), pasa a LISTO, no a Bloqueado.'
            }
        },
        {
            id: 'context-switch',
            title: 'Cambio de Contexto y Jerarquía',
            content: {
                description: 'El arte de saltar de un proceso a otro sin romper nada.',
                items: [
                    'Context Switch: Guardar el [[PCB|Process Control Block: La estructura de datos del kernel que guarda el estado de un proceso (registros, PC, etc.)]] del proceso A y cargar el del proceso B.',
                    'Jerarquía: El proceso "Padre" crea "Hijos" usando `fork()`.',
                    'Contexto vs Proceso: Una [[RAI|Rutina de Atención a Interrupción]] puede cambiar el contexto sin cambiar de proceso (modo kernel).'
                ]
            }
        },
        {
            id: 'threads',
            title: 'Hilos o Hebras (Threads)',
            content: {
                description: 'Procesos livianos: compartir es vivir.',
                items: [
                    'Un hilo es la unidad básica de ejecución que vive dentro de un proceso. Comparten el mismo [[PCB|Process Control Block]] pero cada uno tiene su propio flujo.',
                    '[[TCB|Thread Control Block]]: Estructura de datos que guarda el estado propio de cada hilo (registros, PC y stack).',
                    '[[ULT|User Level Threads]]: Hilos gestionados por una librería de usuario sin intervención del kernel. El cambio es ultra rápido pero una syscall bloqueante frita a todo el proceso.',
                    '[[KLT|Kernel Level Threads]]: Hilos que el kernel conoce y planifica. Permiten paralelismo real en multinúcleo y si uno se bloquea, el kernel puede ejecutar otro.',
                    'Jacketing: La solución técnica para que un ULT no bloquee a todo el proceso. Una rutina que envuelve la llamada al sistema para interceptarla y pasarle la bola a otro hilo.',
                    'Modelos: [[Workers|Un hilo servidor reparte laburo a hilos esclavos]], [[Teams|Todos los hilos trabajan a la par sobre un pool de datos]] y [[Pipelines|Hilos en serie: la salida de uno es la entrada del otro]].'
                ],
                highlight: 'Pregunta de Oro: ¿Cómo solucionás el bloqueo total en ULT? ¡Con [[Jacketing | Jacket Routines]]! Una "chaqueta" que protege al proceso de quedar bloqueado por una syscall.'
            }
        }
    ],
    lab: {
        language: 'C',
        task: 'Script con `ps` y `top` para identificar procesos huérfanos y un programa en C que haga un `fork()` y muestre el PID del padre y del hijo.'
    },
    animations: [
        {
            id: 'process-states',
            title: 'El Baile de los Estados',
            description: 'Interactuá con un proceso para verlo saltar entre Listo, Ejecución y Bloqueado según las interrupciones que le tires.'
        }
    ],
    examQuestions: [
        {
            type: 'V/F',
            question: '¿Un hilo (thread) tiene su propio espacio de direccionamiento de memoria independiente?',
            answer: 'Falso',
            explanation: 'Los hilos de un mismo proceso comparten el espacio de memoria, lo que facilita la comunicación pero requiere sincronización.'
        },
        {
            type: 'V/F',
            question: '¿Cuando un proceso agota su Quantum (tiempo de CPU) pasa al estado Bloqueado?',
            answer: 'Falso',
            explanation: 'Pasa al estado LISTO. Al estado bloqueado solo se va si el proceso pide algo que tarda (I/O) o espera un evento.'
        },
        {
            type: 'Desarrollo',
            question: 'Explicá la diferencia entre ULT y KLT respecto a qué pasa cuando un hilo hace una System Call bloqueante.',
            answer: 'En ULT, si un hilo se bloquea, el SO bloquea a TODO el proceso porque no sabe que hay otros hilos. En KLT, el SO puede bloquear solo a ese hilo y dejar que los demás sigan ejecutando.'
        },
        {
            type: 'Desarrollo',
            question: '¿Qué información mínima debe guardarse en un Context Switch?',
            answer: 'Se deben guardar los registros de la CPU, el Program Counter (PC) para saber qué instrucción seguía, y el Stack Pointer del proceso que sale.'
        }
    ]
};
