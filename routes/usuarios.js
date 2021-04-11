

const { Router } = require('express');
const { check } = require('express-validator');
const { getUsuarios, crearUsuario, actualizarUsuario, borrrarUsuario } = require('../controllers/usuarios');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT, validarAdminRoleOMismoUsuario } = require('../middlewares/validar-jwt');

const router = Router();


router.get('/',validarJWT, getUsuarios);

router.post('/',[
    check('nombre', "El campo nombre es obligatorio").not().isEmpty(),
    check('password', "El campo password es obligatorio").not().isEmpty(),
    check('email', "El campo email es obligatorio").isEmail(),
    validarCampos,
] ,crearUsuario );

router.put('/:id', [
    validarJWT,
    validarAdminRoleOMismoUsuario,
    check('nombre', "El campo nombre es obligatorio").not().isEmpty(),
    check('email', "El campo email es obligatorio").isEmail(),
    check('role', "El role nombre es obligatorio").not().isEmpty(),
    validarCampos,
] ,actualizarUsuario);


router.delete('/:id',validarJWT ,borrrarUsuario);


module.exports = router;