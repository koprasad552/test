const mongoose = require('mongoose');
const constant = require('./constant')();
module.exports = {
  connect: () => {
    console.log('connection state++ ', mongoose.connection.readyState);
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      console.log('connection reused');
      return Promise.resolve();
    } else {
      console.log('connection created once again');
      return mongoose.connect(constant.DB.URL, constant.DB.OPTION);
    }
  }
};

