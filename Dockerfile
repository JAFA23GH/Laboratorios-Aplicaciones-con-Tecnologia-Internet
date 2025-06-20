# Imagen base Ubuntu
FROM ubuntu:latest

# Instala Apache, Python3 y utilidades necesarias
RUN apt-get update && \
    apt-get install -y apache2 python3 python3-pip && \
    apt-get clean

# Habilita el módulo CGI en Apache
RUN a2enmod cgi

# Crea el directorio de la app
RUN mkdir -p /var/www/html/ATI

# Copia el contenido del proyecto al contenedor
COPY . /var/www/html/ATI

# Da permisos de ejecución a los scripts Python CGI
RUN chmod +x /var/www/html/ATI/*.py

# Configura Apache para permitir ejecución de CGI en el directorio ATI
RUN echo '<Directory "/var/www/html/ATI">' > /etc/apache2/conf-available/ati.conf && \
    echo '    Options +ExecCGI' >> /etc/apache2/conf-available/ati.conf && \
    echo '    AddHandler cgi-script .py' >> /etc/apache2/conf-available/ati.conf && \
    echo '    Require all granted' >> /etc/apache2/conf-available/ati.conf && \
    echo '</Directory>' >> /etc/apache2/conf-available/ati.conf

RUN a2enconf ati

# Expone el puerto 80
EXPOSE 80

# Inicia Apache en primer plano
CMD ["/usr/sbin/apache2ctl", "-D", "FOREGROUND"]