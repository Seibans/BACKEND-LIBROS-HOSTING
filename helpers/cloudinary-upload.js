// cloudinary.js

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const upload = async (file, Camino) => {
  const image = await cloudinary.uploader.upload(
    file,
    { folder: Camino },
    (result) => result
  );
  return image;
};

const borrarImagen = async (public_id) => {
  return await cloudinary.uploader.destroy(public_id);
};

module.exports = {
  upload,
  borrarImagen
};