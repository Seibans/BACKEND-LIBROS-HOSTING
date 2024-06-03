const { Schema, model } = require('mongoose');

const DirectoriosSchema = Schema(
  {
    nombre: {
      type: String,
      required: true
    },
    cargo: {
      type: String,
      required: true
    },
    editorial: {
      type: String,
    },
    gestion: {
      type: String,
    },
    imgUrl: {
      type: String,
    },
    img_id: {
      type: String,
    }
  }, {
  timestamps: true,
  versionKey: false,
  collection: 'directorio'
});

DirectoriosSchema.method('toJSON', function() {
  const { ...object } = this.toObject();
  return object;
})

module.exports = model('Directorio', DirectoriosSchema);