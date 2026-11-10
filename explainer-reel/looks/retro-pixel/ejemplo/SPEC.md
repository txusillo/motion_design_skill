# SPEC: Desigualdad Chile, escenas 1 a 10

Brief de implementación en HyperFrames. El storyboard aprobado manda: si este texto y una imagen
no coinciden, gana la imagen, salvo en "Decisiones sobre el storyboard" más abajo.

GOAL: el espectador entiende el tamaño de cada grupo de Chile mirando una sola torre de cubos.
OUTPUT: HyperFrames, 1080 x 1920, 30 fps, para Instagram Reels.
TIME: tramo 1 (escenas 1-3) 0 a 10,62 s. Tramo 2 (escenas 4-10) hasta 36,28 s. Video completo: 74,3 s de voz.

## Fuentes de verdad

| Qué | Dónde |
|---|---|
| Imágenes aprobadas | `storyboard/escena_*.png` y `storyboard/storyboard_01-10.png` |
| Dibujo ya resuelto (torre, cubos, personas, multitud, billetes, refugio) | `storyboard/index.html` |
| Ventana, mar de píxeles, barra, retícula y su animación | `compositions/apertura.html` |
| Fondo de puntos | `compositions/fondo.html` (no rediseñar; solo su `DURATION`) |
| Líneas de barrido | `compositions/pantalla.html` (no cambiar) |
| Voz y tiempos por palabra | `assets/voice/vo_guion.mp3`, `assets/voice/vo_guion.json` |
| Subtítulos | `compositions/subtitulos.html`, generado por `python3 scripts/voz.py --solo-subtitulos SEGUNDOS` |
| Transiciones y apoyos | `ESCENAS.md` |

**Nunca** llames a ElevenLabs: nada de `scripts/voz.py` sin `--solo-subtitulos`.

## Cómo correr HyperFrames

Desde `desigualdad_chile/`, siempre con este lanzador:

```bash
node ~/.claude/plugins/cache/hyperframes/hyperframes/0.9.13/skills/hyperframes/scripts/plugin-cli.mjs <comando>
```

Comandos: `check --json`, `snapshot --at 1.2,3.4`, `render --quality looks -o archivo.mp4`.
Las capturas quedan en `.hyperframes/artifacts/snapshots/<id>/`.

## Contrato de render

1. Un elemento temporizado lleva `class="clip"`, `data-start` y `data-duration`; se ve en `[inicio, fin)`.
2. La duración del video es `data-duration` del root. Ningún clip puede pasarse de ella.
3. Cada composición registra una sola línea pausada: `window.__timelines["<id>"] = tl`.
4. Prohibido `Date.now()`, `Math.random()` sin semilla, `fetch`, timers, `repeat: -1`. Todo es función del tiempo.
5. En sub-composiciones, estilos, marcado y scripts van dentro de `<template>`; el root se estiliza como `#root`.
6. Usa `fromTo` o `set` en la línea, no `from`. No tweenear `display`, `visibility` ni `autoAlpha` en un `.clip`.
7. Sin `transform` CSS en elementos que GSAP transforma: fija la posición inicial con `gsap.set`.
8. Rutas `assets/...` sin `/` inicial. Fuentes con `@font-face` a `assets/fonts/`.
9. Ids únicos en toda la página: prefijo `tr-` en la torre.
10. Host, root de la escena y clave de la línea usan el mismo id.
11. Dibujos en canvas: un tween `clock` de `{t:0}` a `{t:TOTAL}` con `ease:"none"` y `onUpdate` que redibuja. Esto ya funciona con seek en `fondo.html`.

## LOOK

- Fondo: `#101c33` con puntos de `fondo.html`.
- Paneles: `#0d1524`, borde 4 px `#e6e4cf`, sombra dura `12px 12px 0 #060a13`.
- Tinta `#e6e4cf`, atenuado `#a3a795`, dorado `#dcc266`, rosado `#e8527f`, plata `#d8884a`.
- Títulos: Press Start 2P. Cifras 72 px, títulos de barra 28 px, nada bajo 28 px salvo glifos de botones de ventana.
- Texto de apoyo: VT323. Subtítulos: VT323 64 px, ya resueltos.
- La Í y otras mayúsculas acentuadas de Press Start se ven como minúsculas: evítalas o usa VT323.

## Geometría de la torre (fija, no cambiar)

Canvas 540 x 960 escalado 2x con `image-rendering: pixelated`. Cubo `A=12, B=6, C=13`, base `N=6`, origen `(270, 684)`.
En pantalla: centro x 540, base y 1368, cima y ~470. Panel y 176-430. Subtítulo y 1400-1590.
Una capa de la torre: `layerY(l) = 1296 - l * 26` en pantalla. 1 cubo = 20.000 personas, 1.014 cubos.
Copia `STRATA`, `CUM`, `cubes`, `order`, `box`, `tower` de `storyboard/index.html`.

## MOTION

- Lo digital salta: revelados y líneas usan `steps(8-12)`.
- Zoom a la torre: `power3.out`, 0,5 s. Vuelta: `power3.inOut`, 0,55 s. Solo `scale` y `y` sobre el canvas de la torre, nunca sobre el fondo.
- El zoom usa `transformOrigin: "540px <cy>px"` y `y: target - cy`, como `zoomed()` en el storyboard.
- Paneles y etiquetas aparecen de golpe con `tl.set`. Sin fundidos ni deslizamientos hacia arriba.
- Los textos no se mueven mientras se leen.

## BANNED

Brillos, neón, partículas decorativas, gradientes nuevos, tarjetas de vidrio, fundidos generales, textos que derivan,
loops de respiración, logos, etiquetas de esquina, cifras que no estén en el guion o el storyboard.

## Tramo 1: escenas 1 a 3 (0 a 10,62 s)

Palabras clave en segundos: `Chile?` 1,64 · `Esta` 2,48 · `Chile.` 3,76 · `Cada` 4,56 · `cubo` 4,80 · `veinte` 5,88 · `En` 7,36 · `base,` 7,72 · `un` 8,20 · `cubo:` 8,64 · `los` 9,28 · `sin` 9,84 · `hogar.` 10,00.

| Tiempo | Plano | Imagen |
|---|---|---|
| 0,00 | Ventana visible desde el primer frame. Barra de 0 a 100% en saltos, de 0,3 a 2,2 s. Retícula parpadea | `escena_01` |
| 2,44 | El mar sale de la ventana y llena la pantalla, 0,4 s `steps(10)`. La ventana se oculta al terminar | `trans_02a` |
| 2,86 a 4,16 | La cámara retrocede: el mar era la cara izquierda de un cubo. Torre completa desde el inicio del movimiento | `trans_02b` |
| 4,16 | Torre completa, sin movimiento. Marco alrededor de ese cubo, con el píxel rosado adentro | `trans_02c` |
| 4,80 | El cubo se vuelve dorado; desaparecen marco, mar y píxel. Aparecen el píxel rosado en la cima, `CLASE ALTA?` y el panel `ESCALA / 1 CUBO / = 20.000 PERSONAS` | `escena_02` |
| 5,36 | La línea dorada se dibuja, 0,3 s, desde el cubo hacia el cubo grande | |
| 5,88 | Aparecen el cubo grande y la multitud, de golpe | `escena_02` |
| 7,32 | Se oculta todo lo de escala. La torre pasa a tonos apagados | `escena_03a` |
| 7,72 | Zoom a la base, escala 3,5, `cy=1342`, `target=1142` | |
| 8,32 | Panel `BASE · 1 CUBO / 1 CUBO / = 20.000 PERSONAS`. El cubo de la base se vuelve rosado. Sin etiqueta de cima | `escena_03b` |
| 9,28 | Zoom de vuelta a la torre completa | |
| 9,52 | Aparecen el refugio y la persona. Vuelve la etiqueta de cima | |
| 9,84 | Panel `BASE · 1 CUBO / 20.175 / PERSONAS SIN HOGAR` y línea rosada | `escena_03c` |

### Retroceso de cámara (2,86 a 4,16 s)

- Cubo elegido: `gx=0, gy=2, capa 10` (reemplaza al de `escena_02`). Centro de su cara izquierda en pantalla, con la torre a escala 1: `(480, 1065)`.
- Lados de esa cara a escala 1, en pantalla: `u = (24, 12)`, `v = (0, 26)`. Esquina superior izquierda: centro menos `u/2` y menos `v/2`.
- La torre escala de `S0 = 45` a `1`, en interpolación exponencial, con origen en ese centro, `power3.inOut`. Nunca hay un instante sin torre.
- El mar se dibuja en un canvas de pantalla completa con `setTransform`, como un paralelogramo: sus esquinas interpolan entre la pantalla completa y la cara del cubo a la escala actual de la torre. Termina exactamente sobre la cara. Sin suavizado.
- **El píxel rosado NO viaja:** queda fijo dentro del mar y se aleja con él, y termina dentro del cubo. Se dibuja con la misma transformación, con tamaño mínimo de 6 px para que no desaparezca. Su clara oscura escala con el mar.
- Se eliminan la compresión del mar y el apilado cubo a cubo.

La torre se dibuja con una función `drawTower(t)`, que decide cada color según el tiempo. El tramo 2 agregará más casos a esa función.

## Decisiones sobre el storyboard

- La ventana usa la versión de `apertura.html`, con bandera, botones de ventana y retícula. El tablero 1 simplificó esos detalles.
- El subtítulo muestra las palabras a medida que se dicen; las imágenes son solo un instante.
- La pregunta y cada frase vienen de `subtitulos.html`. No escribas subtítulos a mano.

## Tareas del tramo 1

- [ ] T1. Crear `compositions/torre.html` (id `torre`, prefijo `tr-`), con ventana y mar desde `apertura.html` y torre desde el storyboard, sin la capa de puntos dentro del canvas.
- [ ] T2. Implementar la tabla del tramo 1.
- [ ] T3. En `index.html`: root y hosts a `10.62`; reemplazar el host `apertura` por `torre`; audio `assets/voice/vo_guion.mp3` con `data-duration="10.62"`. En `fondo.html`, `DURATION = 10.62`.
- [ ] T4. Borrar `compositions/apertura.html` solo cuando `torre.html` funcione.
- [ ] T5. Verificar. Generar `prueba_esc01-03.mp4`.

## Criterios de aceptación del tramo 1

1. `check --json` sin errores. Reporta cada aviso que quede y por qué.
2. Snapshots en 1,2 · 5,9 · 7,5 · 8,5 · 10,3 comparados contra `escena_01`, `02`, `03a`, `03b`, `03c`: mismos elementos en la misma posición.
3. Snapshots en 2,6 · 3,2 · 4,0 · 8,0 · 9,5: las transiciones ocurren y no hay manchas ni elementos cortados.
4. MP4 de 1080 x 1920, con audio, de 10,6 s, medido con `ffprobe`.

## Límites

Toca solo `compositions/torre.html`, `compositions/apertura.html` (borrar), `compositions/fondo.html` (`DURATION`) e `index.html`.
No toques `storyboard/`, `scripts/`, `assets/`, `GUION.md`, `ESCENAS.md` ni los MP4 existentes. No hagas commits.

## Tramo 2: escenas 4 a 10 (10,62 a 36,28 s)

Corta en 36,28 s, justo antes de "Pero". Las imágenes siguen `storyboard/escena_*.png`.
Sigue la misma composición continua `torre.html`. Al abrir cada escena, oculta con `tl.set` el panel, las líneas y los apoyos de la anterior.

Colores de la torre: lo ya contado `[62,70,84]`, lo pendiente tonos apagados, y el estrato activo en su color.
Encendido "cubo a cubo": la cantidad de cubos encendidos sale de `t`, en orden de `idx`. Cifras con conteo: `power1.out`, formato `es-CL`, y terminan en el número exacto.

Zooms con los valores de "MOTION": `(escala, cy, target)`. Durante un zoom se ocultan etiqueta y píxel de cima, apoyos y líneas; vuelven al terminar la vuelta.

| Tiempo | Plano | Imagen |
|---|---|---|
| **Escena 4** | | |
| 10,80 | Panel `MITAD DE CHILE / 50% / DE LA POBLACIÓN`. El cubo de la base sigue rosado | `escena_04` |
| 12,08 a 13,12 | Se encienden cubo a cubo estratos 1 y 2 (tinta). Aparecen los tres niños y su línea | |
| 13,12 a 14,00 | Se enciende estrato 3 (`INK2`). Aparecen las dos personas mayores y su línea | |
| 14,08 a 14,60 | Se enciende estrato 4 (`INK3`). Aparece cuidadora con silla de ruedas y su línea | |
| 14,60 | Línea dorada y etiqueta `MITAD` | `escena_04` |
| **Escena 5** | | |
| 15,10 | Zoom `(3,2, 905, 900)`. Estrato 5 dorado | `escena_05a` |
| 15,44 | Panel `SIN TRABAJO · 49 CUBOS / CASI 1.000.000 / NO ENCUENTRA TRABAJO` | `escena_05a` |
| 16,32 | Vuelta del zoom | |
| 16,90 | Fila de 4 personas, letrero `SIN VACANTES` y línea | `escena_05b` |
| **Escena 6** | | |
| 17,50 | Zoom `(2,4, 813, 900)`. Estrato 6 se enciende cubo a cubo en naranjo hasta 18,90. Panel `INGRESO · 230 CUBOS`, conteo a `4.600.000` hasta 18,96, `PERSONAS` | `escena_06a` |
| 19,60 | Vuelta del zoom | |
| 20,16 a 21,30 | Llave. La pila crece de 0 a 34 billetes, de a uno. Valor `$680.000 / AL MES / 34 BILLETES DE $20.000`, a su altura final desde 20,16 | `escena_06b` |
| **Escena 7** | | |
| 22,40 | Zoom `(3, 673, 900)`. Estrato 7 se enciende hasta 23,40. Panel con conteo a `3.100.000` hasta 23,20. La pila sigue en pantalla, oculta por el zoom si corresponde | `escena_07a` |
| 23,64 | Vuelta del zoom | |
| 24,00 a 24,90 | Llave. La pila crece de 34 a 75 desde donde estaba. Valor `$1.500.000 / AL MES / 75 BILLETES DE $20.000` | `escena_07b` |
| **Escena 8** | | |
| 25,10 | Se ocultan la pila y su texto. Panel `HASTA $1.500.000 AL MES`, conteo de 0 a `93%` hasta 26,20, `DE LOS CHILENOS` | `escena_08` |
| 25,24 a 26,20 | Sin zoom: estratos 0 a 7 se encienden en tinta, cubo a cubo | |
| 26,48 a 27,60 | Llave. Multitud de 100, con personas encendidas de 0 a 93, y `93 DE CADA 100` | `escena_08` |
| **Escena 9** | | |
| 29,40 | Zoom `(4,5, 598, 900)`. Estrato 8 dorado hasta 30,00. Panel `INGRESO · 50 CUBOS / 1.000.000 / HASTA $3.000.000 AL MES` | `escena_09a` |
| 30,52 | Vuelta del zoom | |
| 31,12 a 31,90 | Llave. Tres pilas de 50 crecen una tras otra. Profesional, y `$3.000.000 / 150 BILLETES DE $20.000` | `escena_09b` |
| **Escena 10** | | |
| 32,12 | Panel `$3.000.000 O MÁS / 4% / DE LOS TRABAJADORES` y llave. Estrato 9 rosado, el resto `[62,70,84]` | `escena_10a` |
| 32,80 a 33,84 | Multitud con personas encendidas de 0 a 4, y `4 DE CADA 100` | `escena_10a` |
| 33,28 | Ejecutivo sobre su piso | `escena_10a` |
| 34,56 | Se ocultan los apoyos. Zoom a la cima `(3,5, 540, 900)`, 0,6 s. Se queda ahí hasta el final | `escena_10b` |

Notas de dibujo:
- `box`, `person`, `kid`, `elder`, `caregiver`, `exec`, `professional`, `crowd`, `pile`, `tent` están en `storyboard/index.html`. `pile` y `rand` no pueden alterar el dibujo entre frames: calcula el desplazamiento de cada billete una sola vez al iniciar.
- `pile` debe aceptar la cantidad actual, para crecer. Lo mismo `crowd` con la cantidad encendida.
- Los accesorios se redibujan en su propio canvas solo cuando cambia su estado.

### Tareas del tramo 2

- [ ] T6. Extender `torre.html`, sin cambiar lo aprobado de las escenas 1 a 3.
- [ ] T7. `index.html`: root y hosts a `36.28`; audio con `data-duration="36.28"`. `fondo.html`: `DURATION = 36.28`.
- [ ] T8. Generar `prueba_esc01-10.mp4`, sin sobrescribir `prueba_esc01-03.mp4`.

### Criterios de aceptación del tramo 2

1. `check --json` sin errores. Reporta cada aviso que quede.
2. Snapshots contra su imagen: 14,9 `escena_04` · 15,9 `05a` · 17,3 `05b` · 18,8 `06a` · 21,8 `06b` · 23,3 `07a` · 24,95 `07b` · 28,5 `08` · 30,3 `09a` · 32,0 `09b` · 34,3 `10a` · 36,0 `10b`.
3. Snapshots de movimiento: 10,9 · 12,6 · 16,6 · 20,7 · 24,4 · 25,7 · 27,0 · 31,5 · 33,3 · 34,8: sin restos de la escena anterior, sin saltos del zoom.
4. Busca que la escena 3 siga igual: 10,3 calza con `escena_03c`.
5. MP4 de 1080 x 1920, con audio, de 36,3 s.

## Tramo 3: escenas 11 a 17 (36,28 a 76,00 s)

Voz hasta 74,32 s; imagen hasta 76,00 s. Las imágenes son `storyboard/escena_11a.png` a `escena_17b.png`. Dibujo resuelto en `storyboard/index.html`, sección "Escenas 11 a 17": `sPerson`, `family`, `hospital`, `ruler`, `chileMap`, `pointInChile`, `globe`, `equator`, `topCube`, `LAND`, `CHILE`.

### Estructura

| Host | Archivo | Inicio | Duración | z-index |
|---|---|---|---|---|
| `fondo` | `fondo.html` | 0 | 76 | 0 |
| `torre` | `torre.html` | 0 | 76 | 1 |
| `regla` | `regla.html` (nuevo) | 41,24 | 9,76 | 2 |
| `mapa` | `mapa.html` (nuevo) | 51,00 | 10,60 | 2 |
| `estado` | `estado.html` (nuevo) | 61,60 | 8,28 | 2 |
| `subtitulos` | `subtitulos.html` | 0 | 76 | 3 |
| `pantalla` | `pantalla.html` | 0 | 76 | 4 |
| `voz` | audio | 0 | 74,32 | |

- **Los tiempos de abajo son absolutos.** Dentro de `regla`, `mapa` y `estado` el reloj parte en 0 al iniciar el host: resta su inicio.
- `torre.html` se oculta completa a los 41,24 s y vuelve a los 69,88 s.
- Prefijos de ids: `rg-`, `mp-`, `es-`. Cada archivo copia solo los ayudantes que usa. Fondo transparente en los tres.
- `fondo.html`: `DURATION = 76`. `subtitulos.html` ya está generado: no lo toques.

### Plano por plano

| Tiempo | Plano | Imagen |
|---|---|---|
| **Escena 11** | Sigue el zoom a la cima de la escena 10 | |
| 36,32 | La franja rosada se apaga; toda la torre en `[62,70,84]`. Solo queda `topCube`: un cubo rosado chico sobre la cima, bordes nítidos | `escena_11a` |
| 37,12 | Panel `CAMBIA LA REGLA / PATRIMONIO / YA NO SE MIDE EN SUELDOS`, en rosado | `escena_11a` |
| 39,24 | Lupa crece de escala 0,3 a 1, 0,35 s `steps(6)`, sobre el cubo. Panel `LA CIMA / UNOS POCOS / CLANES FAMILIARES` | `escena_11b` |
| 39,64 / 40,00 / 40,28 | Aparecen las tres familias, una en cada tiempo | `escena_11b` |
| **Escena 12** | | |
| 41,24 | Corte. Regla horizontal y panel `NUEVA REGLA / 1 MM / = $1.000` | `escena_12a` |
| 41,68 | Aparece el billete azul | `escena_12a` |
| 42,56 | Se dibuja la marca `1 MM` | `escena_12a` |
| 43,36 | La regla gira a vertical, 0,4 s `steps(8)`; se ocultan billete y marca | |
| 44,08 | Panel `SUELDO / $1.500.000 / = 1,5 METROS` | `escena_12b` |
| 44,96 | Aparece la persona grande | `escena_12b` |
| 45,76 | Marca y línea `1,5 M`, con la cabeza de la persona a esa altura | `escena_12b` |
| **Escena 13** | | |
| 46,76 | Panel `JULIO PONCE LEROU`, con cifra `$3.800.000.000.000` (`.num40`) desde 48,40 y línea `PESOS · FORBES 2026 · DÓLAR $981` a 44 px | `escena_13a` |
| 47,10 a 48,40 | Retroceso: persona escala de 5,2 a 1 y queda abajo; la regla se alarga y sale por arriba, `power3.inOut` | `escena_13a` |
| 51,00 | Corte al mapa real de Chile, con panel `JULIO PONCE LEROU / 3.800 KM / PESOS... ` igual al anterior | `escena_13b` |
| 51,04 a 52,84 | La línea dorada se dibuja de Arica a Punta Arenas | |
| 51,44 | `3.800 KM` junto al mapa | `escena_13b` |
| 52,92 / 53,72 | `ARICA` y luego `PUNTA ARENAS` | `escena_13b` |
| **Escena 14** | | |
| 54,44 a 55,30 | Corte al globo acercado sobre Chile, y se aleja: escala 3 a 1 con origen en Chile, `power3.inOut` | `escena_14a` |
| 54,92 | Panel `CLAN LUKSIC`, cifra `$52.000.000.000.000` (`.num40`), línea `CASI · FORBES 2026 · DÓLAR $981` a 44 px | `escena_14a` |
| 58,08 a 60,96 | Línea rosada por el Ecuador, desde lon -70 hacia el este. Da una vuelta y sigue 107° más con la línea clara en lat 6. Solo se dibuja la cara visible. Panel `CLAN LUKSIC / 52.000 KM / MÁS DE 1 VUELTA` | `escena_14b` |
| 60,12 | `ECUADOR: 40.075 KM` bajo el globo | `escena_14b` |
| **Escena 15** | | |
| 61,60 | Corte. Ventana `ESTADO.SYS — 2026` con edificio | `escena_15` |
| 62,00 | `REBAJA DE IMPUESTOS` | |
| 64,40 | `-$3.000.000.000.000` y `POR AÑO · ESTIMACIÓN DIPRES, ABRIL 2026` | `escena_15` |
| 62,48 a 66,24 | Los billetes salen del edificio por saltos a lo largo de 2 rutas, y se pierden por el borde. Determinista | `escena_15` |
| **Escena 16** | Sin `escena_16a`: pasa directo a la grilla | |
| 66,24 | Corte. Panel `ESTIMADO AL AÑO / CERCA DE 12 / HOSPITALES PÚBLICOS NUEVOS` | `escena_16b` |
| 67,12 a 69,10 | Los 12 hospitales aparecen de a uno, de atrás hacia adelante | `escena_16b` |
| **Escena 17** | | |
| 69,88 | Vuelve la torre con sus estratos, `topCube` y `CLASE ALTA?`. Panel `CLASE MEDIA O ALTA / ¿Y TÚ? / ¿DÓNDE TE VES EN LA TORRE?` con el acento `.big` | `escena_17a` |
| 70,64 | Aparece la persona | `escena_17a` |
| 73,00 | Se oculta la persona. Ventana `COMENTARIO`; el panel pasa a `COMENTARIOS / ¿Y TÚ? / TE LEO` | `escena_17b` |
| 73,00 a 76,00 | El cursor parpadea cada 0,5 s con `tl.set`. Se mantiene hasta el final | `escena_17b` |

### Tareas del tramo 3

- [ ] T9. Extender `torre.html` con las escenas 11 y 17, sin cambiar lo aprobado.
- [ ] T10. Crear `regla.html`, `mapa.html` y `estado.html`.
- [ ] T11. Actualizar `index.html` y `fondo.html`.
- [ ] T12. Generar `video_completo.mp4` con `--quality looks`.

### Criterios de aceptación del tramo 3

1. `check --json` sin errores. Reporta cada aviso que quede.
2. Snapshots contra su imagen: 38,5 `11a` · 40,8 `11b` · 43,0 `12a` · 46,4 `12b` · 50,5 `13a` · 54,1 `13b` · 57,5 `14a` · 61,3 `14b` · 65,8 `15` · 69,5 `16b` · 72,5 `17a` · 75,5 `17b`.
3. Snapshots de movimiento: 36,5 · 39,4 · 43,6 · 47,8 · 51,8 · 54,8 · 59,5 · 63,0 · 68,0 · 70,0: sin restos del plano anterior, sin saltos. A los 41,3 s y 70,0 s la torre solo se ve donde corresponde.
4. Las escenas 1 a 10 siguen iguales: compara 5,9 · 14,9 · 21,8 · 28,5 · 34,3.
5. MP4 de 1080 x 1920, con audio, de 76 s.

## Correcciones sobre `video_completo.mp4`

Mandan sobre todo lo anterior. No cambian ni los tiempos de voz ni el resto de los planos.

- [ ] C1. **Etiqueta de cima (`torre.html`).** Sacar `CLASE ALTA?` y el píxel rosado de cima de las escenas 2 a 10. Aparecen solo desde la escena 17 (el cubo chico `topCube` sigue desde 36,32 s). A partir de 4,80 s, la cima de las escenas 2 a 10 no tiene marca alguna.
- [ ] C2. **Fajo en la escena 12 (`regla.html`).** Reemplazar a la persona por un fajo de billetes naranjos (`BILL`), isométrico, en el mismo lugar. Mide exactamente de la base de la regla (y≈1360) a la marca de 1,5 m (y=630), contando su cara superior. Sus billetes se distinguen por líneas; lleva una banda de papel clara a media altura. Aparece a los 44,96 s creciendo desde la base hasta la marca, 0,6 s, `steps(16)`.
- [ ] C3. **Fajo en la escena 13a (`regla.html`).** El retroceso de 47,10 a 48,40 s encoge ese mismo fajo a escala ~0,19, como antes a la persona: la regla sale por arriba y el fajo queda chico, abajo a la derecha de la regla.
- [ ] C4. **Globo que gira (`mapa.html`).** Rotación continua de 54,44 a 61,60 s, función del tiempo, sin el dibujo precalculado fijo. `lon0` va de -66 a 294 (una vuelta exacta), lenta hasta 58,08 s (hasta ~-30) y acompañando la línea de 58,08 a 60,96 s, para terminar con Chile de frente a los 61,60 s. La línea sigue el globo: está en coordenadas de longitud. Precalcula tierra y Chile en una máscara por latitud y longitud, para no probar polígonos en cada cuadro. Mantén el aspecto por píxeles de 2 x 2 y el zoom inicial.
- [ ] C5. **Bandera en la escena 15 (`estado.html`).** Rehacer como la bandera de Chile bien dibujada: mástil vertical parado sobre el techo, y paño plano y recto de 32 x 20 en el canvas de baja resolución (mitad superior blanca con cuadro azul `#3b6fb5` a la izquierda y estrella blanca centrada; mitad inferior roja `#e8527f`, igual a la bandera de la ventana inicial). Sin franjas desfasadas. Debe verse sin tocar el techo.
- [ ] C6. **Hospitales que saltan (`estado.html`).** Cada hospital hace "pop up": escala de 0 a 1,18 y vuelve a 1, en 0,3 s, desde su base en el suelo. Uno nuevo cada 0,16 s desde 67,12 s, en orden de atrás hacia adelante. Todo en función del tiempo.

### Criterios

1. `check --json` sin errores. Reporta cada aviso que quede.
2. Snapshots: 6,0 · 14,9 · 21,8 · 28,5 · 34,3 (sin marca en la cima) · 38,5 (cubo chico) · 45,3 (fajo creciendo) · 46,4 (fajo en la marca) · 47,8 y 50,5 (retroceso, fajo chico) · 55,5 · 57,0 · 59,0 · 60,5 · 61,5 (el globo gira; Chile de frente en 61,5) · 63,0 (bandera) · 67,4 · 67,7 · 68,4 (hospitales saltando) · 72,5 (etiqueta en la escena 17).
3. Generar `video_completo_v2.mp4` con `--quality looks`: 1080 x 1920, con audio, 76 s. No sobrescribas `video_completo.mp4`.

## Correcciones sobre `video_completo_v2.mp4`

Mandan sobre todo lo anterior. No cambian los tiempos de voz ni el resto de los planos.

### P. "Pop up" en todos los apoyos

Mismo salto de los hospitales: escala de 0 a 1,18 en 0,18 s y de vuelta a 1 en 0,12 s, desde la base del elemento en el suelo, en función del tiempo. Dentro de un grupo, cada elemento sale 0,12 s después del anterior. Solo salta la primera vez que aparece: si vuelve tras un zoom, aparece sin salto.

| Escena | Tiempo | Elemento |
|---|---|---|
| 2 | 5,88 | Cubo grande y luego la multitud |
| 3 | 9,52 | Refugio y persona |
| 4 | 12,08 | Tres niños, de a uno |
| 4 | 13,12 | Dos personas mayores, de a una |
| 4 | 14,08 | Cuidadora con silla de ruedas |
| 5 | 16,90 | Letrero `SIN VACANTES` y las 4 personas de la fila, de a una |
| 8 | 26,48 | Multitud, como bloque; luego se encienden sus personas |
| 9 | 31,12 | Profesional con maletín |
| 10 | 32,80 | Multitud, como bloque |
| 10 | 33,28 | Ejecutivo y su piso |
| 11 | 39,64 / 40,00 / 40,28 | Cada familia: piso y personas, de a una familia |
| 15 | 61,60 | Edificio de La Moneda |
| 17 | 70,64 | Persona |

Las pilas de billetes y el fajo siguen creciendo como están; no saltan.

### M. La Moneda (escena 15)

El edificio pasa a parecerse al Palacio de La Moneda:
- Volumen largo y bajo: fachada larga en la cara izquierda, color piedra clara `[226, 218, 198]`, proporción ancho/alto cercana a 3:1.
- Fachada: cuerpo central que sobresale, con 4 columnas y puerta oscura. A cada lado, dos filas de ventanas altas y regulares, alineadas con la inclinación de la cara.
- Cornisa continua arriba, con baranda de balaustres.
- La bandera de Chile ya corregida, sobre el centro del techo.
- Debe entrar completa dentro de la ventana, con al menos 32 px de margen, en la mitad inferior.

### B. La plata que se pierde (escena 15)

Reemplaza las dos filas de billetes sueltos:
- Una pila de billetes grande y clara frente a La Moneda, a la derecha de la puerta.
- De 62,48 a 66,24 s, los billetes salen de a uno de la pila: una sola fila, en un arco hacia arriba a la derecha, y se pierden por el borde de la ventana. La pila baja de 40 a 8 billetes, en sincronía con los que salen.
- Etiqueta en VT323 44 px, color `#e8527f`, sobre el arco, desde 62,48 s: `EL ESTADO DEJA DE RECAUDAR`. Debe caber dentro de la ventana.
- Usa billetes del mismo tamaño que las pilas de las escenas 6 y 7.

### Criterios

1. `check --json` sin errores. Reporta cada aviso que quede.
2. Snapshots en plena subida del salto: 5,95 · 9,58 · 12,15 · 13,2 · 14,15 · 17,0 · 26,55 · 31,2 · 32,87 · 33,35 · 39,7 · 61,67 · 70,7. Y ya asentados: 6,6 · 10,3 · 14,9 · 17,6 · 28,5 · 34,3 · 40,8 · 72,5.
3. Escena 15: 61,9 · 63,0 · 64,6 · 66,1: La Moneda completa, la pila baja y una sola fila de billetes sale hacia el borde.
4. Sin saltos al volver de un zoom: 16,87 y 31,07.
5. Generar `video_completo_v3.mp4` con `--quality looks`: 1080 x 1920, con audio, 76 s. No sobrescribas otros MP4.

## Actualización de desocupados

INE, julio-septiembre 2026: 1.007.976. Reemplaza a 989.000 y a `CASI 1.000.000`. Voz: "Más de un millón no encuentra trabajo." La toma anterior queda en `assets/voice/vo_guion_v1.mp3`.

## Escena 5 sostenida

Se agregó 1 s desde 17,5 s. **Los tiempos de todas las tablas anteriores a esta nota son sin ese segundo.** `torre.html` lo aplica con `warp` y `shiftChildren`; los hosts `regla`, `mapa` y `estado` parten en 42,24, 52 y 62,6. Duración total: 77 s.

## Composición achicada y centrada

Por Instagram, `torre`, `regla`, `mapa`, `estado` y `subtitulos` usan en `#root`: `transform: translateY(77px) scale(0.88); transform-origin: 540px 883px`. Las coordenadas de las tablas son sin esa transformación. `fondo` y `pantalla` no se transforman. El mar y la regla usan lienzos mayores para seguir llenando la pantalla.
