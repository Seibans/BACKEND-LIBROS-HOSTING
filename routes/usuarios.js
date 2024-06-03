/*
Ruta: /api/usuarios
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");

const {
  getUsuarios,
  crearUsuarios,
  actualizarUsuario,
  borrarUsuario,
} = require("../controllers/usuarios-controllers");
const {
  validarJWT,
  validarADMIN,
  validarADMIN_O_mismoUSUARIO,
} = require("../middlewares/validar-jwt");

const router = Router();

router.get("/", getUsuarios);
//Lo que esta en el array es un middleware
//Leer la documentación de ExpressValidator
router.post(
  "/",
  [
    check("nombre", "El Nombre es Obligatorio").not().isEmpty(),
    check("password", "La Contraseña es Obligatoria").not().isEmpty(),
    check("email", "El Email es Obligatorio").isEmail(),
    check("categoria", "La Categoria es Obligatoria").not().isEmpty(),
    validarCampos,
  ],
  crearUsuarios
);

router.put(
  "/:id",
  [
    validarJWT,
    validarADMIN_O_mismoUSUARIO,
    check("nombre", "El Nombre es Obligatorio").not().isEmpty(),
    check("email", "El Email es Obligatorio").isEmail(),
    check("categoria", "La Categoria es Obligatoria").not().isEmpty(),
    validarCampos,
  ],
  actualizarUsuario
);

router.delete("/:id", [validarJWT, validarADMIN], borrarUsuario);

module.exports = router;
