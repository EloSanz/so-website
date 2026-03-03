import { Module } from '../types';

export const module5: Module = {
    id: '5',
    title: 'Gestión de Memoria: El Arte de Malabarear Bytes',
    unit: 'Unidad 5: Memoria Principal y Virtual',
    advancedFocus: 'Para el final: No podés ignorar el funcionamiento exacto de la MMU y el TLB. La segmentación vs paginación es pregunta de cajón. Y si no sabés explicar la Anomalía de Belady, estás en el horno.',
    topics: [
        {
            id: 'hardware-conceptos',
            title: 'Jerarquía y Hardware: Los Cimientos',
            content: {
                description: 'La memoria no es un bloque monolítico, es una arquitectura jerárquica diseñada para que la CPU no se muera de aburrimiento esperando datos.',
                items: [
                    'La [[ RAM | Memoria Central o Principal: es un arreglo direccionable de bytes donde reside el código y los datos de los procesos en ejecución. Es volátil y mucho más lenta que los registros de la CPU. ]] es el campo de batalla principal, pero no el único.',
                    'El corazón de la gestión es la [[ MMU | Memory Management Unit: el dispositivo de hardware que transforma las direcciones lógicas generadas por la CPU en direcciones físicas reales mediante tablas de mapeo. ]], que se encarga de la traducción en tiempo récord.',
                    'Para proteger al núcleo, usamos el [[ Boundary | Registro Límite: un registro de hardware que define la frontera infranqueable entre el espacio del Sistema Operativo y el espacio de los usuarios. ]].',
                    'La [[ Cache | Memoria de alta velocidad situada entre la CPU y la RAM: aprovecha la localidad de referencia para evitar accesos lentos a la memoria principal. ]] es fundamental para el rendimiento moderno.',
                    'Cuando el dato no está donde debería, sufrimos un [[ Stall | Ciclo de espera forzado: ocurre cuando la CPU tiene que detenerse porque el dato requerido no está en el cache y debe ser buscado en la RAM. ]].'
                ],
                highlight: 'La eficiencia del sistema se mide en que tan poco tiempo pasa la CPU en estado de Stall.'
            }
        },
        {
            id: 'espacio-proceso-detalle',
            title: 'La Anatomía del Espacio de Direccionamiento',
            content: {
                description: 'El Sistema Operativo no tira los datos al azar; organiza cada proceso en un esquema lógico estructurado.',
                items: [
                    '[[ Code Segment | Área de código: contiene las instrucciones ejecutables del programa. Es de solo lectura para evitar que el proceso se suicide modificando su propio código. ]]: Instrucciones fijas, usualmente en la zona baja.',
                    '[[ Data Segment | Área de datos: almacena variables globales y estáticas. Su tamaño se define al compilar y no cambia, aunque el valor de las variables sí. ]]: El estante de las variables globales.',
                    '[[ HEAP | Memoria dinámica: es la zona que crece "hacia arriba" a medida que pedís memoria con funciones como malloc() o new. ]]: El caos controlado de la memoria dinámica.',
                    '[[ STACK | Pila de llamadas: almacena variables locales y parámetros de funciones. Crece desde las direcciones más altas hacia abajo, buscando encontrarse con el Heap. ]]: El registro de la ejecución actual.'
                ],
                highlight: 'El "Stack Overflow" no es solo una web; es lo que pasa cuando tu pila de llamadas invade zonas que no le corresponden.'
            }
        },
        {
            id: 'resolucion-direcciones',
            title: 'Resolución de Direcciones y Mapeo',
            content: {
                description: '¿Cómo llega un "x = 5" a un transistor real en un chip? Es un viaje de traducción constante.',
                items: [
                    'Manejamos [[ Direcciones Lógicas | Direcciones generadas por la CPU: son abstractas y relativas al proceso. ]] que deben convertirse en [[ Direcciones Físicas | Posiciones reales en los chips de memoria principal: donde los bits están realmente guardados. ]].',
                    'En el [[ Binding | Vinculación de direcciones: proceso de asignar una dirección de memoria a un identificador del programa. ]] se decide el destino final de cada dato.',
                    'La resolución puede ser en tiempo de [[ Compilación | Las direcciones son fijas y absolutas: si el programa no se carga en esa dirección exacta, no funciona. ]], de [[ Carga | El Loader decide la dirección real al momento de iniciar el proceso. ]] o de [[ Ejecución | El mapeo es dinámico y cambia instrucción a instrucción gracias a la MMU. ]].'
                ],
                highlight: 'Hoy casi todo es en Tiempo de Ejecución por la flexibilidad que da para mover procesos en RAM.'
            }
        },
        {
            id: 'paginacion-segmentacion-pro',
            title: 'Paginación, Segmentación y Tablas',
            content: {
                description: 'El SO tiene que ser un experto en logística para meter fragmentos de procesos en los huecos libres de la RAM.',
                items: [
                    'Dividimos en [[ Páginas | Unidades lógicas de tamaño fijo en las que se divide un proceso. ]] y [[ Frames | Marcos: bloques de memoria física del mismo tamaño que las páginas. ]].',
                    'Usamos la [[ MPT | Memory Page Table: tabla que asocia cada página lógica con su frame físico correspondiente. Existe una por cada proceso. ]] para no perdernos.',
                    'En segmentación, la [[ SMT | Segment Memory Table: almacena la base y el límite de cada segmento lógico del proceso (código, datos, stack). ]] maneja tamaños variables.',
                    'Luchamos contra la [[ Frag. Interna | Fragmentación Interna: espacio desperdiciado dentro de una página o partición asignada. ]] y la [[ Frag. Externa | Fragmentación Externa: memoria libre total suficiente pero dispersa en huecos demasiado chicos. ]].'
                ],
                highlight: 'La paginación elimina la fragmentación externa, pero te deja un poquito de interna.'
            }
        },
        {
            id: 'memoria-virtual-avanzada',
            title: 'Memoria Virtual: Potencia Sin Límites',
            content: {
                description: 'Es la técnica que permite que un proceso "crea" que tiene más memoria de la que físicamente existe.',
                items: [
                    'El [[ Swapping | Intercambio: mover procesos completos o páginas entre la RAM y el área de intercambio en el disco. ]] nos da aire cuando la RAM explota.',
                    'Para que sea rápido, la MMU usa el [[ TLB | Translation Lookaside Buffer: un pequeño cache de hardware de alta velocidad que guarda las traducciones de páginas más recientes. ]].',
                    'Si el TLB falla, tenemos un [[ TLB Miss | Fallo en el buffer: obliga a la MMU a leer la tabla de páginas en la RAM lenta. ]].',
                    '[[ Belady | Anomalía de Belady: un error en el algoritmo FIFO donde tener más frames físicos asignados causa paradójicamente más page faults. ]]: El gran misterio de la paginación.',
                    'La [[ Hiperpaginación | Thrashing: el sistema colapsa porque gasta más CPU moviendo páginas que ejecutando el programa. ]] es el fin del rendimiento.',
                    'Con [[ COW | Copy-On-Write: técnica de optimización donde los procesos comparten la misma página física hasta que uno intenta escribir en ella. ]], ahorramos muchísima RAM en los forks.'
                ],
                highlight: 'Un buen sistema de Memoria Virtual es lo que hace que tu PC no muera cuando abrís 50 pestañas de Chrome.'
            }
        }
    ],

    examQuestions: [
        {
            type: 'V/F',
            question: 'La resolución de direcciones en tiempo de carga (Loader) es la más flexible ya que permite mover el proceso en RAM durante su ejecución.',
            answer: 'Falso',
            explanation: 'La más flexible es la resolución en TIEMPO DE EJECUCIÓN. En tiempo de carga, una vez que el Loader calculó las direcciones, estas quedan fijas para toda esa sesión de ejecución.'
        },
        {
            type: 'V/F',
            question: 'La fragmentación interna es un problema típico de la segmentación pura.',
            answer: 'Falso',
            explanation: 'La fragmentación interna es típica de la PAGINACIÓN (en la última página). La segmentación sufre de fragmentación EXTERNA porque los segmentos son de tamaño variable.'
        },
        {
            type: 'V/F',
            question: 'La Anomalía de Belady demuestra que, en ciertos algoritmos como FIFO, aumentar la cantidad de frames físicos puede aumentar los fallos de página.',
            answer: 'Verdadero',
            explanation: 'Es un fenómeno contraintuitivo que ocurre con FIFO. Algoritmos como LRU no sufren de esta anomalía.'
        },
        {
            type: 'V/F',
            question: 'Un TLB Hit implica que el sistema debe realizar dos accesos a la memoria RAM para obtener un dato.',
            answer: 'Falso',
            explanation: 'Al contrario, el TLB Hit evita el primer acceso a la RAM (donde está la MPT). La CPU obtiene la dirección física del TLB directamente y solo hace UN acceso a RAM para buscar el dato.'
        },
        {
            type: 'Desarrollo',
            question: 'Explique qué es la Hiperpaginación (Thrashing) y cómo afecta al uso de la CPU.',
            answer: 'Ocurre cuando el sistema operativo asigna menos frames de los necesarios a los procesos, provocando fallos de página constantes. El sistema pasa más tiempo swapeando (sacando y metiendo páginas del disco) que ejecutando código útil. Esto hace que la utilización de la CPU caiga drásticamente, lo que a veces confunde al planificador y le hace meter más procesos, empeorando el problema.',
        },
        {
            type: 'Desarrollo',
            question: '¿Qué es la técnica Copy-On-Write (COW) y por qué es importante en sistemas Unix?',
            answer: 'Es una optimización para la llamada al sistema fork(). En lugar de copiar toda la memoria del padre al hijo (operación carísima), ambos comparten las mismas páginas físicas marcadas como de solo lectura. Solo cuando uno de los dos intenta escribir, el hardware genera una excepción y el kernel crea una copia real de esa página específica. Ahorra muchísima memoria y tiempo.',
        },
        {
            type: 'Desarrollo',
            question: 'Un proceso lee una matriz de 30 filas por 128 columnas (integers de 2 bytes) de forma secuencial (por filas). El sistema tiene páginas de 256 bytes y solo un frame libre para datos. ¿Cuántos fallos de página se producen?',
            answer: 'Se producen exactamente 30 fallos de página. Explicación: Cada fila tiene 128 columnas * 2 bytes = 256 bytes. Como la página es de 256 bytes, cada fila entra exactamente en una página. Al leer secuencialmente por filas, el primer acceso a cada fila genera un fallo de página para cargarla en el único frame disponible, y los siguientes 127 accesos de esa misma fila resultan en aciertos (hits). Total: 1 fallo por fila * 30 filas = 30 fallos.',
        },
        {
            type: 'Desarrollo',
            question: 'Describa la función de la MMU y nombre al menos dos registros de hardware que utilice.',
            answer: 'La MMU es la unidad de hardware que traduce direcciones lógicas a físicas en tiempo real y protege la memoria. Utiliza registros como el Registro Base (o de Relocalización) y el Registro Límite (Boundary) para verificar que el proceso no acceda a direcciones fuera de su espacio asignado.',
        }
    ],
    challenge: {
        id: 'm5-challenge',
        title: 'Simulador de MMU: MPT + TLB',
        description: 'Implementá un simulador de MMU en C puro. El sistema debe traducir direcciones lógicas a físicas manejando un caché TLB y detectando Page Faults.',
        task: 'Crear un programa en C que reciba direcciones de 16 bits, extraiga el Número de Página y el Offset, consulte un TLB de 4 entradas y, ante un Miss, acceda a la Tabla de Páginas.',
        hints: [
            'Define una estructura TLBEntry con `typedef struct`. Necesitás campos para `page_num`, `frame_num` y un flag de `valid`.',
            'Usa operaciones binarias (máscaras y desplazamientos) para separar el número de página del offset.',
            'Simulá la MPT como un arreglo de enteros donde el índice es la página y el valor es el frame.',
            'No olvides inicializar el TLB como inválido al principio.',
            'Extra: Implementá una política de reemplazo simple (como FIFO) para el TLB cuando se llene.'
        ],
        solutionCode: {
            language: 'C',
            code: '```c\n#include <stdio.h>\n#include <stdbool.h>\n\n#define TLB_SIZE 4\n#define PAGE_TABLE_SIZE 16\n\ntypedef struct {\n    int page_num;\n    int frame_num;\n    bool valid;\n} TLBEntry;\n\nTLBEntry tlb[TLB_SIZE];\nint mpt[PAGE_TABLE_SIZE];\n\nint translate(int logical_addr) {\n    int page = (logical_addr & 0xFF00) >> 8;\n    int offset = logical_addr & 0x00FF;\n\n    // 1. Buscar en TLB\n    for(int i=0; i < TLB_SIZE; i++) {\n        if(tlb[i].valid && tlb[i].page_num == page) {\n            printf("TLB Hit! Page %d\\n", page);\n            return (tlb[i].frame_num << 8) | offset;\n        }\n    }\n\n    // 2. TLB Miss -> Buscar en MPT\n    printf("TLB Miss. Accediendo a MPT...\\n");\n    int frame = mpt[page];\n    if(frame == -1) {\n        printf("PAGE FAULT! La página no está en RAM.\\n");\n        return -1;\n    }\n\n    // 3. Opcional: Actualizar TLB aquí\n    return (frame << 8) | offset;\n}\n```'
        }
    },
    animations: [
        {
            id: 'belady-visualizer',
            title: 'Visualizador de la Anomalía de Belady',
            description: 'Insertá una secuencia de páginas y compará FIFO vs LRU. Mirá cómo al subir de 3 a 4 frames, el FIFO se rompe solo.',
        },
        {
            id: 'mmu-translator',
            title: 'MMU: El Traductor en Tiempo Real',
            description: 'Mirá cómo una dirección lógica se parte en (p, d), se busca en la tabla y se convierte en una dirección física real.',
        }
    ],
};


