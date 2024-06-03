const jwt = require('jsonwebtoken')

const generarJWT = (uid) => {
  return new Promise((resolve, reject) => {
    const payload = {
      uid,
    };

    jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '365d'
    }, (err, token) => {
      if (err) {
        reject('No se pudo generar el Token', err)
      } else {
        resolve(token);
      }
    });
  });
}

module.exports = {
  generarJWT
}