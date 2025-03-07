import express from 'express';
import {
    formularioLogin, autenticar, cerrarSesion, formularioRegistro, formularioOlvidePassword, registrar,
    confirmar, resetPassword, comprobarToken, nuevoPassword
} from '../controllers/usuarioController.js';

const router = express.Router();

/* router.get('/', (req, res) => {
    res.send("Hola mundo ...");
}) */

router.get('/login', formularioLogin);
router.post('/login', autenticar);

//cerrar sesión
router.post('/cerrar-sesion', cerrarSesion);

router.get('/registro', formularioRegistro);
router.post('/registro', registrar);

router.get('/confirmar/:token', confirmar);

router.get('/olvide-password', formularioOlvidePassword);
router.post('/olvide-password', resetPassword);

router.get('/olvide-password/:token', comprobarToken);
router.post('/olvide-password/:token', nuevoPassword);

export default router;