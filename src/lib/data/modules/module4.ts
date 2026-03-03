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
        language: 'C',
        task: 'Simulador de Deadlock en C. Implementá un programa que genere un bloqueo mutuo entre dos hilos usando Mutexes, y luego intentá resolverlo rompiendo la Espera Circular o usando un orden de adquisición jerárquico.',
    },
    animations: [
        {
            id: 'deadlock',
            title: 'Simulador de Deadlock',
            description: 'Visualizá un Grafo de Asignación de Recursos y detectá ciclos mortales.',
            instructions: [
                'Añadí procesos y recursos al sistema mediante los controles.',
                'Creá aristas de "Asignación" (el recurso lo tiene el proceso) o "Petición".',
                'Ejecutá el algoritmo de detección paso a paso.',
                'Observá si se forma un ciclo resaltado en rojo, lo que indica un abrazo mortal (Deadlock).'
            ],
        },
        {
            id: 'producer-consumer',
            title: 'Productor - Consumidor',
            description: 'Mirá cómo el buffer acotado y los semáforos controlan el flujo de datos.',
            instructions: [
                'Hacé que el productor inserte "items" en el buffer compartido.',
                'Hacé que el consumidor extraiga "items".',
                'Observá los valores de los semáforos: `empty`, `full` y el `mutex`.',
                'Tratá de consumir cuando el buffer está vacío o producir cuando está lleno para ver cómo se bloquean.'
            ],
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
        },
        {
            type: 'V/F',
            question: 'Implementar semáforos mutex con espera activa aumenta la posibilidad de ocurrencia de deadlocks.',
            answer: 'Verdadero',
            explanation: 'En un sistema monoprocesador, si un proceso hace un P() sobre un semáforo con espera activa, se queda en un bucle infinito consumiendo CPU. El proceso que necesita el procesador para liberar ese semáforo no puede ejecutarse porque el otro acapara la CPU, generando un bloqueo que no ocurriría con espera pasiva (bloqueo en cola).'
        },
        {
            type: 'V/F',
            question: 'El uso de recursos consumibles no genera deadlock.',
            answer: 'Falso',
            explanation: 'Un recurso consumible (ej: un mensaje) sí puede generar deadlock. Ejemplo: el proceso A envía con send() bloqueante y espera que B lo reciba, pero B también necesita que A reciba algo primero. Ambos quedan bloqueados indefinidamente esperando al otro.'
        },
        {
            type: 'V/F',
            question: 'Si en un sistema hay 4 procesos y 3 recursos compartidos entre sí (2 procesadores y un buffer de memoria) entonces se pueden cumplir las condiciones de Coffman y producir un deadlock.',
            answer: 'Falso',
            explanation: 'Los procesadores son administrados por el planificador del SO, no son recursos que los procesos "retengan" como un mutex. Descartando los 2 procesadores, queda solo 1 recurso (el buffer). Para que haya deadlock se necesitan al menos 2 procesos y 2 recursos para que exista espera circular.'
        },
        {
            type: 'V/F',
            question: '¿Pueden 3 procesos que comparten 5 archivos ejecutarse en forma concurrente?',
            answer: 'Verdadero',
            explanation: 'Sí, si se cumplen las condiciones de Bernstein: (1) El conjunto de lectura de cada proceso tiene intersección nula con el conjunto de escritura de los otros, (2) Los conjuntos de escritura de todos los procesos son mutuamente disjuntos. Si todos leen sin escribir, o escriben en archivos distintos, pueden ejecutarse concurrentemente sin problemas.'
        },
        {
            type: 'V/F',
            question: 'No es posible la ocurrencia de un deadlock si el sistema operativo es monoprogramado.',
            answer: 'Verdadero',
            explanation: 'En un sistema monoprogramado, los procesos se ejecutan secuencialmente: hasta que un proceso no finaliza, no se inicia otro. No puede haber espera circular entre procesos si solo hay uno en memoria a la vez.'
        },
        {
            type: 'V/F',
            question: 'Es imposible que ocurra una race condition entre dos hilos ULT de un mismo proceso.',
            answer: 'Falso',
            explanation: 'Los hilos ULT comparten el mismo espacio de memoria del proceso. Si dos hilos intentan escribir en la misma variable sin sincronización adecuada, se produce una race condition. Que sean ULT no los exime de los problemas de concurrencia.'
        },
        {
            type: 'V/F',
            question: 'Si un sistema es multiprocesador monoprogramado (por procesador), no existe posibilidad de que se produzca un deadlock.',
            answer: 'Falso',
            explanation: 'Aunque solo haya un proceso por procesador, puede haber dos procesos ejecutándose en procesadores distintos que necesiten el mismo recurso compartido. Si ambos retienen un recurso y esperan el del otro, se produce un deadlock clásico.'
        },
        {
            type: 'V/F',
            question: 'Si la implementación de las primitivas V() y P() utilizadas para sincronizar no fueran atómicas, entonces la probabilidad de deadlock aumentaría.',
            answer: 'Verdadero',
            explanation: 'Las primitivas P() y V() se usan para exclusión mutua y coordinación. Si no son atómicas, dos procesos podrían ejecutar partes de la operación de forma intercalada, corrompiendo el valor del semáforo. Esto podría llevar a que un recurso nunca se libere o que dos procesos accedan simultáneamente, generando condiciones de carrera y potenciales deadlocks.'
        }
    ]
};

