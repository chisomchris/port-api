const nodemailer = require("nodemailer");

const config = {
  service: "gmail",
  auth: {
    type:'OAuth2',
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENTSECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  },
};

const sendEmail = async (data) => {
  try {
    const transporter = nodemailer.createTransport(config);
    const info = await transporter.sendMail(data);
    return info.response;
  } catch (error) {
    console.error(error);
  }
};

module.exports = { sendEmail };
