# Lecciones de proyectos anteriores

Cada una costó una vuelta extra con el usuario.

## Render y código

- **Selectores CSS compartidos.** Al cambiar una regla `#a, #b { … }` para mover `#a`, también se movió `#b` (la torre quedó bajo el panel). Separa la regla antes de editarla.
- **Redibujo con clave.** Un canvas que redibuja solo cuando cambia una clave dejó de dibujar partes fijas (el edificio) mientras la clave no cambiaba. Inicia la clave en `null` y dibuja lo fijo siempre.
- **Recolorear por clase.** Al pasar textos sobre el fondo a oscuro, un letrero con panel oscuro quedó con texto invisible. Revisa cada elemento que hereda la clase cambiada.
- **Glifos acentuados.** Press Start 2P dibuja Í y É como minúsculas. Usa la letra sin acento con un acento dibujado encima, o una fuente con esos glifos.
- **Primer cuadro.** Es la miniatura: no puede quedar vacío ni con el subtítulo sin texto.
- **Tiempos corridos.** Al sostener una escena, todo lo posterior se corre: voz, subtítulos, efectos, hosts de composición y animaciones. Hazlo en un solo lugar (una función que mapea el tiempo) y anótalo en `SPEC.md`.

## Voz

- No aceleres la voz para que quepa: suena apurada y el usuario lo nota de inmediato.
- Generar frase por frase con pausas fijas dejó un ritmo raro. Una sola toma completa suena natural.
- Para corregir una frase sin regrabar todo, genérala aparte a velocidad natural, empálmala con fundidos y mueve todo lo que viene después. Guarda la toma anterior.

## Proceso

- Los subagentes a veces revisan solo algunos snapshots y dicen que todo calza. Revisa tú los frames del MP4 en cada entrega.
- La transición que se entiende mejor es el retroceso de cámara continuo: un elemento se revela como parte de algo mayor. Encogerlo, desaparecerlo y mostrar otra cosa no se entendió.
- Etiquetas que adelantan el remate (como `CLASE ALTA?` desde el inicio) le quitan fuerza. Muéstralas recién cuando la voz llega ahí.
- Verifica con un recorte simulado de Instagram antes de entregar, no después.
