const { Schema, model } = require('mongoose');

const EventoSchema = Schema(
  {
    titulo: {
      type: String,
      required: true
    },
    detalles: {
			type: String,
      required: true,
		},
    imgUrl: {
      type: String
    },
    img_id: {
      type: String
    },
    fecha: {
      type: Date,
    }
  }, {
    timestamps: true,
    versionKey: false,
    collection: 'eventos'
  });

EventoSchema.method('toJSON', function() {
  const {...object } = this.toObject();
  return object;
})

module.exports = model('Evento', EventoSchema);