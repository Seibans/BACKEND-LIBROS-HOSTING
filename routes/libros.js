/*
	Ruta: /api/libros
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");

const { validarJWT, validarCoin } = require("../middlewares/validar-jwt");

const expressFileUpload = require('express-fileupload');


const {
  getLibros,
  crearLibro,
  actualizarLibro,
  borrarLibro,
  getLibroById,
  getLibrosconUsuario,
  habilitarLibro,
  getLibrosEditorial
} = require("../controllers/libros-controllers");

const router = Router();

router.use(expressFileUpload({
	// limits: {fileSize: process.env.MAXSIZEUPLOAD * 1024 * 1024},
  useTempFiles: true,
}));

router.get("/", getLibros);

router.get("/:id", getLibroById);

router.get("/usuario/books", validarJWT, getLibrosconUsuario);

router.get("/editorial/books/:id", getLibrosEditorial);



router.post(
  "/",
  [
    validarJWT,
    check("titulo", "El Titulo del Libro es Necesario").not().isEmpty(),
    check("descripcion", "La descripción del Libro es Necesaria")
      .not()
      .isEmpty(),
    check("autor", "El Nombre del Autor(a) es Necesario").not().isEmpty(),
    check("precio", "El Precio del Libro es Necesario").isNumeric(),
    check("formato", "El Formato del Libro es Necesario").not().isEmpty(),
    check("idioma", "El Idioma del Libro es Necesario").not().isEmpty(),
    check("categoria", "El id de la Categoria debe ser Válido").isMongoId(),
    validarCampos,
  ],
  crearLibro
);

router.put(
  "/:id",
  [
    validarJWT,
    check("titulo", "El Titulo del Libro es Necesario").not().isEmpty(),
    check("descripcion", "La descripción del Libro es Necesaria")
      .not()
      .isEmpty(),
    check("autor", "El Nombre del Autor(a) es Necesario").not().isEmpty(),
    check("precio", "El Precio del Libro es Necesario").isNumeric(),
    check("formato", "El Formato del Libro es Necesario").not().isEmpty(),
    check("idioma", "El Idioma del Libro es Necesario").not().isEmpty(),
    check("categoria", "El id de la Categoria debe ser Válido").isMongoId(),
    validarCampos,
  ],
  actualizarLibro
);

router.put("/habilitar/:id", [validarJWT, validarCoin], habilitarLibro);

router.delete("/:id", validarJWT, borrarLibro);

module.exports = router;
