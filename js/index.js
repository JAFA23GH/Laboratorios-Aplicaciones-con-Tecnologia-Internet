document.addEventListener('DOMContentLoaded', async function() {
  // ---------------------------
  // Cargar configuración de idioma
  // ---------------------------
  const urlParams = new URLSearchParams(window.location.search);
  // Se busca el parámetro "lang". Si no existe, se revisa "ilang".
  let langParam = urlParams.get('lang') || urlParams.get('ilang');
  const lang = langParam ? langParam.toUpperCase() : 'ES';
  const configUrl = `conf/config${lang}.json`;
  let config = {};

  try {
    const response = await fetch(configUrl);
    if (!response.ok)
      throw new Error(`Error cargando ${configUrl}: ${response.statusText}`);
    config = await response.json();

    // Actualizar elementos en index.html 
    
    const welcomeMessageContainer = document.getElementById("welcomeMessageContainer");
    if (welcomeMessageContainer && config.saludo) {
      welcomeMessageContainer.innerText = config.saludo;
    }    
    
    const headerTitle = document.getElementById("headerTitle");
    if (headerTitle && config.sitio && Array.isArray(config.sitio)) {
      headerTitle.innerHTML = config.sitio.join(" ");
    }
    
    const searchPlaceholder = document.getElementById("searchPlaceholder");
    if (searchPlaceholder && config.nombre) {
      searchPlaceholder.placeholder = config.nombre;
    }
    
    const searchButton = document.getElementById("searchButtonText");
    if (searchButton && config.buscar) {
      searchButton.innerText = config.buscar;
    }
    
    const footerText = document.getElementById("footerText");
    if (footerText && config.copyRight) {
      footerText.innerText = config.copyRight;
    }
    
    const titleElement = document.getElementById("pageTitle");
    if (titleElement && config.sitio && Array.isArray(config.sitio)) {
      const newTitle = config.sitio.join(" ");
      titleElement.innerText = newTitle;
      document.title = newTitle;
    }
    
    // Actualizar elementos en perfil.html
    const gustosContainer = document.querySelector(".gustos-perfil");
    if (gustosContainer) {
      const paragraphs = gustosContainer.querySelectorAll("p");
   
      if (paragraphs.length >= 5) {
        paragraphs[0].innerHTML = `${config.color}: <span id="perfil-color">${document.getElementById("perfil-color")?.innerText || ""}</span>`;
        paragraphs[1].innerHTML = `${config.libro}: <span id="perfil-libro">${document.getElementById("perfil-libro")?.innerText || ""}</span>`;
        paragraphs[2].innerHTML = `${config.musica}: <span id="perfil-musica">${document.getElementById("perfil-musica")?.innerText || ""}</span>`;
        paragraphs[3].innerHTML = `${config.video_juego}: <span id="perfil-videojuego">${document.getElementById("perfil-videojuego")?.innerText || ""}</span>`;
        const languageLabel = config.lenguages || config.lenguajes || "Lenguajes aprendidos";
        paragraphs[4].innerHTML = `<strong>${languageLabel}: <span id="perfil-lenguajes">${document.getElementById("perfil-lenguajes")?.innerText || ""}</span></strong>`;
      }
    }
   
    const emailContainer = document.querySelector(".contacto-email p");
    if (emailContainer && config.email) {
      const emailPlaceholder = "jalffernandesucv@gmail.com";
      if (config.email.includes("[email]")) {
        const parts = config.email.split("[email]");
        emailContainer.innerHTML = `${parts[0]}<a id="perfil-email" href="mailto:${emailPlaceholder}">${emailPlaceholder}</a>${parts[1]}`;
      } else {
        emailContainer.innerHTML = `${config.email} <a id="perfil-email" href="mailto:${emailPlaceholder}">${emailPlaceholder}</a>`;
      }
    }
  } catch (error) {
    console.error("Fallo al cargar la configuración:", error);
  }

  // ---------------------------
  // Código para el listado y búsqueda de estudiantes en index.html
  // ---------------------------
  if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
    try {
      const response = await fetch("datos/index.json");
      const perfiles = await response.json();
      
      let allStudents = perfiles;

      const renderStudents = function(list) {
        const ul = document.querySelector("#student-list");
        let out = "";
        list.forEach(function(perfil, index) {         
            out += `
              <li class="perfil">
                <a href="perfil.html?id=${perfil.ci}" class="perfil-link">
                  <img src="${perfil.imagen}" alt="${perfil.nombre}">
                  <p>${perfil.nombre}</p>
                </a>
              </li>
            `;          
        });
        if (ul) ul.innerHTML = out;
      };

      renderStudents(allStudents);

      // Agregar funcionalidad de búsqueda
      const searchInput = document.getElementById("searchPlaceholder");
      const sectionContainer = document.querySelector("section");
      searchInput.addEventListener("input", function() {
        const query = searchInput.value.trim().toLowerCase();
        if (query === "") {
          sectionContainer.innerHTML = "<ul id='student-list'></ul>";
          renderStudents(allStudents);
          return;
        }
        let filtered = allStudents.filter(p => p.nombre.toLowerCase().includes(query));
        if (filtered.length === 0) {
          const noResultMsg = (config.no_alumnos || "No hay alumnos que tengan en su nombre:") + " " + query;
          sectionContainer.innerHTML = `<div style="font-size:2em; text-align:center; color:#99c5dd; margin-top:2em;">${noResultMsg}</div>`;;
        } else {
          sectionContainer.innerHTML = "<ul id='student-list'></ul>";
          renderStudents(filtered);
        }
      });
    } catch (error) {
      console.error("Error al cargar los perfiles:", error);
    }
  }

  // ---------------------------
  // Código para el perfil en perfil.html
  // ---------------------------
  if (window.location.pathname.endsWith('perfil.html')) {
    const urlParamsPerfil = new URLSearchParams(window.location.search);
    const profileId = urlParamsPerfil.get('id');

    // Función auxiliar que intenta cargar la imagen en distintos formatos:
    async function cargarImagen(id) {    
      const extensiones = ['jpg', 'JPG', 'png', 'PNG'];
      for (const ext of extensiones) {
        const url = `${id}/${id}.${ext}`;
        const response = await fetch(url, { method: 'HEAD' });
        if (response.ok) {
          return url; 
        }
      }
      throw new Error('Imagen no encontrada en formato jpg o png');
    }

    try {
      const response = await fetch(`${profileId}/perfil.json`);
      const profile = await response.json();      
      if (!profile) throw new Error('Perfil no encontrado');

      document.getElementById('perfil-nombre').textContent = profile.nombre;
      document.getElementById('perfil-descripcion').textContent = profile.descripcion;        
      document.getElementById('perfil-color').textContent = profile.color;
      document.getElementById('perfil-libro').textContent = profile.libro;
      document.getElementById('perfil-musica').textContent = profile.musica;
      document.getElementById('perfil-videojuego').textContent = profile.video_juego;
      document.getElementById('perfil-lenguajes').textContent = profile.lenguajes ? profile.lenguajes.join(', ') : "";

      const emailElement = document.getElementById('perfil-email');
      if (emailElement) {
        emailElement.href = `mailto:${profile.email}`;
        emailElement.textContent = profile.email;
      } else {
        console.error("No se encontró el elemento con id 'perfil-email'");
      }

      // Manejo de la imagen con múltiples formatos
      try {
        const imageUrl = await cargarImagen(profileId);
        document.getElementById('perfil-img-default').src = imageUrl;
      } catch (imgError) {
        console.error("Error cargando imagen:", imgError);
        // Imagen de respaldo si no se encuentra alguna de las opciones
        document.getElementById('perfil-img-default').src = "default.jpg";
      }

      document.title = `${profile.nombre} | Perfil`;
    } catch (error) {
      console.error('Error:', error);
      document.body.innerHTML = `<h1>Error: ${error.message}</h1>`;
    }
  }
});