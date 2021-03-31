const { response } = require('express');
const Medico = require('../models/medico');;

const getMedicos = async (req, res = response) => {
    try {

        const medicos = await Medico.find()
        .populate('usuario','nombre img')
        .populate('hospital','nombre img');

        res.json({
            ok: true,
            medicos
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "ha occurrido un error contacte al administrador"
        })
    }
} 

const crearMedico = async (req, res = response) => {

    const uid = req.uid;
    const medico = new Medico({ ...req.body, usuario: uid });

    try {

        const medicoDB = await medico.save();

        res.json({
            ok: true,
            medico: medicoDB,
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "ha occurrido un error contacte al administrador"
        })
    }

} 

const actualizarMedico = async (req, res = response) => {

} 

const borrarMedico = async (req, res = response) => {

} 





module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico,
}