/*
	Ruta api/todo/:busqueda
*/

const { Router } = require('express');
const expressFileUpload = require('express-fileupload');
const { validarJWT } = require('../middlewares/validar-jwt');

const {
	fileUpload,
	retornaImagen
} = require('../controllers/uploads-controllers');

const router = Router();

router.use(expressFileUpload({
	limits: {fileSize: process.env.MAXSIZEUPLOAD * 1024 * 1024},
  useTempFiles: true,
	//TODO El abort on limit sirve para ya no realizar ningun guardado del archivo
	//! abortOnLimit: true,
	//* Esto dice que si la ruta no existe pues me la crea
	//* createParentPath: true,
}));

router.put( '/:tipo/:id',validarJWT, fileUpload);

// router.get( '/:tipo/:foto', retornaImagen);






















































 
module.exports = router;