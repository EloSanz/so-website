import { Module } from '../types';

export const module3: Module = {
    id: '3',
    title: 'Planificación: La Pelea por la CPU',
    unit: 'El Corazón del SO',
    advancedFocus: 'Acá la teoría se vuelve matemática. Gantt, métricas y algoritmos que deciden quién vive y quién espera.',
    topics: [
        {
            id: 'intro-planificacion',
            title: 'Algoritmos de Planificación 2.0',
            content: {
                description: 'La planificación es el arte de repartir el tiempo de CPU para que nadie se quede con hambre de procesamiento.',
                items: [
                    'Sistemas Cooperativos (Non-Preemptive): El SO no interrumpe. El proceso cede la CPU mediante una instrucción yield o syscall.',
                    'Sistemas Expropiativos (Preemptive): El SO quita el procesador por la fuerza, usando el quantum del timer del hardware.',
                    'Scheduler de Corto Plazo: Decide cuál de los procesos Listos pasa a Ejecución miles de veces por segundo.'
                ]
            }
        },
        {
            id: 'fcfs',
            title: 'Primero en llegar (FCFS)',
            content: {
                description: 'El más simple. Atiende en orden de llegada. Es Non-Preemptive.',
                items: [
                    'Ventaja: Muy poco overhead de gestión.',
                    'Desventaja: Efecto Convoy. Un proceso largo traba a todos los cortitos detrás de él.'
                ]
            }
        },
        {
            id: 'round-robin',
            title: 'Ronda (Round Robin)',
            content: {
                description: 'Multitarea Preemptive basada en una cola circular y un Quantum fijo.',
                items: [
                    'Quantum: Si es muy chico, hay mucho overhead; si es muy grande, se vuelve un FCFS.',
                    'Cola Circular: Al terminar su tiempo, el proceso vuelve al final de la cola de Listos.',
                    'Mejoras: Se puede sumar el quantum sobrante al siguiente turno para ganar eficiencia.'
                ],
                highlight: 'A mayor quantum mejora el tiempo promedio de respuesta, pero penaliza procesos cortos.'
            }
        },
        {
            id: 'spn',
            title: 'Proceso más corto (SPN/SJF)',
            content: {
                description: 'Multitarea Non-Preemptive que selecciona al de menor ráfaga de CPU.',
                items: [
                    'Optimización: Es el algoritmo óptimo en cuanto a tiempo de espera promedio.',
                    'Riesgo: Puede causar inanición (starvation) en procesos largos.',
                    'Dificultad: Requiere conocer de antemano el tiempo de cada proceso (u estimarlo).'
                ]
            }
        },
        {
            id: 'hrrn',
            title: 'El más penalizado (HPRN/HRRN)',
            content: {
                description: 'Busca un equilibrio entre FCFS y SPN usando la Tasa de Penalidad.',
                items: [
                    'Cálculo: Penalidad P = (Espera + Servicio) / Servicio.',
                    'Aging: Los procesos estancados aumentan su espera y eventualmente ganan prioridad.',
                    'Overhead: Requiere cálculos constantes por cada proceso en la cola.'
                ],
                highlight: 'Aging (Envejecimiento): La técnica para evitar la inanición total.'
            }
        },
        {
            id: 'selfish-rr',
            title: 'Ronda Egoísta',
            content: {
                description: 'Usa dos colas: una de procesos Aceptados y otra de Nuevos.',
                items: [
                    'Prioridad: Los procesos en la cola de aceptados tienen prioridad sobre los nuevos.',
                    'Parámetros b/a: Si b/a < 1, los nuevos eventualmente alcanzan a los aceptados.',
                    'Casos: Si b/a = 0 es un Round Robin normal; si b/a >= 1 es un FCFS.'
                ]
            }
        },
        {
            id: 'fb-multilevel',
            title: 'Retroalimentación Multinivel (FB)',
            content: {
                description: 'Varias colas con distinta prioridad y quantum.',
                items: [
                    'Degradación: Si un proceso consume su quantum entero, baja de nivel de prioridad.',
                    'Adaptabilidad: Favorece a procesos de I/O (cortos) y castiga a los intensivos de CPU.',
                    'Configuración: Cada cola puede tener su propio algoritmo y quantum.'
                ]
            }
        },
        {
            id: 'lottery',
            title: 'Lotería 🏷️',
            content: {
                description: 'Esquema probabilístico basado en boletos asignados a procesos.',
                items: [
                    'Sorteo: El Scheduler "tira los dados" y el proceso con el boleto ganador ejecuta.',
                    'Prioridad: Más boletos = Más probabilidad de ganar CPU.',
                    'Simplicidad: Es fácil de implementar y bastante justo estadísticamente.'
                ]
            }
        },
        {
            id: 'multiprocessor',
            title: 'Planificación Multinúcleo',
            content: {
                description: 'Administrar varios cerebros requiere estrategias de afinidad.',
                items: [
                    'Afinidad de CPU: Tratar de que un proceso siga en el mismo núcleo para aprovechar el Cache.',
                    'Balanceo de Carga: Mover procesos de colas saturadas a núcleos ociosos (atenta contra la afinidad).',
                    'Hilos: El SO puede ejecutar hilos del mismo proceso en distintos núcleos en paralelo.'
                ]
            }
        }
    ],
    lab: {
        language: 'Papel y Lápiz (o Excel)',
        task: 'Dadas las ráfagas de CPU y tiempos de llegada de 5 procesos, dibujar el Diagrama de Gantt para Round Robin (Q=2) y calcular el Turnaround promedio.'
    },
    animations: [
        {
            id: 'rr',
            title: 'Simulador Round Robin',
            description: 'Mirá cómo el Quantum afecta la cola de listos y el tiempo de respuesta.'
        },
        {
            id: 'sjf',
            title: 'Algoritmo SJF',
            description: 'El más cortito pasa primero. Mirá cómo se reordena la cola según la ráfaga.'
        },
        {
            id: 'gantt',
            title: 'Visualizador de Gantt',
            description: 'Proximamente: Comparativa de algoritmos en tiempo real.'
        }
    ],
    examQuestions: [
        {
            type: 'V/F',
            question: '¿El algoritmo FCFS puede causar inanición (Starvation)?',
            answer: 'Falso',
            explanation: 'En FCFS todos terminan ejecutando tarde o temprano. La inanición se da en algoritmos por prioridad o SJF/SRT.'
        },
        {
            type: 'V/F',
            question: '¿Un Quantum muy pequeño en Round Robin mejora el rendimiento general del sistema?',
            answer: 'Falso',
            explanation: 'Si es demasiado chico, el overhead (sobrecarga) del cambio de contexto consume más tiempo que la ejecución de los procesos.'
        },
        {
            type: 'Desarrollo',
            question: 'Explicá qué es el "Efecto Convoy" y en qué algoritmo es más común.',
            answer: 'Ocurre en FCFS cuando un proceso muy largo (CPU-bound) entra primero, haciendo que muchos procesos cortos (I/O-bound) esperen mucho tiempo detrás de él, bajando la utilización de dispositivos I/O.'
        },
        {
            type: 'Desarrollo',
            question: '¿Diferencia entre Planificación de Largo Plazo y Corto Plazo?',
            answer: 'La de Largo Plazo decide qué procesos entran al sistema (estado Nuevo a Listo). La de Corto Plazo decide qué proceso de la cola de Listos pasa a ejecutarse en la CPU.'
        },
        {
            type: 'V/F',
            question: 'Un algoritmo de planificación Round Robin permite un nivel de multiprogramación mayor al que permite un algoritmo FIFO.',
            answer: 'Falso',
            explanation: 'El nivel de multiprogramación (cantidad de procesos cargados en memoria al mismo tiempo) está dado por la memoria disponible y las políticas del planificador de largo/mediano plazo. El algoritmo de planificación de corto plazo (RR, FIFO, etc.) no tiene influencia en cuántos procesos se admiten.'
        },
        {
            type: 'V/F',
            question: 'El uso de un algoritmo de planificación SPTF se asemeja a un FIFO si el sistema solo ejecuta instancias del mismo proceso pero con diferentes datos.',
            answer: 'Depende',
            explanation: 'Si todas las instancias del mismo proceso tienen ráfagas de CPU iguales (los datos no afectan la duración), como SPTF no tiene criterio de desempate relevante, podría comportarse como FIFO. Pero si los datos modifican la duración de cada instancia, SPTF reordenaría la cola y el comportamiento diferiría de FIFO.'
        },
        {
            type: 'V/F',
            question: 'El dispatcher se ocupa de ordenar la cola de listos en el planificador de mediano plazo.',
            answer: 'Falso',
            explanation: 'El dispatcher (despachador) es un componente del planificador de corto plazo. Su función es realizar el cambio de contexto: guardar el estado del proceso saliente, cargar el estado del entrante y saltar al código del nuevo proceso. No ordena colas ni opera en el mediano plazo.'
        },
        {
            type: 'Desarrollo',
            question: 'Luego de realizar inferencias estadísticas a un sistema donde la carga de procesos siempre es constante, se determina que en promedio el 50% de los procesos tienen ráfagas de CPU muy cortas y el otro 50% tiene ráfagas de CPU muy largas. ¿Recomendaría utilizar un algoritmo de planificación SPF?',
            answer: 'No sería recomendable. SPF (Shortest Process First) siempre ejecuta primero los procesos más cortos, lo que penaliza severamente a los procesos largos (el 50% restante). Con carga constante, los procesos largos sufrirían inanición (starvation) ya que siempre habría procesos cortos llegando a la cola que les robarían la prioridad.'
        },
        {
            type: 'V/F',
            question: 'El proceso nulo es el de más alta prioridad para que se ejecute en cada cambio de contexto.',
            answer: 'Falso',
            explanation: 'El proceso nulo (idle process) tiene la prioridad más BAJA del sistema. Solo se ejecuta cuando no hay ningún otro proceso en la cola de listos. Su existencia es para que la CPU siempre tenga algo que hacer (ejecutar un bucle vacío), pero se debe evitar su ejecución porque significa que el sistema está ocioso.'
        }
    ]
};
