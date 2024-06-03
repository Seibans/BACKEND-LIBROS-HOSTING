const { Schema, model } = require('mongoose');

const AsociadoSchema = Schema(
  {
    nombre: {
      type: String,
      required: true
    },
    representante: {
      type: String,
      required: true
    },
    direccion: {
      type: String,
      required: true
    },
    correo: {
      type: String,
    },
    page_web: {
      type: String,
    },
    celular: {
      type: Number,
    },
    telefono: {
      type: Number,
    },
    imgUrl: {
      type: String,
    },
    img_id: {
      type: String,
    },
  }, {
  timestamps: true,
  versionKey: false,
  collection: 'asociados'
});

AsociadoSchema.method('toJSON', function() {
  const { ...object } = this.toObject();
  return object;
})

module.exports = model('Asociado', AsociadoSchema);