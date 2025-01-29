import { check, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import Usuario from '../models/usuario.js';
import {generarJWT, generarId } from '../helpers/token.js';
import { emailOlvidemiPassword, emailRegistro } from '../helpers/mails.js';

const formularioLogin = (req, res) => {
    res.render("auth/login", {
        pagina: 'Iniciar sesión',
        csrfToken: req.csrfToken()
    });
}

const autenticar = async (req, res) => {
    //validacion
    await check('email').isEmail().withMessage('El email es obligatorio').run(req);
    await check('password').notEmpty().withMessage('El password es obligatorio').run(req);

    let resultado = validationResult(req);

    if (!resultado.isEmpty()) {
        return res.render('auth/login', {
            pagina: 'Iniciar sesión',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
        });
    }//si existe el usuario
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
        return res.render('auth/login', {
            pagina: 'Iniciar sesión',
            csrfToken: req.csrfToken(),
            errores: { Errors: { msg: 'El usuario no existe' } }
        });
    }
    if (!usuario.confirmado) {
        return res.render('auth/login', {
            pagina: 'Iniciar sesión',
            csrfToken: req.csrfToken(),
            errores: { Errors: { msg: 'Tu cuenta no ha sido confirmada' } }
        });
    }
    //revisar password
    if(!usuario.verificarPassword(password)){
        return res.render('auth/login', {
            pagina: 'Iniciar sesión',
            csrfToken: req.csrfToken(),
            errores: { Errors: { msg: 'El password es incorrecto' } }
        });
    }
    //autenticar el usuario
    const token=generarJWT({id:usuario.id,nombre:usuario.nombre });
    return res.cookie('_token',token,{
        httOnly:true, //no se puede acceder al token por alguna fuente externa
        //secure: true, requieren certificados
        //sameSite:true
    }).redirect('/mis-propiedades');
}

const formularioRegistro = (req, res) => {
    res.render("auth/registro", {
        pagina: 'Crea tu cuenta',
        csrfToken: req.csrfToken()
    });
}

const registrar = async (req, res) => {
    await check('nombre').notEmpty().withMessage('El nombre no puede ir vacío').run(req);
    await check('email').isEmail().withMessage('Eso no parece un email').run(req);
    await check('password').isLength({ min: 6 }).withMessage('El password debe de ser de al menos 6 caracteres').run(req);
    await check('repetir_password').equals(req.body.password).withMessage('Los password no coinciden').run(req);

    const resultado = validationResult(req);
    //se muestran errores de validacion
    if (!resultado.isEmpty()) {
        return res.render('auth/registro', {
            pagina: 'Crea tu cuenta',
            errores: resultado.array(),
            csrfToken: req.csrfToken(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        });
    }

    const { nombre, email, password } = req.body;
    const existeUsuario = await Usuario.findOne({ where: { email } });
    //evitamos usuarios duplicados
    if (existeUsuario) {
        return res.render('auth/registro', {
            pagina: 'Crea tu cuenta',
            csrfToken: req.csrfToken(),
            errores: { Errors: { msg: 'El email ya ha sido registrado' } },
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        });
    }

    const usuario = await Usuario.create({ nombre, email, password, token: generarId() });

    await emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    });
    res.render('templates/mensaje', { pagina: 'Cuenta creada con éxito', mensaje: 'Hemos enviado un email de confirmacion al correo proporcionado ' });
}

const confirmar = async (req, res) => {

    const { token } = req.params;
    const usuario = await Usuario.findOne({ where: { token } });

    if (!usuario) {
        return res.render('auth/confirmar-cuenta', {
            pagina: 'Error al confirmar tu cuenta',
            error: true,
            mensaje: 'Ha ocurrido un error al confirmar tu cuenta, por favor intenta de nuevo'
        });
    }

    usuario.token = null;
    usuario.confirmado = true;
    await usuario.save();

    return res.render('auth/confirmar-cuenta', {
        pagina: 'Cuenta confirmada',
        mensaje: 'La cuenta se confirmó con éxito'
    });

}

const formularioOlvidePassword = (req, res) => {
    res.render("auth/olvide-password", {
        pagina: 'Recupera tu acceso a bienes raices ',
        csrfToken: req.csrfToken(),
    });
}

const resetPassword = async (req, res) => {
    await check('email').isEmail().withMessage('Eso no parece email').run(req);

    let resultado = validationResult(req);

    if (!resultado.isEmpty())
        return res.render('auth/olvide-password', {
            pagina: 'Recupera tu acceso a Bienes Raices',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        });
    //buscar el usuario
    const { email } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
        return res.render('auth/olvide-password', {
            pagina: 'Recupera tu acceso a Bienes Raices',
            csrfToken: req.csrfToken(),
            errores: { Errors: { msg: 'El correo no pertenece a un usuario registrado previamente' } },
        });
    }
    usuario.token = generarId();
    await usuario.save();
    //envio email de Confirmación
    emailOlvidemiPassword({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    });

    res.render('templates/mensaje', {
        pagina: 'Restablece tu password',
        mensaje: 'Hemos enviado un email al correo proporcionado '
    });
}

const comprobarToken = async (req, res) => {
    const { token } = req.params;
    const usuario = await Usuario.findOne({ where: { token } });
    if (!usuario) {
        return res.render('auth/confirmar-cuenta', {
            pagina: 'Restablece tu password',
            mensaje: 'Hubo un error al validar tu información, inténtalo de nuevo',
            error: true
        });
    }
    //mostrar formulario para modificar password
    res.render('auth/reset-password', {
        pagina: 'Restablece tu password',
        csrfToken: req.csrfToken()
    });

}

const nuevoPassword = async (req, res) => {
    //validar el nuevo password
    await check('password').isLength({ min: 6 }).withMessage('El password debe de ser de al menos 6 caracteres').run(req);
    const resultado = validationResult(req);

    if (!resultado.isEmpty()) {
        return res.render('auth/reset-password', {
            pagina: 'Restablece tu password',
            errores: resultado.array(),
            csrfToken: req.csrfToken(),
        });
    }
    //identificar quien hace el cambio
    const { token } = req.params;
    const { password } = req.body;

    const usuario = await Usuario.findOne({ where: { token } });
    //hashear el password
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt);
    usuario.token = null;

    await usuario.save();
    res.render('auth/confirmar-cuenta', {
        pagina: 'Password restablecido',
        mensaje: 'El password se guardó correctamente'
    });
}
export {
    formularioLogin,
    autenticar,
    formularioRegistro,
    registrar,
    confirmar,
    formularioOlvidePassword,
    resetPassword,
    comprobarToken,
    nuevoPassword
}