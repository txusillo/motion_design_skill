# Sonido

## Efectos

`scripts/sfx.py` genera la librería con ElevenLabs (`/v1/sound-generation`) y coloca cada efecto en `index.html`, entre `<!-- sfx -->` y `<!-- /sfx -->`. Configura `sfx.json` en el proyecto.

Lo que funcionó:
- **Pops:** en cada elemento que aparece con salto. Necesitan al menos 6 a 8 variantes (burbuja, gota, madera, corcho, grave), rotando sin repetir seguidas; con 3 se notaba la repetición.
- **Whooshes:** en zooms y cortes, más suaves en la vuelta del zoom. 3 variantes cortas y una larga para retrocesos de cámara.
- **Cartas al barajar:** para billetes que se apilan. Son golpes muy cortos y necesitan compresión para oírse.
- Cada efecto queda con su pico un cuadro después de la imagen, nunca antes.

Si no hay ElevenLabs, propón efectos de Openverse (`/media-use`) o dejarlo sin efectos. No sintetices sonidos en código.

## Música

- **ElevenLabs:** no tiene catálogo; la música se genera con `/v1/music` y `force_instrumental: true`. Plan Starter o superior: uso comercial online, sin atribución, sin distribución en streaming musical.
- Genera 3 o 4 candidatos de 30 s, con prompts distintos de estilo y tempo, y mézclalos bajo 30 s del video para que el usuario los compare.
- La pista larga suele empezar baja y apagarse sola al final. Mide su nivel cada 5 s y, si pasa, empalma una sección en un pulso (`hyperframes beats`) para que llegue pareja al final.
- Volumen bajo la voz: unos 12 a 14 dB más baja.

## Mezcla

- Mide con `ffmpeg loudnorm` y deja el final en -15 LUFS integrados, con pico máximo de -1 dBTP (`scripts/render_final.py`).
- No se puede escuchar: mide, compara por resta con una versión sin el efecto si dudas que suene, y di que fue medido, no oído.
