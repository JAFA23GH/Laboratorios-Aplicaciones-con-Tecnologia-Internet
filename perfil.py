#!/usr/bin/env python3
import cgi
import os
import json

form = cgi.FieldStorage()
student_id = form.getvalue("student_id")
json_mode = form.getvalue("json")

if not student_id:
    print("Content-Type: application/json\n")
    print(json.dumps({"error": "No se ha especificado el ID del estudiante."}))
    exit()

profile_dir = f"/var/www/html/ATI/static/perfiles/{student_id}"
json_path = os.path.join(profile_dir, "perfil.json")

if not os.path.exists(json_path):
    print("Content-Type: application/json\n")
    print(json.dumps({"error": "Perfil no encontrado."}))
    exit()

with open(json_path, "r", encoding="utf-8") as f:
    perfil = json.load(f)

imagen = perfil.get("imagen")
if not imagen:
    for archivo in os.listdir(profile_dir):
        if archivo.lower().endswith((".jpg", ".png")):
            imagen = archivo
            break

imagen_url = f"/ATI/static/perfiles/{student_id}/{imagen}" if imagen else ""

if json_mode:
    print("Content-Type: application/json\n")
    perfil["imagen_url"] = imagen_url
    print(json.dumps(perfil))
    exit()

print("Content-Type: text/html\n")
print(f"""
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Perfil</title>
</head>
<body>
    <h1>{perfil.get("nombre", "")}</h1>
    <img src="{imagen_url}" alt="Foto de perfil">
    <p>{perfil.get("descripcion", "")}</p>
</body>
</html>
""")