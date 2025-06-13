#!/usr/bin/env python3
import cgi
import os
import json
import uuid
from http import cookies

# Indica al navegador que el contenido es HTML
print("Content-Type: text/html")

# Manejo de cookies para la sesión
cookie = cookies.SimpleCookie(os.environ.get("HTTP_COOKIE"))
if "sessionId" not in cookie:
    session_id = str(uuid.uuid4())
    print(f"Set-Cookie: sessionId={session_id}; Path=/")
else:
    session_id = cookie["sessionId"].value

# Línea en blanco obligatoria entre headers y contenido
print()

# Procesa parámetros de la URL, por ejemplo para seleccionar el idioma
form = cgi.FieldStorage()
lang = form.getvalue("lang", "es")  # Por defecto en español

# Carga dinámica de la configuración según el idioma
# Se asume que tienes archivos: conf/configES.json y conf/configEN.json, por ejemplo.
config_path = f"/var/www/ATI/conf/config{lang.upper()}.json"
if not os.path.exists(config_path):
    config_path = "/var/www/ATI/conf/configES.json"  # Valor por defecto

with open(config_path, "r", encoding="utf-8") as config_file:
    config = json.load(config_file)

# Genera el HTML de la página, tomando como base tu index.html
html = f"""<!DOCTYPE html>
<html lang="{lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="http://www.ciens.ucv.ve/portalasig2/favicon.ico" type="image/x-icon">
    <title id="pageTitle">{config.get('titulo', 'ATI[UCV] 2024-1')}</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="preload" href="conf/configES.json" as="fetch" crossorigin>
    <script src="js/index.js" defer></script>    
</head>
<body>

    <header class="header-block">
        <nav>
            <div class="header-block logo" id="headerTitle">{config.get('logoText', '')}</div>
            <div class="separador"></div>
            <div class="header-block nav-name" id="welcomeMessageContainer">{config.get('welcomeMessage', '')}</div>
            <div class="separador"></div>
            <div class="header-block search-form">
                <input type="text" class="search-input" id="searchPlaceholder" placeholder="Nombre...">
                <button type="submit" class="search-button" id="searchButtonText">{config.get('searchButton', 'Buscar')}</button>
            </div>
        </nav>
    </header>

    <section>
        <ul id="student-list">
            <!-- La lista de estudiantes se cargará aquí dinámicamente -->
        </ul>
    </section>

    <footer id="footerText">
        {config.get('footer', 'Copyright © 2025 Escuela de computación - ATI. Todos los derechos reservados')}
    </footer>

</body>
</html>
"""

print(html)
