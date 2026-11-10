# Storyboard

## Cómo se hace

- Proyecto aparte: `<proyecto>/storyboard/`, con `init --skip-skills` y las fuentes del look.
- Un `index.html` con una escena por segundo (`data-start` = número de escena), dibujada con el código del look, sin animación.
- Exporta un PNG por escena con `snapshot --at` y arma un tablero con ffmpeg `tile` o `xstack`. Ábrelo al usuario con `open`.
- Nombra los archivos `escena_05a.png`, `escena_05b.png` cuando una escena tenga varios momentos (zoom de entrada y vuelta).
- Ejemplos completos: `looks/retro-pixel/ejemplo/storyboard.html` y `looks/editorial-tinta/ejemplo/storyboard.html`.

## Qué debe tener cada escena

- **El objeto central a la vista**, con suficiente contraste contra el fondo y sin quedar tapado por los paneles.
- **Apoyo gráfico**: personajes, pilas de billetes o una multitud de 100 personas con algunas encendidas. Una cifra sola en pantalla no se recuerda.
- **Panel** con el dato y su unidad, y **subtítulo** con la palabra que se está diciendo.
- **Transición** anotada: zoom de entrada a la parte que nombra la voz y vuelta a la vista completa.

## Al presentar

- Muestra una tabla con escena, tiempo, voz, qué se ve y transición.
- Señala lo que podría estar mal: clichés, cifras ilustrativas, escenas con poco tiempo.
- Pide correcciones antes de pasar al plan. Las imágenes se ajustan rápido; un video no.
