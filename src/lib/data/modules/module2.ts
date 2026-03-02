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
                description: '¿Cómo pasa un `.c` a ser un proceso corriendo? El viaje de la compilación a la RAM.',
                items: [
                    'Compilador: Traduce código fuente a código objeto (lenguaje intermedio).',
                    'Link-Editor: Une los objetos con las bibliotecas (los #include) y genera el Ejecutable.',
                    'Loader: El módulo del SO que lee el ejecutable del disco y lo mete en la RAM.',
                    'Direccionamiento Absoluto: Direcciones fijas (ej: "Ir a la celda 1000"). Imposible de usar en multiprogramación porque no sabés qué procesos ya están en memoria.',
                    'Direccionamiento Relativo (Lógico): El programa se cree dueño de la memoria desde la dirección 0. Usa un "desplazamiento" (offset).',
                    'Relocalización: El Loader o la [[MMU|Memory Management Unit: Componente de hardware que traduce direcciones lógicas a físicas y maneja la protección de memoria.]] traducen la dirección relativa a una física real cuando el proceso se carga.'
                ],
                highlight: '¿Por qué relativo? Porque permite que un programa se cargue en cualquier parte de la RAM sin tener que recompilarlo cada vez.'
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
            id: 'jerarquia',
            title: 'La Familia: Fork y Jerarquía',
            content: {
                description: '¿Cómo "nacen" los procesos? No aparecen de la nada, se clonan de un padre.',
                items: [
                    'Llamada `fork()`: El sistema crea un duplicado exacto del proceso padre. El hijo hereda una copia del [[PCB|Process Control Block: La estructura de datos del kernel que guarda el estado de un proceso (registros, PC, etc.)]] pero con su propio PID (Process ID) y el PPID (Parent PID) apuntando al padre.',
                    'Copy-on-Write (COW): El SO es eficiente. El hijo NO recibe una copia física de la RAM de entrada. Ambos comparten las mismas páginas de memoria de forma "Solo Lectura". Recién cuando alguno quiere escribir (modificar un dato), el hardware genera una excepción y el kernel duplica esa página específica. ¡Optimización pura!',
                    'Zombies: Si un hijo hace `exit()`, el SO destruye su RAM pero mantiene su PCB en la tabla de procesos esperando que el padre haga un `wait()`. Si el padre se cuelga y no lo reconoce, el hijo queda como un "Zombie".',
                    'Huérfanos: Si el padre muere antes que el hijo, el hijo queda "Huérfano". El proceso `init` (o `systemd`, PID 1) adopta a todos los huérfanos para asegurar que alguien los limpie cuando terminen.'
                ],
                highlight: 'Pregunta de Oro: ¿Si padre e hijo quieren usar el mismo micro, hay context switch? ¡SÍ! Aunque compartan memoria (COW), son procesos distintos con espacios de direccionamiento lógicos independientes. El SO debe hacer un **Process Context Switch** completo para cambiar de uno a otro.'
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
                    'Modelos: [[Workers|Un hilo servidor reparte laburo a hilos esclavos]], [[Teams|Todos los hilos trabajan a la par sobre un pool de datos]] y [[Pipelines|Hilos en serie: la salida de uno es la entrada del otro]].',
                    'Thread Context Switch: Es el cambio de contexto "liviano". Si pasamos de un hilo A a un hilo B del MISMO proceso, no hace falta cambiar las tablas de páginas en la [[MMU|Memory Management Unit]] ni vaciar la cache ([[TLB|Translation Lookaside Buffer: Una cache de alta velocidad dentro de la CPU que almacena las traducciones más recientes de direcciones virtuales a físicas.]]), porque comparten la RAM. Solo se guardan los registros y el PC. ¡Es órdenes de magnitud más rápido que un cambio entre procesos!'
                ],
                highlight: 'Pregunta de Oro: ¿Cómo solucionás el bloqueo total en ULT? ¡Con [[Jacketing|Jacket Routines]]! Una "chaqueta" que protege al proceso de quedar bloqueado por una syscall.'
            }
        },
        {
            id: 'ipc-conceptos',
            title: 'IPC: Comunicación entre Procesos',
            content: {
                description: '¿Cómo se hablan dos procesos? No pueden gritarse de una RAM a otra sin permiso del kernel.',
                items: [
                    'Memoria Compartida: Un área común donde ambos escriben y leen. Es rapidísimo pero requiere sincronización manual (semáforos) para no romper nada.',
                    'Pasaje de Mensajes: El SO hace de cartero. Los procesos se envían copias de datos. Es más seguro y fácil de programar, pero más lento por las copias.',
                    'Mensaje (MSG): Porción discreta de datos con Cabecera (sender, receiver, longitud, tipo) y Cuerpo.',
                    'Comunicación Directa: Los procesos se nombran explícitamente (ej: send(P, mensaje)).',
                    'Comunicación Indirecta: Se usa un buzón intermedio (Mailbox). Cualquiera con permiso puede dejar o sacar mensajes de ahí.'
                ],
                highlight: 'Clave: El propósito de IPC es permitir que dos procesos se sincronicen o intercambien datos de forma explícita.'
            }
        },
        {
            id: 'ipc-sincronizacion',
            title: 'Sincronización de Mensajes',
            content: {
                description: '¿Qué pasa si el receptor no está listo o el emisor tiene mil cosas para mandar?',
                items: [
                    'Sincrónica (Bloqueante): El emisor se queda clavado hasta que se recibe el mensaje. El receptor se bloquea hasta que llega algo.',
                    'Asincrónica (No Bloqueante): Cada uno sigue su vida. El emisor manda y sigue; el receptor mira si hay algo y si no, sigue laburando.',
                    'Semi-sincrónica: Típico send no bloqueante con receive bloqueante. Ojo: si el productor va muy rápido, las colas de mensajes explotan.'
                ]
            }
        },
        {
            id: 'productor-consumidor',
            title: 'Modelo Productor-Consumidor',
            content: {
                description: 'El problema clásico de la computación concurrente.',
                items: [
                    'Productor: Genera datos y los deposita en un Buffer (zona de memoria intermedia).',
                    'Consumidor: Retira datos del buffer y los procesa.',
                    'Buffer: Amortigua la diferencia de velocidad. Si se llena, el productor debe esperar; si se vacía, el consumidor se frena.',
                    'Ejemplos Reales: El comando `ls | more` (la salida de uno es la entrada del otro) o el Spooler de impresión.'
                ],
                highlight: 'Dato técnico: El Buffer suele ser una cola circular FIFO (First In, First Out).'
            }
        },
        {
            id: 'algoritmos-ipc',
            title: 'Algoritmos y Soluciones',
            content: {
                description: 'Tratando de que el productor y el consumidor no choquen en el mismo buffer.',
                items: [
                    'Sleep & Wakeup: El más simple pero PELIGROSO. Si una señal de wakeup se manda justo cuando el otro se está por dormir pero todavía no lo hizo, la señal se pierde y ambos pueden quedar dormidos para siempre (Race Condition).',
                    'Contadores de Eventos: Variables que solo suben (read, advance, await). Evitan las condiciones de carrera porque no dependen de un estado momentáneo sino de un conteo acumulativo.',
                    'Semáforos (Dijkstra): La solución elegante. Usamos 3 semáforos: Mutex (para que solo uno toque el buffer), Vacío (cuenta huecos libres) y Lleno (cuenta elementos listos).'
                ],
                highlight: 'Mecanismos IPC Reales: Pipes, FIFOs, Señales, Memoria Compartida, Sockets y RPC/RMI.'
            }
        }
    ],
    conversation: {
        id: 'debate-procesos',
        title: 'User123 vs KernelMaster',
        topic: '¿Un proceso hijo comparte TODO con el padre?',
        messages: [
            {
                role: 'student',
                name: 'User123',
                message: 'Che, una duda. Si hago fork(), el hijo es un clon exacto, no? Entonces si el padre tiene un giga de RAM usado, el hijo de golpe me morfa otro giga al nacer? Es un bajón si es así.',
                isRight: false
            },
            {
                role: 'expert',
                name: 'KernelMaster',
                message: '¡Ojo con eso! No es tan así. El SO es más bicho. Al principio no copia nada físico, solo las tablas de páginas. Usan [[Copy-on-Write|Copy-on-Write: Técnica de optimización donde el hijo comparte la memoria del padre como solo lectura, y la copia real solo ocurre cuando uno intenta modificar un dato.]] (COW). Solo si el hijo quiere escribir algo, ahí el hardware se aviva y le hace una copia de esa paginita puntual.',
                isRight: true
            },
            {
                role: 'student',
                name: 'User123',
                message: 'Ahhh, entonces de entrada comparten la RAM física. ¿Y si el padre muere? ¿El hijo se queda sin RAM?',
                isRight: false
            },
            {
                role: 'expert',
                name: 'KernelMaster',
                message: 'No, son independientes emocionalmente (?). Si el padre muere, el hijo queda [[Huérfano|Proceso cuyo padre ha terminado su ejecución antes que él. Es adoptado por el proceso init (PID 1).]], pero su memoria sigue ahí. La copia COW ya se habrá hecho para lo que haga falta o simplemente heredó el derecho a usar esas páginas. Y si el hijo muere antes, recordá que queda como [[Zombie|Proceso que ya terminó pero sigue en la tabla de procesos porque su padre todavía no leyó su código de salida con wait().]] hasta que el padre lo reconozca.',
                isRight: true
            }
        ],
        conclusion: {
            winner: 'KernelMaster',
            explanation: 'KernelMaster aclaró que el fork() es eficiente gracias a COW y explicó qué pasa con la memoria y el ciclo de vida (huérfanos/zombies) de forma precisa.'
        }
    },
    lab: {
        language: 'Consola Linux',
        task: 'Aprendé a ver qué está pasando realmente en tu sistema Linux, identificando la diferencia entre procesos y hilos desde la consola.'
    },
    animations: [
        {
            id: 'process-states',
            title: 'El Baile de los Estados',
            description: 'Interactuá con un proceso para verlo saltar entre Listo, Ejecución y Bloqueado según las interrupciones que le tires.'
        }
    ],
    guidedLabs: [
        {
            id: 'ps-top-lab',
            title: 'Exploración de Procesos: ps y top',
            difficulty: 'Medio',
            description: 'Aprendé a ver qué está pasando realmente en tu sistema Linux, identificando la diferencia entre procesos y hilos desde la consola.',
            steps: [
                {
                    id: 'step1',
                    title: 'Monitoreo Dinámico con top',
                    description: 'Abrí una terminal y ejecutá el comando `top`. Observá la tabla de procesos que se actualiza en tiempo real.',
                    command: 'top',
                    explanation: 'En la parte superior verás el "Uptime" y el "Load Average" (carga del sistema de los últimos 1, 5 y 15 min). En la lista de procesos, la columna "S" indica el estado: R (Running), S (Sleeping), T (Stopped) o Z (Zombie).',
                    technicalDetail: 'Si ves un Load Average mayor a la cantidad de CPUs que tenés, el procesador está saturado.'
                },
                {
                    id: 'step2',
                    title: 'Visualización de Hilos (Threads)',
                    description: 'Usamos `ps` con flags específicos para ver cómo un proceso (como Chrome o VS Code) se divide en múltiples hilos.',
                    command: 'ps -eLf',
                    explanation: 'El flag -L añade la columna LWP (Light Weight Process) que es el ID del hilo, y NLWP que indica cuántos hilos tiene ese proceso. Todos los hilos de un proceso comparten el mismo PID (Process ID) pero tienen distinto LWP.',
                    technicalDetail: 'En Linux, los hilos se ven casi igual que los procesos en las tablas del kernel, por eso se les llama LWP.'
                },
                {
                    id: 'step3',
                    title: 'Identificación de Procesos Zombie',
                    description: 'Buscamos procesos que ya terminaron (exit) pero cuyo padre todavía no leyó su código de salida con `wait()`.',
                    command: 'ps aux | grep Z',
                    explanation: 'Un proceso Zombie no consume CPU ni RAM, pero ocupa una entrada en la tabla de procesos. Si el padre no los "limpia", podemos llegar al límite de la tabla de procesos (PID exhaustion).',
                    technicalDetail: 'No podés matar un Zombie con kill -9 porque YA está muerto. Tenés que matar al proceso padre o que este haga el wait().'
                }
            ]
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
            question: 'Si el planificador decide realizar un cambio de contexto (Context Switch) entre un hilo del Proceso A hacia un hilo del Proceso B, ¿este se realiza con un "Thread Context Switch"?',
            answer: 'Falso',
            explanation: 'Aunque el destino sea un hilo, al pertenecer a un PROCESO distinto (B), el kernel debe realizar obligatoriamente un Process Context Switch completo para cambiar el espacio de direccionamiento (tablas de páginas) en la [[MMU|Memory Management Unit]]. El Thread Context Switch solo ocurre entre hilos de un mismo proceso.'
        },
        {
            type: 'V/F',
            question: '¿Cuando un proceso agota su Quantum (tiempo de CPU) pasa al estado Bloqueado?',
            answer: 'Falso',
            explanation: 'Pasa al estado LISTO. Al estado bloqueado solo se va si el proceso pide algo que tarda (I/O) o espera un evento.'
        },
        {
            type: 'V/F',
            question: '¿La solución de Sleep & Wakeup para el problema del Productor-Consumidor garantiza la ausencia de condiciones de carrera (Race Conditions)?',
            answer: 'Falso',
            explanation: 'Es propensa a condiciones de carrera si una señal de wakeup se pierde cuando el proceso receptor aún no se ha dormido pero ya verificó que debía hacerlo, lo que puede llevar a un deadlock.'
        },
        {
            type: 'V/F',
            question: 'En la comunicación indirecta mediante Mailboxes, ¿los procesos deben conocer obligatoriamente el PID del otro para enviarse mensajes?',
            answer: 'Falso',
            explanation: 'No, justamente la ventaja del Mailbox es que actúa como una interfaz intermedia. Un proceso envía al buzón y otro retira de ahí, sin necesidad de referenciarse directamente.'
        },
        {
            type: 'Desarrollo',
            question: 'Explicá la diferencia entre ULT y KLT respecto a qué pasa cuando un hilo hace una System Call bloqueante.',
            answer: 'En ULT, si un hilo se bloquea, el SO bloquea a TODO el proceso porque no sabe que hay otros hilos. En KLT, el SO puede bloquear solo a ese hilo y dejar que los demás sigan ejecutando.'
        },
        {
            type: 'Desarrollo',
            question: 'Mencioná los 3 semáforos necesarios para resolver el modelo Productor-Consumidor y qué función cumple cada uno.',
            answer: '1. Mutex (binario): Garantiza exclusión mutua para que solo un proceso acceda al buffer a la vez. 2. Vacío (contador): Inicializado en N, cuenta los espacios libres disponibles en el buffer. 3. Lleno (contador): Inicializado en 0, cuenta cuántos elementos listos hay para ser consumidos.'
        },
        {
            type: 'Desarrollo',
            question: '¿Qué información mínima debe guardarse en un Context Switch?',
            answer: 'Se deben guardar los registros de la CPU, el Program Counter (PC) para saber qué instrucción seguía, y el Stack Pointer del proceso que sale.'
        },
        {
            type: 'V/F',
            question: 'En la técnica Copy-on-Write (COW), ¿el Sistema Operativo realiza una copia física completa de la memoria RAM del padre al momento exacto de ejecutar fork()?',
            answer: 'Falso',
            explanation: 'COW es perezoso (lazy). Al hacer fork(), padre e hijo comparten las mismas páginas de memoria como "solo lectura". La copia física de una página específica solo se realiza cuando uno de los dos intenta escribir en ella.'
        },
        {
            type: 'Desarrollo',
            question: 'Explicá la diferencia entre un proceso Zombie y un proceso Huérfano.',
            answer: 'Un Zombie es un proceso hijo que ya terminó (exit) pero cuyo padre aún no ha leído su estado (wait()), por lo que sigue ocupando un lugar en la tabla de procesos. Un Huérfano es un proceso cuyo padre murió antes que él; en este caso, el proceso init (PID 1) lo adopta para asegurar su gestión.'
        },
        {
            type: 'V/F',
            question: 'Si un proceso padre y su hijo están compitiendo por el mismo procesador, ¿el SO realiza un "Thread Context Switch" para alternar entre ellos ya que comparten memoria inicial via COW?',
            answer: 'Falso',
            explanation: 'Debe realizar un **Process Context Switch** completo. Aunque compartan memoria física inicialmente, son procesos distintos con espacios de direccionamiento lógicos separados (y sus propias tablas de páginas). Alternar entre ellos requiere un cambio total del contexto del proceso en el kernel y la [[MMU|Memory Management Unit]].'
        }
    ]
};
