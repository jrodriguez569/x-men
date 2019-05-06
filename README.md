# X-MEN
#### Consideraciones:
Debe contar con `nodejs` y `npm` instalado en su pc para poder hacer uso de los comandos indicados mas adelante y para la ejecucion del proyecto, ya sea desarrollo o produccion debe tener una base de datos `mongodb` a la cual conectarse, para lo que se requiere `la url de conexion`.

#### Instrucciones:
Una vez clonado el proyecto debera ejecutar `mpn i` para instalar las dependencias requeridas por el proyecto.

#### Variables de entorno:
En el archivo `.env` se encuentran definidas las variables de entorno.
 * **MONGO_URL:** Cadena de conexion a mongodb.
#### Comandos:
* `npm test`: Ejecuta los tests.
* `npm run dev`: Modo desarrollo, el server se reinicia con cada cambio.
* `npm run build`: Construye una version "compilada" del proyecto.
* `npm run artillery`: Ejecuta pruebas de performance antes de ejecutar este comando asegurarse de tener corriendo el server en otro terminal.

#### Produccion
Ejecutar dentro de la carpeta del proyecto:
* `npm run build`
* ` nodejs index.js` o `npm start`
#### Tests
Debido a un error de dependencias en mongodb se incluyen algunos archivos `.so` para poder ejecutar los tests.

##### Error al ejecutar los test. 
![Error mongod](doc/imgs/mongod.png?raw=true)

##### Archivos requeridos para los tests [./test/lib/data/lib/x86_64-linux-gnu/]:
* libcrypto.so.1.0.0
* libcurl.so.3
* libcurl.so.4
* libcurl.so.4.4.0
* libssl.so.1.0.0
