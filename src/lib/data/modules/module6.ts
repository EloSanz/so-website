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
                    'Un [[ Hard Link | Dos nombres apuntando al mismo I-nodo físico. Si borrás uno, el archivo sigue vivo con el otro nombre. ]] es el archivo real con dos etiquetas.',
                    'Un [[ Soft Link | Acceso directo o Simbólico: es un archivo especial que solo contiene la ruta de otro archivo. Si borrás el original, el link queda roto. ]] es solo un puntero de texto.'
                ],
                highlight: 'Dato de Final: El I-nodo es el DNI del archivo; el nombre es solo un alias en un directorio.'
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
        },
        {
            id: 'disk-scheduling',
            title: 'Algoritmos de Brazo de Disco',
            description: 'Visualizá movimientos como FCFS, SSTF y SCAN para entender cómo optimizar el Seek Time.',
        }
    ],
};
