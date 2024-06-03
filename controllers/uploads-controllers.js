const { response } = require('express');
const { actualizarImagen } = require('../helpers/actualizar-imagen');
require('dotenv').config();

const fileUpload = async (req, res = response) => {
  const tipo = req.params.tipo;
  const id = req.params.id;

  const tiposValidos = ['eventos', 'libros', 'usuarios', 'asociados', 'directorio'];

  if (!tiposValidos.includes(tipo)) {
    res.status(400).json({
      ok: false,
      msg: 'No Esta En Las Categorias Asignadas',
    });
  };

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      msg: 'No hay ningún Archivo',
    });
  };

  //Validacion de tamaño de la imagen
  if (req.files.imagen.truncated) {
    console.log('La imagen es pesada');
    // return res.status(400).json({
    // 	ok: false,
    // 	msg: `El archivo es demasiado grande, solo se permiten archivos de ${process.env.MAXSIZEUPLOAD}MB`
    // });
  };

  //Procesar la imagen
  const file = req.files.imagen;
  const nombreCortado = file.name.split('.');
  const extensionArchivo = nombreCortado[nombreCortado.length - 1];

  //Validar extensión
  const extensionesValidas = ['png', 'jpg', 'jpeg'];
  if (!extensionesValidas.includes(extensionArchivo)) {
    return res.status(400).json({
      ok: false,
      msg: 'No es un archivo valido',
    });
  };

  const realizado = await actualizarImagen(tipo, id, file);

  if (realizado.ok) {
    res.status(200).json({
      ok: true,
      imgUrl: realizado.imgUrl,
      img_id: realizado.img_id,
    });
  } else {
    res.status(500).json({
      ok: false,
      msg: 'Hable con El Administrador',
    });
  }
}

module.exports = {
  fileUpload,
}