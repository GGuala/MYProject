# heyguala.com

Sitio de Nicolás Guala. HTML/CSS/JS + Jekyll sobre GitHub Pages.

## Cómo actualizar un proyecto

1. Entrá a **https://app.pagescms.org** con tu cuenta de GitHub y elegí este repo.
2. **Proyectos** → abrí uno (o *Add entry* para uno nuevo).
3. Cambiá lo que quieras: estado, textos, ficha, piezas, galería. Arrastrá fotos tal como salen de la cámara o el celular (jpg, png, HEIC).
4. **Save**. En 2–3 minutos está online.

Para anotar algo del taller: **Registro de taller** → *Add entry* → fecha, tipo, una línea y el proyecto (el nombre del archivo, ej. `silencios-de-segundos`). La "última actividad" de cada proyecto sale de acá.

Si un campo queda vacío, ese módulo no aparece en la página.

### Imágenes protegidas (spoilers)

Los proyectos **En investigación** o **En producción** muestran sus imágenes con blur y el cartel "Contiene spoilers"; el visitante toca para verlas. Además, en esos proyectos:

- solo se publica la versión chica (900 px), también en el visor;
- la página le pide a Google que no indexe sus imágenes (`noimageindex`) y a las IA que no las usen para entrenar (`noai`, `noimageai`);
- no hay vista previa de imagen al compartir el link.

Cuando el proyecto pasa a **Inédito** o **Exhibido**, todo se muestra normal. Qué estados protegen se define en `_data/estados.yml` (`protegido: true`).

Imágenes y IA: en todo el sitio, `robots.txt` deja que los rastreadores de IA lean los textos pero no descarguen imágenes (y las páginas llevan `noimageai`). Google y los buscadores ven todo.

### Para que te encuentren (Google e IA)

- **CV**: `_data/cv.yml`, editable en Pages CMS → *CV*. Se publica en `/cv/`.
- **Datos del artista**: `_data/artista.yml` (Pages CMS → *Artista*). Alimentan los datos estructurados (schema.org) de todas las páginas.
- **`/llms.txt`**: resumen en texto para IA, se arma solo con proyectos y CV.
- **`/sitemap.xml`**: se arma solo con los proyectos publicados.

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
