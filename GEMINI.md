# Reglas para realizar cambios y pushear

Antes de realizar cualquier cambio en el código o en los archivos del proyecto, debes seguir estrictamente este flujo de trabajo:

1. **Preguntar primero**: Jamás hagas cambios directos sin consultarme.
2. **Listar los cambios**: Presentame en el chat una lista detallada de los cambios propuestos.
3. **Esperar el primer OK (Para aplicar)**: No apliques ningún cambio hasta que te dé mi "OK" explícito en el chat. Una vez que me des el OK, podés hacer las modificaciones en los archivos.
4. **Esperar el segundo OK (Para pushear)**: Luego de haber realizado y verificado localmente los cambios, no hagas `git push` hasta que te dé un segundo "OK" explícito para subir el código al repositorio remoto.
5. **Definiciones Técnicas**: Cuando te pida agregar una definición a un concepto técnico, utilizá siempre la sintaxis de `[[ CONCEPTO | Definición Detallada ]]`. Esto permite que el sistema lo renderice como un término interactivo del lexicón.

---

# Errores e inexactitudes detectadas en contenido de File Systems (module6.ts)

## 🔴 Error 1: "FAT solo permite Soft Links" (Pregunta 5 de FS)

- **Enunciado original dice:** "FAT solo permite soft links" → Verdadero.
- **Problema:** FAT32 **NO soporta ni Hard Links ni Soft Links nativamente**. Los `.lnk` de Windows son archivos del Shell, no del FS. Los symlinks reales son feature del VFS, no de FAT.
- **Corrección:** La primera parte (I-nodos permiten Hard Links) es correcta. La segunda debe aclarar que FAT no soporta links nativamente; si el SO emula symlinks sobre FAT, es capa superior.

## 🔴 Error 2: Accesos de copia incompletos (Pregunta 7b de FS)

- **Enunciado dice:** Copiar archivo de C a D = 4229 accesos.
- **Problema:** Solo cuenta los accesos de LECTURA en C. Copiar también implica ESCRIBIR en D (accesos adicionales).
- **Corrección:** 4229 son accesos de lectura. Si se piden accesos totales, hay que sumar los de escritura en D.

## 🟡 Imprecisión: Explicación de tamaño máximo de archivo (Pregunta 3 de FS)

- **La pregunta dice** "depende del número de punteros" → Falso.
- **La respuesta refuta con** "depende del tamaño de punteros".
- **Mejora:** Distinguir explícitamente: (1) cantidad de punteros directos/indirectos, (2) tamaño de cada puntero (16/32/64 bits), (3) tamaño de los bloques.
