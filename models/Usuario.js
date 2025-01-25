import { DataTypes } from 'sequelize';
import db from '../config/db.js';
import bcrypt, { hash } from 'bcrypt';

const Usuario = db.define('usuarios', {
    nombre: {
        type: DataTypes.STRING,
        alllowNull: false
    }, email: {
        type: DataTypes.STRING,
        alllowNull: false,
    }, password: {
        type: DataTypes.STRING,
        alllowNull: false,
    },
    token: DataTypes.STRING,
    confirmado: DataTypes.BOOLEAN
}, {
    hooks: {
        beforeCreate: async function (usuario) {
            const salt = await bcrypt.genSalt(10);
            usuario.password = await bcrypt.hash(usuario.password, salt);
        }
    }
});

export default Usuario;
