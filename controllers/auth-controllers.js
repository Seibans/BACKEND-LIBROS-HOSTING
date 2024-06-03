const { response } = require("express");
const Usuario = require("../models/usuario");
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    //Verificar Email
    const usuarioDB = await Usuario.findOne({ email });
    if (!usuarioDB) {
      return res.status(400).json({
        ok: false,
        msg: "Email o Contraseña no Válidos",
      });
    }
    //Verificar Contraseña
    const validPassword = bcrypt.compareSync(password, usuarioDB.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Email o Contraseña no Válidos",
      });
    }
    // Generar el Token
    const token = await generarJWT(usuarioDB.id);
    res.json({
      ok: true,
      token,
      usuarioDB,
      direct: usuarioDB.role,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el Administrador",
    });
  }
};

const googleSignIn = async (req, res = response) => {

  const googleToken = req.body.token;

  try {
    const { name, email, picture } = await googleVerify(googleToken);

    const usuarioDB = await Usuario.findOne({ email });
    let usuario;

    if (!usuarioDB) {
      //SI NO EXISTE EL USUARIO
      usuario = new Usuario({
        nombre: name,
        email,
        password: "google",
        imgUrl: picture,
        google: true,
        categoria: "Autor",
      });
    } else {
      //EXISTE USUARIO
      usuario = usuarioDB;
      usuario.google = true;
      //Si no le cambiamos la contraseña la persona tendra los 2 metodos de autenticacion
      //Si le cambiamos la contra la persona va a perder la autenticacion
      //normal que seria la de mi base de datos
      // usuario.password = 'google',
    }

    //GUARDAR EN DB
    await usuario.save();

    const token = await generarJWT(usuario.id);

    res.status(200).json({
      ok: true,
      msg: "Google Signin",
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(401).json({
      ok: false,
      msg: "Token Incorrecto",
    });
  }
};

const renewToken = async (req, res = response) => {
  const uid = req.uid;

  const token = await generarJWT(uid);

  const usuario = await Usuario.findById(uid);

  res.json({
    ok: true,
    msg: "Token Renovado",
    token,
    usuario,
  });
};

module.exports = {
  login,
  googleSignIn,
  renewToken,
};
