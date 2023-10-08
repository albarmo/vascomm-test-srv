const nodemailer = require('nodemailer')

const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'tukangemailalbar@gmail.com',
        pass:'aywy ibvl same ejuq'
    },
    tls:{
        rejectUnauthorized:false
    }

})


module.exports=transporter