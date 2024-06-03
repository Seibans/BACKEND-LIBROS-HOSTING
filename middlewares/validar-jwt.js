const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");

const validarJWT = (req, res, next) => {
  const token = req.header("x-token");
  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "No hay Token en la Petición",
    });
  }
  try {
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);
    req.uid = uid;
    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: "Token No Válido",
    });
  }
};

const validarADMIN = async (req, res, next) => {
  const uid = req.uid;
  try {
    const usuarioDB = await Usuario.findById(uid);
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no Existe",
      });
    }

    if (usuarioDB.role !== "ADMIN_ROLE") {
      return res.status(403).json({
        ok: false,
        msg: "No tiene privilegios para hacer eso",
      });
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      oK: false,
      msg: "Hable con el Administrador",
    });
  }
};

const validarADMIN_O_mismoUSUARIO = async (req, res, next) => {
  const uid = req.uid;
  const id = req.params.id;

  try {
    const usuarioDB = await Usuario.findById(uid);
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no Existe",
      });
    }

    if (usuarioDB.role === "ADMIN_ROLE" || uid === id) {
      next();
    } else {
      return res.status(403).json({
        ok: false,
        msg: "No tiene privilegios para hacer eso",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      oK: false,
      msg: "Hable con el Administrador",
    });
  }
};

const validarCoin = async (req, res, next) => {
  const uid = req.uid;
  try {
    const usuarioDB = await Usuario.findById(uid);
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no Existe",
      });
    }

    if (usuarioDB.coin >= 10) {
      next();
    } else {
      return res.status(403).json({
        ok: false,
        msg: "No tiene privilegios para hacer eso",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      oK: false,
      msg: "Hable con el Administrador",
    });
  }
};

module.exports = {
  validarJWT,
  validarADMIN,
  validarADMIN_O_mismoUSUARIO,
  validarCoin,
};
