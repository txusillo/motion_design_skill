# Plantilla de SPEC.md

Ejemplos reales: `looks/retro-pixel/ejemplo/SPEC.md` y `looks/editorial-tinta/ejemplo/SPEC.md`.

```markdown
# SPEC: <título>, escenas X a Y

El storyboard aprobado manda: si este texto y una imagen no coinciden, gana la imagen.

GOAL: <qué entiende el espectador al terminar>
OUTPUT: HyperFrames, 1080 x 1920, 30 fps, Instagram Reels.
TIME: tramo N de A a B s. Video completo: C s.

## Fuentes de verdad
| Qué | Dónde |
(imágenes, código de dibujo del storyboard, kit del look, voz y su JSON de tiempos, subtítulos, cómo regenerarlos sin API)

## Cómo correr HyperFrames
(ruta exacta al lanzador del plugin y comandos)

## Contrato de render
(las reglas de la skill hyperframes que más se rompen: .clip, fromTo, sin transform CSS en elementos animados, ids únicos con prefijo, un reloj que redibuja los canvas)

## LOOK
(colores con hex, fuentes y tamaños mínimos, sombras, glifos problemáticos)

## Geometría
(coordenadas fijas del objeto central, zonas de paneles y subtítulos, zona segura)

## MOTION
(eases por rol, duraciones, regla de zoom, pop up)

## BANNED
(lo que no debe aparecer)

## Tramo N
Palabras clave con su segundo, desde el JSON de la voz.
| Tiempo | Plano | Imagen |

### Tareas
- [ ] T1 …

### Criterios de aceptación
1. `check --json` sin errores; reporta cada aviso.
2. Snapshots en segundos exactos contra su imagen.
3. Snapshots de movimiento: sin restos ni saltos.
4. Las escenas ya aprobadas siguen iguales.
5. MP4 con su duración y audio, medido con ffprobe.

## Límites
(qué archivos puede tocar; nada de commits, ni servicios externos, ni regrabar la voz)
```

## Al lanzar el subagente

- Usa `model: "sonnet"` y pásale el camino del SPEC, no su contenido.
- Pide la respuesta en el idioma del usuario, con archivos cambiados, avisos, una línea por snapshot con su ruta, ffprobe y decisiones propias.
- Pídele abrir **todos** los snapshots de los criterios y decir cuáles no abrió.
- Continúa los tramos siguientes con `SendMessage` al mismo agente: ya tiene el código en contexto.
