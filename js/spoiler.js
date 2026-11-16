// Proyectos en investigación o producción: las imágenes arrancan con blur y el
// cartel "Contiene spoilers". Un clic en cualquiera las revela todas.
(function () {
  const main = document.querySelector('.es-protegido');
  if (!main) return;
  main.querySelectorAll('.spoiler-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      main.classList.add('revelado');
      main.querySelectorAll('.lb-abrir[inert]').forEach((b) => b.removeAttribute('inert'));
      const propio = btn.parentElement.querySelector('.lb-abrir');
      if (propio) propio.focus();
    });
  });
})();
