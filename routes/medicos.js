const { Router } = require('express');
const { check } = require('express-validator');
const { getMedicos, crearMedico, actualizarMedico, borrarMedico } = require('../controllers/medicos');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/',validarJWT, getMedicos);

router.post('/',[
    validarJWT,
    check("nombre", "El campo nombre es obligatorio").not().isEmpty(),
    check("hospital", "El campo hospital es obligatorio").isMongoId(),
    validarCampos
] ,crearMedico );

router.put('/:id', [
] ,actualizarMedico);


router.delete('/:id',validarJWT ,borrarMedico);

module.exports = router;