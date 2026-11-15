// Lightbox de la página de proyecto: clic para abrir, ← → para navegar, esc para cerrar.
(function () {
  const caja = document.querySelector('.lb');
  if (!caja) return;
  const botones = Array.from(document.querySelectorAll('.lb-abrir'));
  const img = caja.querySelector('img');
  const pie = caja.querySelector('.lb-pie');
  const cuenta = caja.querySelector('.lb-cuenta');
  let actual = 0;
  let origen = null;

  function mostrar(i) {
    actual = (i + botones.length) % botones.length;
    const b = botones[actual];
    img.src = b.dataset.full;
    img.alt = b.querySelector('img') ? b.querySelector('img').alt : '';
    pie.textContent = b.dataset.pie || '';
    const tipo = b.dataset.tipo ? ' · ' + b.dataset.tipo.toUpperCase() : '';
    cuenta.textContent = (actual + 1) + ' / ' + botones.length + tipo;
  }
  function abrir(i) {
    origen = document.activeElement;
    mostrar(i);
    caja.hidden = false;
    document.body.style.overflow = 'hidden';
    caja.querySelector('.lb-cerrar').focus();
  }
  function cerrar() {
    caja.hidden = true;
    document.body.style.overflow = '';
    if (origen) origen.focus();
  }

  botones.forEach((b, i) => b.addEventListener('click', () => abrir(i)));
  caja.querySelector('.lb-cerrar').addEventListener('click', cerrar);
  caja.querySelector('.lb-ant').addEventListener('click', () => mostrar(actual - 1));
  caja.querySelector('.lb-sig').addEventListener('click', () => mostrar(actual + 1));
  caja.addEventListener('click', (e) => { if (e.target === caja) cerrar(); });
  document.addEventListener('keydown', (e) => {
    if (caja.hidden) return;
    if (e.key === 'Escape') cerrar();
    if (e.key === 'ArrowLeft') mostrar(actual - 1);
    if (e.key === 'ArrowRight') mostrar(actual + 1);
  });
})();
