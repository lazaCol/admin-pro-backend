const path = require('path');
const fs = require('fs');
const { response } = require("express");
const { v4: uuidv4 } = require("uuid");
const { actualizarImagen } = require("../helpers/actualizar-imagen");

const fileUpload = async (req, res = response) => {
  const tipo = req.params.tipo;
  const id = req.params.id;

  const tiposValidos = ["hospitales", "medicos", "usuarios"];

  if (!tiposValidos.includes(tipo)) {
    return res.status(400).json({
      ok: false,
      msg: "El tipo seleccionado no es valido",
    });
  }

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      msg: "No files were uploaded.",
    });
  }

  const file = req.files.imagen;

  const nombreCortado = file.name.split(".");
  const extensionArchivo = nombreCortado[nombreCortado.length - 1];

  //validar extension
  const extensionesValidas = ["png", "jpg", "jpeg", "gif", "PNG"];
  if (!extensionesValidas.includes(extensionArchivo)) {
    return res.status(400).json({
      ok: false,
      msg: "La extension del archivo no es valida.",
    });
  }

  //generar nombre archivo
  const nombreArchivo = `${uuidv4()}.${extensionArchivo.toLowerCase()}`;

  //Path para guardar la imagen
  const path = `./uploads/${tipo}/${nombreArchivo}`;

  //mover la imagen
  file.mv(path, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
          ok: false,
          msg: "Contacte al administrador, Error al mover la imagen",
      });
    }
    //actualizar bd
    actualizarImagen(tipo, id, nombreArchivo);

    res.json({
      ok: true,
      msg: "Archivo subido",
      nombreArchivo,
    });

  });

};

const retornaImagen = (req, res = response) => {

  const tipo = req.params.tipo;
  const foto = req.params.foto;

  const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);

  //imagen por defecto
  if(fs.existsSync(pathImg)){
    res.sendFile( pathImg);
  }else{
    const pathImg = path.join(__dirname, `../uploads/no-img.jpg`);
    res.sendFile( pathImg);
  }


}

module.exports = {
  fileUpload,
  retornaImagen,
};
