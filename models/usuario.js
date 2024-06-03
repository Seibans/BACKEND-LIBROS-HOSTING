const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema(
  {
    nombre: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password : {
      type: String,
      required: true
    },
    categoria: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true,
      default: 'USER_ROLE'
    },
    google: {
      type: Boolean,
      default: false
    },
    coin: {
      type: Number,
      default: 0,
    },
    imgUrl: {
      type: String
    },
    img_id: {
      type: String
    },
    celular: {
      type: Number,
    },
    telefono: {
      type: Number,
    },
    page_web: {
      type: String,
    },
    direccion: {
      type: String,
    },
  }, {
    timestamps: true,
    versionKey: false,
  });


UsuarioSchema.method('toJSON', function() {
  const { _id, password ,...object } = this.toObject();
  object.uid = _id;
  return object;
})

module.exports = model('Usuario',UsuarioSchema);