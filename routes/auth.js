const { Router } = require ('express');
const { check } = require('express-validator');
const { login, googleSingnIn, renewToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

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

router.get('/renew', validarJWT , renewToken);


module.exports = router;