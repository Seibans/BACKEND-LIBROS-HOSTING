/*
	Ruta: /api/asociados
*/

const { Router } = require('express');
const { check } = require('express-validator'); 
const { validarCampos } = require('../middlewares/validar-campos');
const expressFileUpload = require('express-fileupload');


const { validarJWT, validarADMIN } = require('../middlewares/validar-jwt');

const {
	getComunicados,
	crearComunicado,
  actualizarComunicado,	
	borrarComunicado
} = require('../controllers/comunicados-controllers');

const router = Router();

router.use(expressFileUpload({
	limits: {fileSize: process.env.MAXSIZEUPLOAD * 1024 * 1024},
  useTempFiles: true,
}));

router.get( '/', getComunicados);
//Lo que esta en el array es un middleware
//Leer la documentación de ExpressValidator
router.post( '/',
    [
      validarJWT,
      validarADMIN,
      // check('titulo', 'El Titulo es Necesario').not().isEmpty(),
      // check('descripcion', 'La Descripción es Necesaria').not().isEmpty(),
      // validarCampos
    ],
    crearComunicado);

router.put( '/:id',
    [
      validarJWT,
      validarADMIN,
      check('titulo', 'El Titulo es Necesario').not().isEmpty(),
      check('descripcion', 'La Descripción es Necesaria').not().isEmpty(),
      validarCampos
    ],
    actualizarComunicado);

router.delete('/:id',
    [
      validarJWT,
      validarADMIN
    ],
    borrarComunicado);
 
module.exports = router;