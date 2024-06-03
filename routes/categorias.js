/*
	Ruta: /api/categorias
*/


const { Router } = require('express');
const { check } = require('express-validator'); 
const { validarCampos } = require('../middlewares/validar-campos')

const { validarJWT, validarADMIN } = require('../middlewares/validar-jwt');

const {
	getCategorias,
	crearCategoria,
  actualizarCategoria,	
	borrarCategoria
} = require('../controllers/categorias-controllers');

const router = Router();

router.get( '/', getCategorias);
//Lo que esta en el array es un middleware
//Leer la documentación de ExpressValidator
router.post( '/',
    [
      validarJWT,
      validarADMIN,
      check('categoria', 'La Categoria es Necesaria').not().isEmpty(),
      validarCampos
    ],
    crearCategoria);

router.put( '/:id',
    [
      validarJWT,
      validarADMIN,
      check('categoria', 'La Categoria es Necesaria').not().isEmpty(),
      validarCampos
    ],
    actualizarCategoria);

router.delete('/:id',
    [
      validarJWT,
      validarADMIN
    ],
    borrarCategoria);
 
module.exports = router;