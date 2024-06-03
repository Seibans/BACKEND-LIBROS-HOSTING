// getTODO 

const { response } = require('express');
const Usuario = require('../models/usuario');
const Libro = require('../models/libro');
const Evento = require('../models/evento');
const Categoria = require('../models/categoria');
const { newDatos } = require("../helpers/borrarVacio");
// const { isValidObjectId } = require("mongoose");


const getTodo = async (req, res = response) => {
  const busqueda = req.params.busqueda;
  //Este regEx es para buscar una expresion exacta en un buscador
  const regex = new RegExp(busqueda, 'i');

  // const usuarios = await Usuario.find({nombre: regex});
  const [libros, eventos, entidades] = await Promise.all([
    Libro.find({ $or: [{ titulo: regex }, { descripcion: regex }, { autor: regex }, { subtitulo: regex }] }),
    Evento.find({ $or: [{ titulo: regex }, { detalles: regex }] }),
    Usuario.find({ $or: [{ nombre: regex }, { categoria: regex }, { direccion: regex }, { page_web: regex }] }),
  ]);

  try {
    res.json({
      ok: true,
      busqueda,
      libros,
      eventos,
      entidades,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable Con el Administrador'
    });
  }
};


const getLibrosFiltrados = async (req, res = response) => {
  const { busqueda, categoria, formato } = await newDatos(req.body);
  console.log(busqueda, categoria, formato);

  let data = [];
  try {
    if (busqueda || categoria || formato) {
      if (busqueda && categoria && formato) {
        const regex1 = new RegExp(busqueda, 'i');
        const regex = new RegExp(formato, 'i');
        data = await Libro.find({ $and: [{ $or: [{ titulo: regex1 }, { autor: regex1 }, { idioma: regex1 }, { descripcion: regex1 }] }, { categoria: categoria }, { formato: regex }] })
          .populate('usuario', 'nombre email categoria imgUrl img_id celular telefono page_web direccion createdAt updatedAt')
          .populate('categoria', 'categoria');
      } else if (busqueda && categoria) {
        const regex1 = new RegExp(busqueda, 'i');
        data = await Libro.find({ $and: [{ $or: [{ titulo: regex1 }, { autor: regex1 }, { idioma: regex1 }, { descripcion: regex1 }] }, { categoria: categoria }] })
          .populate('usuario', 'nombre email categoria imgUrl img_id celular telefono page_web direccion createdAt updatedAt')
          .populate('categoria', 'categoria');
      } else if (busqueda && formato) {
        const regex1 = new RegExp(busqueda, 'i');
        const regex = new RegExp(formato, 'i');
        data = await Libro.find({ $and: [{ $or: [{ titulo: regex1 }, { autor: regex1 }, { idioma: regex1 }, { descripcion: regex1 }] }, { formato: regex }] })
          .populate('usuario', 'nombre email categoria imgUrl img_id celular telefono page_web direccion createdAt updatedAt')
          .populate('categoria', 'categoria');
      } else if (categoria && formato) {
        const regex = new RegExp(formato, 'i');
        data = await Libro.find({ $and: [{ categoria: categoria }, { formato: regex }] })
          .populate('usuario', 'nombre email categoria imgUrl img_id celular telefono page_web direccion createdAt updatedAt')
          .populate('categoria', 'categoria');
      } else if (busqueda) {
        const regex1 = new RegExp(busqueda, 'i');
        data = await Libro.find({ $or: [{ titulo: regex1 }, { autor: regex1 }, { idioma: regex1 }, { descripcion: regex1 }] })
          .populate('usuario', 'nombre email categoria imgUrl img_id celular telefono page_web direccion createdAt updatedAt')
          .populate('categoria', 'categoria');
        console.log(data)
      } else if (categoria) {
        data = await Libro.find({ categoria: categoria })
          .populate('usuario', 'nombre email categoria imgUrl img_id celular telefono page_web direccion createdAt updatedAt')
          .populate('categoria', 'categoria');
      } else if (formato) {
        const regex = new RegExp(formato, 'i');
        data = await Libro.find({ formato: regex })
          .populate('usuario', 'nombre email categoria imgUrl img_id celular telefono page_web direccion createdAt updatedAt')
          .populate('categoria', 'categoria');
      }
    }
    res.status(200).json({
      ok: true,
      resultados: data
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable Con el Administrador'
    });
  }
}



const getTodoAdmin = async (req, res = response) => {
  const busqueda = req.params.busqueda;
  //Este regEx es para buscar una expresion exacta en un buscador
  const regex = new RegExp(busqueda, 'i');
  const [usuarios, libros, eventos, categorias] = await Promise.all([
    Usuario.find({ $or: [{ nombre: regex }, { categoria: regex }, { direccion: regex }, { page_web: regex }] }),
    Libro.find({ $or: [{ titulo: regex }, { descripcion: regex }, { autor: regex }, { subtitulo: regex }] }),
    Evento.find({ $or: [{ titulo: regex }, { detalles: regex }] }),
    Categoria.find({ categoria: regex }),
  ]);

  try {
    res.json({
      ok: true,
      busqueda,
      usuarios,
      libros,
      eventos,
      categorias,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable Con el Administrador'
    });
  }
};


const getDocumentosColeccion = async (req, res = response) => {

  const tabla = req.params.tabla;
  const busqueda = req.params.busqueda;

  const regex = new RegExp(busqueda, 'i');

  let data = [];

  try {
    switch (tabla) {
      case 'usuarios':
        data = await Usuario.find({ $or: [{ nombre: regex }, { email: regex }, { categoria: regex }, { direccion: regex }, { page_web: regex }] }, 'nombre email categoria role google coin imgUrl img_id celular telefono page_web direccion createdAt updatedAt');
        break;
      case 'eventos':
        data = await Evento.find({ $or: [{ titulo: regex }, { detalles: regex }] })
        break;
      case 'categorias':
        data = await Categoria.find({ categoria: regex });
        break;
      case 'libros':
        data = await Libro.find({ categoria: busqueda })
          .populate('usuario', 'nombre email categoria imgUrl img_id celular telefono page_web direccion createdAt updatedAt')
          .populate('categoria', 'categoria');
        break;
      default:
        return res.status(400).json({
          ok: false,
          msg: 'La tabla tiene que ser Usuarios, Libros u Categorias'
        });
    }
    res.status(200).json({
      ok: true,
      resultados: data
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable Con el Administrador'
    });
  }
};

module.exports = {
  getTodoAdmin,
  getTodo,
  getDocumentosColeccion,
  getLibrosFiltrados
}