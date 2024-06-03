/*
	Ruta api/todo/:busqueda
*/

const { Router } = require('express');

const {
  validarJWT,
  validarADMIN,
} = require("../middlewares/validar-jwt");

const {
	getTodoAdmin,
	getTodo,
	getDocumentosColeccion,
	getLibrosFiltrados
} = require('../controllers/busquedas-controllers');

const router = Router();

router.get( '/:busqueda',
				[
					validarJWT,
					validarADMIN
				],
				getTodoAdmin);


router.get( '/normal/:busqueda', getTodo);

router.put('/libros/filtro', getLibrosFiltrados)



router.get( '/coleccion/:tabla/:busqueda',
			getDocumentosColeccion);
 
module.exports = router;