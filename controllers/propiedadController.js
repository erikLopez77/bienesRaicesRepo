import { Sequelize, Op } from 'sequelize';
import { unlink } from 'node:fs/promises';//eliminar archivos
import { validationResult } from 'express-validator';
import { Precio, Categoria, Propiedad, Mensaje, Usuario } from '../models/index.js';
import { esVendedor, formatearFecha } from '../helpers/index.js'

const admin = async (req, res) => {
    //leer query
    const { pagina: paginaActual } = req.query;
    const expresion = /[1-9]$/
    if (!expresion.test(paginaActual)) {//asegurarnos que oaginaActual es un número del 1-9
        return res.redirect('/mis-propiedades?pagina=1');
    }
    try {
        const { id } = req.usuario;
        const limit = 5;
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
//modifica el estado de la propiedad
const cambiarEstado = async (req, res) => {
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
    console.log(id, '+++')
    //actualizar
    propiedad.publicado = !propiedad.publicado;
    await propiedad.save();
    res.json({
        resultado: 'ok'
    })
}
const mostrarPropiedad = async (req, res) => {
    const autenticado = req.usuario
    const { id } = req.params;
    //comprobar que exista la propiedad
    const propiedad = await Propiedad.findByPk(id, {
        include: [
            { model: Precio, as: 'precio' },
            { model: Categoria, as: 'categoria' }
        ]
    });
    if (!propiedad || !propiedad.publicado) {
        return res.redirect('/404');
    }

    res.render('propiedades/mostrar', {
        propiedad,
        pagina: propiedad.titulo,
        csrfToken: req.csrfToken(),
        usuario: req.usuario,
        autenticado,
        esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId)
    });
}
const enviarMensajes = async (req, res) => {
    const { id } = req.params;
    const { usuario } = req;
    //comprobar que exista la propiedad
    const propiedad = await Propiedad.findByPk(id, {
        include: [
            { model: Precio, as: 'precio' },
            { model: Categoria, as: 'categoria' }
        ]
    });
    //se ridirige en caso de no existir la propiedad
    if (!propiedad && !usuario) {
        return res.render('404');
    }
    if (!propiedad && usuario) {
        return res.render('404', { admin: true });
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
    const usuarioId = usuario.id;

    await Mensaje.create({ mensaje, propiedadId, usuarioId })
    res.redirect('/propiedades-venta');
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
        mensajes: propiedad.mensajes,
        formatearFecha
    });
}
//controladores de invitado con head de usuario
const enVenta = async (req, res) => {
    const { usuario } = req
    const [categorias, precios, casas, departamentos] = await Promise.all([
        Categoria.findAll({ raw: true }),
        Precio.findAll({ raw: true }),
        Propiedad.findAll({
            limit: 3,
            where: {
                usuarioId: { [Op.ne]: usuario.id }, // Excluye las propiedades del usuario actual
                publicado: true,
                categoriaId: 1
            }, include: [
                { model: Precio, as: 'precio' }
            ], order: [['createdAt', 'DESC']]
        }),
        Propiedad.findAll({
            limit: 3,
            where: {
                usuarioId: { [Op.ne]: usuario.id }, // Excluye las propiedades del usuario actual
                categoriaId: 2,
                publicado: true
            }, include: [
                { model: Precio, as: 'precio' }
            ], order: [['createdAt', 'DESC']]
        })
    ])
    res.render('propiedades/enVenta', {
        pagina: 'Propiedades en venta',
        categorias,
        precios,
        casas,
        departamentos,
        admin: true,
        csrfToken: req.csrfToken(),
        csrfToken2: req.csrfToken(),
    });
}


const categoria2 = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;
    //comprobar que la categoria exista
    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
        return res.render('404', { admin: true });
    }
    //obtener propiedades
    const propiedades = await Propiedad.findAll({
        where: {
            categoriaId: id,
            usuarioId: { [Op.ne]: usuario.id }, // Excluye las propiedades del usuario actual
            publicado: true
        },
        include: [
            { model: Precio, as: 'precio' }
        ]
    });
    res.render('categoria', {
        pagina: `${categoria.nombre}s en venta`,
        propiedades,
        csrfToken: req.csrfToken(),
        admin: true
    });
}

const buscador2 = async (req, res) => {
    const { q } = req.query;
    const { usuario } = req;//
    console.log(usuario, 'user+++++');
    res.json(q);
    /* console.log(q, 'trmn+++++')
    //consultar propiedades si todo salio bien
    const propiedades = await Propiedad.findAll({
        where: {
            usuarioId: { [Op.ne]: usuario.id },  // Excluye las propiedades del usuario actual
            titulo: {
                [Sequelize.Op.like]: '%' + q + '%'//se busca al inicio y fin de la string
            }
        }, include: [
            { model: Precio, as: 'precio' }
        ]
    })
    res.render('propiedades/buscar', {
        pagina: 'Resultados de la búsqueda',
        propiedades,
        csrfToken: req.csrfToken(),
    }) */
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
    cambiarEstado,
    mostrarPropiedad,
    enviarMensajes,
    verMensajes,
    enVenta,
    categoria2,
    buscador2
}