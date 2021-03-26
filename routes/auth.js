const { Router } = require ('express');
const { check } = require('express-validator');
const { login } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/',[
    check('email', "El campo email es obligatorio").not().isEmpty(),
    check('password', "El campo password es obligatorio").not().isEmpty(),
    validarCampos,
], login);


module.exports = router;