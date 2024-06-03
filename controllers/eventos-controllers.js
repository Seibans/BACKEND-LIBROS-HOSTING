const { response } = require('express');
const { newDatos } = require('../helpers/borrarVacio');
const Evento = require('../models/evento');

const getEventos = async (req, res = response) => {

  const eventos = await Evento.find();

  res.status(200).json({
    ok: true,
    eventos
  })
};

const crearEvento = async (req, res = response) => {


  const datos = newDatos(req.body);
  const evento = new Evento({
    ...datos,
  });

  try {
    const eventoDB = await evento.save();
    res.status(200).json({
      ok: true,
      evento: eventoDB
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable Con el Administrador'
    });
  }
};

const actualizarEvento = async (req, res = response) => {
  const id = req.params.id;

  try {
    const evento = await Evento.findById(id);

    if (!evento) {
      return res.status(404).json({
        ok: true,
        msg: 'Evento no encontrado por id'
      })
    }

    const cambiosEvento = {
      ...req.body,
    }

    //TODO EL NEW : TRUE ES PARA DEVOLVER EL ACTUALIZADO
    const eventoActualizado = await Evento.findByIdAndUpdate(id, cambiosEvento, { new: true });

    res.status(200).json({
      ok: true,
      evento: eventoActualizado
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Hable con el Administrador'
    })
  }
};

const borrarEvento = async (req, res = response) => {
  const id = req.params.id;

  try {
    const evento = await Evento.findById(id);

    if (!evento) {
      return res.status(404).json({
        ok: true,
        msg: 'Evento no encontrado por id'
      })
    }

    await Evento.findByIdAndDelete(id);

    res.status(200).json({
      ok: true,
      msg: 'Evento Eliminado'
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error al Borrar el Evento'
    })
  }
};


module.exports = {
  getEventos,
  crearEvento,
  actualizarEvento,
  borrarEvento
}