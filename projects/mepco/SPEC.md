# SPEC: El amortiguador que se soltó (MEPCO), escenas 01 a 23

Este es el brief de implementación en HyperFrames. Manda el storyboard aprobado: si este texto y una imagen no coinciden, gana la imagen, salvo en "Decisiones sobre el storyboard".

GOAL: el espectador entiende que el MEPCO repartía las alzas del combustible en el tiempo, que en marzo de 2026 se soltó por decreto y que el golpe entero llegó de una vez a la bomba y a la inflación, sin tiempo para adaptarse.
OUTPUT: HyperFrames, 1080 x 1920, 30 fps, Instagram Reels.
TIME: video completo de 96,23 s (voz de 95,09 s + 1,15 s de cierre; toma 3). Se implementa en 5 tramos (ver al final). El **tramo 1** (escenas 01 a 03, de 0 a 9,75 s) es una prueba corta del enfoque.

## Fuentes de verdad

| Qué | Dónde |
|---|---|
| Imágenes aprobadas, una por escena | `storyboard/escenas/escena_<NN>.png` (01, 02, 03, 04a, 04b, 05a, 05b, 06, 07, 08a, 08b, 09, 10a, 10b, 11a, 11b, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23) |
| Tableros | `storyboard/tablero_tramo1.png`, `storyboard/tablero_tramo2.png` |
| Código de dibujo ya resuelto: `seg7` (dígitos LED), `ledRow`, `GLOW`, `car` (auto en corte con resorte), `person`/`FAMILY`, `barrel`, `truck`, `congress`, `doc`, `liter`, el gráfico (`CH`, `PAR`, `PUMP`, `path`, `stepPath`, `gapArea`, `chartFrame`), `stairs`, `gauge`, `cal`, `ROAD`, `T` (texto SVG) | `storyboard/index.html`: **copia** las funciones a `assets/dibujo.js`, no las importes desde `storyboard/` |
| Fuentes | `assets/fonts/BarlowCondensed-{SemiBold,Bold,ExtraBold}.ttf` (con `@font-face`, ver LOOK). JetBrains Mono viene incluida en HyperFrames |
| Voz | `assets/voice/voz.mp3` (95,09 s, toma 3) |
| Tiempos por palabra | `assets/voice/voz.json` (`words[]` con `text`, `start`, `end`). Son aproximados (Kokoro): sincroniza con la palabra, no con la sílaba |
| Subtítulos | `compositions/subtitulos.html`, ya generado para todo el video. Para recortarlo a un tramo: `python3 /home/queno/.claude/skills/explainer-reel/scripts/voz.py subtitulos <segundos>`; sin argumento vuelve a ser el video completo |
| Guion y fuentes de cada cifra | `voz.json` (líneas), `CONTEXTO.md` |

**Nunca** corras `voz.py grabar`: regraba la voz.

## Cómo correr HyperFrames

Desde `/home/queno/hyperframes-videos/mepco/`, siempre con este lanzador (no `npx hyperframes`):

```bash
node /home/queno/.claude/plugins/cache/hyperframes/hyperframes/0.9.31/skills/hyperframes/scripts/plugin-cli.mjs <comando>
```

Comandos: `check --json`, `snapshot --at 1.2,3.4` (usa **punto** decimal), `snapshot --range 4.0,5.0 --frames 8`, `render --quality draft -o prueba_tramo1.mp4`. Las capturas quedan en `.hyperframes/artifacts/snapshots/<id>/`.

## Contrato de render

1. Todo elemento temporizado lleva `class="clip"`, `data-start` y `data-duration`, y se ve en `[inicio, fin)`.
2. La duración del video es el `data-duration` del root. Ningún clip puede pasarse de ella.
3. Cada composición registra una sola línea pausada, después de crear sus tweens: `window.__timelines["<id>"] = tl`.
4. Prohibido `Date.now()`, `Math.random()` sin semilla, `fetch`, timers y `repeat: -1`. Todo es función del tiempo de la línea.
5. En las sub-composiciones, estilos, marcado y scripts van dentro de `<template>`, y el root se estiliza como `#root`.
6. Usa `fromTo` o `set`, no `from`. No tweenees `display`, `visibility` ni `autoAlpha` en un `.clip`: anima un hijo.
7. Sin `transform` CSS en elementos que GSAP transforma: fija la posición inicial con `gsap.set`.
8. Rutas `assets/...` sin `/` inicial.
9. Ids únicos en toda la página, con prefijo por composición (ver Arquitectura).
10. Host, root de la escena y clave de la línea usan el mismo id.
11. El SVG dibujado por script se construye **sincrónicamente** antes de registrar la línea, con ids estables en todo lo que se anima. Lo que cambia de forma (un resorte que se comprime, una aguja, una línea que se dibuja) se anima con atributos (`attr`, `strokeDashoffset`) o con `scale`/`rotation` sobre un `<g>` con `transform-origin` definido por GSAP (`svgOrigin`).
12. Los movimientos continuos (el auto que avanza, los dígitos LED que corren) son tweens dentro de la línea. Un contador LED se hace con un objeto `{v:0}` y `onUpdate`, que reescribe los `fill` de los segmentos de ese dígito.

## LOOK "surtidor"

- Fondo `#26292d`, con puntos `rgba(255,255,255,.07)` de 1,6 px cada 36 px. Panel (letreros LED, gráficos) `#0e0f10`, con borde `#3d4248` de 3-4 px y radio de 18-26 px.
- Tinta `#ecebe6` · gris `#8b8d91` · **ámbar LED `#ffb000`** (cifras encendidas, siempre con el filtro `GLOW`) · segmento apagado `#211d12` · **naranjo `#ff6a13`** (precio en la bomba, alzas, palabra activa del subtítulo, alarma) · **verde agua `#46c2b0`** (el amortiguador, el impuesto, lo que absorbe el Estado: siempre ese significado) · carrocería `#454a52` · cifra antigua o atenuada `#a8916a`.
- Fuentes: **Barlow Condensed** 700/800 (titulares, cifras, subtítulos) con `@font-face` a `assets/fonts/`; **JetBrains Mono** en mayúsculas con `letter-spacing` de 0,12-0,16 em para rótulos técnicos.
- **Tamaño mínimo:** con la escala de zona segura (0,88), todo texto legible debe medir **26 px o más** en el código. Los rótulos del storyboard de 18 a 24 px se suben a 26; si no caben, acorta el texto y no lo achiques.
- Las cifras en dígitos LED usan `seg7`, con los segmentos apagados visibles. El signo `$` y el `%` van en Barlow.

## Geometría (1080 x 1920)

- **Zona segura de Instagram:** dentro de cada composición de contenido, del marco y de los subtítulos, envuelve todo en un `<div>` de pantalla completa con `transform: translateY(77px) scale(0.88); transform-origin: 540px 883px` (este div nunca se anima). El fondo de puntos (`fondo.html`) va sin escala, a pantalla completa. Las coordenadas de abajo son las del storyboard, antes de la escala.
- HUD en y 236: `MEPCO · 2014–2026` a la izquierda y un rótulo de escena a la derecha (el que aparece arriba a la derecha de cada imagen), con *blur swap* al cambiar.
- Contenido: y 300 a 1180.
- Subtítulos: y 1236 a 1464, ya resueltos en `subtitulos.html`. El contenido no baja de 1180, salvo la calle (`ROAD`, y 1130-1170).
- Pie en y 1500: `0N/05 <SECCIÓN>` a la izquierda y `● mm:ss` (tiempo real del video) a la derecha, en ámbar. Debajo, una barra de avance de 8 px (`#3d4248`, con relleno `#ff6a13` lineal con el video).
- Secciones: 01 EL GOLPE (0–5,59) · 02 EL AMORTIGUADOR (5,59–29,85) · 03 LA DECISIÓN (29,85–52,34) · 04 EL EFECTO (52,34–78,23) · 05 HOY (78,23–96,23).

## MOTION

| Qué | Regla |
|---|---|
| Elementos nuevos (paneles, etiquetas, personas, barriles, documentos) | Pop: escala 0 → 1,06 → 1 en ~0,3 s, `back.out(1.4)`; opacidad 0 → 1 en 0,12 s, sin rebote |
| Varios elementos juntos | Desfase de 50-80 ms |
| **Dígitos LED** | "Corren" como el contador de una bomba: cada dígito pasa por valores intermedios cada 2 cuadros y se fija; 0,5-0,8 s en total, de izquierda a derecha, 60 ms entre dígitos. Un dígito que cambia de valor (1.170 → 1.542) corre desde su valor anterior |
| Zoom de entrada | 0,5 s, `power3.out` |
| Retroceso de cámara / vuelta a la vista completa | 0,6-0,9 s, `power3.inOut` |
| Líneas del gráfico, flechas, escaleras | Se dibujan de izquierda a derecha con `strokeDashoffset`, `power2.out`. La escalera de la escena 14 sube escalón por escalón (`steps`), el muro naranjo en 0,15 s |
| Áreas verde agua | Aparecen detrás de la línea que las cierra, 0,4 s |
| Barras y cifras | 0,6-1,0 s, `expo.out`; la cifra cuenta a la par |
| El auto | Avanza por la calle a velocidad constante (60-90 px/s) cuando hay calle; al pasar el bache, la rueda sube siguiendo la curva y el resorte se comprime (`scaleY` 1 → 0,6 sobre su extremo superior). Sin resorte (escenas 11a y 12), la carrocería salta con la rueda |
| Impacto (escena 12) | Sacudida de pantalla de 0,25 s, ±8 px amortiguados (seno con caída exponencial, determinista), y tres líneas de impacto naranjas que se dibujan en 0,12 s |
| Aguja (escena 18) | Rota de 2,8 a 4,0 en 0,9 s, `power3.inOut`, con un pequeño rebasamiento (`back.out(1.2)`) |
| Rótulos del HUD y del pie | *Blur swap*: salida con blur de 6 px y opacidad 0 en 0,13 s; entrada con blur de 6 → 0 en 0,13 s |

Lo que ya llegó queda quieto mientras se lee. El brillo `GLOW` es estático: no parpadea.

## BANNED

Fundidos de pantalla completa entre escenas, partículas, humo o llamas, emojis, brillos que respiran, parpadeos de neón, textos que flotan, rebote en opacidad o color, gradientes nuevos, cifras que no estén en el storyboard, etiquetas que adelanten lo que la voz aún no dice (por ejemplo, el +$372 antes de "trescientos setenta" en la escena 01: ver Decisiones), y el verde agua usado para algo que no sea el amortiguador, el impuesto o el Estado.

## Arquitectura

- `index.html`: root de 1080 x 1920 (cambia el viewport y quita el placeholder 1920 x 1080), solo hosts y audio. Orden de capas: `fondo`, escenas, `marco`, `subtitulos`.
- `compositions/fondo.html` (id `fondo`, prefijo `fo-`): fondo y puntos, todo el video.
- `compositions/marco.html` (id `marco`, `mc-`): HUD con el rótulo derecho por escena, pie con sección, tiempo `mm:ss` y barra. Su duración vive en la constante `DUR`.
- Escenas: `golpe.html` (`gp-`, escenas 01–03), `amortiguador.html` (`am-`, 04a–08b), `decision.html` (`de-`, 09–13), `efecto.html` (`ef-`, 14–19), `hoy.html` (`hy-`, 20–23). Si una transición queda más limpia juntando composiciones, júntalas y anótalo.
- `assets/dibujo.js`: las funciones de dibujo copiadas del storyboard, cargado por cada composición de escenas.
- `compositions/subtitulos.html`, encima de todo.
- Audio: `<audio id="voz" class="clip" src="assets/voice/voz.mp3" data-start="0" data-duration="...">`.

## Escenas y tiempos (todo el video)

Palabras clave (s) desde `assets/voice/voz.json`.

### Tramo 1: escenas 01 a 03 (0 a 9,75 s), en `golpe.html`

| Tiempo | Plano | Imagen |
|---|---|---|
| 0,00 | **Cuadro 0 completo (es la miniatura):** letrero con el cabezal naranjo `PRECIOS · GASOLINA 93`, la fila `MIÉ 25·03` con `$1170` en `#a8916a` y la fila `JUE 26·03` con `$1542` en ámbar con brillo. HUD, pie y primer subtítulo visibles | `escena_01` |
| 0,00–0,25 | Para que el cuadro 0 tenga cifra, la fila de abajo muestra `1170` en ámbar desde el cuadro 0 | |
| 2,10–3,20 | En "trescientos setenta pesos": los dígitos de abajo **corren** de 1170 a 1542 (0,8 s) | `escena_01` |
| 3,22 | En "pesos.": pop de la etiqueta naranja `+$372` y del rótulo `POR LITRO · PROM. RM` | `escena_01` |
| 3,80–4,10 | **Transición:** el letrero se encoge y se parte en las dos hojas de calendario (la fila de arriba va a la hoja MIÉ y la de abajo a la hoja JUE), 0,5 s `power3.inOut` | |
| 4,00 | Escena 02: calendario `MIÉ 25` apagado y `JUE 26` encendido, cada uno con su precio LED chico | `escena_02` |
| 4,34 | En "día": la flecha naranja se dibuja (0,25 s), con pop de la luna y de `1 NOCHE` | `escena_02` |
| 4,83 | En "otro.": pop de `+$372 POR LITRO` | `escena_02` |
| 5,45–5,95 | **Transición:** retroceso de cámara. Los calendarios se encogen hacia el extremo derecho de la línea de tiempo (2026) mientras el panel de la escena 03 entra desde escala 1,4 a 1, 0,7 s `power3.inOut` | |
| 5,59 | Escena 03: el panel `LEY N° 20.765 · 09·07·2014` y el eje 2014–2026 | `escena_03` |
| 6,07–6,37 | En "doce años,": pop del sello `12 AÑOS` (con su rotación de -8°) | `escena_03` |
| 6,98–8,60 | Desde "ley": se dibuja la línea punteada gris que zigzaguea (`PETRÓLEO: SALTA`) y, 0,3 s después, la línea naranja casi plana (`PRECIO BOMBA: SUAVE`), ambas de izquierda a derecha | `escena_03` |
| 8,67–9,75 | En "evitar eso.": todo quieto | `escena_03` |

Pie: `01/05 EL GOLPE` hasta 5,59 s y `02/05 EL AMORTIGUADOR` desde ahí. HUD derecho: `JUE 26·03·2026` → `MIÉ → JUE` (4,0) → `LEY 20.765` (5,59).

### Tramo 2: escenas 04a a 08b (9,75 a 29,75 s), en `amortiguador.html`

| Tiempo | Plano | Imagen |
|---|---|---|
| 9,75–10,30 | El panel de la línea de tiempo baja y se vuelve la calle (la línea naranja se aplana hasta y 1130); el auto entra desde la izquierda | |
| 10,30 | En "MEPCO,": `MEPCO` hace pop, con su subtítulo técnico en dos líneas | `escena_04a` |
| 11,67 | En "amortiguador": los resortes se encienden en verde agua y el rótulo `AMORTIGUADOR` hace pop con su línea guía | `escena_04a` |
| 11,90–12,40 | **Zoom de entrada al resorte delantero** (0,5 s `power3.out`) hasta el encuadre de 04b. Pop de `MEPCO = AMORTIGUADOR` | `escena_04b` |
| 13,35–13,90 | Vuelta a la vista completa (0,6 s `power3.inOut`) | |
| 13,98 | En "petróleo": pop del barril `PETRÓLEO` y de `AFUERA ↑` | `escena_05a` |
| 14,47 | En "salta": la línea punteada forma el bache (se dibuja) y la calle levanta su bache; el auto avanza y la rueda delantera sube con el resorte comprimido | `escena_05a` |
| 15,30–15,80 | **Zoom que atraviesa el resorte** hasta los dos litros (0,5 s) | |
| 15,40 | Escena 05b: litro `ANTES` (impuesto 450, importar 700, `$1.150`) | `escena_05b` |
| 16,11–16,90 | En "menos impuesto": aparece el litro `BACHE`; la parte gris crece y la verde agua se achica (0,7 s `expo.out`); la cifra cuenta hasta `$1.200`. Pop de la nota `UN LITRO · CIFRAS ILUSTRATIVAS` | `escena_05b` |
| 18,00–18,50 | Retroceso: los litros se encogen y salen; entra el gráfico de 06 | |
| 18,09–21,40 | El gráfico: la línea punteada se dibuja hasta la semana 20; la línea naranja sube **en escalones** al ritmo de la voz (un escalón en "poco:", "veinte", "pesos", "semanas"); el área verde agua `ESTADO ABSORBE` crece por detrás; pop de cada `+$20` con su escalón | `escena_06` |
| 21,40 | Pop de la nota `≈ $20–26 CADA 3 SEMANAS SEGÚN LA FUENTE · ILUSTRATIVO` | `escena_06` |
| 22,97–25,85 | En "petróleo baja,": las líneas siguen a la derecha (paneo de cámara suave si hace falta); la punteada cae y la naranja baja en escalones más lentos; en "recupera" se llena el área `RECUPERA` y `ESTADO ABSORBE` cambia a `PONE` con *blur swap* | `escena_07` |
| 26,45–26,90 | Las dos áreas verde agua salen del gráfico, se vuelven los cuadrados `PONE` y `RECUPERA`, y el gráfico se desvanece | |
| 26,90 | En "barato.": pop del `=` y de `AL FINAL, EL MISMO PRECIO` | `escena_08a` |
| 27,50 | Escena 08b: los cuadrados salen; la familia hace pop (60 ms entre personas) y entra el panel `SEMANAS` | `escena_08b` |
| 28,15–29,40 | En "tiempo": las casillas se llenan de ámbar una a una (13 de 20, 60 ms entre casillas); pop de `TIEMPO PARA AJUSTAR` y de `PRESUPUESTO, FLETES, PASAJES` | `escena_08b` |

HUD derecho: `LEY 20.765` → `EL BACHE` (13,4) → `UN LITRO` (15,4) → `DE A POCO` (18,1) → `DE VUELTA` (22,3) → `EL TRATO` (26,5).

### Tramo 3: escenas 09 a 13 (29,75 a 52,25 s), en `decision.html`

| Tiempo | Plano | Imagen |
|---|---|---|
| 29,75–30,40 | Retroceso de cámara: la familia sale y vuelve el gráfico, ahora con el eje `2026 →` | `escena_09` |
| 30,90 | En "veintiséis,": las dos líneas se dibujan planas hasta x 560 | `escena_09` |
| 31,68 | En "guerra": pop del barril `GUERRA` y de `MEDIO ORIENTE` | `escena_09` |
| 32,94–33,80 | En "disparó": la punteada se dispara hasta arriba (0,6 s `power2.in`), con la flecha `↑`; la naranja sube apenas | `escena_09` |
| 34,40 | Escena 10a: la calle con el bache grande; el auto lo sube inclinado (rotación de 0 a -26° sobre la rueda trasera, 0,8 s `power2.inOut`) y el resorte se comprime al máximo y brilla | `escena_10a` |
| 35,37 | En "hizo": pop de `EL BACHE MÁS GRANDE` y de `EL RESORTE AGUANTA` | `escena_10a` |
| 37,90–38,40 | Zoom de entrada al resorte, que se convierte en el letrero LED (corte en el punto de máxima escala) | |
| 38,02 | En "Fisco": letrero `COSTO PARA EL FISCO · 19 AL 25 DE MARZO`; en "ciento cuarenta" los dígitos corren hasta `140`; `MILL.` y la nota hacen pop | `escena_10b` |
| 39,24–40,30 | Los 14 billetes caen y se apilan (40 ms entre billetes, `power2.in` y un pequeño rebote al tocar) | `escena_10b` |
| 40,70 | Escena 11a: el documento del decreto hace pop | `escena_11a` |
| 41,97 | En "soltarlo,": los resortes del auto se cortan (cada uno se separa en dos mitades que caen, 0,3 s) y quedan los muñones grises. Pop de `SIN RESORTE` | `escena_11a` |
| 42,72 | En "decreto,": el timbre `DECRETO` cae sobre el documento (escala 1,6 → 1, 0,2 s `power3.in` y una sacudida de 3 px) | `escena_11a` |
| 43,10 | Escena 11b: el Congreso hace pop en gris | `escena_11b` |
| 43,20–44,30 | En "sin pasar": la flecha punteada naranja va de `HACIENDA` a `BOMBA` rodeando el Congreso por arriba (se dibuja en 1 s) | `escena_11b` |
| 44,95 | Escena 12: el auto **sin resorte** sube el bache grande; la carrocería salta con la rueda | `escena_12` |
| 46,02 | En "subió": **impacto** (sacudida y líneas de MOTION) | `escena_12` |
| 46,35–47,76 | El letrero LED corre de `1170` a `1542`; en "pesos." pop de `+$372` | `escena_12` |
| 48,45 | Escena 13: barras `GASOLINA 93` (crece en "noventa": ya visible) y camión | `escena_13` |
| 48,71–49,79 | En "diésel,": la barra `DIÉSEL` crece hasta su largo en "ochenta:"; las cifras cuentan `+$372`/`+$580` | `escena_13` |
| 50,47 | En "sesenta y dos": pop de `+62%` y de `+32%`, y de la nota `ALZA DEL 26·03·2026 · ENAP` | `escena_13` |

Pie: `03/05 LA DECISIÓN` desde 29,85. HUD derecho: `MARZO 2026` → `23·03·2026` (40,7) → `VÍA DECRETO` (43,1) → `SIN AMORTIGUADOR` (44,95) → `26·03·2026` (48,45).

### Tramo 4: escenas 14 a 19 (52,25 a 78,15 s), en `efecto.html`

| Tiempo | Plano | Imagen |
|---|---|---|
| 52,25 | Escena 14: eje de semanas y `PARA SUBIR $372` | `escena_14` |
| 52,74–55,44 | Desde "regla": la escalera verde agua sube escalón por escalón (todos los escalones entre 52,74 y 55,30); pop de `REGLA DE ANTES: ~43 SEMANAS` en "año." | `escena_14` |
| 55,44 | Pop de la nota `~$26 CADA 3 SEMANAS · CÁLCULO PROPIO` | `escena_14` |
| 56,16 | En "Llegó": el muro naranjo sube de golpe (0,15 s) con un pequeño impacto (±4 px); pop de `MARZO 2026: 1 NOCHE` y `+$372` | `escena_14` |
| 56,47–56,90 | Corte a la escena 15 en "noche,": la luna y la familia hacen pop, y el panel `SEMANAS PARA AJUSTAR` aparece con todas las casillas apagadas | `escena_15` |
| 57,40 | En "tiempo": el `0` naranja hace pop sobre las casillas | `escena_15` |
| 58,90 | Escena 16: el camión entra por la calle desde la izquierda (0,7 s `power3.out`) | `escena_16` |
| 60,15–61,80 | En "camiones": las etiquetas `↑` sobre PAN, LECHE y FRUTA hacen pop, una en "traen", otra en "todo" y otra en "compras." | `escena_16` |
| 62,60 | Escena 17: letrero LED `IPC · ABRIL 2026 · VARIACIÓN MENSUAL` | `escena_17` |
| 64,39–65,40 | En "uno coma tres": los dígitos corren hasta `1,3` y el `%` hace pop | `escena_17` |
| 66,66–67,50 | En "el mayor": la barra `MAR 1,0%` y luego `ABR 1,3%` crecen (0,7 s `expo.out`); pop de `MAYOR ALZA MENSUAL DESDE JULIO 2022 · INE` en "desde" | `escena_17` |
| 69,20 | Escena 18: velocímetro con el arco gris y la aguja en 2,8 | `escena_18` |
| 69,93 | En "anual": el arco verde agua de la meta (2-4) se dibuja y `META BANCO CENTRAL: 3% ± 1` hace pop | `escena_18` |
| 70,64 | En "dos coma ocho": `2,8%` hace pop y queda la marca punteada en 2,8 | `escena_18` |
| 71,46–72,40 | En "cuatro": la aguja rota hasta 4,0 (ver MOTION) y `→ 4,0%` hace pop | `escena_18` |
| 73,60–74,30 | **Retroceso de cámara a la escalera contra el muro** (la de la escena 14), que entra desde escala 1,5 | |
| 74,92–77,44 | Desde "repartía": **zoom al pie del muro** (0,8 s `power3.inOut`), con el encuadre de la escena 19; la familia, el camión y la tienda hacen pop (80 ms entre ellos); en "golpe." el muro sacude ±4 px | `escena_19` |

Pie: `04/05 EL EFECTO` desde 52,34. HUD derecho: `ANTES VS. AHORA` → `1 NOCHE` (56,47) → `CADENA` (58,9) → `IPC` (62,6) → `INFLACIÓN` (69,2) → `DE GOLPE` (73,6).

### Tramo 5: escenas 20 a 23 (78,15 a 96,23 s), en `hoy.html`

**La voz cambió en este tramo** (toma 3, 11-11-2026): la frase de la escena 20 ahora dice "…la noventa y tres vuelve a niveles de récord." Hasta 78 s el audio es idéntico. El video completo dura **96,23 s** (voz de 95,09 s + 1,15 s de cierre). Tiempos nuevos: `Hoy,` 78,23 · `seis` 78,78 · `julio,` 80,23 · `noventa` 80,79 · `vuelve` 81,63 · `récord.` 82,74 · `Y` 83,63 · `Congreso` 85,40 · `ley` 86,14 · `veinte` 88,08 · `pesos.` 88,48 · `¿Tú` 89,26 · `año` 91,03 · `noche?` 92,42 · `Te` 93,26 · `leo` 93,42 · `comentarios.` 94,00.

**La escena 20 cambia respecto de su imagen:** se saca el letrero LED `93 · HOY · RM ≈$1538` (el precio cambia el jueves y no se quiere una cifra que quede vieja). La escena queda con la línea `MÁXIMO HISTÓRICO`, las 6 flechas y `6 ALZAS SEGUIDAS`; en su lugar, arriba a la izquierda, va un rótulo grande en Barlow 800 ámbar `GASOLINA 93`.

| Tiempo | Plano | Imagen |
|---|---|---|
| 78,15 | Escena 20: la línea punteada `MÁXIMO HISTÓRICO` se dibuja y el rótulo `GASOLINA 93` hace pop | `escena_20` (sin el LED) |
| 78,78–80,23 | Desde "seis": las 6 flechas crecen de abajo hacia arriba una tras otra (0,2 s entre flechas, 0,35 s cada una, `expo.out`), con las etiquetas JUL a NOV; pop de `6 ALZAS SEGUIDAS` en "julio," | `escena_20` |
| 81,63–82,74 | Desde "vuelve": la última flecha (NOV) crece hasta **tocar** la línea `MÁXIMO HISTÓRICO`; en "récord." la línea destella una vez (opacidad 1 → 0,4 → 1 en 0,3 s, sin escala) | `escena_20` |
| 83,55 | Escena 21: la 20 sale completa antes (regla de salida); el documento `PROYECTO DE LEY…` hace pop | `escena_21` |
| 85,40 | En "Congreso": pop del Congreso | `escena_21` |
| 86,14–88,48 | En "ley": el auto entra por la calle **sin resorte**; en "veinte pesos." los resortes verde agua vuelven a aparecer (crecen con `scaleY` 0 → 1 desde arriba) y `¿DE VUELTA EL RESORTE?` hace pop | `escena_21` |
| 89,15–89,80 | Retroceso a la vista completa de la escalera contra el muro (la de las escenas 14 y 19), con la familia al pie | `escena_22` |
| 91,03–92,42 | En "año": la escalera se ilumina de abajo hacia arriba; en "noche?" el muro sacude ±4 px | `escena_22` |
| 93,20 | Escena 23: el globo hace pop y la familia sigue abajo | `escena_23` |
| 93,42–94,00 | Las líneas `¿TE ALCANZÓ` y `EL TIEMPO?` aparecen una tras otra | `escena_23` |
| 94,00–96,23 | Todo quieto | `escena_23` |

Pie: `05/05 HOY` desde 78,23. HUD derecho: `NOV 2026` → `¿Y TÚ?` (89,15) → `COMENTA` (93,2).

**Regla de transiciones** (vale para todo el video): la escena vieja sale completa en 0,15-0,2 s (`power3.in`, escala a 0,9 y opacidad a 0) y la nueva entra cuando la vieja está en opacidad ≤ 0,15. Nunca dos escenas legibles a la vez. Las excepciones son los retrocesos y zooms continuos sobre el mismo objeto (por ejemplo, 21→22 vuelve a la escalera).

## Decisiones sobre el storyboard

- El subtítulo lo pone `subtitulos.html`: no escribas subtítulos a mano. Las imágenes muestran solo un instante.
- Escena 01: el storyboard muestra el estado final (1542 y +$372). En el video, la fila de abajo parte en `1170` ámbar y corre en "trescientos setenta"; la etiqueta `+$372` aparece en "pesos.".
- El tiempo del pie (`● mm:ss`) es el real del video, no el del storyboard.
- Los rótulos de menos de 26 px se agrandan (ver LOOK).
- La escena 19 es un zoom de la misma escalera de la escena 14, no un dibujo distinto.

## Tareas del tramo 1

- [ ] T1. `index.html`: 1080 x 1920, root `data-duration="9.75"`; hosts `fondo`, `golpe` (0–9,75), `marco` y `subtitulos` (0–9,75), y el audio `voz` con `data-duration="9.75"`.
- [ ] T2. `compositions/fondo.html` y `compositions/marco.html` completos para todo el video (secciones y rótulos del HUD de todos los tramos, según las tablas), con la constante `DUR` (ahora 9,75).
- [ ] T3. `assets/dibujo.js` con las funciones del storyboard, y `compositions/golpe.html` según la tabla del tramo 1.
- [ ] T4. `python3 /home/queno/.claude/skills/explainer-reel/scripts/voz.py subtitulos 9.75` y verifica que los subtítulos se lean sobre el contenido. Aplica la escala de zona segura también a los subtítulos, envolviendo su contenido; si para eso tienes que editar `templates/subtitulos.template.html`, hazlo ahí y regenera (nunca edites a mano el HTML generado).

## Criterios de aceptación del tramo 1

1. `check --json` sin errores; reporta cada aviso con tu decisión.
2. Snapshots en 0,0 · 1,0 · 2,6 · 3,5 · 4,5 · 5,2 · 6,5 · 8,0 · 9,5 s, cada uno comparado con su imagen (`escena_01`, `escena_02`, `escena_03`). Abre **todos** y di cuáles no abriste.
3. Snapshots de movimiento con `snapshot --range 2.0,3.4 --frames 8` (dígitos que corren), `--range 3.7,4.3 --frames 8` y `--range 5.4,6.1 --frames 8`: sin restos de la escena anterior, sin cuadros vacíos y sin saltos.
4. El cuadro 0 está completo: letrero con las dos filas encendidas, HUD, pie y primer subtítulo.
5. Recorte simulado de Instagram en 0,0 y 6,5 s (`ffmpeg ... -vf crop=988:1920:46:0`): nada importante queda cortado y ningún texto pasa de y 1700 ni queda bajo los botones (x > 910 con y > 1200).
6. Render `prueba_tramo1.mp4` con `--quality draft`; `ffprobe` muestra 9,75 s ± 0,05, 1080 x 1920, 30 fps y una pista de audio.

## Criterios de aceptación (tramos 2 a 5)

1. `check --json` sin errores al final de cada tramo; reporta los avisos nuevos.
2. Snapshots de **cada** imagen del tramo, en un segundo donde esa imagen esté completa (elígelo de la tabla y dilo), abriéndolos todos.
3. Rangos de movimiento (`--frames 8`) en cada transición y cada contador LED del tramo. Mínimo: 11,8-12,5 · 15,2-16,9 · 26,4-27,6 · 34,4-35,3 · 41,9-43,0 · 45,9-46,4 · 52,7-56,5 · 71,4-72,5 · 73,6-75,8 · 87,1-89,6.
4. Las escenas ya aprobadas no cambian.
5. Después de cada tramo, render `prueba_tramoN.mp4` y ffprobe. Al final, `video_completo.mp4`: 96,23 s ± 0,05, 1080 x 1920, 30 fps, audio.
6. Al terminar cada tramo, sube `data-duration` del root, el `DUR` del marco, el audio y los subtítulos (`voz.py subtitulos <fin del tramo>`; en el último tramo, sin argumento).

## Límites

Puedes crear y editar `index.html`, `compositions/*.html`, `assets/dibujo.js` y `templates/subtitulos.template.html`. No toques `storyboard/`, `assets/voice/`, `voz.json`, `CONTEXTO.md`, `looks_propuestas/` ni la skill. Nada de commits, servicios externos ni regrabar la voz. Responde en español.
