/*
	Ruta: /api/eventos
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos')

const {
  validarJWT,
  validarADMIN,
} = require("../middlewares/validar-jwt");

const {
	getEventos,
	crearEvento,
	actualizarEvento,
  borrarEvento
} = require('../controllers/eventos-controllers');

const router = Router();

router.get( '/',getEventos);
//Lo que esta en el array es un middleware
//Leer la documentación de ExpressValidator
router.post( '/',
    [
      validarJWT,
      validarADMIN,
      check('titulo', 'El Titulo del Evento es Necesario').not().isEmpty(),
      check('detalles', 'Los Detalles del Evento son Necesarios').not().isEmpty(),
      validarCampos
    ],
    crearEvento);

router.put( '/:id',
    [
      validarJWT,
      validarADMIN,
    ],
    actualizarEvento);

router.delete('/:id',
    [
      validarJWT,
      validarADMIN,
    ],
    borrarEvento);
 
module.exports = router;