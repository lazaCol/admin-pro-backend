const { response } = require('express');
const jwt = require('jsonwebtoken');


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

module.exports = {
    validarJWT,
}