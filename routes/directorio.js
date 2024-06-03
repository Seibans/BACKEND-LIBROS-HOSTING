/*
	Ruta: /api/directorio
*/

const { Router } = require('express');
const { check } = require('express-validator'); 
const { validarCampos } = require('../middlewares/validar-campos')

const { validarJWT, validarADMIN } = require('../middlewares/validar-jwt');

const expressFileUpload = require('express-fileupload');


const {
	getDirectorio,
	crearDirectorio,
  actualizarDirectorio,	
	borrarDirectorio
} = require('../controllers/directorio-controllers');

const router = Router();

router.use(expressFileUpload({
	limits: {fileSize: process.env.MAXSIZEUPLOAD * 1024 * 1024},
  useTempFiles: true,
  //tempFileDir: '../uploads',
}));

router.get( '/', getDirectorio);

router.post( '/',
    [
      validarJWT,
      validarADMIN,
      check('nombre', 'El Nombre es Necesario').not().isEmpty(),
      check('cargo', 'El Cargo es Necesario').not().isEmpty(),
      validarCampos
    ],
    crearDirectorio);

router.put( '/:id',
    [
      validarJWT,
      validarADMIN,
			check('nombre', 'El Nombre es Necesario').not().isEmpty(),
      check('cargo', 'El Cargo es Necesario').not().isEmpty(),
      validarCampos
    ],
    actualizarDirectorio);

router.delete('/:id',
    [
      validarJWT,
      validarADMIN
    ],
    borrarDirectorio);
 
module.exports = router;