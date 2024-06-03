const { Schema, model } = require('mongoose');

const LibroSchema = Schema(
  {
    titulo: {
      type: String,
      required: true
    },
    descripcion: {
      type: String,
      required: true
    },
    autor: {
      type: String,
      required: true
    },
    precio: {
      type: Number,
      required: true
    },
    formato: {
      type: String,
      required: true,
    },
    idioma: {
      type: String,
      required: true
    },
    usuario: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true
    },
    categoria: {
      type: Schema.Types.ObjectId,
      ref: 'Categoria',
      required: true
    },
    habilitado: {
      type: Boolean,
      required: true,
      default: false
    },
    fecha_limite:{
      type: Date,
    },
    date_publicacion: {
      type: Number,
    },
    imgUrl: {
      type: String,
    },
    img_id: {
      type: String,
    },
    subtitulo: {
      type: String,
    },
    estado: {
      type: String,
    },
    edad_publico: {
      type: String,
    },
    n_paginas: {
      type: String,
    },

  },{
    timestamps: true,
    versionKey: false,
    collection: 'libros'
});

LibroSchema.method('toJSON', function() {
  const { ...object } = this.toObject();
  return object;
})

module.exports = model('Libro',LibroSchema);