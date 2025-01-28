import nodemailer from 'nodemailer';

const emailRegistro = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const { nombre, email, token } = datos;

    await transport.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'Confirma tu cuenta en BienesRaices.com',
        text: 'Confirma tu cuenta en BienesRaices.com',
        html: `<p>Hola ${nombre}</p>
        <p>Tu cuenta ya está casi lista, solo tienes que hacer click en el siguiente enlace:
            <a href='${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}'>Confirmar cuenta</a>
        </p> 
        <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>`
    });
}

const emailOlvidemiPassword = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const { nombre, email, token } = datos;

    await transport.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'Restablece tu cuenta en BienesRaices.com',
        text: 'Restablece tu cuenta en BienesRaices.com',
        html: `<p>Hola ${nombre}, has solicitado restablecer tu password en BienesRaices.com</p>
        <p>Haz click en el siguiente enlace para generar un password nuevo:
            <a href='${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/olvide-password/${token}'>Restablecer password</a>
        </p> 
        <p>Si tu no solicitaste este cambio, puedes ignorar este mensaje</p>`
    });
}

export { emailRegistro, emailOlvidemiPassword }