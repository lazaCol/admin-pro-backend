const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req, res = response ) => {

    const {email, password} = req.body;
    try {


        const usuarioDB = await Usuario.findOne({ email });

        if(!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: "El email no existe",
            })
        }

        const validPassword = bcrypt.compareSync(password, usuarioDB.password);

        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: "El password no es valido",
            })
        }

        //generar el token
        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok: true,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Ha occurrido un error contacte ala administrador",
        })
    }
}

const googleSingnIn = async (req, res = response ) => {

    const googleToken = req.body.token; 

    try {

        const { name, email, picture } = await googleVerify(googleToken);

        const usuarioDB = await Usuario.findOne({ email });
        let usuario;
        if(!usuarioDB){
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true,
            });
        }else{
            usuario = usuarioDB;
            usuario.google = true;
            // usuario.password = "@@@";
        }

        await usuario.save();

        //generar el token
        const token = await generarJWT(usuario.id);
        
        res.json({
            ok: true,
            token
        })
    } catch (error) {
        res.status(401).json({
            ok: false,
            msg: "El token no es correcto",
        })
        
    }

}

module.exports = {
    login,
    googleSingnIn,
}