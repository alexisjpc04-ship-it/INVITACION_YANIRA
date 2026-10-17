'use strict';
const cfg = window.INVITACION;
const $ = id => document.getElementById(id);
$('personal-message').textContent = cfg.mensaje;
$('maps').href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(cfg.lugar + ', ' + cfg.direccion);
if (!cfg.whatsapp) $('rsvp-status').textContent = 'El número de confirmación está pendiente. Pronto podrás confirmar tu asistencia por aquí.';
$('rsvp').addEventListener('click', () => {
  const number = cfg.whatsapp.replace(/\D/g, '');
  if (!/^\d{8,15}$/.test(number)) { $('rsvp-status').textContent = 'La familia aún no ha añadido el número de WhatsApp para confirmar. Por favor, comunícate con ella directamente.'; return; }
  window.open('https://wa.me/' + number + '?text=' + encodeURIComponent(cfg.mensajeWhatsapp), '_blank', 'noopener,noreferrer');
});
const eventTime = new Date(cfg.fecha).getTime();
function countdown() {
  const remaining = Math.max(0, eventTime - Date.now());
  const values = [Math.floor(remaining / 86400000), Math.floor(remaining / 3600000) % 24, Math.floor(remaining / 60000) % 60, Math.floor(remaining / 1000) % 60];
  ['days','hours','minutes','seconds'].forEach((id,i) => $(id).textContent = String(values[i]).padStart(2,'0'));
  if (!remaining) $('countdown-note').textContent = '¡Llegó el día de celebrar!';
}
countdown(); setInterval(countdown, 1000);
function icsEscape(value) { return value.replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;'); }
$('calendar').addEventListener('click', () => {
  const stamp = date => date.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
  const content = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Yanira XV//Invitacion//ES','BEGIN:VEVENT','UID:yanira-xv-20261107@invitacion.local','SEQUENCE:1','DTSTAMP:' + stamp(new Date()),'DTSTART:' + stamp(new Date(cfg.fecha)),'SUMMARY:' + icsEscape('XV años de ' + cfg.nombre),'LOCATION:' + icsEscape(cfg.lugar + ', ' + cfg.direccion),'DESCRIPTION:Celebramos los XV años de Yanira.','BEGIN:VALARM','ACTION:DISPLAY','DESCRIPTION:Hoy celebramos los XV años de Yanira a las 7:30 p. m.','TRIGGER;VALUE=DATE-TIME:' + stamp(new Date(cfg.recordatorio)),'END:VALARM','END:VEVENT','END:VCALENDAR'].join('\r\n');
  const url = URL.createObjectURL(new Blob([content],{type:'text/calendar;charset=utf-8'}));
  const link = document.createElement('a'); link.href = url; link.download = 'XV-Yanira.ics'; link.click(); setTimeout(() => URL.revokeObjectURL(url),1000);
});
cfg.fotos.forEach(photo => {
  const button = document.createElement('button'); button.className = 'photo-button'; button.setAttribute('aria-label','Ampliar: ' + photo.alt);
  const img = document.createElement('img'); img.src = photo.src; img.alt = photo.alt; img.loading = 'lazy'; img.width=1024; img.height=1536;
  const icon = document.createElement('span'); icon.textContent = '↗'; icon.setAttribute('aria-hidden','true'); button.append(img,icon);
  button.addEventListener('click', () => { $('full-photo').src = photo.src; $('full-photo').alt = photo.alt; $('photo-caption').textContent = photo.titulo || ''; $('lightbox').showModal(); });
  $('gallery-grid').append(button);
});
$('close-photo').addEventListener('click', () => $('lightbox').close());
$('lightbox').addEventListener('click',e => { if (e.target === $('lightbox')) $('lightbox').close(); });
const audio = $('audio'); let track = 0;
function formatTime(seconds) { if (!Number.isFinite(seconds)) return '0:00'; return Math.floor(seconds / 60) + ':' + String(Math.floor(seconds % 60)).padStart(2,'0'); }
function setTrack(index) {
  if (!cfg.canciones.length) return;
  track = (index + cfg.canciones.length) % cfg.canciones.length;
  const song = cfg.canciones[track]; audio.src = song.archivo;
  $('track-title').textContent = song.titulo; $('track-artist').textContent = song.artista;
  $('slogan').textContent = song.frase || ''; document.querySelector('.album').src = song.portada || cfg.fotos[0].src;
  $('seek').value=0; $('current').textContent='0:00'; $('duration').textContent='0:00';
  $('audio-status').textContent='';
  document.querySelectorAll('.track-option').forEach((button,i) => { button.classList.toggle('active',i===track); button.setAttribute('aria-pressed',String(i===track)); });
}
async function play() { try { await audio.play(); $('audio-status').textContent=''; } catch (error) { $('audio-status').textContent='Toca reproducir para iniciar la música. Si no carga, comprueba el archivo de audio.'; } }
function setExpanded(expanded) { $('playlist').hidden = !expanded; $('toggle-list').setAttribute('aria-expanded',String(expanded)); }
cfg.canciones.forEach((song,i) => { const button=document.createElement('button'); button.className='track-option'; button.textContent=String(i+1).padStart(2,'0') + ' · ' + song.titulo; button.addEventListener('click',() => {setTrack(i);play();}); $('track-list').append(button); });
if(cfg.canciones.length) setTrack(0);
$('prev').disabled=cfg.canciones.length<2; $('next').disabled=cfg.canciones.length<2;
$('prev').addEventListener('click',() => {setTrack(track-1);play();});
$('next').addEventListener('click',() => {setTrack(track+1);play();});
$('play').addEventListener('click',() => audio.paused ? play() : audio.pause());
audio.addEventListener('play',() => {$('play').textContent='Ⅱ';$('play').setAttribute('aria-label','Pausar');});
audio.addEventListener('pause',() => {$('play').textContent='▶';$('play').setAttribute('aria-label','Reproducir');});
audio.addEventListener('ended',() => {setTrack(track+1);play();});
audio.addEventListener('loadedmetadata',() => {$('duration').textContent=formatTime(audio.duration);});
audio.addEventListener('timeupdate',() => { $('current').textContent=formatTime(audio.currentTime); if(Number.isFinite(audio.duration)&&audio.duration>0) $('seek').value=audio.currentTime/audio.duration*100; });
$('seek').addEventListener('input',e => {if(Number.isFinite(audio.duration)&&audio.duration>0) audio.currentTime=Number(e.target.value)*audio.duration/100;});
$('mute').addEventListener('click',() => {audio.muted=!audio.muted;$('mute').textContent=audio.muted?'♫̸':'♪';$('mute').setAttribute('aria-label',audio.muted?'Activar sonido':'Silenciar');$('mute').setAttribute('aria-pressed',String(audio.muted));});
$('toggle-list').addEventListener('click',() => setExpanded($('playlist').hidden));
$('close-playlist').addEventListener('click',() => setExpanded(false));
audio.addEventListener('error',() => {$('audio-status').textContent='No se pudo cargar esta canción. Revisa su ruta en js/config.js.';setExpanded(true);});
$('open').addEventListener('click',() => { $('gate').classList.add('opened'); $('gate').setAttribute('inert',''); document.body.classList.remove('locked'); $('invitation').inert=false; $('player').hidden=false; if(cfg.canciones.length) play(); document.querySelector('.scroll-link').focus({preventScroll:true}); });
if('IntersectionObserver' in window) { const observer = new IntersectionObserver(entries => entries.forEach(entry => {if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.12}); document.querySelectorAll('.reveal').forEach(el => observer.observe(el)); } else document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));
if(!matchMedia('(prefers-reduced-motion: reduce)').matches) for(let i=0;i<25;i++){const dot=document.createElement('i');dot.className='firefly';dot.style.left=Math.random()*100+'%';dot.style.top=Math.random()*100+'%';dot.style.setProperty('--speed',6+Math.random()*8+'s');dot.style.setProperty('--delay',-Math.random()*12+'s');$('lights').append(dot);}
