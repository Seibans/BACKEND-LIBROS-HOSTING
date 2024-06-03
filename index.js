require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const { dbConnection } = require('./database/config');

//* Crear el Servidor de Express
const app = express();
//Helmet protege nuestras rutas con cabeceras extra
// app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
// PARA USAR STRIPE
//Middleware
app.use(express.urlencoded({ extended: false }));
//* Cors
//* El cors es para hacer nuestra api accesible a diferentes usuarios
app.use(cors());
// Habilitar CORS para todas las rutas

// Manejar las solicitudes de preflight
app.options('*', cors());
//* Para ver las peticiones Http en consola
app.use(morgan('dev'));
//* Lectura y Parseo del Body
app.use(express.json());
//* Base de Datos
dbConnection();
//!Esta pag solo era de prueba por lo cual se debe borrar o comentar
// app.use(express.static('public'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/categorias', require('./routes/categorias'));
app.use('/api/libros', require('./routes/libros'));
app.use('/api/login', require('./routes/auth'));
app.use('/api/eventos', require('./routes/eventos'));
app.use('/api/asociados', require('./routes/asociados'));
app.use('/api/directorio', require('./routes/directorio'));
app.use('/api/comunicados', require('./routes/comunicados'));
app.use('/api/todo', require('./routes/busquedas'));
app.use('/api/upload', require('./routes/uploads'));

app.listen(process.env.PORT, () => {
	console.log('Servidor corriendo en el puerto ' + process.env.PORT);
});
//TODO la informacion importante
//* cors es para acer accesible nuestra api a varios dispositivos
//* cuando subes una imagen recibes un truncate que te indica si la imagen a sido recortada para poder
//* guardarse en la base de datos