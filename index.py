#!/usr/bin/env python3
import cgi
import os
import json
import uuid
from http import cookies

form = cgi.FieldStorage()
lang = form.getvalue("lang", "es")
config_json = form.getvalue("config")
list_json = form.getvalue("list")

# Manejo de cookies para la sesión
cookie = cookies.SimpleCookie(os.environ.get("HTTP_COOKIE"))
if "sessionId" not in cookie:
    session_id = str(uuid.uuid4())
    print(f"Set-Cookie: sessionId={session_id}; Path=/")
else:
    session_id = cookie["sessionId"].value

# Configuración de idioma
config_path = f"/var/www/html/ATI/static/conf/config{lang.upper()}.json"
if not os.path.exists(config_path):
    config_path = "/var/www/html/ATI/static/conf/configES.json"
with open(config_path, "r", encoding="utf-8") as config_file:
    config = json.load(config_file)

# config como JSON (AJAX)
if config_json:
    print("Content-Type: application/json\n")
    print(json.dumps(config))
    exit()

# Lista de estudiantes como JSON (AJAX)
if list_json:
    perfiles_dir = "/var/www/html/ATI/static/perfiles"
    estudiantes = []
    if os.path.exists(perfiles_dir):
        for nombre in os.listdir(perfiles_dir):
            perfil_path = os.path.join(perfiles_dir, nombre, "perfil.json")
            if os.path.exists(perfil_path):
                with open(perfil_path, "r", encoding="utf-8") as f:
                    perfil = json.load(f)
                    # Devuelve la ruta accesible desde el navegador
                    imagen = perfil.get("imagen", "")
                    imagen_url = f"/ATI/static/perfiles/{nombre}/{imagen}" if imagen else ""
                    estudiantes.append({
                        "id": nombre,
                        "nombre": perfil.get("nombre", ""),
                        "imagen": imagen_url
                    })
    print("Content-Type: application/json\n")
    print(json.dumps(estudiantes))
    exit()

# HTML principal
print("Content-Type: text/html\n")
print(f"""<!DOCTYPE html>
<html lang="{lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="/ATI/static/images/favicon.ico" type="image/x-icon">
    <title id="pageTitle">{config.get('titulo', 'ATI[UCV] 2024-1')}</title>
    <link rel="stylesheet" href="/ATI/static/css/style.css">
    <script src="/ATI/static/js/index.js" defer></script>
</head>
<body>
    <div id="app"></div>
</body>
</html>
""")