const { response } = require("express");
const Directorio = require("../models/directorio");
const { newDatos } = require("../helpers/borrarVacio");
const { upload, borrarImagen } = require("../helpers/cloudinary-upload");

const fs = require("fs-extra");

const getDirectorio = async (req, res = response) => {
  const directorio = await Directorio.find();

  res.json({
    ok: true,
    directorio,
  });
};

const crearDirectorio = async (req, res = response) => {
  if (!req.files) {
    return res.status(400)
      .json({
        msg: "Por Favor Debe Subir Un Archivo de Imagen"
      });
  }
  // const fileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  // const imageSize = 1024;
  // if (!fileTypes.includes(image.mimetype)) return res.send('Image formats supported: JPG, PNG, JPEG');
  // if (image.size / 1024 > imageSize) return res.send(`Image size should be less than ${imageSize}kb`);
  // const { file } = req.files;
  const cloudFile = await upload(req.files.file.tempFilePath, "Directorio");
  // res.status(201).json({
  //   message: "Image uploaded successfully",
  //   imageUrl: cloudFile.url,
  // });
  const datos = newDatos(req.body);
  const directorio = new Directorio({
    ...datos,
    imgUrl: cloudFile.secure_url,
    img_id: cloudFile.public_id,
  });
  // const uid = req.uid;
  // const directorio = new Directorio({
  // 	...req.body
  // });
  await fs.unlink(req.files.file.tempFilePath)
  try {
    const directorioDB = await directorio.save();
    res.json({
      ok: true,
      directorio: directorioDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable Con el Administrador",
    });
  }
};

const actualizarDirectorio = async (req, res = response) => {
  const id = req.params.id;

  try {
    const directorio = await Directorio.findById(id);

    if (!directorio) {
      return res.status(404).json({
        ok: true,
        msg: "Directorio no encontrado por id",
      });
    }

    const cambiosDirectorio = {
      ...req.body,
    };

    //TODO EL NEW : TRUE ES PARA DEVOLVER EL ACTUALIZADO
    const directorioActualizado = await Directorio.findByIdAndUpdate(
      id,
      { $set: cambiosDirectorio },
      { new: true }
    );

    res.json({
      ok: true,
      directorio: directorioActualizado,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error al actualizar al Directorio",
    });
  }
};

const borrarDirectorio = async (req, res = response) => {
  const id = req.params.id;

  try {
    const directorio = await Directorio.findById(id);

    if (!directorio) {
      return res.status(404).json({
        ok: true,
        msg: "Directorio no encontrado por id",
      });
    }

    if (directorio?.img_id) {
      await borrarImagen(directorio.img_id)
    }

    await Directorio.findByIdAndDelete(id);

    res.json({
      ok: true,
      msg: "Directorio Eliminado",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error al Borrar Directorio",
    });
  }
};

module.exports = {
  getDirectorio,
  crearDirectorio,
  actualizarDirectorio,
  borrarDirectorio,
};
