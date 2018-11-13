let cb;
// function callback(err,data) {
//     console.log(err,data);
// }

try {

//const event=require('./driverArry');
  const getConstant = require('./constant')();
//codecommit test
  exports.handler = (event, context, callback) => {
    console.log(JSON.stringify(event));
    console.log('context', JSON.stringify(context))
    cb = callback;
    context.callbackWaitsForEmptyEventLoop = false;
    getConstant.then(() => {
      //imports
      const db = require('./db').connect();
      const oneByOne = require('./backgroundJob');
      const nearest = require('./nearestAllocation');

      const sendTo = require('./sendAll');


      //connect to db
      db.then(() => {
        if (event.autoAllocation.nearest.current === true) {
          nearest.nearestAllo(event, cb);
        } else if (event.autoAllocation.sendToAll.current === true) {
          sendTo.sendToAllDrivers(event, cb);
        } else if (event.autoAllocation.oneByOne.current === true) {
          oneByOne.doBackGroundJob(event, cb)
        }

      }).catch(sendError);

      function sendError(error) {
        console.error('error +++', error);


      }
    }).catch((err) => {
      console.log(err);
      cb(null, 'errormessage');
    });

  };

} catch (err) {
  console.error('error +++', err);
  cb(null, 'errormessage');
  // result.sendServerError(cb);
}
