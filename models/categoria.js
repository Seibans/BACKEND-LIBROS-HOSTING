const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema(
  {
    categoria: {
      type: String,
      required: true
    },
    usuario: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: 'Usuario'
    }
  }, {
  timestamps: true,
  versionKey: false,
  collection: 'categorias'
});

CategoriaSchema.method('toJSON', function() {
  const { ...object } = this.toObject();
  return object;
})

module.exports = model('Categoria', CategoriaSchema);