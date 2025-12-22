// utils/sendEmail.js
const nodemailer=require('nodemailer');
const sendEmail=async(to,subject,html)=>{
    try{
        if(!to || typeof to !=='string'){
            throw new Error('invalid recipient email address');

        }
        const transporter = nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:process.env.GMAIL_USER,
                pass:process.env.GMAIL_PASS,
            },
        });
        const mailOptions={
            from:`"Bus Booking" <${ process.env.GMAIL_USER}>`,
            to,
            subject,
            html,

        };
        await transporter.sendMail(mailOptions);
        console.log(`email sent to ${to}`);

    }catch(error){
        console.error('email sending error:',error.message);
    }
    
};
module.exports=sendEmail