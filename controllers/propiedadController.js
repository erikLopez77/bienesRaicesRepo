import { unlink } from 'node:fs/promises';
import { validationResult } from 'express-validator';
import { Precio, Categoria, Propiedad, Mensaje, Usuario } from '../models/index.js';
import { esVendedor } from '../helpers/index.js'

const admin = async (req, res) => {
    //leer query
    const { pagina: paginaActual } = req.query;
    const expresion = /[1-9]$/
    if (!expresion.test(paginaActual)) {//asegurarnos que oaginaActual es un número del 1-9
        return res.redirect('/mis-propiedades?pagina=1');
    }
    try {
        const { id } = req.usuario;
        const limit = 10;
        const offset = ((paginaActual * limit) - limit)//no. de propiedades a saltar antes de mostrar 

        const [propiedades, total] = await Promise.all([
            Propiedad.findAll({
                limit,
                offset,//limitan y desplazan los resultados p/paginar
                where: {
                    usuarioId: id
                },
                include: [
                    { model: Categoria, as: 'categoria' },
                    { model: Precio, as: 'precio' },
                    { model: Mensaje, as: 'mensajes' }
                ]
            }), Propiedad.count({ where: { usuarioId: id } })
        ])
        res.render('propiedades/admin', {
            csrfToken: req.csrfToken(),
            pagina: 'Mis propiedades',
            propiedades,
            paginas: Math.ceil(total / limit),
            paginaActual: Number(paginaActual),
            total, limit, offset
        });
    } catch (error) {
        console.log(error);
    }
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
        next();
        console.log('Se agrego img CTRLR');
        // Redirigir al usuario en el codigo js
    } catch (error) {
        console.log(error);
    }
}
const editar = async (req, res) => {
    const { id } = req.params;
    const propiedad = await Propiedad.findByPk(id);
    //validar existencia de propiedad
    if (!propiedad) {
        return res.redirect('/mis-propiedades');
    }
    //revisar quien visita la url
    if (propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
        return res.redirect('/mis-propiedades');
    }
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ]);

    res.render('propiedades/editar', {
        pagina: `Editar propiedad: ${propiedad.titulo}`,
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos: propiedad
    });

}
const guardarCambios = async (req, res) => {
    //validacion
    let resultado = validationResult(req);
    if (!resultado.isEmpty()) {
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ])
        return res.render('propiedades/editar', {
            pagina: `Editar propiedad: ${propiedad.titulo}`,
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errores: resultado.array(),
            datos: req.body
        });
    }
    const { id } = req.params;
    const propiedad = await Propiedad.findByPk(id);
    //validar existencia de propiedad
    if (!propiedad) {
        return res.redirect('/mis-propiedades');
    }
    //revisar quien visita la url
    if (propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
        return res.redirect('/mis-propiedades');
    }
    //reescribir eel objeto
    try {
        const { titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio: precioId,
            categoria: categoriaId
        } = req.body;
        propiedad.set({
            titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precioId,
            categoriaId
        });
        await propiedad.save();
        res.redirect('/mis-propiedades');
    } catch (error) {
        console.log(error);
    }
}
const eliminar = async (req, res) => {
    const { id } = req.params;
    const propiedad = await Propiedad.findByPk(id);
    //validar existencia de propiedad
    if (!propiedad) {
        return res.redirect('/mis-propiedades');
    }
    //revisar quien visita la url
    if (propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
        return res.redirect('/mis-propiedades');
    }
    //eliminar imagen
    await unlink(`public/uploads/${propiedad.imagen}`);

    //eliminar la propiedad
    await propiedad.destroy();
    res.redirect('/mis-propiedades');
}

const mostrarPropiedad = async (req, res) => {
    const { id } = req.params;
    //comprobar que exista la propiedad
    const propiedad = await Propiedad.findByPk(id, {
        include: [
            { model: Precio, as: 'precio' },
            { model: Categoria, as: 'categoria' }
        ]
    });
    if (!propiedad) {
        return res.redirect('/404');
    }

    res.render('propiedades/mostrar', {
        propiedad,
        pagina: propiedad.titulo,
        csrfToken: req.csrfToken(),
        usuario: req.usuario,
        esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId)
    });
}
const enviarMensajes = async (req, res) => {
    const { id } = req.params;
    //comprobar que exista la propiedad
    const propiedad = await Propiedad.findByPk(id, {
        include: [
            { model: Precio, as: 'precio' },
            { model: Categoria, as: 'categoria' }
        ]
    });
    if (!propiedad) {
        return res.redirect('/404');
    }
    //validacion y renderizar los errores
    let resultado = validationResult(req);
    if (!resultado.isEmpty()) {
        return res.render('propiedades/mostrar', {
            propiedad,
            pagina: propiedad.titulo,
            csrfToken: req.csrfToken(),
            usuario: req.usuario,
            esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId),
            errores: resultado.array()
        });
    }
    //almacenar el mensaje 
    const { mensaje } = req.body;
    const { id: propiedadId } = req.params;
    const { id: usuarioId } = req.usuario;

    await Mensaje.create({ mensaje, propiedadId, usuarioId })
    res.redirect('/');
}
const verMensajes = async (req, res) => {
    const { id } = req.params;
    const propiedad = await Propiedad.findByPk(id, {
        include: [
            {
                model: Mensaje, as: 'mensajes',
                include: [
                    { model: Usuario.scope('eliminarPassword'), as: 'usuario' }
                ]
            }
        ]
    });
    //validar existencia de propiedad
    if (!propiedad) {
        return res.redirect('/mis-propiedades');
    }
    //revisar quien visita la url
    if (propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
        return res.redirect('/mis-propiedades');
    }
    res.render("propiedades/mensajes", {
        pagina: 'Mensajes',
        mensajes: propiedad.mensajes
    });
}

export {
    admin,
    crear,
    guardar,
    agregarImagen,
    almacenarImagen,
    editar,
    guardarCambios,
    eliminar,
    mostrarPropiedad,
    enviarMensajes,
    verMensajes
}