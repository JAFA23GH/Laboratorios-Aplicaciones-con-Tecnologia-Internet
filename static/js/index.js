document.addEventListener('DOMContentLoaded', function () {
  const app = document.getElementById('app');
  let currentLang = 'ES';
  let config = {};

  // Cargar configuración de idioma desde el backend
  async function cargarConfig(lang = 'ES') {
    const res = await fetch(`/ATI/index.py?config=1&lang=${lang}`);
    return await res.json();
  }

  // Cargar lista de estudiantes desde el backend
  async function cargarLista() {
    const res = await fetch('/ATI/index.py?list=1');
    return await res.json();
  }

  // Cargar perfil individual desde el backend
  async function cargarPerfil(id) {
    const res = await fetch(`/ATI/perfil.py?student_id=${id}&json=1`);
    return await res.json();
  }

  // Renderizar header
  function renderHeader() {
  return `
    <header class="header-block">
      <nav>
        <div class="header-block logo" id="headerTitle">${(config.sitio || []).join(" ")}</div>
        <div class="separador"></div>
        <div class="header-block nav-name" id="welcomeMessageContainer">${config.saludo || ""}</div>
        <div class="separador"></div>
        <div class="header-block search-form">
          <input type="text" class="search-input" id="searchPlaceholder" placeholder="${config.nombre || "Nombre..."}">
          <button type="submit" class="search-button" id="searchButtonText">${config.buscar || "Buscar"}</button>
        </div>
        <div style="margin-left:20px;">          
          <select id="langSelect">
            <option value="ES" ${currentLang === 'ES' ? 'selected' : ''}>ES</option>
            <option value="EN" ${currentLang === 'EN' ? 'selected' : ''}>EN</option>
            <option value="PT" ${currentLang === 'PT' ? 'selected' : ''}>PT</option>
          </select>
        </div>
      </nav>
    </header>
  `;
}
  // Renderizar footer
  function renderFooter() {
    return `<footer id="footerText">${config.copyRight || "Copyright &copy; 2025 Escuela de computación - ATI. Todos los derechos reservados"}</footer>`;
  }

  // Renderizar lista de estudiantes
  async function renderLista() {
    config = await cargarConfig(currentLang);
    const estudiantes = await cargarLista();

    let html = renderHeader();
    html += `
      <section>
        <ul id="student-list">
          ${estudiantes.map(perfil => `
            <li class="perfil">
              <a href="#" class="perfil-link" data-id="${perfil.id}">
                <img src="${perfil.imagen || '/ATI/static/images/default_profile.png'}" alt="${perfil.nombre}">
                <p>${perfil.nombre}</p>
              </a>
            </li>
          `).join('')}
        </ul>
      </section>
      ${renderFooter()}
    `;
    app.innerHTML = html;

    // Listeners para los enlaces de perfil
    app.querySelectorAll('a.perfil-link').forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        renderPerfil(link.dataset.id);
      });
    });

    // Listener para el cambio de idioma
    document.getElementById('langSelect').addEventListener('change', function (e) {
      currentLang = e.target.value;
      renderLista();
    });

    // Listener para búsqueda
    const searchInput = document.getElementById("searchPlaceholder");
    searchInput.addEventListener("input", function () {
      const query = searchInput.value.trim().toLowerCase();
      const filtered = estudiantes.filter(p => p.nombre.toLowerCase().includes(query));
      const ul = document.getElementById("student-list");
      if (filtered.length === 0) {
        ul.innerHTML = `<div style="font-size:2em; text-align:center; color:#99c5dd; margin-top:2em;">${(config.no_alumnos || "No hay alumnos que tengan en su nombre:")} ${query}</div>`;
      } else {
        ul.innerHTML = filtered.map(perfil => `
          <li class="perfil">
            <a href="#" class="perfil-link" data-id="${perfil.id}">
              <img src="${perfil.imagen || '/ATI/static/images/default_profile.png'}" alt="${perfil.nombre}">
              <p>${perfil.nombre}</p>
            </a>
          </li>
        `).join('');
        ul.querySelectorAll('a.perfil-link').forEach(link => {
          link.addEventListener('click', function (e) {
            e.preventDefault();
            renderPerfil(link.dataset.id);
          });
        });
      }
    });
  }

  // Renderizar perfil individual
  async function renderPerfil(id) {
    config = await cargarConfig(currentLang);
    const perfil = await cargarPerfil(id);

    let html = renderHeader();
    html += `
      <div class="container">
        <div class="foto">
          <img id="perfil-img-default" class="profile-image" src="${perfil.imagen_url || '/ATI/static/images/default_profile.png'}" alt="Foto de perfil">
        </div>
        <div class="info-perfil">
          <div class="nombre-perfil"><h1 id="perfil-nombre">${perfil.nombre || ""}</h1></div>
          <div class="descripcion-perfil">
            <p id="perfil-descripcion">${perfil.descripcion || ""}</p>
          </div>
          <div class="gustos-perfil">
            <p>${config.color || "Mi color favorito es"}: <span id="perfil-color">${perfil.color || ""}</span></p>
            <p>${config.libro || "Mi libro favorito es"}: <span id="perfil-libro">${perfil.libro || ""}</span></p>
            <p>${config.musica || "Estilo de música preferida es"}: <span id="perfil-musica">${perfil.musica || ""}</span></p>
            <p>${config.video_juego || "Mis Videojuegos favoritos son"}: <span id="perfil-videojuego">${perfil.video_juego || ""}</span></p>
            <p><strong>${config.lenguajes || "Lenguajes aprendidos"}: <span id="perfil-lenguajes">${(perfil.lenguajes || []).join(', ')}</span></strong></p>
          </div>
          <div class="contacto-email">
            <p>${(config.email || "Si necesitan comunicarse conmigo me pueden escribir a")}: <a id="perfil-email" href="mailto:${perfil.email || ""}">${perfil.email || ""}</a></p>
          </div>
          <button id="volver">${currentLang === 'EN' ? 'Back' : 'Volver'}</button>
        </div>
      </div>
      ${renderFooter()}
    `;
    app.innerHTML = html;

    document.getElementById('volver').onclick = renderLista;

    // Listener para el cambio de idioma en perfil
    document.getElementById('langSelect').addEventListener('change', function (e) {
      currentLang = e.target.value;
      renderPerfil(id);
    });
  }

  // Inicializar SPA
  renderLista(); 
}); 