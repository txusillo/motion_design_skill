# Looks

Estilos visuales reutilizables para los reels de la skill `explainer-reel`. Cada look tiene su carpeta:

```
looks/<nombre>/
├── look.md          # paleta, tipografías, materiales, movimiento y qué evitar
├── muestra.png      # un frame representativo, para elegir
├── video.png        # cinco cuadros del video real hecho con ese look
├── kit/             # archivos que se copian al proyecto nuevo
└── ejemplo/         # storyboard y SPEC.md de un video real con ese look
```

Para usar un look, copia su `kit/` a la carpeta del proyecto respetando sus carpetas (`compositions/`, `templates/`, `assets/`) y lee su `look.md` antes del storyboard. `ejemplo/` trae el storyboard y el `SPEC.md` de un video real hecho con ese look.

Para agregar uno nuevo, terminado el video, crea su carpeta con esos cinco elementos y suma una fila a la tabla.

| Look | Para qué sirve | Ejemplo |
|---|---|---|
| [retro-pixel](retro-pixel/look.md) | Datos y escalas con objetos isométricos de píxeles, ventanas de sistema antiguo, tono serio | `desigualdad_chile` |
| [editorial-tinta](editorial-tinta/look.md) | Papel claro, tipografía editorial, redes de datos, mapas y personajes isométricos de bloques | `apellidos_santiago` |
