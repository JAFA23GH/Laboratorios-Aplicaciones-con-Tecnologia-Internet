const lang = document.documentElement.lang; 

let configURL = "";
if (lang === "es") {
    configURL = "conf\/configES.json";
} else if (lang === "en") {
    configURL = "conf\/configEN.json";
}else if (lang === "pt") {
    configURL = "conf\/configPT.json";
} else {
    configURL = "conf\/configES.json";
}

fetch("datos\/index.json")

.then(function(response){

    return response.json();
})

.then(function(perfiles) {
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
  .catch(function(error) {
      console.error("Error al cargar los perfiles:", error);
  });