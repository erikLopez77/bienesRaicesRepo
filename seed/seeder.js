import { exit } from 'node:process';
import categorias from "./categorias.js";
import precios from "./precios.js";
import { Categoria, Precio } from "../models/index.js"
import db from "../config/db.js";

const importarDatos = async () => {
    try {
        //autenticar
        await db.authenticate();

        //generar las columnas
        await db.sync();

        //insertamos los datos
        await Promise.all([
            Categoria.bulkCreate(categorias),
            Precio.bulkCreate(precios)
        ]);

        console.log('Datos importados correctamente');
        exit();//==exit(0) es porque finalizo sin  errores

    } catch (error) {
        console.log(error);
        exit(1); //todo finalizo pero con un error
    }
}

const eliminarDatos = async () => {
    try {
        await Promise.all([
            Categoria.destroy({ where: {}, truncate: true }),
            Precio.destroy({ where: {}, truncate: true })
        ]);
        console.log("Datos eliminados correctamente");
        exit();
    } catch (error) {
        console.log(error);
        exit(1);
    }
}

if (process.argv[2] === "-i") {
    importarDatos();
}

if (process.argv[2] === "-e") {
    eliminarDatos();
}