import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

const identificarUsuario = async (req, res, next) => {
    //identificar si hay un token
    const { _token } = req.cookies;
    if (!_token) {
        req.usuario = null;
        return next();
    }
    //comprobar el token 
    try {
        //verifica que sea valido, de lo contrario retorna error que nos manda al catch
        const decoded = jwt.verify(_token, process.env.JWT_SECRET);
        const usuario = await Usuario.scope('eliminarPassword').findByPk(decoded.id);
        if (usuario) {
            req.usuario = usuario;
        }
        return next();
    } catch (error) {
        console.log(error);
        return res.clearCookie('_token').redirect('/auth/login');
    }
}

export default identificarUsuario;