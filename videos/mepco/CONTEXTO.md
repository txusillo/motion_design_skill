# MEPCO: el amortiguador que se soltó

Reel vertical (1080 x 1920, 30 fps, Instagram), basado en el artifact "El amortiguador que se apagó" (https://claude.ai/artifact/MVcFc3rSuRQuT3yg3ZD7WQ). Cifras verificadas el 10-11-2026.

- **Look:** nuevo, "surtidor" (grafito `#151617`, LED ámbar `#ffb000`, naranjo `#ff6a13`, Barlow Condensed + JetBrains Mono). Propuestas en `looks_propuestas/`.
- **Voz vigente: toma 8 (12-11-2026), Rocío** (`fAARL40MFmBzc8srMW9t`, `eleven_v4`, seed 2026), una sola toma con todo el guion y dos pausas de silencio insertadas por `voz_dos.py` (ver "Toma 8"). Se probó una versión Rocío + César y se descartó. Voz anterior (toma 7): ElevenLabs, voz chilena "Esteban - Deep Corporate & Narration" (`fawH90GsqqfRlrMoVpk5`), modelo `eleven_v4`, sin etiquetas. Toma 7: voz 107,5 s, video 109,13 s (`assets/voice/tomas/toma7_eleven_esteban.*`). Las animaciones se hicieron con la toma 6 de Kokoro: `retime_build.py` genera `assets/retime.js`, que traduce cada tiempo palabra a palabra a la toma actual (cada escena llama `retime(tl, inicioViejo, inicioNuevo)`; los hosts de `index.html` ya están en tiempos nuevos). Si se regraba con el mismo texto, basta correr `retime_build.py` y actualizar los hosts.
- **Voz anterior:** Kokoro `ef_dora`, toma 3 (95,1 s) en `assets/voice/tomas/toma3_kokoro.mp3`: igual a la toma 2 hasta 78 s, con la frase de la escena 20 en versión genérica ("vuelve a niveles de récord"), que sirve tanto si la 93 supera su máximo el 12-11 como si no.
- **Gancho (toma 4, 98,6 s):** antes de "Un jueves de marzo" se agregó la pregunta "¿Qué es el MEPCO, y por qué te afecta aunque no tengas auto?" (escena `compositions/pregunta.html`, 0–3,48 s). Debe ser atemporal: no nombrar el paro de camioneros ni alzas puntuales. El resto del audio es idéntico a la toma 3, corrido 3,48 s.
- **Toma 5 (99,6 s, video 100,76 s):** línea 5 cambiada a "Cuando el precio internacional del petróleo se dispara, …" (+1,045 s). `amortiguador.html` y `marco.html` traducen sus tiempos con `W()`; las escenas siguientes se corrieron 1,045 s.
- **Toma 6 (97,9 s, video 99,05 s):** línea 21 cambiada a "Y ahora, el mismo Gobierno busca volver a amortiguar las alzas." porque el 11-11 el Gobierno retiró el proyecto del tope de $20 para modificarlo (Pauta, Emol, BioBio, 11-11-2026). La escena 21 ya no muestra el proyecto ni el $20: Gobierno + "MARZO LO SOLTÓ / AHORA LO BUSCA".

## Toma 8: Rocío, sin pausas, láminas aceleradas, música con cierre, contador y reloj (12-11-2026, rondas 1 y 2)

- **Voz:** `python3 voz_dos.py grabar` (desde la carpeta del proyecto, tras `source ~/.zshrc`). Rocío (`fAARL40MFmBzc8srMW9t`), una sola toma con todo el guion (646 caracteres), cruda en `assets/voice/tomas/toma8_rocio/` (no se vuelve a pedir si existe; la ronda 2 no gastó créditos). `PAUSAS = []`: la ronda 1 insertaba 1,6 s tras "barato." y 2,0 s tras "noche,", y al usuario no le gustaron; `voz_dos.py` aún sabe insertarlas. Normaliza a -16,8 LUFS, pico -1,9 dBFS (loudnorm de dos pasadas: solo con ganancia la voz de Rocío quedaba en -23 LUFS por sus picos). `hold_end` = 2,5 s (el acorde final suena completo). Voz 97,68 s, video **100,26 s**. Copia de `voz.json` en `tomas/toma8_rocio_sin_pausas.json` (y `..._con_pausas.json` de la ronda 1). `voz_dos.py prueba` es la prueba Rocío + César, descartada. **Nunca** `voz.py grabar` (graba con Esteban).
- **Retime:** `python3 retime_build.py` (toma 6 -> toma 8). Hosts (inicio / duración): pregunta 0 / 4,107, golpe 4,107 / 9,605, amortiguador 13,712 / 20,476, decisión 34,188 / 22,195, efecto 56,383 / 26,863, hoy 83,246 / 17,014, marco 4,107 / 96,153. Los segundos argumentos de `retime(...)` y `HN` de `marco.html` están en esos valores. Todo sale de `retime.js`: si cambia la voz, correr `retime_build.py`, recalcular hosts y `remap_cues.py`.
- **Escena 08a (ronda 2, `amortiguador.html`):** el último tramo del gráfico se acelera (termina en 25,45 SPEC = fin de "recupera"), las áreas se vuelven los cuadrados en 0,3 s, `=` y `AL FINAL, EL MISMO PRECIO` hacen pop apenas llegan, y el corte a 08b es en "regala" (32,30 s). Lámina completa y quieta de ~30,25 a 32,30 s. Para colocar una animación en un instante de la toma 8 se invierte `RM` (tiempo SPEC = `RM^-1(T8) - 4,525`); cuidado con los tramos que `RM` estira (una pausa o una palabra muy corta).
- **Escena 14/15 (ronda 2, `efecto.html`):** la escalera sube en 0,92 s desde "regla" (56,64 s), `REGLA DE ANTES` en "tomado" (58,32) y la nota 0,3 s después; el muro entra en "Llegó" (60,08, sin tocar). El corte a la 15 es en "tiempo" (62,05 s; la 15 entra en 62,23), el `0` hace pop en 62,48 y el rótulo `1 NOCHE` del HUD cambia en 62,23 (`marco.html`).
- **Cues de sonido:** `remap_cues.py` lleva `sfx_toma7.json` (cues de la toma 7) a la toma 8 y suma `contadores.json` (ya en toma 8); conserva `library` y `volume` de `sfx.json`. Luego `sfx.py`.
- **Tipo `contador`:** de las 3 variantes de ElevenLabs quedó `contador_2` ("fast soft electronic digital counter ticking up, short"): ~11 ticks regulares en 0,8 s, a la cadencia de los dígitos; `contador_1` (2 ticks y silencio) y `contador_3` (rodar continuo, más ruidoso) siguen en `assets/sfx/crudos`. Volumen 0,14, carril 14, `length` = duración de la corrida, fundido de 0,05 s. `sfx.py` (skill) conoce `contador`. Cues (inicio / largo): golpe 6,330 / 0,795; decisión 10b (140) 42,653 / 0,724; decisión 12 (1170 -> 1542) 50,549 / 0,840; efecto 17 (1,3) 68,482 / 0,584. `hoy.html` no tiene contadores LED.
- **Música (ronda 2):** `musica_toma7.mp3` es la anterior. Nueva: ElevenLabs `/v1/music` (`musica_nueva.py`), 3 generaciones de 4 permitidas. `nueva_1` se apagaba sola a los 93 s y cerraba con un acorde débil (-29 dB); `nueva_2` tiene un golpe de acorde cada 4,8 s y el último queda sonando (+16 dB de ataque), pero lo puso en 91,3 s en vez de al final; `nueva_3` (pedida más larga) lo puso en 96,1 s con ataque flojo. Se usó `nueva_2` con `musica_empalme.py`: quita 3,035 s del inicio (la subida), repite 9,6 s (4 compases, dos periodos de acordes) del cuerpo y corta a `total` con 0,3 s de fundido: `musica.mp3` dura 100,26 s y el acorde final ataca en **97,80 s** (la última palabra termina en 97,76), decae de -11 a -29 dB en 2 s. Sin `data-fade-out` en el HTML; volumen 0,47 (voz -16,8 LUFS, música -24,8: 8 dB). Las candidatas sin usar están en `assets/music/candidatos/`.
- **Reloj (`marco.html`):** en el instante local `s` se lee `floor(s + HN)` (HN = 4,107, primer rótulo `● 00:04`); la barra va de `HN / total` a 100 % sobre el video entero.

## Ronda 3: efectos que describen el movimiento (solo sonido)

- `efectos_r3.py` escribe `efectos_r3.json` (81 cues con escena, qué se mueve, tiempo y largo; `verificacion` lista los frames del MP4 donde se vio cada movimiento). Los tiempos salen de cargar cada composición en Chrome headless (la línea de tiempo ya pasada por `retime`): inicio de cada tween (host + tiempo local) y, para escaleras, ruedas y casillas, muestreando la línea de tiempo cada 2-10 ms. Son de la toma 8 sin pausas; si cambia la voz hay que recalcularlos. `remap_cues.py` suma esos cues a los de la toma 7 remapeados (`sfx_toma7.json`) y `sfx.json` anterior quedó en `sfx_r2.json`.
- **Tipos nuevos** (volumen, carril): `resorte` (0,14), `lapiz` (0,10, dura lo que el trazo, fade 0,05 s), `escalon` (0,13; cada plop con `pitch` en semitonos: +1 por escalón en las subidas y bajadas de 06/07 y en los 13 de la 14 (0,08 s); más grave en las bajadas), `rodar` (0,07, de fondo, con fade in/out), `bache` (0,14; en la 12, sin resorte, x1,3), `camion` (0,14), `golpe` (0,18; `golpe_2` = sello de goma para el timbre), `tijera` (0,14), `aguja` (0,12), `clic` (0,12, 13 casillas), `papel` (0,12), `barra` (0,10). Librería: 2 variantes de `resorte`, `lapiz`, `escalon`, `clic`, `golpe` y 1 de los demás (17 generaciones de ElevenLabs de 30 permitidas, ninguna repetida). `sfx.py` (skill) ahora entiende `TIMED` (tipos con `length`), `name`, `pitch` y `vol` por cue.
- **Reemplazaron a genéricos** (a +-0,1 s, `efectos_r3_reemplazados.json`): 27, de los cuales 4 `whoosh` (entrada del auto/camión) y 23 `pop` (+ 1 `cartas` por `papel`). Además se quitaron por exceso de simultaneidad 1 `pop` (16,42 s, `efectos_r3_quitados.json`). Máximo 3 sonidos a la vez (medido con las duraciones de los clips: 0 momentos con más).
- No hay `bache` en el primer bache de 04a (la tabla pide 05a, 10a y 12; ahí ya suenan rodar + resorte + lápiz). Se agregaron fuera de la tabla `rodar` y `resorte` en la escena 21 (el auto entra y los resortes vuelven) y `golpe` en la sacudida de la 22 (el mismo muro de la 19).

## Ronda 4: escena 07 más rápida (`amortiguador.html`)

- La 07 (gráfico `DE VUELTA`) se cortaba a medias porque la transición a 08a parte en "recupera". Ahora, en toma 8: la punteada cae de 27,875 a 28,515 s (0,64 s); la naranja baja en 5 escalones (`steps`, contrahuellas en 27,85 / 27,95 / 28,04 / 28,24 / 28,45 s) y termina en 28,56 s; el área `RECUPERA` se llena en 0,3 s (28,56 a 28,86 s), su rótulo hace pop y `ESTADO ABSORBE` pasa a `PONE` con blur swap en ese mismo instante. La 07 queda completa y quieta de 28,86 a 29,91 s (1,05 s). La transición a 08a sigue en 29,907 s (0,3 s) y 08a queda completa de ~30,25 a 32,30 s (2,05 s). Los tiempos del brief se pasan a la toma 8 invirtiendo `RM` (ver ronda 2); `retime` puede correr unos 0,1 s los tweens cortos consecutivos, así que se midieron muestreando la línea de tiempo (`/private/tmp/.../tw`: Chrome headless con la composición cargada).
- Sonido: `lapiz` de la punteada en 27,875 (0,64 s) y `escalon` de bajada en 27,85 / 27,95 / 28,04 / 28,24 / 28,45 (pitch +4 a 0), en `efectos_r3.py`/`efectos_r3.json`; el escalón de subida en 27,54 no cambia.

## Correcciones al artifact original

- El decreto exento N° 103 (firmado el 20-03-2026 y publicado el 23-03) pasó el cálculo de paridad de **2** a 4 semanas, no de 3. Tres semanas (21 días) es la frecuencia de ajuste del precio.
- El alza del 26-03 no la produjo ese cambio. El Gobierno anunció que usaría la facultad de la ley para un "rápido ajuste a los precios internacionales" por estrechez fiscal.
- Costo fiscal: el dato oficial es US$140 millones entre el 19 y el 25 de marzo. Otras declaraciones van de US$120 a 200 millones por semana.
- Con $26 cada tres semanas, $372 toman unas 43 semanas: "casi un año", no "más de un año".
- Julio: los $158 y $208 de Scotiabank son estimaciones (lo que habría pasado con la regla anterior); lo que ENAP informó fue +$32,9 y +$28,5.

## Fuentes

| Cifra del guion | Tipo | Fuente |
|---|---|---|
| Ley 20.765, 9-07-2014 ("12 años") | oficial | https://www.bcn.cl/historiadelaley/nc/historia-de-la-ley/4265/ |
| Decreto 103, paridad de 2 a 4 semanas, rige desde el 26-03-2026 | oficial / secundaria | Diario Oficial, decreto 271 exento del 03-11-2026 (cita el decreto 103): https://www.cne.cl/wp-content/uploads/2026/11/2026_11_05_MEPCO.pdf · https://www.emol.com/noticias/Economia/2026/03/23/1195109/ajuste-al-mepco.html |
| US$140 millones (19-25 mar) | Gobierno, vía prensa | https://www.cooperativa.cl/noticias/pais/consumidores/combustibles/cambios-al-mepco-bencinas-subiran-370-pesos-y-diesel-tendra-alza-de-580/2026-03-23/203943.html |
| 93 +$372,2 (32%), diésel +$580,3 (62%), 93 de $1.170 a ≈$1.542 (RM) | ENAP, vía prensa | https://www.eldinamo.cl/pais/2026/03/25/enap-confirma-alza-historica-en-las-gasolinas-y-el-diesel-chilenos-enfrentaran-precios-record/ |
| "Unos $20" cada tres semanas (analista: $26) | analista | https://www.24horas.cl/actualidad/economia/cambio-mepco-que-es-bencina-combustible |
| Seis alzas seguidas desde fines de julio (la sexta, el 12-11) | secundaria | https://www.eldinamo.cl/economia/2026/11/05/bencinas-podrian-superar-sus-maximos-historicos-tras-nueva-alza-proyectada-para-noviembre/ |
| 22-10: +$41,3 gasolinas, +$91,5 diésel; desde julio +$183,4 y +$401,4 | ENAP, vía prensa | https://www.emol.com/noticias/Economia/2026/10/21/1214815/combustibles-precio-alza-enap-hoy.html |
| La 93 "vuelve a niveles de récord": ~$1.538 (RM) frente a un máximo de ~$1.546, con un alza proyectada de ~$40 el 12-11 | secundaria | El Dínamo, 05-11-2026; La Tercera: "ad portas de nuevo récord de precios" https://www.latercera.com/pulso/noticia/gobierno-anuncia-proyecto-para-limitar-alzas-de-los-combustibles-a-20-ad-portas-de-nuevo-record-de-precios/ |
| Proyecto de ley: alzas de máximo $20/L por 90 días (retirado el 11-11 para modificarlo: https://www.pauta.cl/actualidad/2026/11/11/gobierno-retira-proyecto-para-limitar-alza-de-combustibles-a-20-por-litro-y-prepara-modificaciones.html); ENAP 11-11: 93 y 97 +$38,7, diésel +$41,9 desde el 12-11 (https://www.pauta.cl/actualidad/2026/11/11/enap-confirma-nueva-alza-de-bencinas-y-diesel-desde-este-jueves-12-de-noviembre.html) | Gobierno, vía prensa | https://www.biobiochile.cl/noticias/economia/actualidad-economica/2026/11/09/kast-confirma-que-combustibles-subirian-unos-40-y-anuncia-proyecto-para-contener-proximas-alzas.shtml |
| IPC de marzo +1,0%, 2,8% en 12 meses | oficial | https://www.ine.gob.cl/sala-de-prensa/prensa/general/noticia/2026/04/08/%C3%ADndice-de-precios-al-consumidor-(ipc)-de-marzo-present%C3%B3-una-variaci%C3%B3n-mensual-de-1-0 |
| IPC de abril +1,3% (el mayor alza desde julio de 2022), de 2,8% a 4,0% en 12 meses; transporte +8,0% | oficial | https://www.ine.gob.cl/sala-de-prensa/prensa/general/noticia/2026/05/08/%C3%ADndice-de-precios-al-consumidor-(ipc)-de-abril-present%C3%B3-una-variaci%C3%B3n-mensual-de-1-3 |
| Octubre: 4,5% en 12 meses (no se usa: también recoge las alzas posteriores) | oficial | INE, boletín de octubre de 2026 |

## Estado (11-11-2026)

- **Final:** `mepco_final.mp4` (1080 x 1920, 30 fps, 109,1 s, -15 LUFS). Portada: `portada.png` / `portada.jpg`. Texto del post: `instagram.md`.
- **Sonido:** música ElevenLabs con acorde de cierre (ver "Toma 8"; la "pulso" anterior es `musica_toma7.mp3`). 104 efectos (`sfx.json`, volúmenes pop 0,16 / whoosh 0,13 / largo 0,15 / cartas 0,15), colocados en los tiempos reales de cada animación.

## Puntos que pueden cuestionar

- "El Gobierno decidió soltarlo": el MEPCO sigue existiendo (costó $1,1 billones entre agosto y octubre, Hacienda). Lo que se soltó en marzo fue el traspaso gradual; el post lo aclara.
- "Unos $20 cada tres semanas" es la aproximación de analistas ($26 según 24Horas).
- "Casi un año" sale de $372 / $26 ≈ 43 semanas.
- "Vuelve a niveles de récord": la 93 (~$1.538 RM) + $38,7 del 12-11 supera el máximo de ~$1.546; ningún medio lo llamó récord todavía.
- La línea 21 dejó de mencionar el tope de $20 porque el proyecto se retiró el 11-11 para modificarlo.

## Cómo regenerar

1. Voz: `python3 voz_dos.py grabar` (Rocío; no `voz.py grabar`, que graba con Esteban). `voz.json` del proyecto lleva el `voice_id` de Rocío.
2. Si el texto no cambió: `python3 retime_build.py` y actualizar los `data-start`/`data-duration` de `index.html` con `RM()` (ver `assets/retime.js`). Si el texto cambió, primero ajustar las escenas a la toma 6 de Kokoro o reescribir la referencia.
3. Efectos: `python3 ~/.claude/skills/explainer-reel/scripts/sfx.py` (los crudos no se vuelven a pedir).
4. Final: `python3 ~/.claude/skills/explainer-reel/scripts/render_final.py . mepco_final.mp4 --grade "null"`.

## Pendiente

- [x] La frase de la escena 20 quedó genérica ("vuelve a niveles de récord") y sin precio en pantalla, para no depender del informe ENAP del 11-11-2026.

## Final (12-11-2026, correcciones rondas 1 a 4)

- `mepco_final.mp4`: 1080 x 1920, 30 fps, H.264 High, 100,27 s, -15,0 LUFS, pico -3,5 dBTP. Voz de Rocío (toma 8), música nueva con acorde final, efectos de movimiento (ronda 3), escena 07 acelerada (ronda 4), reloj en tiempo real. El final anterior (toma 7, Esteban) quedó en `mepco_final_toma7.mp4`. Detalle de cada ronda en `CORRECCIONES.md`.
