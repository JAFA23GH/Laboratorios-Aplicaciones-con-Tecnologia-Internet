# Usa la imagen base de Ubuntu
FROM ubuntu:latest

# Actualiza e instala Apache y Python
RUN apt-get update && apt-get install -y apache2 python3

# Habilita el módulo CGI en Apache
RUN a2enmod cgi

RUN mkdir -p /var/www/html/ATI

COPY . /var/www/html/ATI

# permisos de ejecución
RUN chmod +x /var/www/html/ATI/*.py

RUN echo '<Directory "/var/www/html/ATI">' > /etc/apache2/conf-available/ati.conf && \
    echo '    Options +ExecCGI' >> /etc/apache2/conf-available/ati.conf && \
    echo '    AddHandler cgi-script .py' >> /etc/apache2/conf-available/ati.conf && \
    echo '    Require all granted' >> /etc/apache2/conf-available/ati.conf && \
    echo '</Directory>' >> /etc/apache2/conf-available/ati.conf

RUN a2enconf ati

EXPOSE 80

# Ejecuta Apache en primer plano para que el contenedor se mantenga en ejecución
CMD ["/usr/sbin/apache2ctl", "-D", "FOREGROUND"]
