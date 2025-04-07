import express from 'express';
import { inicio, categoria, noEncontrado, buscador, pregFrec } from '../controllers/appController.js';
import identificarUsuario from '../middleware/identificarUsuario.js'
const router = express.Router();

//pagina de inicio
router.get('/', inicio);
//categorias
router.get('/categorias/:id', categoria)
//pagina 404
router.get('/404', identificarUsuario, noEncontrado);
//buscador
router.post('/buscador', buscador);

router.get("/FAQ's", pregFrec);
export default router;