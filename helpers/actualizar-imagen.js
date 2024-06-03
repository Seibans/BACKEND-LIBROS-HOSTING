// const fs = require('fs');
const Usuario = require("../models/usuario");
const Libro = require("../models/libro");
const Evento = require("../models/evento");
const { upload, borrarImagen } = require("../helpers/cloudinary-upload");
const fs = require("fs-extra");
const Asociado = require("../models/asociado");
const Directorio = require("../models/directorio");

const actualizarImagen = async (tipo, id, Archivo) => {
  let cloudfile;

  switch (tipo) {
    case "libros":
      const libro = await Libro.findById(id);
      if (!libro) {
        console.log("No es un Libro por Id");
        return false;
      }
      await borrarImagen(libro.img_id);
      cloudFile = await upload(Archivo.tempFilePath, "Libros");
      await Libro.findByIdAndUpdate(
        id,
        { $set: { imgUrl: cloudFile.secure_url, img_id: cloudFile.public_id } },
        { new: true }
      );
      await fs.unlink(Archivo.tempFilePath);

      return {
        ok: true,
        imgUrl: cloudFile.secure_url,
        img_id: cloudFile.public_id,
      };
      break;
    case "eventos":
      const evento = await Evento.findById(id);
      if (!evento) {
        console.log("No es Evento por Id");
        return false;
      }
      if (evento?.img_id) {
        await borrarImagen(evento.img_id);
      }
      cloudFile = await upload(Archivo.tempFilePath, "Eventos");
      await Evento.findByIdAndUpdate(
        id,
        { $set: { imgUrl: cloudFile.secure_url, img_id: cloudFile.public_id } },
        { new: true }
      );
      await fs.unlink(Archivo.tempFilePath);
      return {
        ok: true,
        imgUrl: cloudFile.secure_url,
        img_id: cloudFile.public_id,
      };
      break;
    case "usuarios":
      const usuario = await Usuario.findById(id);
      if (!usuario) {
        console.log("No es Usuario por Id");
        return false;
      }
      if (usuario?.img_id) {
        await borrarImagen(usuario.img_id);
      }
      cloudFile = await upload(Archivo.tempFilePath, "Usuarios");
      await Usuario.findByIdAndUpdate(
        id,
        { $set: { imgUrl: cloudFile.secure_url, img_id: cloudFile.public_id } },
        { new: true }
      );
      await fs.unlink(Archivo.tempFilePath);
      return {
        ok: true,
        imgUrl: cloudFile.secure_url,
        img_id: cloudFile.public_id,
      };
      break;

    case "asociados":
      const asociado = await Asociado.findById(id);
      if (!asociado) {
        console.log("No es Asociado por Id");
        return false;
      }
      if (asociado?.img_id) {
        await borrarImagen(asociado.img_id);
      }
      cloudFile = await upload(Archivo.tempFilePath, "Asociados");
      await Asociado.findByIdAndUpdate(
        id,
        { $set: { imgUrl: cloudFile.secure_url, img_id: cloudFile.public_id } },
        { new: true }
      );
      await fs.unlink(Archivo.tempFilePath);
      return {
        ok: true,
        imgUrl: cloudFile.secure_url,
        img_id: cloudFile.public_id,
      };
      break;

    case "directorio":
      const directorio = await Directorio.findById(id);
      if (!directorio) {
        console.log("No es Directorio por Id");
        return false;
      }
      if (directorio?.img_id) {
        await borrarImagen(directorio.img_id);
      }
      cloudFile = await upload(Archivo.tempFilePath, "Directorio");
      await Directorio.findByIdAndUpdate(
        id,
        { $set: { imgUrl: cloudFile.secure_url, img_id: cloudFile.public_id } },
        { new: true }
      );
      await fs.unlink(Archivo.tempFilePath);
      return {
        ok: true,
        imgUrl: cloudFile.secure_url,
        img_id: cloudFile.public_id,
      };
      break;
    default:
      break;
  }
};

module.exports = {
  actualizarImagen,
};
