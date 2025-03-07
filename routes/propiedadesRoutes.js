import express from "express";
import { body } from "express-validator";
import {
    admin, crear, guardar, agregarImagen, almacenarImagen, editar, guardarCambios, eliminar,
    cambiarEstado, mostrarPropiedad, enviarMensajes, verMensajes,
} from '../controllers/propiedadController.js';
import protegerRuta from "../middleware/protegerRuta.js";
import upload from '../middleware/subirImagen.js';//se importa middleware
import identificarUsuario from "../middleware/identificarUsuario.js";

const router = express.Router();

router.get('/mis-propiedades', protegerRuta, admin);

router.get('/propiedades/crear', protegerRuta, crear);
router.post('/propiedades/crear', protegerRuta,
    body('titulo').notEmpty().withMessage('El titulo del anuncio es obligatorio'),
    body('descripcion').notEmpty().withMessage('La descripción no puede ir vacía').
        isLength({ max: 200 }).withMessage('La descripcion es muy larga'),
    body('categoria').isNumeric().withMessage('Selecciona una categoria'),
    body('precio').isNumeric().withMessage(' Selecciona un rango de precio'),
    body('habitaciones').isNumeric().withMessage('Selecciona la cantidad de habitaciones'),
    body('estacionamiento').isNumeric().withMessage('Selecciona la cantidad de estacionamientos'),
    body('wc').isNumeric().withMessage('Selecciona la cantidad de sanitarios '),
    body('lat').notEmpty().withMessage('Ubica la propiedad en el mapa'),
    guardar);

router.get('/propiedades/agregar-imagen/:id', protegerRuta, agregarImagen);
router.post('/propiedades/agregar-imagen/:id',
    protegerRuta,
    upload.single('imagen'),//single solo p/imagen, .array+1 img
    almacenarImagen);

router.get('/propiedades/editar/:id', protegerRuta, editar);
router.post('/propiedades/editar/:id', protegerRuta,
    body('titulo').notEmpty().withMessage('El titulo del anuncio es obligatorio'),
    body('descripcion').notEmpty().withMessage('La descripción no puede ir vacía').
        isLength({ max: 200 }).withMessage('La descripcion es muy larga'),
    body('categoria').isNumeric().withMessage('Selecciona una categoria'),
    body('precio').isNumeric().withMessage(' Selecciona un rango de precio'),
    body('habitaciones').isNumeric().withMessage('Selecciona la cantidad de habitaciones'),
    body('estacionamiento').isNumeric().withMessage('Selecciona la cantidad de estacionamientos'),
    body('wc').isNumeric().withMessage('Selecciona la cantidad de sanitarios '),
    body('lat').notEmpty().withMessage('Ubica la propiedad en el mapa'),
    guardarCambios);

router.post("/propiedades/eliminar/:id", protegerRuta, eliminar);
router.put('/propiedades/:id',
    protegerRuta,
    cambiarEstado);
//area publica
router.get('/propiedad/:id', identificarUsuario, mostrarPropiedad);
//almacenar mensajes 
router.post('/propiedad/:id',
    identificarUsuario,
    body('mensaje').isLength({ min: 10 }).withMessage('El mensaje no puede ir vacío o es muy corto'),
    enviarMensajes);
router.get('/mensajes/:id', protegerRuta, verMensajes)
export default router;