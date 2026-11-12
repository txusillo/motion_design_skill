# MEPCO: el amortiguador que se soltó

Reel vertical (1080 x 1920, 30 fps, Instagram), basado en el artifact "El amortiguador que se apagó" (https://claude.ai/artifact/MVcFc3rSuRQuT3yg3ZD7WQ). Cifras verificadas el 10-11-2026.

- **Look:** nuevo, "surtidor" (grafito `#151617`, LED ámbar `#ffb000`, naranjo `#ff6a13`, Barlow Condensed + JetBrains Mono). Propuestas en `looks_propuestas/`.
- **Voz final:** ElevenLabs (plan Starter), voz chilena de la biblioteca "Esteban - Deep Corporate & Narration" (`fawH90GsqqfRlrMoVpk5`), modelo `eleven_v4`, sin etiquetas. Toma 7: voz 107,5 s, video 109,13 s (`assets/voice/tomas/toma7_eleven_esteban.*`). Las animaciones se hicieron con la toma 6 de Kokoro: `retime_build.py` genera `assets/retime.js`, que traduce cada tiempo palabra a palabra a la toma actual (cada escena llama `retime(tl, inicioViejo, inicioNuevo)`; los hosts de `index.html` ya están en tiempos nuevos). Si se regraba con el mismo texto, basta correr `retime_build.py` y actualizar los hosts.
- **Voz anterior:** Kokoro `ef_dora`, toma 3 (95,1 s) en `assets/voice/tomas/toma3_kokoro.mp3`: igual a la toma 2 hasta 78 s, con la frase de la escena 20 en versión genérica ("vuelve a niveles de récord"), que sirve tanto si la 93 supera su máximo el 12-11 como si no.
- **Gancho (toma 4, 98,6 s):** antes de "Un jueves de marzo" se agregó la pregunta "¿Qué es el MEPCO, y por qué te afecta aunque no tengas auto?" (escena `compositions/pregunta.html`, 0–3,48 s). Debe ser atemporal: no nombrar el paro de camioneros ni alzas puntuales. El resto del audio es idéntico a la toma 3, corrido 3,48 s.
- **Toma 5 (99,6 s, video 100,76 s):** línea 5 cambiada a "Cuando el precio internacional del petróleo se dispara, …" (+1,045 s). `amortiguador.html` y `marco.html` traducen sus tiempos con `W()`; las escenas siguientes se corrieron 1,045 s.
- **Toma 6 (97,9 s, video 99,05 s):** línea 21 cambiada a "Y ahora, el mismo Gobierno busca volver a amortiguar las alzas." porque el 11-11 el Gobierno retiró el proyecto del tope de $20 para modificarlo (Pauta, Emol, BioBio, 11-11-2026). La escena 21 ya no muestra el proyecto ni el $20: Gobierno + "MARZO LO SOLTÓ / AHORA LO BUSCA".

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
- **Sonido:** música ElevenLabs "pulso" (`assets/music/musica.mp3`, volumen 0,64, ~8 dB bajo la voz; se repitieron 4 compases antes del cierre para que termine en 109 s). 104 efectos (`sfx.json`, volúmenes pop 0,16 / whoosh 0,13 / largo 0,15 / cartas 0,15), colocados en los tiempos reales de cada animación.

## Puntos que pueden cuestionar

- "El Gobierno decidió soltarlo": el MEPCO sigue existiendo (costó $1,1 billones entre agosto y octubre, Hacienda). Lo que se soltó en marzo fue el traspaso gradual; el post lo aclara.
- "Unos $20 cada tres semanas" es la aproximación de analistas ($26 según 24Horas).
- "Casi un año" sale de $372 / $26 ≈ 43 semanas.
- "Vuelve a niveles de récord": la 93 (~$1.538 RM) + $38,7 del 12-11 supera el máximo de ~$1.546; ningún medio lo llamó récord todavía.
- La línea 21 dejó de mencionar el tope de $20 porque el proyecto se retiró el 11-11 para modificarlo.

## Cómo regenerar

1. Voz: `voz.json` → `python3 ~/.claude/skills/explainer-reel/scripts/voz.py grabar` (ElevenLabs, clave en `~/.zshrc`).
2. Si el texto no cambió: `python3 retime_build.py` y actualizar los `data-start`/`data-duration` de `index.html` con `RM()` (ver `assets/retime.js`). Si el texto cambió, primero ajustar las escenas a la toma 6 de Kokoro o reescribir la referencia.
3. Efectos: `python3 ~/.claude/skills/explainer-reel/scripts/sfx.py` (los crudos no se vuelven a pedir).
4. Final: `python3 ~/.claude/skills/explainer-reel/scripts/render_final.py . mepco_final.mp4 --grade "null"`.

## Pendiente

- [x] La frase de la escena 20 quedó genérica ("vuelve a niveles de récord") y sin precio en pantalla, para no depender del informe ENAP del 11-11-2026.
