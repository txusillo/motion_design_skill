---
name: explainer-reel
description: Proceso para hacer un video explicativo vertical para Instagram (Reel) con HyperFrames, de la idea o el guion al MP4 final con portada y texto con fuentes. Úsala siempre que el usuario quiera hacer un reel, un video explicativo, un explainer, un video con datos o "un video como el de la desigualdad", aunque no nombre la skill, y también para retomar uno de esos proyectos.
---

# Explainer reel

Un video vertical que explica una sola idea con datos, en fases que el usuario aprueba una por una. Nació del reel "¿Quiénes componen la clase alta en Chile?", que funcionó muy bien en redes. Cada look trae un proyecto de ejemplo en `looks/<look>/ejemplo/` (storyboard y `SPEC.md`).

Lo que hace funcionar este proceso es que el usuario ve cada cosa antes de que se gaste en ella: el guion antes de grabar, imágenes fijas antes de animar y un tramo animado antes del resto. Es más barato corregir una imagen que un video renderizado.

## Antes de empezar

- Lee la skill `hyperframes:hyperframes` y sus referencias de explainer y vertical. Esta skill no reemplaza su contrato de render: lo da por sabido.
- Corre la CLI con el lanzador del plugin (ver `references/plugin-installation.md` de HyperFrames), no con `npx hyperframes`.
- Crea el proyecto en `<carpeta de proyectos>/<slug>/` con `init --skip-skills`. Si el usuario no tiene una carpeta de proyectos de reels, pregúntale dónde crearla (por ejemplo `~/Documents/code/explainer_videos/`).
- Los looks están en `looks/`, dentro de esta skill.
- Todo se habla en el idioma del usuario. El formato es 1080 x 1920, 30 fps, solo para Instagram por ahora.

## Fases

Termina cada fase con una pregunta concreta y espera la respuesta. Si el usuario corrige algo, ajusta y vuelve a mostrar solo lo que cambió.

### 1. Guion

Lee `references/guion.md`. El guion tiene tres partes: **gancho** (los primeros 2 a 3 s, una pregunta o dato que obligue a quedarse), **explicación** (un objeto visual que se construye frase a frase) y **pregunta que interpela** al espectador, cerrando con una invitación a comentar.

- Si el usuario trae un guion, revísalo: aritmética, frases cortadas y afirmaciones sin respaldo.
- Si el video nace de un paper o un informe, léelo completo y discútelo con el usuario antes de escribir: cuál era su objetivo, qué afirma y qué solo sugiere, y qué cifras se pueden decir sin traicionarlo.
- **Verifica cada cifra en la web** o en la fuente original y arma la tabla de fuentes en `CONTEXTO.md` desde ya. Una cifra sin fuente se reescribe ("unos pocos clanes") o se saca. En un video sobre temas sensibles, los comentarios van a buscar el error.
- Propón el largo según el contenido y estima la duración con unas 2,5 a 3 palabras por segundo.

### 2. Look

Apenas se apruebe el guion, **pregúntale al usuario qué look quiere**. Lee `looks/README.md`, abre la `muestra.png` de cada look con `open` y ofrécelos en una pregunta con opciones (una por look, más "uno nuevo"), con una línea de para qué sirve cada uno.

- Si elige uno existente: lee su `look.md` y copia su `kit/` al proyecto respetando las carpetas (`compositions/`, `templates/`, `assets/`). Su `ejemplo/storyboard.html` tiene el código de dibujo listo para copiar.
- Si quiere uno nuevo: pide referencias (capturas, videos, colores que no quiere), propón dos o tres paletas sobre las dos primeras escenas del guion y deja que elija. Al final del video, guárdalo como look nuevo en `looks/` con `look.md`, `muestra.png`, `kit/` y `ejemplo/`, y súmalo a la tabla de `looks/README.md`.

### 3. Voz

**Pregunta al usuario** qué motor usar. No hay voz por defecto.
- **ElevenLabs:** mejor calidad, gasta créditos y necesita `ELEVENLABS_API_KEY`. Lista sus voces con la API y pregunta cuál, y si quiere acento con una etiqueta (por ejemplo `[Chilean accent] ` con `eleven_v4`). `eleven_v4` ignora el parámetro `speed`: para un ritmo más rápido o un tono más grave usa etiquetas (`[fast-paced] [serious, matter-of-fact tone] `) y prueba antes solo con el gancho, que cuesta pocos créditos.
- **Kokoro, gratis y local:** voz `ef_dora`, español neutro. Los tiempos por palabra salen aproximados, repartidos por largo de palabra. Necesita `kokoro-onnx`; si no está, `voz.py` lo avisa: pide permiso antes de instalarlo en un entorno virtual.

Con la respuesta, escribe `voz.json` y corre `scripts/voz.py grabar`. Graba **una sola toma, sin acelerar el audio después**: frases pegadas o aceleradas suenan raras. Las cifras se escriben como se dicen ("veinte mil") y el subtítulo muestra dígitos con `digits`. Guarda cada toma anterior en `assets/voice/tomas/` y pasa al usuario el audio para que lo escuche.

### 4. Storyboard

Lee `references/storyboard.md`. Imágenes fijas por escena en un proyecto aparte, `storyboard/`, mostradas por tramos (unas 10 escenas por vez) en un tablero.
- Cada escena tiene apoyo gráfico: personajes, objetos o una multitud que hagan concreta la cifra. Una pantalla con solo texto es una escena incompleta.
- Usa transiciones con zoom: la vista completa abre y cierra cada momento, y el zoom entra a la parte que nombra la voz.
- Propón y espera correcciones por tramo antes de seguir.

### 5. Plan

Escribe `SPEC.md` con `references/spec-template.md`: tiempos reales de la voz, coordenadas, colores, reglas del render, reglas de movimiento del look, tareas y criterios de aceptación con los segundos exactos a revisar. Es el brief de alguien que no vio esta conversación.

### 6. Implementación con un modelo más barato

Lanza un subagente con `model: "sonnet"` por tramo, empezando por uno corto (3 escenas) para probar el enfoque. Pásale el `SPEC.md`, las imágenes del storyboard, el lanzador de la CLI y los archivos que puede tocar. Pídele que abra todos los snapshots de los criterios, no algunos.

Cuando termine, **revisa tú** frames sacados del MP4 contra el storyboard, en todos los momentos clave y en las transiciones. No te quedes con su reporte. Luego muéstraselo al usuario y continúa al siguiente tramo con `SendMessage` al mismo subagente. Los renders en calidad borrador a veces no abren en QuickTime: haz una copia con `ffmpeg -c:v libx264 -profile:v high -movflags +faststart` para mostrarla.

### 7. Sonido

Lee `references/sonido.md`. Efectos sutiles y variados (pops, whooshes, cartas) con `scripts/sfx.py`, y música de fondo. Si es con ElevenLabs, genera 3 o 4 candidatos de 30 s para elegir y luego la pista completa. Nadie puede escucharlo por ti: mide y dilo.

### 8. Instagram y entrega

Lee `references/instagram.md`: zonas seguras, contraste en teléfono, render final con `scripts/render_final.py` a -15 LUFS, portada, texto con fuentes y `CONTEXTO.md`. Pídele al usuario que lo pruebe en su teléfono antes de darlo por terminado.

## Lo que ya salió mal

Lee `references/lecciones.md` antes de implementar. Reúne errores de proyectos anteriores que cuestan caro de detectar tarde.
