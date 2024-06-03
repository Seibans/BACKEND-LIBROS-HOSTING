const { response } = require('express');

const Categoria = require('../models/categoria');

const getCategorias = async (req, res = response) => {

  // const categorias = await Categoria.find().populate('usuario','nombre email img');
  const categorias = await Categoria.find().populate('usuario', 'nombre email');

  res.json({
    ok: true,
    categorias
  })
};

const crearCategoria = async (req, res = response) => {

  const uid = req.uid;
  const categoria = new Categoria({
    usuario: uid,
    ...req.body
  });

  try {

    const categoriaDB = await categoria.save();

    res.json({
      ok: true,
      categoria: categoriaDB
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable Con el Administrador WE'
    });
  }
};

const actualizarCategoria = async (req, res = response) => {

  const id = req.params.id;
  const uid = req.uid;

  try {
    const categoria = await Categoria.findById(id);

    if (!categoria) {
      return res.status(404).json({
        ok: true,
        msg: 'Categoria no encontrado por id'
      })
    }

    const cambiosCategoria = {
      ...req.body,
      usuario: uid
    }

    //TODO EL NEW : TRUE ES PARA DEVOLVER EL ACTUALIZADO
    const categoriaActualizado = await Categoria.findByIdAndUpdate(id, cambiosCategoria, { new: true });

    res.json({
      ok: true,
      categoria: categoriaActualizado
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error al actualizar la Categoria'
    })
  }
};

const borrarCategoria = async (req, res = response) => {

  const id = req.params.id;

  try {
    const categoria = await Categoria.findById(id);

    if (!categoria) {
      return res.status(404).json({
        ok: true,
        msg: 'Categoria no encontrado por id'
      })
    }

    await Categoria.findByIdAndDelete(id);

    res.json({
      ok: true,
      msg: 'Categoria Eliminada'
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error al Borrar la Categoria'
    })
  }
};


module.exports = {
  getCategorias,
  crearCategoria,
  actualizarCategoria,
  borrarCategoria,
}