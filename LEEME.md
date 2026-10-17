# Invitación de XV años — Yanira Lizeth

Abre index.html con doble clic. Pulsa «Abrir invitación» para entrar e iniciar la música. No necesita instalación ni compilación.

## Archivos
- index.html: secciones, textos de fecha, local, padres y diseño general.
- css/estilos.css: colores, tipografías, composición y animaciones.
- js/config.js: mensaje, fecha de cuenta regresiva, vestimenta, WhatsApp, fotos y canciones.
- js/app.js: reproductor, galería, cuenta regresiva y calendario.
- img/: fotografías y decoración.
- musica/: canciones.

## Personalizar
Edita js/config.js con un editor de texto y conserva comillas y comas.
El WhatsApp está vacío a propósito: agrega el número con código de país y solo dígitos. Mientras esté pendiente, el botón muestra una explicación y no envía a un número inventado.
La vestimenta está «Por confirmar»: reemplaza vestimenta y notaVestimenta cuando estén definidas.
Hay una fotografía y una canción, las proporcionadas. Añade entradas a fotos y canciones para ampliar la galería y la lista; no dupliques entradas para simular contenido.
Ejemplo de otra canción: {archivo:'musica/otra.mp3', titulo:'Título', artista:'Artista', frase:'Tu frase', portada:'img/portada.jpg'}
Ejemplo de otra foto: {src:'img/otra.jpg', alt:'Descripción de la fotografía', titulo:'Mi recuerdo'}
La fecha incluye -05:00 para usar la hora de Perú. Si cambias el evento, actualiza también los textos visibles en index.html y el mensaje de WhatsApp. El calendario usa la misma fecha de configuración y no inventa una hora de término.
Para cambiar el nombre y los padres, busca los textos en index.html. Actualiza también nombre y apellidos en config.js. El mensaje de bienvenida es una propuesta editable.

## Compartir mediante un enlace
Sube index.html y las carpetas css, js, img y musica juntas a un alojamiento de archivos estáticos (por ejemplo, tu hosting habitual, GitHub Pages o Netlify). index.html debe estar en la raíz publicada. El proveedor te dará una URL que puedes compartir por WhatsApp. No se ha publicado automáticamente.
Prueba la URL en un celular y comprueba fotos, reproducción, ubicación y confirmación antes de enviarla. El enlace de Maps busca la dirección suministrada; reemplázalo por el enlace exacto del local si lo tienes.

## Recursos y funcionamiento
Se conserva la foto original y se generó yanira.webp optimizada para la web.
La música es el archivo que aportaste; para publicar, utiliza audio que tengas permiso para compartir.
La foto ambiental opcional de nenúfares se carga desde Unsplash y necesita internet; si no está disponible, se mantiene el fondo verde. Autor: MAK. Fuente: https://unsplash.com/photos/v6JYm5Q0Tzk — licencia: https://unsplash.com/license
Tipografías Cormorant Garamond y DM Sans desde Google Fonts; sin conexión se usan Georgia y Arial.
La decoración floral SVG es original, sin personajes ni ilustraciones Disney.
El reproductor permanece fijo y la página reserva espacio al final. Toca el título de la canción para desplegar la lista y la barra de progreso. Con una sola canción, anterior y siguiente quedan desactivados; al terminar vuelve a comenzar.
La música requiere la interacción inicial por las reglas de los navegadores. No se interrumpe al desplazarse por la página.
Se respeta la preferencia del dispositivo de reducir movimiento. Las imágenes se amplían en un diálogo que se cierra con × o Escape.
