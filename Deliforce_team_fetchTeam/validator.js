const validate = require('mongoose-validator');
module.exports = {
  emailValidator: [
    validate({
      validator: 'isEmail',
      passIfEmpty: true,
      message: 'invalid email',
    })
  ],
  phoneValidateEmpty: [
    validate({
      validator: function test(d) {
        const regex = /^\d+$/;
        const split = d.substring(1).split(' ');
        if (d.charAt(0) !== '+') {
          return false;
        } else if (split.length === 2) {
          var arr = split.filter((s) => !regex.test(s));
          return (!arr.length);
        } else {
          return false;
        }
      },
      passIfEmpty: true,
      message: 'phone invalid',
    })
  ]
};
