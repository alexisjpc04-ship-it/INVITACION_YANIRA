/** @OnlyCurrentDoc */
function doGet() {
  return HtmlService.createHtmlOutput(`<!doctype html><html lang="es"><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>*{box-sizing:border-box}body{margin:0;padding:12px;background:transparent;color:#405339;font:16px Arial,sans-serif}form{max-width:420px;margin:auto}label{display:block;font-size:14px;margin-bottom:10px}input{width:100%;padding:16px;border:1px solid #a8b88a;border-radius:12px;font:16px Arial;background:#fffef8;color:#344331}button{display:block;margin:18px auto 0;padding:15px 30px;min-height:48px;border:0;border-radius:30px;background:#627647;color:white;font:600 14px Arial;cursor:pointer}button:disabled{opacity:.6}input:focus,button:focus-visible{outline:2px solid #627647;outline-offset:3px}#estado{text-align:center;font-size:14px;line-height:1.5;margin:14px 0;min-height:42px}.trap{position:absolute;left:-9999px}</style></head><body><form id="form"><label for="cancion">Canción (puedes añadir el artista)</label><input id="cancion" name="cancion" placeholder="Esa canción que te lleva a la pista…" required minlength="2" maxlength="160" autocomplete="off"><div class="trap" aria-hidden="true"><input id="web" tabindex="-1" autocomplete="off"></div><button id="enviar" type="submit">Enviar mi canción ♫</button><p id="estado" role="status" aria-live="polite"></p></form><script>var form=document.getElementById('form'),button=document.getElementById('enviar'),statusText=document.getElementById('estado');form.addEventListener('submit',function(e){e.preventDefault();button.disabled=true;statusText.textContent='Guardando tu canción…';google.script.run.withSuccessHandler(function(result){button.disabled=false;statusText.textContent=result.message;if(result.ok)form.reset();}).withFailureHandler(function(){button.disabled=false;statusText.textContent='No se pudo enviar. Inténtalo nuevamente.';}).guardarCancion(document.getElementById('cancion').value,document.getElementById('web').value);});</script></body></html>`).setTitle('Una canción para los XV de Yanira').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
function guardarCancion(valor, trampa) {
  if (trampa) return {ok:false,message:'No se pudo enviar.'};
  const cancion = String(valor || '').trim().replace(/[\r\n\t]+/g,' ');
  if (cancion.length < 2 || cancion.length > 160) return {ok:false,message:'Escribe una canción de entre 2 y 160 caracteres.'};
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return {ok:false,message:'Hay varios envíos. Inténtalo en un momento.'};
  try {
    const cache=CacheService.getScriptCache();
    const key=Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,cancion.toLowerCase()));
    if(cache.get(key)) return {ok:false,message:'Esta canción acaba de ser sugerida. ¡Gracias! Puedes proponer otra.'};
    const libro=SpreadsheetApp.getActiveSpreadsheet();
    let hoja=libro.getSheetByName('Canciones');
    if(!hoja){hoja=libro.insertSheet('Canciones');hoja.appendRow(['Fecha de envío (Perú)','Canción sugerida']);hoja.setFrozenRows(1);hoja.getRange('A1:B1').setFontWeight('bold').setBackground('#dfe9ca');hoja.setColumnWidth(1,200);hoja.setColumnWidth(2,420);}
    const segura=/^[=+@-]/.test(cancion)?"'"+cancion:cancion;
    hoja.appendRow([Utilities.formatDate(new Date(),'America/Lima','yyyy-MM-dd HH:mm:ss'),segura]);
    cache.put(key,'1',60);
    return {ok:true,message:'¡Listo! Tu canción quedó guardada para los XV de Yanira. ♡'};
  } finally {lock.releaseLock();}
}
