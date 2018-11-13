const sgMail = require('@sendgrid/mail');
const constant = require('./constant')();
sgMail.setApiKey(constant.SENDGRID.API_KEY);

module.exports = {
  sendEmailToAdmin: sendEmailTo
};

function sendEmailTo(adminDetails, taskDetails, cb) {
  adminDetails = adminDetails.toObject();
  taskDetails = taskDetails.toObject();
  console.log(adminDetails.email);
  const msg = {
    to: adminDetails.email,
    from: 'support@deliforce.io',
    subject: 'Autocation was failed',
    html: '<strong>Hi,<br>' + adminDetails.name + ' Your given taskId' + taskDetails.taskId + 'customerName:' + taskDetails.name + ' related task Autoallocation was field due to Drivers are offline/busy or drivers are not accept the task</strong>',
  };

  return new Promise((reslove, reject) => {
    sgMail.send(msg, (err, data) => {
      if (err) {
        console.log('send grid error', err);
        cb(null, 'errormessage');
        //process.exit(0);
      } else {
        console.log('sendgrid success');
        cb(null, 'errormessage');
        // process.exit(0);
      }
    });
  })
}
