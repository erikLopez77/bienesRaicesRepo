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
    const confirmUrl = `${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}`;

    await transport.sendMail({
        from: '"BienesRaices.com" <no-reply@bienesraices.com>',
        to: email,
        subject: 'Confirma tu cuenta en BienesRaices.com',
        text: `Hola ${nombre},\n\nPor favor confirma tu cuenta visitando este enlace: ${confirmUrl}\n\nSi no creaste esta cuenta, ignora este mensaje.`,
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Confirma tu cuenta</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px;">
                <div style="text-align: center; margin-bottom: 25px;">
                    <h1 style="color: #2d3748; font-size: 24px; font-weight: bold;">BienesRaices.com</h1>
                </div>

                <div style="background-color: white; padding: 25px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <h2 style="color: #2d3748; font-size: 20px; margin-bottom: 20px;">Hola ${nombre},</h2>

                    <p style="margin-bottom: 20px;">Tu cuenta en BienesRaices.com está casi lista. Por favor confirma tu dirección de email haciendo clic en el siguiente botón:</p>

                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${confirmUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                            Confirmar mi cuenta
                        </a>
                    </div>

                    <p style="margin-bottom: 10px;">Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
                    <p style="word-break: break-all; color: #4f46e5; margin-bottom: 25px;">${confirmUrl}</p>

                    <p style="color: #6b7280; font-size: 14px;">Si no solicitaste crear una cuenta en BienesRaices.com, por favor ignora este mensaje.</p>
                </div>

                <div style="text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px;">
                    <p>© ${new Date().getFullYear()} BienesRaices.com. Todos los derechos reservados.</p>
                </div>
            </div>
        </body>
        </html>
        `
    });
};

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
    const resetUrl = `${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/olvide-password/${token}`;

    await transport.sendMail({
        from: '"BienesRaices.com" <no-reply@bienesraices.com>',
        to: email,
        subject: 'Restablece tu contraseña en BienesRaices.com',
        text: `Hola ${nombre},\n\nPara restablecer tu contraseña, visita este enlace: ${resetUrl}\n\nSi no solicitaste este cambio, ignora este mensaje.`,
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Restablece tu contraseña</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px;">
                <div style="text-align: center; margin-bottom: 25px;">
                    <h1 style="color: #2d3748; font-size: 24px; font-weight: bold;">BienesRaices.com</h1>
                </div>

                <div style="background-color: white; padding: 25px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <h2 style="color: #2d3748; font-size: 20px; margin-bottom: 20px;">Hola ${nombre},</h2>

                    <p style="margin-bottom: 20px;">Has solicitado restablecer tu contraseña en BienesRaices.com. Haz clic en el siguiente botón para crear una nueva contraseña:</p>

                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                            Restablecer contraseña
                        </a>
                    </div>

                    <p style="margin-bottom: 10px;">Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
                    <p style="word-break: break-all; color: #4f46e5; margin-bottom: 25px;">${resetUrl}</p>

                    <p style="color: #6b7280; font-size: 14px;">Si no solicitaste este cambio, por favor ignora este mensaje.</p>

                    <p style="color: #6b7280; font-size: 14px; margin-top: 20px; border-top: 1px solid #e5e7eb; padding-top: 15px;">
                        Este enlace expirará en 1 hora por razones de seguridad.
                    </p>
                </div>

                <div style="text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px;">
                    <p>© ${new Date().getFullYear()} BienesRaices.com. Todos los derechos reservados.</p>
                </div>
            </div>
        </body>
        </html>
        `
    });
};

export { emailRegistro, emailOlvidemiPassword }