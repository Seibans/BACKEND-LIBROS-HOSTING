const { response } = require("express");
const { newDatos } = require("../helpers/borrarVacio");
const Comunicado = require("../models/comunicado");

const { upload, borrarImagen } = require("../helpers/cloudinary-upload");
const fs = require("fs-extra");


const getComunicados = async (req, res = response) => {
  const comunicados = await Comunicado.find();

  res.status(200).json({
    ok: true,
    comunicados,
  });
};

const crearComunicado = async (req, res = response) => {

  if (!req.files) {
    return res.json({ msg: "Por Favor Debe Subir Un Archivo PDF" });
  }

  // const fileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  // const imageSize = 1024;
  // if (!fileTypes.includes(image.mimetype)) return res.send('Image formats supported: JPG, PNG, JPEG');  
  // if (image.size / 1024 > imageSize) return res.send(`Image size should be less than ${imageSize}kb`);
  // const { file } = req.files;
  const cloudFile = await upload(req.files.file.tempFilePath, 'Comunicados');

  const datos = newDatos(req.body);
  await fs.unlink(req.files.file.tempFilePath);

  const comunicado = new Comunicado({
    ...datos,
    documentUrl: cloudFile.secure_url,
    document_id: cloudFile.public_id,
  });

  try {
    const comunicadoDB = await comunicado.save();
    res.json({
      ok: true,
      comunicado: comunicadoDB
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable Con el Administrador",
    });
  }
};

const actualizarComunicado = async (req, res = response) => {
  const id = req.params.id;
  // const uid = req.uid;

  try {
    const comunicado = await Comunicado.findById(id);

    if (!comunicado) {
      return res.status(404).json({
        ok: true,
        msg: "Comunicado no encontrado por id",
      });
    }

    const cambiosComunicado = {
      ...req.body,
    };

    //TODO EL NEW : TRUE ES PARA DEVOLVER EL ACTUALIZADO
    const comunicadoActualizado = await Comunicado.findByIdAndUpdate(
      id,
      cambiosComunicado,
      { new: true }
    );

    res.json({
      ok: true,
      comunicado: comunicadoActualizado,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error al actualizar al Comunicado",
    });
  }
};

const borrarComunicado = async (req, res = response) => {
  const id = req.params.id;

  try {
    const comunicado = await Comunicado.findById(id);

    if (!comunicado) {
      return res.status(404).json({
        ok: true,
        msg: "Comunicado no encontrado por id",
      });
    }

    if (comunicado?.document_id) {
      await borrarImagen(comunicado?.document_id)
    }

    await Comunicado.findByIdAndDelete(id);

    res.json({
      ok: true,
      msg: "Comunicado Eliminado",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error al Borrar Comunicado",
    });
  }
};

module.exports = {
  getComunicados,
  crearComunicado,
  actualizarComunicado,
  borrarComunicado,
};
