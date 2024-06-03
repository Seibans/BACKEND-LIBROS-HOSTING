const { response } = require("express");
// const { isValidObjectId } = require("mongoose");
const { newDatos } = require("../helpers/borrarVacio");
const Libro = require("../models/libro");
const Usuario = require("../models/usuario");

const { upload, borrarImagen } = require("../helpers/cloudinary-upload");

const fs = require("fs-extra");

const getLibros = async (req, res = response) => {
  const libros = await Libro.find()
    .populate(
      "usuario",
      "nombre email categoria imgUrl img_id celular telefono page_web direccion"
    )
    .populate("categoria", "categoria");

  res.json({
    ok: true,
    libros,
  });
};

const getLibrosEditorial = async (req, res = response) => {
  const id = req.params.id;

  const libros = await Libro.find({ usuario: id })
    .populate(
      "usuario",
      "nombre email categoria imgUrl img_id celular telefono page_web direccion"
    )
    .populate("categoria", "categoria");
  res.json({
    ok: true,
    libros,
  });
};

const getLibrosconUsuario = async (req, res = response) => {
  const uid = req.uid;

  const libros = await Libro.find({ usuario: uid })
    .populate(
      "usuario",
      "nombre email categoria imgUrl img_id celular telefono page_web direccion"
    )
    .populate("categoria", "categoria");
  res.json({
    ok: true,
    libros,
  });
};

const getLibroById = async (req, res = response) => {
  const id = req.params.id;

  try {
    const libro = await Libro.findById(id)
      .populate(
        "usuario",
        "nombre email categoria imgUrl img_id celular telefono page_web direccion"
      )
      .populate("categoria", "categoria");

    if (!libro) {
      return res.status(404).json({
        ok: false,
        msg: "Libro no Encontrado",
      });
    }

    res.status(200).json({
      ok: true,
      libro,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      ok: false,
      msg: "Hable con el Administrador",
    });
  }
};

const crearLibro = async (req, res = response) => {
  const uid = req.uid;
  try {
    if (!req.files) {
      return res.json({ msg: "Por Favor Debe Subir Un Archivo de Imagen" });
    }
    // const fileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    // const imageSize = 1024;
    // if (!fileTypes.includes(image.mimetype)) return res.send('Image formats supported: JPG, PNG, JPEG');
    // if (image.size / 1024 > imageSize) return res.send(`Image size should be less than ${imageSize}kb`);
    // const { file } = req.files;
    console.log(req.files.file, ' El Primer Archivo del Cambino');
    const cloudFile = await upload(req.files.file.tempFilePath, "Libros");
    const datos = await newDatos(req.body);
    await fs.unlink(req.files.file.tempFilePath);

    const libro = new Libro({
      usuario: uid,
      ...datos,
      imgUrl: cloudFile.secure_url,
      img_id: cloudFile.public_id,
    });

    const libroDB = await libro.save();

    res.status(200).json({
      ok: true,
      libro: libroDB,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Hable Con el Administrador",
    });
  }
};

const actualizarLibro = async (req, res = response) => {
  const id = req.params.id;
  const uid = req.uid;

  try {
    const libro = await Libro.findById(id);

    if (!libro) {
      return res.status(404).json({
        ok: true,
        msg: "libro no encontrado por id",
      });
    }

    if (libro.usuario.toString() !== uid) {
      return res.status(403).json({
        ok: false,
        msg: "No Tiene Permisos para editar el Libro",
      });
    }

    const datos = newDatos(req.body);

    const cambiosLibro = {
      ...datos,
      usuario: uid,
    };

    const libroActualizado = await Libro.findByIdAndUpdate(
      id,
      { $set: cambiosLibro },
      {
        new: true,
      }
    );

    res.json({
      ok: true,
      libro: libroActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error al actualizar Libro",
    });
  }
};

const habilitarLibro = async (req, res = response) => {
  const id = req.params.id;
  const uid = req.uid;

  try {
    const libro = await Libro.findById(id);

    if (!libro) {
      return res.status(404).json({
        ok: true,
        msg: "libro no encontrado por id",
      });
    }

    if (libro.usuario.toString() !== uid) {
      return res.status(403).json({
        ok: false,
        msg: "No Tiene Permisos para editar el Libro",
      });
    }

    let newCoin = await Usuario.findById(uid);
    newCoin.coin = newCoin.coin - 10;
    const [libronuevo, usuario] = await Promise.all([
      Libro.findByIdAndUpdate(
        id,
        { $set: req.body },
        {
          new: true,
        }
      ),
      Usuario.findByIdAndUpdate(
        uid,
        { $set: { coin: newCoin.coin } },
        { new: true }
      ),
    ]);

    res.status(200).json({
      ok: true,
      libronuevo,
      coin: usuario.coin,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error al actualizar Libro",
    });
  }
};

const borrarLibro = async (req, res = response) => {
  const id = req.params.id;
  const uid = req.uid;

  try {
    const libro = await Libro.findById(id);

    if (!libro) {
      return res.status(404).json({
        ok: true,
        msg: "libro no encontrado por id",
      });
    }

    if (libro.usuario.toString() !== uid) {
      return res.status(403).json({
        ok: false,
        msg: "No Tiene Permisos para editar el Libro",
      });
    }

    if (libro?.img_id) {
      await borrarImagen(libro.img_id);
    }

    await Libro.findByIdAndDelete(id);

    res.status(200).json({
      ok: true,
      msg: "Libro borrado",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error al Eliminar Libro",
    });
  }
};

module.exports = {
  getLibros,
  getLibrosconUsuario,
  crearLibro,
  actualizarLibro,
  borrarLibro,
  getLibroById,
  habilitarLibro,
  getLibrosEditorial,
};
