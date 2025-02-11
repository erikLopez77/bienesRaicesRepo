import multer from 'multer';
import path from 'path';
import { generarId } from '../helpers/token.js';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {//carpeta de almacenamiento
        cb(null, './public/uploads/')
    }, filename: function (req, file, cb) {//p/generar nombre
        cb(null, generarId() + path.extname(file.originalname))
    }
})
//iniciamos multer con la configuración de almacenamiento
const upload = multer({ storage })

export default upload;