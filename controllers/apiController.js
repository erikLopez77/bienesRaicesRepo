import { Op } from 'sequelize';
import { Propiedad, Precio, Categoria, Usuario } from '../models/index.js';
const propiedades = async (req, res) => {
    const { id } = req.query;
    console.log(id);
    const usuario = await Usuario.findByPk(id)
    if (!usuario) {
        const propiedades = await Propiedad.findAll({
            where: { publicado: true },
            include: [
                { model: Precio, as: 'precio' },
                { model: Categoria, as: 'categoria' }
            ]
        });
        return res.json(propiedades);
    } else {
        const propiedades = await Propiedad.findAll({
            where: {
                publicado: true,
                usuarioId: { [Op.ne]: id }, // Excluye las propiedades del usuario actual
            },
            include: [
                { model: Precio, as: 'precio' },
                { model: Categoria, as: 'categoria' }
            ]
        });
        return res.json(propiedades);
    }
}

export {
    propiedades
}