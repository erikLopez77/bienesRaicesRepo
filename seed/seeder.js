import{ exit } from 'node:process';
import categorias  from "./categorias.js";
import Categoria from "../models/Categoria.js";
import db from "../config/db.js";

const importarDatos =async ()=>{
    try{
        //autenticar
        await db.authenticate();

        //generar las columnas
        await db.sync();

        //insertamos los datos
        await Categoria.bulkCreate(categorias);
        console.log('Datos importados correctamente');
        exit();//==exit(0) es porque finalizo sin  errores

    } catch (error){
        console.log(error);
        exit(1); //todo finalizo pero con un error
    }
}