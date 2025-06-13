#!/usr/bin/env python3
import cgi
import os
import json

print("Content-Type: text/html")
print()

# Obtiene el parámetro 'student_id' de la URL
form = cgi.FieldStorage()
student_id = form.getvalue("student_id")

if not student_id:
    print("<div>Error: No se ha especificado el ID del estudiante.</div>")
    exit()

# Define la ruta de la carpeta del perfil
profile_dir = f"/var/www/ATI/data/perfiles/{student_id}"
json_path = os.path.join(profile_dir, "perfil.json")

# Verifica que el archivo JSON exista
if not os.path.exists(json_path):
    print("<div>Error: Perfil no encontrado.</div>")
    exit()

# Carga los datos del perfil desde el archivo JSON
with open(json_path, "r", encoding="utf-8") as f:
    perfil = json.load(f)

# Determina la imagen del perfil.
imagen = perfil.get("imagen")
if not imagen:    
    for archivo in os.listdir(profile_dir):
        if archivo.lower().endswith((".jpg", ".png")):
            imagen = archivo
            break

# Define la ruta pública donde se servirán las imágenes.
imagen_url = f"/ATI/static/perfiles/{imagen}" if imagen else ""

# Genera el HTML del perfil
html = f"""<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="http://www.ciens.ucv.ve/portalasig2/favicon.ico" type="image/x-icon">
    <title>Perfil</title>
    <link rel="stylesheet" href="css/style.css">
    <script src="js/index.js" defer></script>
</head>
<body>
    <div class="container">
        <div class="foto">
            <img id="perfil-img-default" class="profile-image" src="{imagen_url}" alt="Foto de perfil">
        </div>

        <div class="info-perfil">
            <div class="nombre-perfil">
                <h1 id="perfil-nombre">{perfil.get("nombre", "")}</h1>
            </div>

            <div class="descripcion-perfil">
                <p id="perfil-descripcion">{perfil.get("descripcion", "")}</p>
            </div>

            <div class="gustos-perfil">
                <p>Mi color favorito es: <span id="perfil-color">{perfil.get("color", "")}</span></p>
                <p>Mi libro favorito es: <span id="perfil-libro">{perfil.get("libro", "")}</span></p>
                <p>Estilo de música preferida es: <span id="perfil-musica">{perfil.get("musica", "")}</span></p>
                <p>Mis Videojuegos favoritos son: <span id="perfil-videojuego">{perfil.get("videojuego", "")}</span></p>
                <p><strong>Lenguajes aprendidos: <span id="perfil-lenguajes">{perfil.get("lenguajes", "")}</span></strong></p>
            </div>

            <div class="contacto-email">
                <p>Si necesitan comunicarse conmigo me pueden escribir a: 
                    <a id="perfil-email" href="mailto:{perfil.get("email", "")}">{perfil.get("email", "")}</a>
                </p>
            </div>
        </div>
    </div>    
</body>
</html>
"""

print(html)
