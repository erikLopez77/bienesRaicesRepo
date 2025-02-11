import { validationResult } from 'express-validator';
import { Precio, Categoria, Propiedad } from '../models/index.js';

const admin = (req, res) => {
    res.render('propiedades/admin', {
        pagina: 'Mis propiedades'
    });
}
//form p/ crear propiedad
const crear = async (req, res) => {
    //consultar modelo de precios y categorias
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ]);

    res.render('propiedades/crear', {
        pagina: 'Crear propiedad',
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos: {}
    });
}


const guardar = async (req, res) => {
    //validacion
    let resultado = validationResult(req);
    if (!resultado.isEmpty()) {
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ])
        return res.render('propiedades/crear', {
            pagina: 'Crear propiedad',
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errores: resultado.array(),
            datos: req.body
        });
    }

    //crear registro
    const { titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio: precioId,
        categoria: categoriaId
    } = req.body;

    const { id: usuarioId } = req.usuario;
    try {
        const propiedadGuardada = await Propiedad.create({
            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat,
            lng,
            precioId,
            categoriaId,
            usuarioId,
            imagen: ''
        });
        const { id } = propiedadGuardada;

        res.redirect(`/propiedades/agregar-imagen/${id}`);
    } catch (error) {
        console.log(error);
    }
}

const agregarImagen = async (req, res) => {
    const { id } = req.params;

    //validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id);
    if (!propiedad) {
        return res.redirect('/mis-propiedades');
    }
    //validar que la propiedano esté publicada
    if (propiedad.publicado) {
        return res.redirect('/mis-propiedades');
    }
    //validar que la propiedad pertenece a la persona que visita la page
    if (req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
        return res.redirect('/mis-propiedades')
    }
    res.render('propiedades/agregar-imagen', {
        pagina: `Agregar imagen: ${propiedad.titulo}`,
        propiedad,
        csrfToken: req.csrfToken()
    });
}

const almacenarImagen = async (req, res, next) => {
    const { id } = req.params;

    //validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id);
    if (!propiedad) {
        return res.redirect('/mis-propiedades');
    }
    //validar que la propiedano esté publicada
    if (propiedad.publicado) {
        return res.redirect('/mis-propiedades');
    }
    //validar que la propiedad pertenece a la persona que visita la page
    if (req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
        return res.redirect('/mis-propiedades')
    }
    try {
        //almacenar la imagen y publicar propiedad
        console.log(req.file);
        propiedad.imagen = req.file.filename;
        propiedad.publicado = 1;
        await propiedad.save();
        console.log('Se agrego img CTRLR');
        // Redirigir al usuario en el codigo js
    } catch (error) {
        console.log(error);
    }
}

export {
    admin,
    crear,
    guardar,
    agregarImagen,
    almacenarImagen
}