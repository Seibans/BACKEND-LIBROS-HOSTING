const { response } = require('express');
const { newDatos } = require('../helpers/borrarVacio');

const Asociado = require('../models/asociado');

const { upload, borrarImagen } = require("../helpers/cloudinary-upload");

const fs = require("fs-extra");



const getAsociados = async (req, res = response) => {

  // const categorias = await Categoria.find().populate('usuario','nombre email img');
  const asociados = await Asociado.find();

  res.json({
    ok: true,
    asociados,
  })
};

const crearAsociado = async (req, res = response) => {
  if (!req.files) {
    return res.json({ msg: "Por Favor Debe Subir Un Archivo de Imagen" });
  }
  // const fileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  // const imageSize = 1024;
  // if (!fileTypes.includes(image.mimetype)) return res.send('Image formats supported: JPG, PNG, JPEG');  
  // if (image.size / 1024 > imageSize) return res.send(`Image size should be less than ${imageSize}kb`);
  // const { file } = req.files;


  const cloudFile = await upload(req.files.file.tempFilePath, 'Asociados');

  const datos = newDatos(req.body);
  await fs.unlink(req.files.file.tempFilePath)
  const asociado = new Asociado({
    ...datos,
    imgUrl: cloudFile.secure_url,
    img_id: cloudFile.public_id,
  });
  try {
    const asociadoDB = await asociado.save();
    res.json({
      ok: true,
      asociado: asociadoDB
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable Con el Administrador'
    });
  }
};

const actualizarAsociado = async (req, res = response) => {

  const id = req.params.id;

  try {
    const asociado = await Asociado.findById(id);

    if (!asociado) {
      return res.status(404).json({
        ok: true,
        msg: 'Asociado no encontrado por id'
      })
    }

    const cambiosAsociado = {
      ...req.body,
    }

    //TODO EL NEW : TRUE ES PARA DEVOLVER EL ACTUALIZADO
    const asociadoActualizado = await Asociado.findByIdAndUpdate(id, { $set: cambiosAsociado }, { new: true });

    res.json({
      ok: true,
      asociado: asociadoActualizado
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error al actualizar al Asociado'
    })
  }
};

const borrarAsociado = async (req, res = response) => {

  const id = req.params.id;

  try {
    const asociado = await Asociado.findById(id);

    if (!asociado) {
      return res.status(404).json({
        ok: true,
        msg: 'Asociado no encontrado por id'
      })
    }

    if (asociado?.img_id) {
      await borrarImagen(asociado.img_id)
    }

    await Asociado.findByIdAndDelete(id);

    res.json({
      ok: true,
      msg: 'Asociado Eliminado'
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error al Borrar al Asociado'
    })
  }
};


module.exports = {
  getAsociados,
  crearAsociado,
  actualizarAsociado,
  borrarAsociado,
}