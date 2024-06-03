const { Schema, model } = require('mongoose');

const ComunicadoSchema = Schema(
  {
    titulo: {
      type: String,
      required: true
    },
		descripcion: {
      type: String,
      required: true
    },
		documentUrl: {
      type: String,
    },
    document_id: {
      type: String,
    },
  },{
    timestamps: true,
    versionKey: false,
    collection: 'comunicados'
});

ComunicadoSchema.method('toJSON', function() {
  const {...object } = this.toObject();
  return object;
})

module.exports = model('Comunicado',ComunicadoSchema);