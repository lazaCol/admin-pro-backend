const { response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');


const validarJWT = (req, res = response, next) => {

    //leer el token
    const token = req.header('x-token');
    
    if(!token){
        return res.status(401).json({
            ok: false,
            msg: "No hay el token",
        })
    }

    try {

        const { uid } = jwt.verify(token, process.env.JWT_SECRET);

        req.uid = uid;
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "token no valido",
        })
    }

    next();
}

const validarAdminRole = async (req, res = response, next) => {
    try {
        const uid = req.uid;


        const usuarioDb = await Usuario.findById(uid);

        if(!usuarioDb){
            return res.status(404).json({
                ok: false,
                msg: "El usuario no existe"
            })
        }

        if(usuarioDb.role !== "ADMIN_ROLE"){
            return res.status(403).json({
                ok: false,
                msg: "El tine autorizacion par realizar el proceso"
            })
        }

        next();
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador"
        })
    }
}

const validarAdminRoleOMismoUsuario = async (req, res = response, next) => {
    try {
        const uid = req.uid;
        const id = req.params.id;

        const usuarioDb = await Usuario.findById(uid);

        if(!usuarioDb){
            return res.status(404).json({
                ok: false,
                msg: "El usuario no existe"
            })
        }

        if(usuarioDb.role !== "ADMIN_ROLE" && id !== uid){
            return res.status(403).json({
                ok: false,
                msg: "El tine autorizacion par realizar el proceso"
            })
        }

        next();
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador"
        })
    }
}

module.exports = {
    validarJWT,
    validarAdminRole,
    validarAdminRoleOMismoUsuario,
}