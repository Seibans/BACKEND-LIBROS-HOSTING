/*
	Ruta: /api/asociados
*/

const { Router } = require('express');
const { check } = require('express-validator'); 
const { validarCampos } = require('../middlewares/validar-campos')

const { validarJWT, validarADMIN } = require('../middlewares/validar-jwt');
const expressFileUpload = require('express-fileupload');


const {
	getAsociados,
	crearAsociado,
  actualizarAsociado,	
	borrarAsociado
} = require('../controllers/asociados-controllers');

const router = Router();

router.use(expressFileUpload({
	limits: {fileSize: process.env.MAXSIZEUPLOAD * 1024 * 1024},
  useTempFiles: true,
}));

router.get( '/', getAsociados);
//Lo que esta en el array es un middleware
//Leer la documentación de ExpressValidator
router.post( '/',
    [
      validarJWT,
      validarADMIN,
      check('nombre', 'El Nombre es Necesario').not().isEmpty(),
      check('representante', 'El Representante es Necesario').not().isEmpty(),
      check('direccion', 'La Dirección es Necesaria').not().isEmpty(),
      validarCampos
    ],
    crearAsociado);

router.put( '/:id',
    [
      validarJWT,
      validarADMIN,
			check('nombre', 'El Nombre es Necesario').not().isEmpty(),
      check('representante', 'El Representante es Necesario').not().isEmpty(),
      check('direccion', 'La Dirección es Necesaria').not().isEmpty(),
      validarCampos
    ],
    actualizarAsociado);

router.delete('/:id',
    [
      validarJWT,
      validarADMIN
    ],
    borrarAsociado);
 
module.exports = router;