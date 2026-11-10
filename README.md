# motion_design_skill

Skill de [Claude Code](https://claude.com/claude-code) para hacer **videos explicativos verticales para Instagram (Reels)** con datos, usando [HyperFrames](https://hyperframes.heygen.com). Guía el trabajo en fases que apruebas una por una: guion con fuentes verificadas, look, voz, storyboard en imágenes fijas, plan, animación por tramos, sonido y entrega con portada y texto.

## Qué trae

```
explainer-reel/
├── SKILL.md          # el proceso, fase por fase
├── references/       # guion, storyboard, plantilla de SPEC, sonido, Instagram y lecciones
├── scripts/          # voz.py (voz + subtítulos palabra a palabra), sfx.py, render_final.py
└── looks/            # estilos visuales listos para usar
    ├── retro-pixel/      # ventanas de sistema antiguo y objetos isométricos de píxeles
    └── editorial-tinta/  # papel claro, tipografía editorial, redes, mapas y personajes de bloques
```

Cada look tiene `look.md` (paleta, tipografías, movimiento), `muestra.png`, un `kit/` para copiar al proyecto y un `ejemplo/` con el storyboard y el SPEC de un video real.

## Instalación

1. Instala el plugin de HyperFrames en Claude Code (la skill usa su CLI y su skill `hyperframes:hyperframes`).
2. Clona este repo y enlaza la skill en tu carpeta de skills:

   ```bash
   git clone https://github.com/txusillo/motion_design_skill.git
   ln -s "$PWD/motion_design_skill/explainer-reel" ~/.claude/skills/explainer-reel
   ```

   (o copia la carpeta `explainer-reel` a `~/.claude/skills/`).
3. Necesitas `ffmpeg` y Python 3.
4. Voz, a elección en cada video:
   - **ElevenLabs:** exporta `ELEVENLABS_API_KEY`. Gasta créditos.
   - **Kokoro:** gratis y local; la skill te pide permiso para instalar `kokoro-onnx` en un entorno virtual.

## Uso

En Claude Code, pide algo como *"hagamos un reel explicativo sobre…"*, o pasa un paper o un guion. También puedes llamarla con `/explainer-reel`. La skill te va a preguntar en cada fase antes de seguir.

Los textos de la skill están en español.
