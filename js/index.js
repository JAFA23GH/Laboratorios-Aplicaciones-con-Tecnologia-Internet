document.addEventListener('DOMContentLoaded', function() {
    // Código para el listado de estudiantes
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        fetch("datos/index.json")
        .then(response => response.json())
        .then(perfiles => {
            let placeholder = document.querySelector("#student-list");
            let out = "";
            
            perfiles.forEach(function(perfil, index) {
                if (index !== 0) {
                    out += `
                        <li>
                            <img src="${perfil.imagen}" alt="${perfil.nombre}">
                            ${perfil.nombre}
                        </li>
                    `;
                    
                } else {
                    out += `
                        <li>
                        <picture>
                            <source media="(max-width:768px)" srcset=${perfil.imagen_pequena}>
                            <source media="(min-width:769px)" srcset=${perfil.imagen_grande}>   
                            <img src=${perfil.imagen_grande} alt="Foto de perfil">             
                        </picture>  
                        ${perfil.nombre}
                        </li>
                    `;
                }
            });
            
            placeholder.innerHTML = out;
        })
        .catch(error => console.error("Error al cargar los perfiles:", error));
    }
    
     // Código para el perfil
    if (window.location.pathname.endsWith('perfil.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const profileId = urlParams.get('id');

        fetch("datos/index.json")
        .then(response => response.json())
        .then(profiles => {
            // id será la cédula
            const profile = profiles.find(p => p.ci === profileId);
            if (!profile) throw new Error('Perfil no encontrado');

            // Actualizar elementos del DOM
            document.getElementById('perfil-nombre').textContent = profile.nombre;
            document.getElementById('perfil-descripcion').textContent = profile.descripcion;
            document.getElementById('perfil-color').textContent = profile.color;
            document.getElementById('perfil-libro').textContent = profile.libro;
            document.getElementById('perfil-musica').textContent = profile.musica;
            document.getElementById('perfil-videojuego').textContent = profile.videojuegos?.join(', ');
            document.getElementById('perfil-lenguajes').textContent = profile.lenguajes?.join(', ');
            document.getElementById('perfil-ci').textContent = profile.ci;
            document.getElementById('perfil-genero').textContent = profile.género;
            document.getElementById('perfil-fecha-nacimiento').textContent = profile.fecha_nacimiento;
            
            // Actualizar email e imagen
            const emailElement = document.getElementById('perfil-email');
            emailElement.href = `mailto:${profile.email}`;
            emailElement.textContent = profile.email;
            document.getElementById('perfil-img-default').src = profile.imagen;

            // Título de la página
            document.title = `${profile.nombre} | Perfil`;
        })
        .catch(error => {
            console.error('Error:', error);
            document.body.innerHTML = `<h1>Error: ${error.message}</h1>`;
        });
    }
});