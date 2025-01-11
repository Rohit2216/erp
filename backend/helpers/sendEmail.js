    var nodemailer = require('nodemailer');
    const { StatusCodes } = require('http-status-codes');

    async function mailSent(from, to, subject, html) {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: process.env.HOST,
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });
    
        // email template
        let applicantMailOptions = {
            from: from,
            to: to,
            subject: subject,
            html: html
        };
    
        try {
            // send mail with defined transport object and wait for it to complete
            const info = await transporter.sendMail(applicantMailOptions);
    
            // Return the response when the mail is sent successfully
            return {
                status: true,
                message: "Mail sent successfully"
            };
        } catch (error) {
            // Return an error response if the mail sending fails
            return {
                status: false,
                message: error.message
            };
        }
    }


    module.exports = {mailSent}