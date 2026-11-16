// Videos: se carga el reproductor de YouTube/Vimeo recién al tocar "reproducir".
(function () {
  document.querySelectorAll('.video-play').forEach((btn) => {
    btn.addEventListener('click', () => {
      const marco = btn.closest('.video-marco');
      const iframe = document.createElement('iframe');
      iframe.src = btn.dataset.embed;
      iframe.title = btn.dataset.titulo || 'Video';
      iframe.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
      iframe.allowFullscreen = true;
      iframe.loading = 'lazy';
      marco.replaceChildren(iframe);
      marco.classList.add('video-marco--activo');
    });
  });
})();
