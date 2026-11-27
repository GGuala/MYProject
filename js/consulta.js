/* Formulario "Me interesa": manda la consulta a Google Sheets (Apps Script) y
   avisa por mail. Si algo falla, queda el link de mail de siempre. */
(function () {
  var dlg = document.getElementById('consulta');
  if (!dlg || typeof dlg.showModal !== 'function') return;
  var form = dlg.querySelector('form');
  var estado = dlg.querySelector('.consulta-estado');
  var pieza = dlg.querySelector('.consulta-pieza');
  var respaldo = dlg.querySelector('.consulta-respaldo');
  var enviar = form.querySelector('[type=submit]');
  var url = dlg.dataset.url;

  function decir(msg, error) {
    estado.textContent = msg;
    estado.classList.toggle('es-error', !!error);
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[data-consulta]');
    if (!a) return;
    e.preventDefault();
    form.hidden = false;
    form.reset();
    form.elements.pieza.value = a.dataset.consulta;
    form.elements.idioma.value = dlg.dataset.lang;
    form.elements.pagina.value = location.pathname;
    pieza.textContent = a.dataset.consulta;
    respaldo.href = a.getAttribute('href');
    enviar.disabled = false;
    decir('');
    dlg.showModal();
  });

  dlg.querySelectorAll('[data-cerrar]').forEach(function (b) {
    b.addEventListener('click', function () { dlg.close(); });
  });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (form.elements.web.value) { dlg.close(); return; } /* campo trampa */
    enviar.disabled = true;
    decir(dlg.dataset.enviando);
    var ctrl = window.AbortController ? new AbortController() : null;
    var t = ctrl ? setTimeout(function () { ctrl.abort(); }, 15000) : null;
    fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      body: new URLSearchParams(new FormData(form)),
      signal: ctrl ? ctrl.signal : undefined
    }).then(function () {
      if (t) clearTimeout(t);
      form.hidden = true;
      decir(dlg.dataset.ok);
    }).catch(function () {
      if (t) clearTimeout(t);
      enviar.disabled = false;
      decir(dlg.dataset.error, true);
    });
  });
})();
