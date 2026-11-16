"""Crea la versión en español de cada proyecto publicado.

Cada proyecto de _proyectos/ se publica en inglés en heyguala.com/<slug>/.
Para tener heyguala.com/es/<slug>/ hace falta una página mínima que apunte al
proyecto ("ref"); este script las crea en es/obra/ y borra las que sobran.
Lo corre la GitHub Action antes de armar el sitio. No hace falta tocarlo.
"""
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
PROYECTOS = RAIZ / "_proyectos"
DESTINO = RAIZ / "es" / "obra"

PLANTILLA = """---
# Generado por scripts/generar_paginas_es.py — no editar.
layout: proyecto
lang: es
ref: {slug}
permalink: /es/{slug}/
sitemap: true
---
"""


def publicado(texto: str) -> bool:
    m = re.match(r"^---\n(.*?)\n---", texto, re.S)
    if not m:
        return False
    return not re.search(r"^published:\s*false\s*$", m.group(1), re.M)


def main() -> int:
    DESTINO.mkdir(parents=True, exist_ok=True)
    deseados = set()
    for doc in sorted(PROYECTOS.glob("*.md")):
        if publicado(doc.read_text(encoding="utf-8")):
            deseados.add(doc.stem)
    for slug in sorted(deseados):
        archivo = DESTINO / f"{slug}.html"
        contenido = PLANTILLA.format(slug=slug)
        if not archivo.exists() or archivo.read_text(encoding="utf-8") != contenido:
            archivo.write_text(contenido, encoding="utf-8")
            print(f"creada   /es/{slug}/")
    for archivo in DESTINO.glob("*.html"):
        if archivo.stem not in deseados:
            archivo.unlink()
            print(f"borrada  /es/{archivo.stem}/")
    return 0


if __name__ == "__main__":
    sys.exit(main())
