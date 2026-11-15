"""Optimiza las imágenes de /img para la web. Lo corre la GitHub Action en cada push.

Para cada foto subida (jpg, png, heic, tif...):
  - corrige la orientación y borra metadatos (incluida la ubicación GPS)
  - la convierte a webp, máximo 2400 px de lado      → foto.webp
  - genera una versión chica de 900 px para grillas   → foto-m.webp
  - borra el original y actualiza las rutas en _proyectos/ y _registro/

Los webp que ya existen se achican si pasan de 2400 px y reciben su versión -m
si les falta. Nada fuera de /img se toca, así las páginas viejas siguen igual.
"""
import re
import sys
import unicodedata
from pathlib import Path
from urllib.parse import quote

from PIL import Image, ImageOps

try:
    from pillow_heif import register_heif_opener
    register_heif_opener()
except ImportError:  # sin soporte HEIC: el resto funciona igual
    pass

RAIZ = Path(__file__).resolve().parent.parent
IMG = RAIZ / "img"
CONTENIDO = [RAIZ / "_proyectos", RAIZ / "_registro", RAIZ / "_data"]
ENTRADA = {".jpg", ".jpeg", ".png", ".heic", ".heif", ".tif", ".tiff", ".bmp"}
GRANDE, CHICA, CALIDAD = 2400, 900, 82


def nombre_limpio(stem: str) -> str:
    s = unicodedata.normalize("NFKD", stem).encode("ascii", "ignore").decode()
    s = re.sub(r"[^a-zA-Z0-9]+", "-", s).strip("-").lower()
    return s or "imagen"


def preparar(im: Image.Image) -> Image.Image:
    im = ImageOps.exif_transpose(im)
    tiene_alfa = im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info)
    return im.convert("RGBA" if tiene_alfa else "RGB")


def guardar(im: Image.Image, destino: Path, lado: int) -> None:
    copia = im.copy()
    copia.thumbnail((lado, lado), Image.LANCZOS)
    copia.save(destino, "WEBP", quality=CALIDAD, method=6)  # sin exif = sin metadatos


def url(p: Path) -> str:
    return "/" + p.relative_to(RAIZ).as_posix()


def main() -> int:
    if not IMG.exists():
        return 0
    cambios: dict[str, str] = {}

    for f in sorted(IMG.rglob("*")):
        if not f.is_file() or f.suffix.lower() not in ENTRADA:
            continue
        base = nombre_limpio(f.stem)
        destino = f.with_name(base + ".webp")
        n = 1
        while destino.exists():
            destino = f.with_name(f"{base}-{n}.webp")
            n += 1
        with Image.open(f) as im:
            im = preparar(im)
            guardar(im, destino, GRANDE)
            guardar(im, destino.with_name(destino.stem + "-m.webp"), CHICA)
        viejo = url(f)
        for forma in {viejo, quote(viejo)}:
            cambios[forma] = url(destino)
        f.unlink()
        print(f"convertida  {viejo}  →  {url(destino)}")

    for f in sorted(IMG.rglob("*.webp")):
        if f.stem.endswith("-m"):
            continue
        chica = f.with_name(f.stem + "-m.webp")
        with Image.open(f) as im:
            muy_grande = max(im.size) > GRANDE
            if muy_grande or not chica.exists():
                im = preparar(im)
                if not chica.exists():
                    guardar(im, chica, CHICA)
                    print(f"miniatura   {url(chica)}")
                if muy_grande:
                    guardar(im, f, GRANDE)
                    print(f"achicada    {url(f)}")

    if cambios:
        for carpeta in CONTENIDO:
            if not carpeta.exists():
                continue
            for doc in carpeta.rglob("*"):
                if doc.suffix.lower() not in {".md", ".yml", ".yaml", ".json", ".csv"}:
                    continue
                texto = doc.read_text(encoding="utf-8")
                nuevo = texto
                for viejo, nuevo_url in cambios.items():
                    nuevo = nuevo.replace(viejo, nuevo_url)
                if nuevo != texto:
                    doc.write_text(nuevo, encoding="utf-8")
                    print(f"rutas       {doc.relative_to(RAIZ)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
