# heyguala.com

Sitio de Nicolás Guala. HTML/CSS/JS + Jekyll sobre GitHub Pages.

## Cómo actualizar un proyecto

1. Entrá a **https://app.pagescms.org** con tu cuenta de GitHub y elegí este repo.
2. **Proyectos** → abrí uno (o *Add entry* para uno nuevo).
3. Cambiá lo que quieras: estado, textos, ficha, piezas, galería. Arrastrá fotos tal como salen de la cámara o el celular (jpg, png, HEIC).
4. **Save**. En 2–3 minutos está online.

Para anotar algo del taller: **Registro de taller** → *Add entry* → fecha, tipo, una línea y el proyecto (el nombre del archivo, ej. `silencios-de-segundos`). La "última actividad" de cada proyecto sale de acá.

Si un campo queda vacío, ese módulo no aparece en la página.

## Qué pasa al guardar (automático)

La Action `.github/workflows/publicar.yml`:

- convierte las fotos nuevas de `/img` a webp (máx. 2400 px) y crea una versión chica (`-m.webp`) para grillas;
- corrige la orientación y borra los metadatos (incluida la ubicación GPS);
- borra el original y actualiza las rutas en los proyectos;
- arma el sitio con Jekyll y lo publica.

## Estructura

| Carpeta | Qué hay |
|---|---|
| `_proyectos/` | Un archivo por proyecto (`ethos.md` → `heyguala.com/ethos/`) |
| `_registro/` | Entradas de taller |
| `_layouts/proyecto.html` | La plantilla única de proyecto |
| `img/` | Imágenes (las maneja la Action) |
| `css/proyecto.css`, `js/lightbox.js` | Estilos y visor de la página de proyecto |

Las páginas viejas (`index.html`, `/cementerio/`, `/estacionn3/`) siguen funcionando tal cual hasta que se migren.

## Configuración inicial (una sola vez)

**Settings → Pages → Build and deployment → Source: GitHub Actions.**
