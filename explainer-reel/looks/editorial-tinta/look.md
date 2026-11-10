# Look: editorial-tinta

Papel claro con grilla fina, tipografía editorial que mezcla una palo seco gruesa con una serif cursiva, rótulos técnicos en monoespaciada y personajes isométricos de bloques. Nació de referencias de motion design en Instagram (showreels con "MOTION / motion", tarjetas en perspectiva, tableros de cifras). Usado en `apellidos_santiago`.

## Paleta

| Rol | Color | Dónde |
|---|---|---|
| Papel | `#eceae4` | Fondo de pantalla completa |
| Tarjeta | `#f7f6f2` | Fichas, paneles, globos |
| Tinta | `#16213e` | Texto, bordes, franjas invertidas |
| Acento | `#2e5bff` | La palabra que se dice, lo que importa en la escena, barra de avance |
| Suave | `#a9b8e8` | Fichas secundarias, pisos, rellenos |

Para datos con varias categorías, un color por grupo y el acento reservado a lo que la historia señala (en `apellidos_santiago`: verdes, mostaza, rosa y violetas para los grupos; tres azules para la élite).

## Tipografía (incluidas en HyperFrames)

- **Archivo Black:** titulares, cifras, subtítulos (50 px, palabra activa con fondo acento).
- **Playfair Display cursiva 500:** frases "humanas" (globos, citas, "¿por qué?").
- **Space Mono** en mayúsculas, `letter-spacing: 0.14em`: rótulos técnicos, HUD, pie. Nada bajo 20 px.

## Materiales

- Grilla de 1,5 px de tinta al 9%, cada 180 px. Marcas de corte en las cuatro esquinas.
- HUD arriba (título del video y código de tiempo real) y pie abajo con `0N/07 <sección>` y una regla de 7 tramos con barra de avance.
- Filas de texto gigante que se cortan en los bordes, alternando palo seco, cursiva y franja invertida; o una palabra en contorno.
- Tarjetas con radio 26-30 px, borde 4 px y sombra dura de tinta; fichas en perspectiva (`rotateY`) en abanico.
- Personajes isométricos de vóxeles (`box`, `person` en `ejemplo/storyboard.html` y `kit/assets/common.js`), con tonos de piel y peinados variados.

## Movimiento

| Qué | Regla |
|---|---|
| Elementos nuevos | Pop 0 → 1,08 → 1 en ~0,35 s, `back.out(1.4)`; opacidad sin rebote |
| Grupos de elementos | Desfase de 40-80 ms |
| Puntos de redes | Entrada escalonada y flotación lenta (4-8 px, ciclos de 3-5 s) |
| Zoom de entrada | 0,5 s `power3.out` |
| Vuelta o retroceso de cámara | 0,55-0,9 s `power3.inOut` |
| Zoom que atraviesa / salida | `power3.in`, 40-50% más corta que la entrada |
| Líneas | Se dibujan en 0,3-0,5 s `power2.out` |
| Barras y cifras | 0,6-1,0 s `expo.out`, la cifra cuenta a la par |
| Filas de texto grande | Deslizamiento lineal 40-70 px/s |
| Cambio de rótulo | Blur swap de 0,13 s |

## Kit

- `compositions/fondo.html`: papel y grilla, debajo de todas las escenas.
- `compositions/marco.html`: HUD con código de tiempo vivo, pie con el rótulo de cada sección y regla de avance; queda encima de las escenas. Cambia el título del HUD, `DUR`, las secciones y sus tiempos.
- `templates/subtitulos.template.html`: plantilla para `voz.py` (Archivo Black 50 px, palabra activa con fondo acento, y 1205). Va en `templates/`, no en `compositions/`: ahí rompe el `check`.
- `assets/common.js`: vóxeles (`box`, `person`, `at`), paleta de personajes, red de puntos con semilla y asientos de hemiciclo.

`ejemplo/storyboard.html` (con `ejemplo/santiago.js`, mapa de 34 comunas) tiene todas las escenas del video de los apellidos: círculo de personajes, fichas en abanico, pila, multitud sobre mapa, red de grupos, mapa con zona encendida, barras, tarjetas, hemiciclo y ficha final. `ejemplo/SPEC.md` es su brief real, con las reglas de movimiento en detalle.

## Evitar

Naranjo y negro (el usuario los descartó), neón, brillos, vidrio, fundidos de pantalla completa, títulos que flotan o respiran, rebote en opacidad o color.
