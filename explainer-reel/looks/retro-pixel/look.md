# Look: retro-pixel

Ventanas de un computador antiguo y objetos isométricos de píxeles sobre un fondo azul con puntos. Usado en `desigualdad_chile`, que tuvo muy buena recepción.

## Paleta

| Rol | Color | Dónde |
|---|---|---|
| Fondo | `#5f7ca8` | Pantalla completa, con puntos `rgba(205,225,250)` |
| Panel | `#0d1524` | Paneles, ventanas, subtítulos; también textos y líneas sobre el fondo |
| Tinta | `#e6e4cf` | Texto y bordes dentro de paneles |
| Dorado | `#dcc266` | Acento principal, escala, reglas |
| Rosado | `#e8527f` | Lo más extremo (la base, la cima, alertas) |
| Plata | `#d8884a` | Billetes y tramos de ingreso |
| Acero | `#1b2a42` a `#46608a` | Cubos y objetos apagados |

Probado en teléfono: con un fondo más oscuro, la torre se perdía.

## Tipografía

- **Press Start 2P:** títulos y cifras de 56 a 72 px, barras de panel de 28 px. Dibuja Í y É como minúsculas: usa un acento dibujado.
- **VT323:** subtítulos de 64 px y textos de apoyo de 44 a 52 px.

## Materiales

- Paneles con borde de 4 px, barra de título con rayas y sombra dura `12px 12px 0 #060a13`.
- Objetos isométricos (`box` con caras al 100%, 80% y 56% de luz): cubos, personas, pilas de billetes, multitudes de 10 x 10, edificios.
- Pantalla: líneas de barrido y viñeta suave (`kit/compositions/pantalla.html`). Color final con `eq=brightness=0.035:contrast=1.14:saturation=1.32:gamma=1.10`.

## Movimiento

- Lo digital salta: `steps(8-12)` en revelados y líneas.
- Zoom `power3.out` de 0,5 s y vuelta `power3.inOut` de 0,55 s.
- Pop up al aparecer cada objeto: escala de 0 a 1,18 en 0,18 s y vuelta a 1 en 0,12 s.
- Fondo: onda expansiva sutil desde el centro, cada 6 s.

## Kit

- `compositions/fondo.html`: fondo con puntos. Cambia `DURATION` al largo del video.
- `compositions/pantalla.html`: líneas de barrido y viñeta.
- `templates/subtitulos.template.html`: plantilla para `voz.py`, con la palabra activa resaltada y la escala de Instagram ya aplicada.
- `assets/fonts/`: Press Start 2P y VT323 (OFL).

Dibujos isométricos listos para copiar en `ejemplo/storyboard.html`: torre, personas, niños, mayores, cuidadora, pilas, multitud, refugio, hospital, mapa y globo. `ejemplo/SPEC.md` es el brief real de ese video.

## Evitar

Brillos y neón, fondos oscuros sin probar en el teléfono, textos claros sobre el fondo, y etiquetas que adelanten el remate.
