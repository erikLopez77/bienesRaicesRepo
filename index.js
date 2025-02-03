import express from 'express';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import routerUsuarios from './routes/usuarioRutas.js';
import propiedadesRoutes from './routes/propiedadesRoutes.js'
import db from './config/db.js';

const app = express();
//habilitar lectura de datos del formulario
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(csrf({ cookie: true }));

try {
    await db.authenticate();
    db.sync();
    console.log('Conexión correcta a la base de datos');
} catch (error) {
    console.log(error);
}

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.static('public'));

//routing
app.use('/auth', routerUsuarios);//localhost:5000/auth/
app.use('/', propiedadesRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`);
})
