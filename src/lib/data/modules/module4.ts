import { Module } from '../types';

export const module4: Module = {
    id: '4',
    title: 'Concurrencia: ¡Muchachos, no se traben!',
    unit: 'Unidad 4: Concurrencia y Mecanismos de Sincronización',
    advancedFocus: 'Semáforos, IPC y el Algoritmo del Banquero. Si el Banquero te dice que no, ni se te ocurra pedirle un recurso más.',
    topics: [
        {
            id: 'contextos',
            title: 'Contextos: ¿Juntos o Amontonados?',
            content: {
                description: 'Antes de meternos con semáforos, hay que entender cómo "viven" los procesos en el tiempo. No es lo mismo ir uno atrás del otro que intentar hacer todo a la vez.\n\nImaginá que estás cocinando un asado para los pibes:',
                items: [
                    '**Secuencialidad**: Sos vos solo haciendo todo en orden. Primero prendés el fuego, cuando el fuego está listo ponés la carne, cuando la carne está lista servís. Si te olvidaste el carbón, todo se frena hasta que vuelvas.',
                    '**Concurrencia**: Sos vos solo pero con 5 platos a la vez. Ponés la carne, mientras se hace cortás la ensalada, mientras cortás chequeás el fuego. No estás haciendo dos cosas al mismo tiempo (tenés dos manos nada más), pero vas saltando tan rápido entre tareas que parece que sí.',
                    '**Paralelismo**: Le pediste ayuda a un amigo (otro core de CPU). Él se encarga de la ensalada mientras vos te encargás del fuego. Acá sí hay dos cosas sucediendo en el mismo instante del tiempo real.',
                    '**Asincronismo**: Pedís una pizza por delivery. No te quedas mirando la puerta hasta que llegue; seguís poniendo la mesa o mirando el partido hasta que suene el timbre (interrupt/callback).'
                ],
                highlight: 'Dato técnico: La concurrencia es una propiedad del diseño (el código puede lidiar con varias cosas), el paralelismo es una propiedad de la ejecución (el hardware tiene más de una unidad de procesamiento).'
            }
        },
        {
            id: 'conceptos',
            title: 'Sincronización vs Comunicación',
            content: {
                description: 'Cuando tenés a varios procesos laburando juntos (cooperativos), aparecen dos necesidades básicas. Sincronizar es "ponerse de acuerdo en el cuándo" y Comunicar es "pasarse los datos".\n\nSin sincronización, la concurrencia es un caos. Es como si en el asado todos quisieran usar el mismo cuchillo al mismo tiempo sin preguntarse; alguien va a terminar cortado.',
                items: [
                    'Sincronización: Controlar el orden de acceso. Es el control de tráfico para evitar choques en la RAM.',
                    'Comunicación: El intercambio de información. Puede ser mediante memoria compartida o señales del kernel.',
                    'Condición de Carrera: El bug más difícil de encontrar. El resultado cambia según quién ganó la "carrera" por llegar primero al recurso.',
                    'Exclusión Mutua: El principio sagrado. Si yo estoy usando la variable `saldo`, vos esperás afuera hasta que yo termine.'
                ],
                highlight: 'La sincronización es el patovica que cuida la puerta de la Sección Crítica para que no entre más de uno a la vez.'
            }
        },
        {
            id: 'carrera',
            title: 'Condiciones de Carrera y Bernstein',
            content: {
                description: 'Las condiciones de carrera son el "efecto Mandela" de los sistemas operativos. Vos jurás que la variable valía 10, pero de repente vale 5 porque otro proceso se metió en el medio mientras vos pestañeabas.\n\nEs como cuando dos personas intentan lavar la ropa al mismo tiempo: uno mete la ropa blanca y el otro mete un jean azul sin mirar. El resultado final depende de quién llegó primero al lavarropas.',
                code: {
                    language: 'C (POSIX Threads)',
                    snippet: '// Che, mirá este código... ¿Qué pasa si lo corremos así nomás? \n// ¿La cazás?\n\n#include <pthread.h>\n#include <stdio.h>\n\nint contador = 0;\n\nvoid* sumar(void* arg) {\n    for (int i = 0; i < 100000; i++) {\n        contador++; // Sección Crítica sin protección\n    }\n    return NULL;\n}\n\nint main() {\n    pthread_t h1, h2;\n    pthread_create(&h1, NULL, sumar, NULL);\n    pthread_create(&h2, NULL, sumar, NULL);\n    pthread_join(h1, NULL);\n    pthread_join(h2, NULL);\n    printf("Resultado esperado: 200000\\n");\n    printf("Resultado real: %d\\n", contador);\n    return 0;\n}',
                    revealQuestion: "¿Qué muestra la consola?",
                    revealAnswer: "¡No sabemos! Es indeterminado. El resultado será menor a 200.000 porque los hilos se pisan al incrementar."
                },
                items: [
                    'Conjunto de Lectura (L): Variables que el proceso solo mira.',
                    'Conjunto de Escritura (E): Variables que el proceso modifica.',
                    'Regla 1: El E de uno no puede solaparse con el L del otro.',
                    'Regla 2: Los conjuntos de Escritura (E) de ambos deben ser totalmente disjuntos.'
                ],
                highlight: 'Si se cumplen las 3 condiciones de Bernstein, la ejecución en paralelo dará el mismo resultado que una serie.'
            }
        },
        {
            id: 'semaforos',
            title: 'Semáforos 🚦',
            content: {
                description: 'El mecanismo de sincronización por excelencia inventado por Dijkstra. Es un entero con esteroides que sirve para que los procesos hagan fila de forma civilizada.\n\nImaginalo como el sistema de turnos de una carnicería: si no hay número, no te atienden, y si el carnicero está ocupado (valor = 0), te tenés que quedar sentado esperando.',
                items: [
                    'Operación P (Wait): Intenta decrementar. Si es 0, el proceso se bloquea en una cola de espera.',
                    'Operación V (Signal): Incrementa el valor. Si había procesos esperando, despierta a uno (lo pasa a LISTO).',
                    'Mutex: Un semáforo binario (0 o 1) usado exclusivamente para exclusión mutua.',
                    'Contadores: Permiten el acceso a N instancias de un recurso (ej: 5 conexiones simultáneas).'
                ],
                highlight: 'Importante: Las operaciones P y V son **atómicas**. No pueden ser interrumpidas a la mitad por el scheduler.'
            }
        },
        {
            id: 'ipc',
            title: 'Mecanismos de IPC',
            content: {
                description: '¿Cómo se hablan los procesos? El SO ofrece buzones y canales de comunicación.',
                items: [
                    'Memoria Compartida: La más rápida. Los procesos ven el mismo pedazo de RAM (necesitan semáforos sí o sí).',
                    'Pasaje de Mensajes: El kernel hace de cartero. Más lento pero más seguro y fácil de programar.',
                    'Sincronía: Bloqueante (esperás hasta que te respondan) vs No Bloqueante (tirás el mensaje y seguís).',
                    'Direccionamiento: Directo (le hablás al PID) vs Indirecto (escribís en un buzón o "mailbox").'
                ],
                highlight: 'Productor-Consumidor: El problema clásico donde un buffer acotado une a dos procesos con distintos ritmos.'
            }
        },
        {
            id: 'deadlocks',
            title: 'Bloqueos (Deadlocks)',
            content: {
                description: 'El deadlock es el "duelo mexicano" (Mexican Standoff) de la computación. Dos procesos se apuntan con un recurso y ninguno quiere soltar el suyo para que el otro pueda avanzar.\n\nEs el clásico: "Para tener experiencia necesito laburo, pero para tener laburo necesito experiencia". Te quedás trabado en un loop infinito de miseria.',
                items: [
                    'Exclusión Mutua: El recurso es de uso único (ej: una impresora).',
                    'Posesión y Espera: Tengo algo y pido más sin soltar lo que ya tengo.',
                    'No Expropiación: El SO no me puede sacar el recurso por la fuerza.',
                    'Espera Circular: El proceso A espera al B, el B al C, y el C al A. Game Over.'
                ],
                highlight: 'Algoritmo del Banquero: Una estrategia de detección para evitar entrar en un "estado inseguro".'
            }
        },
    ],
    lab: {
        language: 'Java / POSIX Threads',
        task: 'Implementar el problema de los Filósofos Comensales usando semáforos para evitar el Deadlock (espera circular).',
    },
    animations: [
        {
            id: 'deadlock',
            title: 'Simulador de Deadlock',
            description: 'Visualizá un Grafo de Asignación de Recursos y detectá ciclos mortales.',
        },
        {
            id: 'producer-consumer',
            title: 'Productor - Consumidor',
            description: 'Mirá cómo el buffer acotado y los semáforos controlan el flujo de datos.',
        }
    ],
    examQuestions: [
        {
            type: 'V/F',
            question: 'En un semáforo, la operación V (Signal) puede bloquear al proceso que la ejecuta.',
            answer: 'F',
            explanation: 'La operación V siempre incrementa el valor o despierta a alguien; no es bloqueante. La bloqueante es P (Wait).'
        },
        {
            type: 'Desarrollo',
            question: '¿Cuáles son las 4 condiciones necesarias de Coffman para que exista un Deadlock?',
            answer: 'Exclusión Mutua, Posesión y Espera, No Expropiación, y Espera Circular.',
            explanation: 'Si eliminamos cualquiera de estas condiciones, el Deadlock es imposible.'
        },
        {
            type: 'V/F',
            question: 'La Sincronización y la Comunicación son exactamente el mismo concepto en Sistemas Operativos.',
            answer: 'F',
            explanation: 'Sincronizar es ordenar el acceso en el tiempo (control de tráfico), Comunicar es transferir datos (intercambio de info).'
        }
    ]
};

