import { Module } from '../types';

export const module6: Module = {
    id: '6',
    title: 'E/S y File Systems: El Disco no Perdona',
    unit: 'Unidad 6: Entrada/Salida y Gestión de Archivos',
    advancedFocus: 'Ojo con DMA y el robo de ciclos. Para File Systems, entendé bien la diferencia entre Hard y Soft Links y cómo se calcula una dirección física en disco (LBA).',
    topics: [
        {
            id: 'hardware-io',
            title: 'Arquitectura de E/S y el Bus',
            content: {
                description: 'La CPU es rápida, pero el resto del mundo es lento. Necesitamos una infraestructura que cierre esa brecha.',
                items: [
                    'Los periféricos no tocan el bus directamente; usan un [[ Módulo de E/S | Interfaz de hardware que comunica el bus del sistema con un periférico específico. Contiene la lógica para manejar el dispositivo. ]].',
                    'El [[ Bus del Sistema | Camino de comunicación por donde viajan los datos. Trabaja por Broadcast: todos reciben el mensaje pero solo el destinatario lo procesa. ]] se divide en buses de Datos, Direcciones y Control.',
                    'La comunicación puede ser [[ Sincrónica | Regida por un clock central; todos se mueven al ritmo del dispositivo más lento. ]] o Asincrónica.',
                    'Sin módulos de E/S, la CPU tendría que tener una instrucción distinta para cada mouse o teclado que conectes.'
                ],
                highlight: 'El Módulo de E/S abstrae al procesador de las particularidades físicas de cada fierro.'
            }
        },
        {
            id: 'tecnicas-io',
            title: 'Las 3 Técnicas de Transferencia',
            content: {
                description: '¿Cómo movemos los bytes? Desde el trabajo manual hasta la automatización total.',
                items: [
                    '[[ E/S Programada | La CPU tiene el control total y hace "polling": pregunta constantemente si el dispositivo terminó. Gasta muchísima CPU. ]]: Es como mirar el reloj cada 5 segundos.',
                    '[[ E/S por Interrupciones | El dispositivo le pega un grito a la CPU cuando está listo. Evita que el micro pierda tiempo esperando. ]]: Te suena el celu cuando llega un mensaje.',
                    '[[ DMA | Direct Memory Access: un controlador especial toma el bus y mueve datos directo entre el periférico y la RAM sin molestar a la CPU. ]]: Automatización de fábrica.',
                    'En el DMA ocurre el [[ Robo de Ciclos | El controlador de DMA le quita el control del bus a la CPU por un ciclo para mover un dato. ]], lo que frena un poquito al micro pero gana eficiencia total.'
                ],
                highlight: 'DMA es la única forma de mover grandes volúmenes de datos (ej. un video del disco a RAM) sin incendiar la CPU.'
            }
        },
        {
            id: 'discos-lba',
            title: 'Discos: De los Platos al LBA',
            content: {
                description: 'Entender cómo se guardan físicamente los bits en los platos de un disco mecánico o SSD.',
                items: [
                    'El direccionamiento antiguo era [[ CHS | Cylinder, Head, Sector: dirección física basada en la geometría real del disco. ]].',
                    'Hoy usamos [[ LBA | Logical Block Addressing: el SO ve el disco como un arreglo lineal de bloques lógicos (0, 1, 2...), abstrayéndose de los platos y cabezas. ]].',
                    'Se busca llenar los datos por [[ Cilindros | Conjunto de pistas que están en la misma posición vertical en todos los platos. ]] para minimizar el movimiento del cabezal.',
                    'La fórmula para pasar de físico a bloque es: [[ b = s + ns * (h + c * np) | Fórmula de mapeo donde b es el bloque, s el sector, ns sectores por pista, h la cabeza, c el cilindro y np superficies. ]].'
                ],
                highlight: 'Minimizar el movimiento del cabezal (Seek Time) es el objetivo de vida de cualquier driver de disco.'
            }
        },
        {
            id: 'file-system-parts',
            title: 'Anatomía de un File System',
            content: {
                description: 'Un disco sin File System es solo una bolsa de bits. Necesitamos estructura.',
                items: [
                    'El disco se divide en áreas: [[ FDA | Fixed Data Area: área de gestión fija que contiene metadatos del sistema. ]], Área de Catálogo (Directorios) y Área de Datos.',
                    'La [[ Administración del espacio libre | Métodos como Bitmaps o Listas Ligadas para saber qué partes del disco no tienen dueño. ]] es vital para no pisar archivos.',
                    'Para el espacio ocupado, usamos [[ Asignación Indexada | Se usa un bloque (o I-nodo) que contiene punteros a todos los bloques del archivo. ]] o Enlazada.',
                    'Las tablas que necesita un FS no son solo espacio ocupado y libre. También existen [[ Tabla de Directorios | Estructura que mapea nombres de archivos a su ubicación real (I-nodo o entrada de catálogo). ]] y [[ Tabla de Archivos Abiertos | Estructura en memoria que registra qué archivos están siendo usados activamente por los procesos. ]].',
                    'El [[ Bloque Lógico | Unidad mínima de lectura/escritura del FS. Puede agrupar varios sectores físicos (ej: 4 sectores de 512B → bloque de 2KB). ]] no necesariamente coincide con el sector del disco.',
                    'Un [[ Hard Link | Dos nombres apuntando al mismo I-nodo físico. Si borrás uno, el archivo sigue vivo con el otro nombre. ]] es el archivo real con dos etiquetas. Solo es posible en FS con I-nodos (como EXT4), no en FAT.',
                    'Un [[ Soft Link | Acceso directo o Simbólico: es un archivo especial que solo contiene la ruta de otro archivo. Si borrás el original, el link queda roto. ]] es solo un puntero de texto. Funciona en cualquier FS.',
                    'Tanto Linux como Windows pueden manejar múltiples File Systems simultáneamente (ej: disco con NTFS y pendrive con FAT32).'
                ],
                highlight: 'Dato de Final: El I-nodo es el DNI del archivo; el nombre es solo un alias en un directorio.',
                diagram: 'links'
            }
        },
        {
            id: 'fs-tipos-reales',
            title: 'FAT32, EXT4 y NTFS: Los File Systems del Mundo Real',
            content: {
                description: 'No todos los File Systems son iguales. Cada uno resuelve el mismo problema (organizar un disco) con estructuras muy distintas.',
                items: [
                    '[[ FAT32 | File Allocation Table de 32 bits. Usa 2 copias de una tabla FAT que registra tanto el espacio ocupado (cadena de bloques) como el libre (entradas con valor 0). Simple pero limitado. ]] es el más simple: el catálogo y el espacio libre/ocupado están en la misma tabla.',
                    '[[ EXT4 | Fourth Extended Filesystem. Usa I-nodos para el espacio ocupado y un Bitmap de bloques para el espacio libre. Soporta Hard Links. ]] separa las responsabilidades: tabla de [[ I-nodos | Estructuras fijas que guardan metadatos y punteros a bloques de datos. El I-nodo ES el archivo; el nombre está en el directorio. ]] para lo ocupado y [[ Bitmap | Vector de bits donde cada bit indica si un bloque/I-nodo está libre (0) u ocupado (1). ]] para lo libre.',
                    '[[ NTFS | New Technology File System. Usa la MFT (Master File Table) como estructura principal. Cada archivo es una entrada en la MFT. ]] usa la [[ MFT | Master File Table: tabla maestra donde cada registro describe un archivo con sus atributos y punteros. ]] para el espacio ocupado y un Bitmap para el libre.',
                    'FAT32 es más liviano post-formateo: sus estructuras internas ocupan menos espacio, por eso se usa en dispositivos pequeños como pendrives.',
                    'EXT4 reserva espacio al inicio para el área de I-nodos, lo que lo hace más pesado post-formateo pero más eficiente en el acceso posterior.',
                    'Dato clave para el final: FAT32 NO soporta Hard Links (no tiene I-nodos). Solo permite Soft Links.'
                ],
                highlight: 'EXT4 → I-nodos + Bitmap. FAT32 → 2 tablas FAT. NTFS → MFT + Bitmap. Cada FS tiene su combo de estructuras.'
            }
        },
        {
            id: 'asignacion-espacio',
            title: 'Métodos de Asignación de Espacio en Disco',
            content: {
                description: 'Cuando guardás un archivo, ¿cómo se distribuyen los bloques en el disco? Hay varias estrategias, cada una con trade-offs.',
                items: [
                    '[[ Asignación Contigua | Los bloques del archivo se guardan uno al lado del otro en el disco. Acceso rápido, pero sufre fragmentación externa y es difícil que el archivo crezca. ]]: Rápida pero rígida. Los accesos dependen de la distribución física en disco.',
                    '[[ Asignación Enlazada (Simple) | Cada bloque contiene un puntero al siguiente bloque, formando una lista enlazada. Los accesos dependen de la CANTIDAD de bloques, no de su distribución. ]]: Lista simple. Para leer el archivo entero, recorrés todos los bloques secuencialmente.',
                    '[[ Asignación Doblemente Enlazada | Cada bloque tiene un puntero al bloque anterior y otro al siguiente. Más flexible pero desperdicia más espacio útil por bloque. ]]: Dos punteros por bloque: espacio_útil = tamaño_bloque - (2 × tamaño_puntero).',
                    'En asignación enlazada, la cantidad de accesos a disco = cantidad de bloques del archivo. NO depende de la distribución de los bloques.',
                    'En asignación contigua, SÍ importa dónde están los bloques. Es la [[ Segmentación Simple | En el contexto de FS, asignar archivos en bloques contiguos. La cantidad de accesos depende de la ubicación física en disco. ]] del mundo de archivos.',
                    'Cálculo de espacio para asignación doblemente enlazada: bloques = tamaño_archivo / (tamaño_bloque - 2 × tamaño_puntero). Ej: 2MB con bloques de 512B y punteros de 8B → 2×1024×1024 / (512 - 16) = 4229 bloques.'
                ],
                highlight: 'Enlazada: accesos = cantidad de bloques. Contigua: accesos dependen de la distribución. No confundir.'
            }
        },
        {
            id: 'inodo-profundidad',
            title: 'I-Nodos en Profundidad: Punteros y Tamaño Máximo',
            content: {
                description: 'El I-nodo no es solo metadata. La forma en que apunta a los bloques determina el tamaño máximo que puede tener un archivo.',
                items: [
                    'Un I-nodo tiene [[ Punteros Directos | Apuntan directamente a bloques de datos. Son los más rápidos (1 acceso) pero limitados en cantidad. ]] que van directo a los datos.',
                    'Cuando se acaban los directos, se usan [[ Punteros Indirectos Simples | Apuntan a un bloque que a su vez contiene punteros a bloques de datos. Agregan 1 acceso extra. ]]: un nivel más de indirección.',
                    'Después vienen los [[ Punteros Indirectos Dobles | Apuntan a un bloque de punteros que apuntan a bloques de punteros que apuntan a datos. 2 accesos extra. ]] y los [[ Punteros Indirectos Triples | Tres niveles de indirección. Permiten archivos enormes pero con más accesos a disco. ]].',
                    'El tamaño máximo de un archivo depende de: (1) el tamaño de los bloques del disco, (2) la cantidad de punteros directos/indirectos, y (3) el TAMAÑO de cada puntero (16 bits, 32 bits, 64 bits).',
                    'Un puntero más chico (16 bits) permite meter más punteros por bloque, pero direcciona menos bloques totales. Uno más grande (64 bits) direcciona más pero entran menos por bloque.',
                    'Importante: el tamaño máximo de un archivo NO está limitado por el espacio libre en disco. Puede haber espacio de sobra pero si el I-nodo agotó sus punteros, el archivo no puede crecer más.',
                    'El I-nodo NO mantiene una lista enlazada entre bloques. Los bloques se acceden por punteros directos/indirectos, NO como en FAT donde un bloque apunta al siguiente.'
                ],
                highlight: 'El tamaño máximo del archivo depende de los punteros del I-nodo, no del espacio libre en disco.'
            }
        },
        {
            id: 'ablocamiento-fragmentacion',
            title: 'Ablocamiento y Fragmentación en Disco',
            content: {
                description: 'Elegir el tamaño de bloque es un arte: bloques grandes desperdician, bloques chicos son lentos.',
                items: [
                    'El [[ Ablocamiento | Usar bloques grandes en el File System. A mayor tamaño de bloque, mayor desperdicio por fragmentación interna, pero menos overhead de gestión. ]] agrupa más sectores en un solo bloque lógico.',
                    'Si hay ablocamiento (bloques grandes), la [[ Fragmentación Interna en FS | Espacio desperdiciado dentro del último bloque de un archivo. Si el bloque es de 8KB y el archivo ocupa 1KB, se desperdician 7KB. ]] tiende a ser mayor.',
                    'Ejemplo: bloques de 8KB → archivo de 1KB desperdicia 7KB. Bloques de 512B → archivo de 1KB usa 2 bloques, desperdicia 0KB.',
                    'Los [[ Sectores del disco | Unidad mínima física de lectura/escritura del disco (típicamente 512B). El FS puede agrupar varios sectores en un bloque lógico. ]] son la unidad física. Los bloques lógicos del FS pueden agrupar varios sectores.',
                    'El tamaño de bloque del FS NO tiene que coincidir con el tamaño de sector del disco. Ej: sectores de 512B con bloques de 4KB (8 sectores por bloque).',
                    'Una desventaja de los FS con I-nodos es que reservan de entrada mucho espacio para el [[ Área de I-nodos | Región fija del disco creada al formatear. Se reserva espacio para todos los I-nodos posibles, aunque estén vacíos. ]], reduciendo el espacio disponible para datos.'
                ],
                highlight: 'Bloques grandes = menos gestión pero más desperdicio. Bloques chicos = menos desperdicio pero más overhead.'
            }
        }
    ],
    examQuestions: [
        {
            type: 'V/F',
            question: 'En la técnica de DMA, la CPU debe copiar cada byte que llega del disco hacia la memoria RAM.',
            answer: 'Falso',
            explanation: 'Justamente el DMA (Direct Memory Access) permite que un controlador especializado mueva los datos directamente entre el periférico y la RAM sin intervención de la CPU, excepto para iniciar y terminar la transferencia.'
        },
        {
            type: 'V/F',
            question: 'Un Soft Link (o enlace simbólico) deja de funcionar si el archivo original es movido o renombrado.',
            answer: 'Verdadero',
            explanation: 'El Soft Link guarda una ruta de texto. Si el destino cambia o desaparece, el link queda apuntando a la nada. En cambio, un Hard Link apunta al I-nodo, por lo que sobrevive a renombrados.'
        },
        {
            type: 'V/F',
            question: 'El direccionamiento LBA (Logical Block Addressing) es superior al CHS porque abstrae la geometría física del disco.',
            answer: 'Verdadero',
            explanation: 'LBA permite tratar al disco como un arreglo de bloques lógicos, facilitando la tarea del SO y permitiendo manejar discos de capacidades que superan las limitaciones de la geometría CHS.'
        },
        {
            type: 'Desarrollo',
            question: 'Explique qué es el "Robo de Ciclos" en el contexto de una transferencia por DMA.',
            answer: 'Cuando el controlador de DMA necesita transferir un dato por el bus del sistema, le pide el control del bus a la CPU (bus request). Si la CPU se lo concede (bus grant), el micro se detiene por un ciclo de reloj mientras el DMA mueve el dato. Este "robo" de un ciclo de ejecución es el precio que se paga para que la CPU no tenga que encargarse de toda la transferencia manualmente.',
        },
        {
            type: 'Desarrollo',
            question: '¿Qué es un I-nodo y qué información suele contener?',
            answer: 'Un I-nodo (Index Node) es la estructura de datos que representa a un archivo dentro del sistema de archivos. Contiene metadatos como el dueño, permisos, tamaño, fechas de acceso y, lo más importante, los punteros a los bloques de datos donde realmente vive el contenido del archivo en el disco.',
        },
        {
            type: 'V/F',
            question: 'En un sistema con un File System con asignación enlazada, la cantidad de accesos a disco para leer un archivo depende de la distribución que los bloques tengan en el disco.',
            answer: 'Falso',
            explanation: 'Depende de la cantidad de bloques que contenga el archivo, porque un bloque se conecta al otro en forma de lista enlazada. Debemos recorrer todos los bloques para leer el archivo entero. Para que los accesos dependan de la distribución, el FS debería implementar asignación contigua (segmentación simple).'
        },
        {
            type: 'V/F',
            question: 'Las únicas dos tablas que necesita el sistema para administrar los archivos son las de espacio ocupado y espacio libre.',
            answer: 'Falso',
            explanation: 'Hay otras tablas como la de directorios, archivos abiertos, etc. Además, depende del FS: EXT4 usa I-nodos (ocupado) y Bitmap (libre). NTFS usa MFT (ocupado) y Bitmap (libre). FAT32 usa 2 tablas FAT (ocupado y libre juntos). No siempre se usa una tabla para el espacio libre, a veces es un vector de bits.'
        },
        {
            type: 'V/F',
            question: 'En un sistema de archivos con I-Nodos, el tamaño máximo de un archivo depende únicamente del número de punteros directos e indirectos disponibles en el I-Nodo.',
            answer: 'Falso',
            explanation: 'Depende de tres factores: (1) la cantidad de punteros directos/indirectos (configuración del I-nodo), (2) el tamaño de cada puntero (16, 32 o 64 bits: si son más chicos entran más por bloque de indirección, pero direccionan menos espacio total), y (3) el tamaño de los bloques del disco (bloques más grandes = más datos por puntero).'
        },
        {
            type: 'Desarrollo',
            question: '¿Cuál es el objetivo de que exista un módulo específico de FS y cuál es su relación con el módulo de I/O?',
            answer: 'El objetivo del File System es administrar el espacio libre, el espacio dañado y el espacio ocupado del disco. Su relación con el módulo de E/S es que el FS decide CÓMO y DÓNDE guardar los archivos en disco, lo cual afecta directamente al módulo de E/S, que será quien tenga que ir a buscar los datos requeridos y escribir nueva información en los espacios libres.',
        },
        {
            type: 'V/F',
            question: 'Un file system basado en I-nodos permite los Hard Link, a diferencia de los basados en FAT que solo permiten Soft Link.',
            answer: 'Verdadero',
            explanation: 'Los FS con I-nodos (como EXT4) permiten Hard Links porque crear un hard link es agregar un nuevo nombre en el directorio que apunte al mismo I-nodo. En FAT no existen I-nodos, así que no se puede hacer esto. Aclaración importante: FAT32 NO soporta ni Hard Links ni Soft Links nativamente. Los .lnk de Windows son archivos del Shell, no del FS. Si el SO emula symlinks sobre FAT, es una capa superior al FS, no el FS en sí.'
        },
        {
            type: 'V/F',
            question: 'Si dos discos virtuales de 100GB c/u se formatean uno con FAT32 y otro con EXT4, el disco FAT32 ocupa menos espacio que el disco EXT4 después del formateo.',
            answer: 'Verdadero',
            explanation: 'FAT32 es un sistema de archivos más simple, así que sus estructuras internas (tablas FAT) ocupan menos espacio. EXT4 es más avanzado pero necesita más espacio para sus estructuras (área de I-nodos, Bitmap, journaling, etc.). Por eso FAT32 se sigue usando en dispositivos pequeños como pendrives.'
        },
        {
            type: 'Desarrollo',
            question: 'En un sistema con unidad C (asignación doblemente enlazada) y unidad D (asignación contigua), ambas con bloques de 512 bytes y punteros de 8 bytes: a) ¿Cuánto espacio ocupa en C un archivo de 2MB? b) ¿Cuántos accesos a disco para copiarlo a D? c) ¿Cuánto espacio ocupa en D?',
            answer: 'a) En C (doble enlazada): espacio útil por bloque = 512 - (8×2) = 496 bytes. Bloques necesarios = ⌈2×1024×1024 / 496⌉ = 4229 bloques. b) Para LEER de C: 4229 accesos de lectura. Para ESCRIBIR en D: 4096 accesos de escritura (en contigua no hay punteros, el dato puro entra en 4096 bloques). Total de accesos para la copia = 4229 + 4096 = 8325. c) En D (contigua): bloques = 2×1024×1024 / 512 = 4096 bloques. En asignación contigua no hay punteros dentro del bloque.'
        },
        {
            type: 'V/F',
            question: 'Un sistema operativo de la familia Windows no puede manejar distintos tipos de File System, en cambio en Linux sí.',
            answer: 'Falso',
            explanation: 'Tanto Linux como Windows pueden manejar varios File Systems simultáneamente. Por ejemplo, un disco rígido con NTFS y un pendrive con FAT32 en el mismo equipo Windows. Linux incluso puede montar NTFS, FAT32, EXT4, XFS y muchos más.'
        },
        {
            type: 'V/F',
            question: 'Un I-nodo es una estructura que permite administrar el espacio ocupado por un archivo manteniendo una relación linkeada (enlazada) entre sus bloques.',
            answer: 'Falso',
            explanation: 'El I-nodo guarda metadatos del archivo (permisos, dueño, tamaño, fechas) y punteros a los bloques de datos. Pero NO mantiene una relación enlazada entre bloques. Los bloques se acceden mediante punteros directos e indirectos (simples, dobles, triples) dentro del I-nodo, no mediante una lista enlazada como en FAT.'
        },
        {
            type: 'V/F',
            question: 'Si hay ablocamiento en un File System, entonces el desperdicio por fragmentación tiende a ser mayor.',
            answer: 'Verdadero',
            explanation: 'El ablocamiento (bloques grandes) aumenta la fragmentación interna: archivos pequeños desperdician más espacio dentro del bloque. Ejemplo: bloques de 8KB → archivo de 1KB desperdicia 7KB.'
        },
        {
            type: 'V/F',
            question: 'En un file system del tipo I-nodos, el tamaño máximo de almacenamiento para un único archivo está determinado por la cantidad de bloques disponibles en el disco.',
            answer: 'Falso',
            explanation: 'Está limitado por la cantidad de punteros que el I-nodo puede direccionar (directos + indirectos simples/dobles/triples), no necesariamente por todo el disco. Puede haber espacio libre pero el archivo no puede crecer más si el I-nodo ya no tiene punteros disponibles.'
        },
        {
            type: 'V/F',
            question: 'Una desventaja de los file systems del tipo I-nodos es que reservan de entrada mucho espacio para su área de catálogo.',
            answer: 'Verdadero',
            explanation: 'El área de I-nodos se reserva al crear (formatear) el FS, incluso si no se usa. Esto reduce el espacio disponible para datos desde el inicio, aunque mejora el acceso posterior a los archivos.'
        },
        {
            type: 'V/F',
            question: 'El tamaño de los bloques de un file system no necesariamente debe ser igual al tamaño de los sectores del disco donde reside.',
            answer: 'Verdadero',
            explanation: 'El bloque lógico (del FS) puede agrupar varios sectores físicos (ej: 4 sectores de 512B → bloque de 2KB). El FS trabaja con bloques lógicos, no directamente con sectores físicos del disco.'
        }
    ],
    lab: {
        language: 'Bash / Linux',
        task: 'Jugá con los enlaces. Creá un archivo, hacele un ln (hard) y un ln -s (soft). Borrá el original y fijate qué pasa con cada uno. Usá ls -i para ver los I-nodos y confirmar que el hard link tiene el mismo número que el original.',
    },
    animations: [
        {
            id: 'dma-transfer',
            title: 'Simulación de DMA',
            description: 'Mirá cómo el controlador de DMA le roba ciclos a la CPU para mover datos sin que el micro se entere.',
            instructions: [
                'Elegí un tamaño de bloque a transferir desde el dispositivo de I/O a memoria.',
                'Iniciá la simulación del DMA.',
                'Observá cómo la CPU es "interrumpida" solo al inicio para configurar y al final (cuando termina el paquete).',
                'Apreciá el ciclo de robo (Cycle Stealing) del Bus donde la CPU descansa brevemente.'
            ],
        },
        {
            id: 'disk-scheduling',
            title: 'Algoritmos de Brazo de Disco',
            description: 'Visualizá movimientos como FCFS, SSTF y SCAN para entender cómo optimizar el Seek Time.',
            instructions: [
                'Elegí un algoritmo de planificación del brazo del disco (FCFS, SSTF, SCAN).',
                'Añadí posiciones de acceso (cilindros) en una cola de peticiones.',
                'Ejecutá la simulación y seguí el recorrido del cabezal de lectura/escritura.',
                'Comprobá la distancia de búsqueda (Seek Time) total comparando los distintos algoritmos.'
            ],
        }
    ],
};
