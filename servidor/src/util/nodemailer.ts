import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
    host:process.env.SMTP_HOST,
    port:465,
    secure:true,
    requireTLS: true,
    //ignoreTLS: true,
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD
    },
    tls: {
        minVersion: 'TLSv1',
        rejectUnauthorized: false,
        ciphers: 'DEFAULT@SECLEVEL=0'
    }
});