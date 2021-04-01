const { Router } = require ('express');
const { check } = require('express-validator');
const { login, googleSingnIn } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/',[
    check('email', "El campo email es obligatorio").not().isEmpty(),
    check('password', "El campo password es obligatorio").not().isEmpty(),
    validarCampos,
], login);

router.post('/google',[
    check('token', "El campo token es obligatorio").not().isEmpty(),
    validarCampos,
], googleSingnIn);


module.exports = router;