//Importacion para tener la ayuda de typescript
const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { newDatos } = require('../helpers/borrarVacio');

const getUsuarios = async (req, res) => {

  const desde = Number(req.query.desde) || 0;

  const [usuarios, total] = await Promise.all([
    Usuario
      .find({}, 'nombre email categoria role google coin imgUrl img_id celular telefono page_web direccion createdAt updatedAt')
      .skip(desde),
    // .limit(5),
    Usuario.count()
  ]);

  res.json({
    ok: true,
    usuarios,
    total
    //Esto es para saber que uid hizo la peticion get
    // uid: req.uid
  });
}


const crearUsuarios = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    const existeEmail = await Usuario.findOne({ email });

    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: 'El Correo ya está registrado'
      });
    }

    const usuario = new Usuario(newDatos(req.body));

    //Encriptar Contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    //Guardar Usuario en la DB
    await usuario.save();

    // Generar el Token
    const token = await generarJWT(usuario.id);

    res.status(200).json({
      ok: true,
      usuario,
      token
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error Inesperado Vuelva a Intentarlo'
    })
  }
}




const actualizarUsuario = async (req, res = response) => {
  //este req.params.id es el mismo nombre que le ponemos en la ruta que esta :id y de ahi se obtiene
  //TODO: Validar Token y comprobar si es el usuario correcto
  const uid = req.params.id;

  try {
    const usuarioDB = await Usuario.findById(uid);

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No existe un usuario por ese id'
      });
    }

    const { password, google, email, ...campos } = newDatos(req.body);

    if (usuarioDB.email !== email) {
      const existeEmail = await Usuario.findOne({ email });
      if (existeEmail) {
        return res.status(400).json({
          ok: false,
          msg: 'Ya existe un Usuario con ese Email'
        });
      }
    }

    if (!usuarioDB.google) {
      campos.email = email;
    } else if (usuarioDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'Usuario de Google no pueden cambiar su correo'
      });
    }

    //Aca regresaba el usuario antiguo pero con el new : true regresa el cambio actual hecho
    // const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {new: true});

    // TODO: ESTO ES ALGO NUEVO DE PRUEBA
    const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, { $set: campos }, { new: true });

    res.json({
      ok: true,
      usuario: usuarioActualizado
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error Inesperado'
    });
  }
}



const borrarUsuario = async (req, res = response) => {

  const uid = req.params.id;

  try {

    const usuarioDB = await Usuario.findById(uid);

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No existe un usuario por ese id'
      });
    }

    await Usuario.findByIdAndDelete(uid);

    res.json({
      ok: true,
      msg: 'Usuario Eliminado'
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error Inesperado al borrar'
    });
  }
}

module.exports = {
  getUsuarios,
  crearUsuarios,
  actualizarUsuario,
  borrarUsuario
}