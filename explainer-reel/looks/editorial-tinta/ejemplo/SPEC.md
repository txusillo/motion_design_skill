# SPEC: ¿Qué te preguntan cuando te preguntan tus apellidos?, escenas 01 a 03b

Brief de implementación en HyperFrames. El storyboard aprobado manda: si este texto y una imagen no coinciden, gana la imagen, salvo en "Decisiones sobre el storyboard".

GOAL: el espectador entiende que en Santiago los apellidos revelan clase, barrio y poder, siguiendo una red de apellidos que se arma frase a frase.
OUTPUT: HyperFrames, 1080 x 1920, 30 fps, Instagram Reels.
TIME: tramo 1 (escenas 01 a 03b) de 0 a 11,44 s. Video completo: 82,0 s (voz 80,32 s + 1,6 s de cierre).

## Fuentes de verdad

| Qué | Dónde |
|---|---|
| Imágenes aprobadas | `storyboard/escena_*.png`, `storyboard/storyboard_completo.png` |
| Dibujo ya resuelto (vóxeles `box`, `person`, `at`, paleta `PEOPLE`, `SKIN`, `HAIR`, red `GROUPS`/`NET`, `mapa()`, `hemiciclo()`, fichas, paneles, chips) | `storyboard/index.html` (copiar funciones, no importarlas) |
| Mapa de Santiago (34 comunas, `ne: true` = nororiente) | `storyboard/assets/santiago.js` → copiar a `assets/santiago.js` |
| Voz | `assets/voice/voz.mp3` (80,32 s) |
| Tiempos por palabra | `assets/voice/voz.json` (`words[]` con `text`, `start`, `end`) |
| Subtítulos | `compositions/subtitulos.html`, generado. Para regenerar sin API: `python3 scripts/voz.py subtitulos <segundos>` |
| Guion y fuentes de cada cifra | `GUION.md`, `CONTEXTO.md` |

**Nunca** llames a ElevenLabs: no corras `scripts/voz.py grabar`.

## Cómo correr HyperFrames

Desde `apellidos_santiago/`, siempre con este lanzador:

```bash
node ~/.claude/plugins/cache/hyperframes/hyperframes/0.9.13/skills/hyperframes/scripts/plugin-cli.mjs <comando>
```

Comandos: `check --json`, `snapshot --at 1.2,3.4`, `render --quality draft -o prueba_tramo1.mp4`. Las capturas quedan en `.hyperframes/artifacts/snapshots/<id>/`.

## Contrato de render

1. Un elemento temporizado lleva `class="clip"`, `data-start` y `data-duration`; se ve en `[inicio, fin)`.
2. La duración del video es `data-duration` del root. Ningún clip puede pasarse de ella.
3. Cada composición registra una sola línea pausada: `window.__timelines["<id>"] = tl`, después de crear sus tweens.
4. Prohibido `Date.now()`, `Math.random()` sin semilla (usa el `rng(seed)` del storyboard), `fetch`, timers, `repeat: -1`. Todo es función del tiempo de la línea.
5. En sub-composiciones, estilos, marcado y scripts van dentro de `<template>`; el root se estiliza como `#root`.
6. Usa `fromTo` o `set`, no `from`. No tweenear `display`, `visibility` ni `autoAlpha` en un `.clip`: anima un hijo.
7. Sin `transform` CSS en elementos que GSAP transforma: fija la posición inicial con `gsap.set` (incluye `rotationY`, `transformPerspective`, `xPercent`).
8. Rutas `assets/...` sin `/` inicial.
9. Ids únicos en toda la página, con prefijo por composición: `mc-` marco, `pq-` pregunta, `es-` estudio.
10. Host, root de la escena y clave de la línea usan el mismo id.
11. El contenido dibujado por script (SVG de vóxeles, red) se construye **sincrónicamente** antes de registrar la línea. Los elementos que se animan necesitan id estable.
12. Movimientos continuos (filas de texto, puntos que flotan, código de tiempo) son tweens dentro de la línea, deterministas, no loops infinitos. Para el reloj: un tween `{t:0}` → `{t:DUR}` con `ease: "none"` y `onUpdate` que escribe el texto.

## LOOK

- Papel `#eceae4`, tarjeta `#f7f6f2`, tinta `#16213e`, acento `#2e5bff`, suave `#a9b8e8`.
- Grilla: líneas de 1,5 px de tinta al 9%, cada 180 px, desplazada 40 px en y. Marcas de corte de 34 px y 3 px de grosor en (24,150), (1022,150), (24,1500), (1022,1500).
- Fuentes incluidas en HyperFrames, sin `@font-face`: **Archivo Black** (titulares, cifras, subtítulos), **Playfair Display** cursiva 500 (frases "humanas": globo, citas, "¿por qué?"), **Space Mono** mayúsculas con `letter-spacing: 0.14em` (rótulos técnicos). Nada legible bajo 20 px.
- Tarjetas: radio 26-30 px, borde 4 px de tinta, sombra dura `8-10px 8-10px 0` de tinta, o suave `0 30px 40px` de tinta al 22% para las fichas en perspectiva.
- Colores de la red por grupo, en `GROUPS` del storyboard.

## Geometría (1080 x 1920)

- HUD superior en y 196: izquierda `APELLIDOS · SANTIAGO ’12`, derecha código de tiempo `00:00:SS:FF` real.
- Zona del contenido: y 305 a 1185. **Todo el contenido de las escenas va 55 px más abajo que en el storyboard** (`CONTENT_DY = 55`, pedido por el usuario para equilibrar el espacio sobre y bajo el contenido). El HUD y el pie no se mueven.
- Subtítulos: y 1205 a 1395 (ya resueltos en `subtitulos.html`). Nada del contenido baja de 1185.
- Pie en y 1420: `0N/07 <sección>` a la izquierda, `● PADRÓN 2012` a la derecha (en escenas 11 a 12b, `● BCN · FIG. 4`; en 13 y 14, `● TU APELLIDO`). Regla de 7 tramos debajo con barra azul de avance.
- Secciones de la regla: 01 La pregunta (0-6,6) · 02 El estudio (6,6-17,7) · 03 Nueve grupos (17,7-28,5) · 04 Entre ellos (28,5-36,8) · 05 El nororiente (36,8-54,8) · 06 El Congreso (54,8-67,4) · 07 Tu apellido (67,4-82).

## MOTION

| Qué | Regla |
|---|---|
| Elementos nuevos (tarjetas, etiquetas, personajes, paneles, globos) | Pop: escala 0 → 1,08 → 1 en ~0,35 s con `back.out(1.4)`; opacidad 0 → 1 en 0,15 s, sin rebote |
| Varios elementos juntos | Desfase de 40-80 ms; el siguiente entra cuando el anterior va en 30-50% |
| Puntos de la red | Aparecen escalonados (40-60 ms) y después flotan lento: 4-8 px en ciclos de 3-5 s, fase distinta por punto, función seno del tiempo |
| Zoom de entrada | 0,5 s, `power3.out` |
| Vuelta a la vista completa / retroceso de cámara | 0,55-0,9 s, `power3.inOut` |
| Zoom que atraviesa un objeto / salida | `power3.in`, 40-50% más corta que su entrada |
| Líneas (red, conexiones, subrayados) | Se dibujan de un extremo al otro en 0,3-0,5 s, `power2.out` (`stroke-dashoffset` o `scaleX` con origen a la izquierda) |
| Barras y cifras | Crecen en 0,6-1,0 s, `expo.out`; la cifra cuenta a la par |
| Filas de texto grande | Se deslizan horizontal, lineal, 40-70 px/s, sin detenerse |
| Regla y código de tiempo | Lineales con el video |
| Cambio de rótulo de sección | Salida con blur 6 px y opacidad 0 en 0,13 s; entrada con blur 6 → 0 en 0,13 s |

Los títulos y textos que ya llegaron quedan quietos mientras se leen.

## BANNED

Naranjo, negro puro como color de marca, brillos, neón, partículas decorativas, gradientes nuevos, vidrio, fundidos de pantalla completa entre escenas, textos que flotan o respiran, escalas lentas sobre títulos, rebote en opacidad o color, cifras o apellidos que no estén en el storyboard, etiquetas que adelanten lo que la voz aún no dice.

## Arquitectura

- `index.html`: root 1080 x 1920, solo hosts y audio. Orden de capas: `fondo` (papel y grilla), escenas, `marco` (HUD y pie, transparente), `subtitulos`.
- `compositions/marco.html` (id `marco`): fondo papel, grilla, marcas de corte, HUD con código de tiempo vivo, pie con rótulo de sección, texto derecho y regla con barra de avance. Dura todo el video.
- Una composición por bloque de escenas: `pregunta.html` (01-02, id `pregunta`), `estudio.html` (03a-04b, id `estudio`). Los siguientes tramos agregan `grupos.html`, `nororiente.html`, `congreso.html`, `cierre.html`.
- `compositions/subtitulos.html` por encima del contenido.
- Audio: `<audio id="voz" class="clip" src="assets/voice/voz.mp3" data-start="0" data-duration="...">`.

## Tramo 1: escenas 01 a 03b (0 a 11,44 s)

Palabras clave (s): `¿Has` 0,14 · `Chile,` 0,80 · `círculos,` 1,96 · `apellidos?` 3,80 · `¿Qué` 4,72 · `preguntando` 5,12 · `realidad?` 5,76 · `Dos` 6,64 · `investigadores` 6,80 · `analizaron` 7,60 · `apellidos` 8,24 · `cuatro` 9,16 · `millones` 9,44 · `santiaguinos.` 10,36 · `Buscaron` 11,44.

| Tiempo | Plano | Imagen |
|---|---|---|
| 0,00 | **Primer cuadro completo** (es la miniatura): las tres filas de "APELLIDOS", el círculo punteado y los cuatro personajes ya visibles. Las filas se deslizan desde el cuadro 0: fila 1 a la izquierda, fila 2 (cursiva) a la derecha, franja oscura a la izquierda | `escena_01` |
| 0,30 | Pop del globo *"¿y tus apellidos?"* | `escena_01` |
| 1,96 | En "círculos": el círculo punteado hace pop (1 → 1,04 → 1) y su trazo empieza a girar lento (`stroke-dashoffset` lineal) hasta el fin de la escena | |
| 4,55-5,00 | **Zoom que atraviesa el globo**: escala de la escena 01 de 1 a ~7 con origen en el centro del globo, 0,45 s `power3.in`. Cuando el globo llena la pantalla, corte a la escena 02 | |
| 4,95 | Escena 02: la ficha central entra un poco grande (1,12) y se asienta en 1, 0,5 s `expo.out`. Las cuatro fichas laterales se abren en abanico desde detrás de la central (`rotationY` de 0 a su ángulo y `x` hacia afuera), 0,45 s `power3.out`, 60 ms entre ellas. La fila "APELLIDOS · APELLIDOS · APELLIDOS" en contorno se desliza lineal | `escena_02` |
| 5,12 | Lista técnica: "Nombre JUAN", "Paterno ?", "Materno ?" aparecen línea a línea, 80 ms entre ellas | `escena_02` |
| 5,76 | En "realidad?": las dos líneas azules se dibujan de izquierda a derecha (0,35 s) y los dos "?" hacen pop | `escena_02` |
| 6,45-7,00 | **Transición**: la ficha central se encoge (1 → 0,2) y baja hasta la cima de la pila de fichas del padrón, 0,55 s `power3.inOut`. Las demás fichas, la lista y la fila de contorno salen con `power3.in` en 0,25 s. La pila ya está en su lugar cuando la ficha llega | `escena_03a` |
| 6,64 | Pop del panel `FUENTE / PLOS ONE · 2021 / SURNAME AFFINITY IN SANTIAGO, CHILE` | `escena_03a` |
| 6,80 | Pop del investigador izquierdo y su tarjeta `INSTITUTO MILENIO · DATOS / NAIM BRO`; 120 ms después, el derecho y `U. SANTA MARÍA · IMFD / MARCELO MENDOZA` | `escena_03a` |
| 7,60 | En "analizaron": aparece el rótulo `PADRÓN ELECTORAL` sobre la pila y las capas de la pila hacen un pop escalonado de abajo hacia arriba (30 ms entre capas) | `escena_03a` |
| 9,00-9,90 | **Retroceso de cámara**: la pila y los investigadores se encogen hacia el centro del mapa y se desvanecen, mientras el mapa de Santiago entra desde escala 2,4 a 1, 0,9 s `power3.inOut`. El panel cambia con *blur swap*: sale el de la fuente, entra el de la cifra | `escena_03b` |
| 9,16-10,36 | La cifra cuenta de 0 a **4.652.933** (formato chileno con puntos), `expo.out`, terminando en "santiaguinos." Rótulo `SANTIAGUINOS · PADRÓN ELECTORAL 2012` | `escena_03b` |
| 9,30 | La multitud de 10 x 10 aparece por filas sobre el mapa (40 ms entre filas, cada persona hace pop) | `escena_03b` |
| 10,36-11,44 | Todo quieto salvo las filas que ya no existen; el mapa y la multitud quietos. Se mantiene hasta el final del tramo | `escena_03b` |

Pie: `01/07 LA PREGUNTA` hasta 6,6 s; `02/07 EL ESTUDIO` desde 6,6 s, con el cambio de rótulo de MOTION.

## Decisiones sobre el storyboard

- El subtítulo lo hace `subtitulos.html`; las imágenes del storyboard muestran solo un instante. No escribas subtítulos a mano.
- El globo de la escena 01 aparece a los 0,30 s, no en el cuadro 0. Todo lo demás de la escena 01 sí está en el cuadro 0.
- El código de tiempo del HUD es el real del video, no el del storyboard.

## Tareas del tramo 1

- [ ] T1. `index.html`: 1080 x 1920, root `data-duration="11.44"`, hosts `marco` (0-11,44), `pregunta` (0-6,9), `estudio` (6,4-11,44, con los elementos de la transición coordinados con `pregunta`), `subtitulos` (0-11,44) y el audio `voz` con `data-duration="11.44"`. Si la transición 6,45-7,00 queda más limpia en una sola composición, junta 01-03b en `pregunta.html` y anótalo.
- [ ] T2. `compositions/marco.html` completo para todo el video (secciones y textos de la derecha según la Geometría), con su duración ajustable en una constante `DUR` (ahora 11,44).
- [ ] T3. `compositions/pregunta.html` y `compositions/estudio.html` según la tabla.
- [ ] T4. `python3 scripts/voz.py subtitulos 11.44` y verificar que los subtítulos se vean sobre el contenido.
- [ ] T5. Copiar `storyboard/assets/santiago.js` a `assets/santiago.js` y cargarlo desde `estudio.html`.

## Criterios de aceptación

1. `check --json` sin errores; reporta cada aviso con tu decisión.
2. Snapshots en 0,0 · 0,5 · 2,2 · 4,2 · 5,3 · 6,3 · 7,9 · 9,5 · 11,0 s, cada uno comparado con su imagen (`escena_01`, `escena_02`, `escena_03a`, `escena_03b`). Abre **todos** y di cuáles no abriste.
3. Snapshots de movimiento con `snapshot --range 4.4,5.2 --frames 8`, `--range 6.3,7.1 --frames 8` y `--range 8.9,10.0 --frames 8`: sin restos de la escena anterior, sin cuadros vacíos, sin saltos.
4. El cuadro 0 está completo (filas, círculo, personajes, HUD, pie, primer subtítulo).
5. Render `prueba_tramo1.mp4` con `--quality draft`; `ffprobe` muestra 11,44 s ± 0,05, 1080 x 1920, 30 fps y una pista de audio.

## Límites

Puedes crear y editar `index.html`, `compositions/*.html` y `assets/santiago.js`. No toques `storyboard/`, `assets/voice/`, `voz.json`, `GUION.md`, `CONTEXTO.md` ni `scripts/`. Nada de commits, servicios externos ni regrabar la voz. Responde en español.

---

# Tramos 2 a 4 (resto del video)

Mismas reglas de LOOK, MOTION, BANNED, Geometría (con `CONTENT_DY = 55`) y Contrato. Las imágenes de referencia están en `storyboard/escena_*.png` (sin el desplazamiento de 55 px). La red de apellidos usa `GROUPS` y `NET` de `storyboard/index.html` **tal como están** (≈ 85 puntos, colores por grupo aprobados) y sus puntos **flotan** desde que aparecen: 4-8 px en x e y, ciclos de 3-5 s, fase distinta por punto (`rng`), seno del tiempo de la línea; las líneas que los unen siguen a los puntos.

Composiciones nuevas: `grupos.html` (id `grupos`, prefijo `gr-`, escenas 04a-07b), `nororiente.html` (`no-`, 08a-10), `congreso.html` (`co-`, 11-12b), `cierre.html` (`ci-`, 13-14). Si una transición entre composiciones queda más limpia juntando dos, júntalas y anótalo. Al terminar cada tramo, sube `data-duration` del root, del marco (`DUR`), del audio y de los subtítulos (`python3 scripts/voz.py subtitulos <fin del tramo>`; en el último tramo, sin argumento) y renderiza.

## Tramo 2: escenas 04a a 07b (11,44 a 36,84 s)

| Tiempo | Plano | Imagen |
|---|---|---|
| 11,10-11,60 | Zoom de entrada a una persona de la multitud (0,5 s `power3.out`); al llenar la pantalla, corte a 04a | |
| 11,60 | Personaje de Elena (pop) y tarjeta `NOMBRE / ELENA`; rótulo `EJEMPLO DEL PAPER` | `escena_04a` |
| 12,40 | En "paternos": tarjeta `PATERNO · PADRE / GONZÁLEZ` (acento) hace pop y la línea azul se dibuja desde ELENA hacia ella | `escena_04a` |
| 13,00 | En "maternos": `MATERNO · MADRE / MUÑOZ` hace pop y la línea se completa hasta ella | `escena_04a` |
| 13,60-15,20 | "se juntan… al azar": las dos tarjetas se encogen y se vuelven dos puntos unidos (carry across, 0,6 s). Alrededor aparecen los demás puntos de la red, escalonados, y sus líneas se dibujan. Elena y la tarjeta ELENA salen | |
| 15,20 | Rótulo `PARES QUE SE REPITEN / ≥ 100 VECES MÁS QUE AL AZAR` | `escena_04b` |
| 15,80-16,52 | Los 9 círculos punteados se dibujan y los números 1-9 hacen pop escalonado; el 9 llega en "nueve" (16,52) | `escena_04b` |
| 17,76 | Escena 05: círculos y números salen; la élite pasa a gris `#c3c8d4` (0,4 s) | |
| 18,44 / 19,28 / 20,08 / 21,04 | Chips de color: las dos `MAPUCHE` en "mapuche,", `COREANA`, `GITANA`, las dos `MIXTA` en "mixtas." | `escena_05` |
| 22,00 | Escena 06: lo no élite baja al 30% y sus chips se atenúan (0,4 s) | |
| 22,80 | En "élite:": la élite recupera sus azules, sus líneas internas se engruesan en acento, la elipse punteada azul se dibuja, rótulo `3 GRUPOS DE ÉLITE · NIVEL SOCIOECON. 80–82 / 100` | `escena_06` |
| 23,56 / 26,84 / 27,60 | Chips `ARISTOCRACIA`, `+ FAMILIAS PALESTINAS`, `+ FAMILIAS JUDÍAS` | `escena_06` |
| 28,56 | Escena 07a: zoom de entrada a la élite (`zoom: {cx:740, cy:740, s:1.35}` del storyboard), 0,5 s `power3.out`; los chips salen | `escena_07a` |
| 29,52 | En "resumen": panel con la cita *“behave like ethnic minorities”* (Playfair) y `BRO Y MENDOZA, 2021 · CONCLUSIÓN`, pop | `escena_07a` |
| 33,40 | En "étnica.": subrayado acento bajo "ethnic minorities", 0,35 s | |
| 34,32 | Escena 07b: la red baja al 25%; el panel sale; padre + `PADRE / EDWARDS` hacen pop | `escena_07b` |
| 34,68 | Madre + `MADRE / ZAÑARTU` | `escena_07b` |
| 35,48 | En "hijos": las dos líneas azules se dibujan y el hijo + `HIJO / EDWARDS ZAÑARTU` hacen pop | `escena_07b` |
| 35,76 | Rótulo `AMBOS APELLIDOS DEL MISMO GRUPO` | `escena_07b` |

## Tramo 3: escenas 08a a 10 (36,84 a 54,80 s)

| Tiempo | Plano | Imagen |
|---|---|---|
| 36,84 | Escena 08a: la familia y las tarjetas salen; la cámara retrocede: los puntos de la élite se juntan y achican arriba del mapa mientras el mapa entra (escala 1,15 → 1, 0,8 s `power3.inOut`) | `escena_08a` |
| 37,84-38,90 | En "concentran": los puntos caen hacia el nororiente del mapa (`power3.inOut`), línea punteada azul que los guía | `escena_08a` |
| 38,96 | Rótulo `DONDE VIVEN LOS APELLIDOS / DE LOS 3 GRUPOS DE ÉLITE · 2012` | `escena_08b` |
| 39,76 | En "nororiente": las 5 comunas `ne` se llenan de azul (0,4 s `power2.inOut`) y el chip `NORORIENTE` hace pop | `escena_08b` |
| 41,48 | Escena 09a: los puntos salen; el mapa se achica y baja a la posición de `escena_09a` (0,6 s `power3.inOut`); el nororiente vuelve a gris; entra el panel de barras | `escena_09a` |
| 41,96 / 42,40 / 43,20 | Las comunas no `ne` se llenan de `#8a93a8` al 55%. Barras `PERIFERIA 262`, `CENTRO 276`, `NORPONIENTE Y SUR 295` crecen (0,8 s `expo.out`, la cifra cuenta) | `escena_09a` |
| 46,00 | Escena 09b, en "nororiente,": el nororiente se llena de azul y el resto baja al 18% | `escena_09b` |
| 46,88-47,28 | La barra `NORORIENTE 509` crece en azul; en "duplica." el chip `× 2` hace pop | `escena_09b` |
| 48,32 | Escena 10: mapa y panel salen (`power3.in`); *¿por qué?* entra palabra por palabra (blur 6 → 0) | `escena_10` |
| 48,76 | Rótulo `EXPLICACIONES POSIBLES SEGÚN LOS AUTORES` | `escena_10` |
| 50,24 / 50,64 | Tarjetas `COMPUESTO / GARCÍA-HUIDOBRO` y `COMPUESTO / RUIZ-TAGLE` (pop, con su rotación) | `escena_10` |
| 52,32 / 52,72 | `ORIGEN INGLÉS / EDWARDS` y `ORIGEN FRANCÉS / SUBERCASEAUX` | `escena_10` |

## Tramo 4: escenas 11 a 14 (54,80 a 82,00 s)

| Tiempo | Plano | Imagen |
|---|---|---|
| 54,84 | Escena 11: las tarjetas salen; los 110 asientos del hemiciclo (`hemiciclo()` del storyboard) hacen pop de izquierda a derecha, 8-10 ms entre asientos | `escena_11` |
| 55,04 | Panel `SIGLO XIX · CONGRESO` | `escena_11` |
| 56,48-57,04 | En "cuarenta": los asientos de la élite se encienden en orden (aristocracia ~21%, + fam. judías ~15%, + fam. palestinas ~3%) y el panel cuenta hasta `~40%` | `escena_11` |
| 57,56 | Chips de leyenda con su porcentaje | `escena_11` |
| 60,52 | En "dos mil diecisiete": el panel cambia a `2017 · CONGRESO` (blur swap) | `escena_12a` |
| 63,28 | En "veinte": los asientos sobrantes se apagan de derecha a izquierda; la cifra baja a `~20%`; la leyenda cambia a 5% / 9,5% / 4,5% | `escena_12a` |
| 65,16 | Escena 12b: el hemiciclo baja al 35% | `escena_12b` |
| 65,60 | En "mapuche,": personaje mapuche al centro (pop); panel `2017 · GRUPOS MAPUCHE / ≈ 0%` en verde `#5f9e7a` | `escena_12b` |
| 66,60 | En "ninguno.": chip `● MAPUCHE · ≈ 0%` | `escena_12b` |
| 67,44 | Escena 13: el hemiciclo y el personaje salen; *quizás por eso…* palabra por palabra | `escena_13` |
| 68,08 | Ficha `JUAN ___ ___` hace pop | `escena_13` |
| 69,08 | Rótulo `INTERPRETACIÓN NUESTRA, NO DEL PAPER` | `escena_13` |
| 71,08 / 71,88 / 74,00 | Valores de `CLASE`, `BARRIO`, `CONGRESO` hacen pop en "clase,", "barrio" y "Congreso." | `escena_13` |
| 74,88-75,50 | **Cierre en espejo del inicio**: la ficha se vuelve tarjeta de pantalla completa y la cámara retrocede hasta que es el globo *¿y tus apellidos?* de la escena del círculo (escala ~40 → 1, 0,6 s `power3.out`); personajes y círculo ya en su lugar | `escena_14` |
| 75,04 | `¿Y A TI?` (Archivo Black) hace pop | `escena_14` |
| 77,52 | *¿qué crees que querían saber?* palabra por palabra | `escena_14` |
| 79,52 | En "comentarios.": chip `COMENTA ABAJO` con un ícono de globo de diálogo dibujado en SVG (no emoji) | `escena_14` |
| 79,52-82,00 | Todo quieto; el círculo punteado sigue girando lento | `escena_14` |

## Criterios de aceptación (tramos 2 a 4)

1. `check --json` sin errores al final de cada tramo; reporta los avisos nuevos.
2. Snapshots, abriéndolos **todos**: 12,0 · 13,3 · 16,7 · 21,3 · 27,9 · 30,5 · 36,2 · 39,0 · 40,5 · 44,5 · 47,6 · 53,5 · 58,0 · 64,0 · 66,8 · 74,4 · 78,0 · 81,8, cada uno contra su imagen.
3. Rangos de movimiento (`--range a,b --frames 8`): 11,0-11,8 · 13,5-15,4 · 21,9-23,0 · 34,2-35,9 · 36,8-39,2 · 41,4-42,2 · 48,2-48,9 · 54,7-55,9 · 63,2-63,9 · 74,8-75,6. Sin restos, sin cuadros vacíos, sin saltos.
4. Los puntos de la red se mueven en todo el tramo 2 y en 08a (comparar dos snapshots separados 1 s).
5. Render final `video_completo.mp4` con `--quality draft`; ffprobe: 82,0 s ± 0,05, 1080 x 1920, 30 fps, audio. Después de cada tramo, `prueba_tramoN.mp4`.
6. El tramo 1 ya aprobado no cambia.
