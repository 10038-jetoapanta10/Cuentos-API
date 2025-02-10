# Cuentos-API

Este proyecto utiliza Node.js en el backend con las librerías express, cors, @google-cloud/text-to-speech, axios, sqlite3, fs y dotenv. Estas se instalan con el comando 

npm install express cors @google-cloud/text-to-speech axios sqlite3 dotenv

El backend gestiona la generación de cuentos mediante la API de TextCortex y la conversión de texto a voz usando Google Cloud Text-to-Speech, además de almacenar los cuentos en una base de datos SQLite3. 

## Pasos para ejecutar el proyecto:
El proyecto cuenta con tre carpetas principales frontend, Backend y my-api-gateway. se bede ejecutar de la siguiente forma
### Ejecutar el backend

Navega a la carpeta Backend en tu terminal. Asegúrate de tener configurado el archivo .env con las credenciales de las APIs.El backend estará disponible en http://localhost:3001. Ejecuta el comando:

cd Backend

node server.js


### Ejecutar el frontend
Abre otra terminal y navega a la carpeta frontend. El frontend estará disponible en http://localhost:3000.
Ejecuta el comando:

cd fronted

npm start



### Ejecutar el API Gateway
Abre otra terminal y navega a la carpeta my-api-gateway. El API Gateway estará disponible en http://localhost:8090 y se encargará de redirigir las solicitudes del frontend hacia el backend.

cd my-api-gateway

npm start

