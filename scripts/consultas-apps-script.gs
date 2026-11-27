/**
 * Consultas de heyguala.com → Google Sheet + mail.
 *
 * Cómo se instala (una sola vez):
 * 1. Creá un Google Sheet nuevo (ej. "Consultas heyguala").
 * 2. Extensiones → Apps Script. Borrá lo que haya y pegá este archivo completo.
 * 3. (Opcional) Si querés que el aviso llegue a otro mail, completá AVISAR_A.
 * 4. Implementar → Nueva implementación → tipo "Aplicación web".
 *      Ejecutar como: Yo
 *      Quién tiene acceso: Cualquier persona
 *    Google te va a pedir permisos (Sheets y Gmail): es tu propio script, aceptá.
 *    Si aparece "Google no verificó esta aplicación": Avanzado → Ir a (proyecto).
 * 5. Copiá la URL de la aplicación web y pegala en Pages CMS →
 *    Textos de páginas → Consultas → URL.
 *
 * Qué hace: recibe el formulario del sitio, guarda una fila en el Sheet y te
 * manda un mail con asunto "Interesado en pieza: <pieza>". Responder a ese mail
 * le contesta directo a la persona interesada.
 *
 * Seguridad: la URL es pública (está en el código de la página), pero este script
 * solo sabe AGREGAR filas y mandarte un mail a vos. No devuelve ningún dato del
 * Sheet y el destinatario del mail no se puede cambiar desde afuera.
 */

var AVISAR_A = '';              // vacío = el mail de tu cuenta de Google
var HOJA = 'Consultas';         // nombre de la pestaña (se crea si no existe)
var MAX_POR_EMAIL_HORA = 3;     // consultas por mail por hora
var MAX_POR_VENTANA = 40;       // consultas totales cada ~6 horas (freno al spam)

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var p = (e && e.parameter) || {};
    if (p.web) return respuesta_(true); // campo trampa: un humano no lo completa

    var pieza = limpiar_(p.pieza, 150, false);
    var nombre = limpiar_(p.nombre, 100, false);
    var email = limpiar_(p.email, 150, false).toLowerCase();
    var mensaje = limpiar_(p.mensaje, 1500, true);
    var idioma = limpiar_(p.idioma, 5, false);
    var pagina = limpiar_(p.pagina, 200, false);

    if (!pieza || !nombre || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return respuesta_(false);
    }

    lock.waitLock(15000);

    // Frenos contra spam
    var cache = CacheService.getScriptCache();
    var kEmail = 'e_' + email.replace(/[^a-z0-9]/g, '_').slice(0, 80);
    var nEmail = Number(cache.get(kEmail) || 0);
    var nTotal = Number(cache.get('total') || 0);
    if (nEmail >= MAX_POR_EMAIL_HORA || nTotal >= MAX_POR_VENTANA) return respuesta_(false);
    cache.put(kEmail, String(nEmail + 1), 3600);
    cache.put('total', String(nTotal + 1), 21600);

    // Guardar en el Sheet (todo como texto plano: así nada se interpreta como fórmula)
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var hoja = ss.getSheetByName(HOJA) || ss.insertSheet(HOJA);
    if (hoja.getLastRow() === 0) {
      hoja.appendRow(['Fecha', 'Pieza', 'Nombre', 'Email', 'Mensaje', 'Idioma', 'Página', 'Estado']);
      hoja.setFrozenRows(1);
    }
    var fecha = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm');
    var fila = hoja.getLastRow() + 1;
    var rango = hoja.getRange(fila, 1, 1, 8);
    rango.setNumberFormat('@');
    rango.setValues([[fecha, pieza, nombre, email, mensaje, idioma, pagina, 'nueva']]);

    // Avisarte por mail
    MailApp.sendEmail({
      to: AVISAR_A || Session.getEffectiveUser().getEmail(),
      replyTo: email,
      subject: 'Interesado en pieza: ' + pieza,
      body: 'Pieza: ' + pieza + '\nNombre: ' + nombre + '\nEmail: ' + email +
            '\nIdioma: ' + idioma + '\nPágina: ' + pagina + '\n\nMensaje:\n' + (mensaje || '(sin mensaje)')
    });

    return respuesta_(true);
  } catch (err) {
    return respuesta_(false);
  } finally {
    try { lock.releaseLock(); } catch (e2) {}
  }
}

function doGet() {
  return ContentService.createTextOutput('heyguala consultas');
}

function limpiar_(v, max, multilinea) {
  var s = String(v == null ? '' : v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');
  s = multilinea ? s.replace(/\r/g, '') : s.replace(/[\r\n\t]+/g, ' ');
  return s.trim().slice(0, max);
}

function respuesta_(ok) {
  return ContentService.createTextOutput(JSON.stringify({ ok: ok }))
    .setMimeType(ContentService.MimeType.JSON);
}
