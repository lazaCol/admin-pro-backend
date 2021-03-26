const { response } = require("express");
const Usuario = require("../models/usuario");
const bcrypt = require('bcryptjs');
const { generarJWT } = require("../helpers/jwt");

const getUsuarios = async (req, res = response) => {
  const usuarios = await Usuario.find({}, "nombre email role google");

  res.json({
    ok: true,
    usuarios,
  });
};

const crearUsuario = async (req, res = response) => {
  const { email, password, nombre } = req.body;

  try {
    const existeEmail = await Usuario.findOne({ email });

    if(existeEmail){
        return res.status(400).json({
            ok: false,
            msg: "El email ya se encuentra resgistrado.",
        })
    }

    const usuario = new Usuario(req.body);

    //encriptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    await usuario.save();

    const token = await generarJWT(usuario.id);

    res.json({
      ok: true,
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado contacte al administrador",
    });
  }
};

const actualizarUsuario = async (req, res = response) => {

  const uid = req.params.id;
  // const { name, email, role} = req.body;
  try {

    const usuarioDB = await Usuario.findById(uid);

    if(!usuarioDB){
      return res.status(404).json({
        ok: false,
        msg: "El usuario no existe"
      })
    }

    //validar token

    const {password, google, email,...campos} = req.body;
    if(usuarioDB.email !== email){
      const existeEmail = await Usuario.findOne({email});
      if(existeEmail){
        return res.status(400).json({
          ok: false,
          msg: "Ya existe un usuario con ese email.",
        })
      }
    }

    campos.email = email;

    const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true } );


    res.json({
      ok: true,
      usuario: usuarioActualizado,
    })
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado contacte al administrador",
    });
  }
}


const borrrarUsuario = async (req, res = response) => {
  const uid = req.params.id;
  try {

    const usuarioDB = await Usuario.findById(uid);

    if(!usuarioDB){
      return res.status(404).json({
        ok: false,
        msg: "El usuario no existe"
      })
    }

    await Usuario.findByIdAndDelete(uid);

    res.json({
      ok: true,
      msg: "Usuario eliminado.",
    })
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado contacte al administrador",
    });
  }
}

module.exports = {
  getUsuarios,
  crearUsuario,
  actualizarUsuario,
  borrrarUsuario
};
