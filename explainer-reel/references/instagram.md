# Instagram

## Zonas seguras (medidas en un iPhone, 1080 x 1920)

- Instagram muestra el video agrandado y **recorta unos 46 px por lado**.
- **Arriba**, la barra de Reels tapa hasta unos 215 px.
- **Abajo**, desde unos 1.700 px están el usuario, la descripción y la barra.
- **A la derecha**, desde unos 910 px de x y bajo unos 1.200 px de y, están los botones.

Lo que funcionó: componer a tamaño completo y luego aplicar a cada composición de contenido (no al fondo ni a las líneas de barrido) `transform: translateY(77px) scale(0.88); transform-origin: 540px 883px`. Los elementos a pantalla completa (mar, regla larga) necesitan lienzos más grandes para seguir llegando a los bordes. Con esa escala, los textos bajo 32 px quedan bajo el mínimo: diseña los textos chicos en 32 px o más.

Simula el recorte al revisar: `crop=988:1920:46:0`.

## Contraste

- En el teléfono todo se ve más oscuro. El fondo medio (`#5f7ca8` en el ejemplo) con objetos oscuros encima funcionó mejor que un fondo oscuro.
- Calcula el contraste del objeto central contra el fondo y apunta a más de 2,5 : 1. Muestra al usuario un frame con 3 o 4 niveles de fondo antes de rehacer el video.
- Al aclarar el fondo, los textos y líneas que van sobre él pasan a oscuros. Los paneles conservan su fondo oscuro y su texto claro.

## Entrega

1. Render final: `scripts/render_final.py <proyecto> <salida.mp4>`. Hace el render `delivery`, aplica el color del look y deja el audio en -15 LUFS.
2. Revisa frames del archivo final con el recorte simulado.
3. **Portada** 1080 x 1920 con la idea más fuerte. Su contenido debe caber en el centro 3:4 (y de 240 a 1680) para la grilla del perfil. Expórtala en PNG y JPG.
4. **Texto** en `instagram.md`: gancho, 2 o 3 frases con los datos más fuertes, la pregunta final, la lista de fuentes y 4 o 5 hashtags. Menos de 2.200 caracteres. Instagram no activa enlaces: entrégalos aparte en el chat.
5. **`CONTEXTO.md`**: estado, archivo final, tabla de fuentes con su solidez, puntos que pueden cuestionar y cómo regenerar. Enlázalo desde el `CLAUDE.md` del proyecto.
6. Pide al usuario subirlo como borrador y mirarlo en el teléfono.
