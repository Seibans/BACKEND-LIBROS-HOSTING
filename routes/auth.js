/*
Ruta: /api/auth
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignIn, renewToken } = require('../controllers/auth-controllers');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post('/',
    [
      check('email', 'El Correo es Obligatorio').isEmail(),
      // podrias colocar tambien si tiene un lenght validoreq.query
      check('password', 'La Contraseña es Obligatoria').not().isEmpty(),
      validarCampos,
    ],
    login
);


router.post('/google',
    [
      check('token', 'El token de Google es obligatorio').not().isEmpty(),
      validarCampos,
    ],
    googleSignIn
)

//Ruta para renovar el Token

router.get('/renew',
    validarJWT,
    renewToken
)

module.exports = router;