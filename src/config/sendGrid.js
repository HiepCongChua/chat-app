import sendGridMail from '@sendgrid/mail';
sendGridMail.setApiKey(process.env.API_KEY_SENDGRID);
export const sendMail=(email,subject,html)=>{
  const msg = {
    to: email,
    from: 'chat-app-realtime@node.com',
    subject,
    html
  };  
 return sendGridMail.send(msg);
}
