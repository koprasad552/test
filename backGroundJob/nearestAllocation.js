const taskModel = require('./model').Task;
const userModel = require('./model').User;
const notification = require('./notify');
const mongoose = require('mongoose');
const email = require('./sendEmail');
const _ = require('lodash');
module.exports = {
  nearestAllo: nearByAllo
};


function nearByAllo(event, cb) {
  let taskId = event.taskId;
  let driverArry = event.driverData;
  let expiry = event.autoAllocation.nearest.expiry;

  if (driverArry.length) {
    taskId = mongoose.Types.ObjectId(taskId)
    taskModel.findOne({_id: mongoose.Types.ObjectId(taskId)}).then((taskData) => {
      if (!_.isEmpty(taskData)) {
        console.log('taskData', taskData);
        // taskData = taskData.toObject();
        console.log('driverArry', driverArry);
        Promise.all([assignNearestDriverForcefully(taskId, driverArry[0].driverId), notification.sendPushNotification(taskData, driverArry[0].endArn, 4, expiry)])
          .then(() => {
            cb(null, 'errormessage');
            //process.exit(0);
          })
      }
      else {
        cb(null, 'errormessage');
        // process.exit(0);
      }

    })

  } else {
    taskDetails(taskId).then((res) => {
      let taskDetails = (res && res.length) ? res[0] : null;
      if (taskDetails) {
        let adminId = taskDetails.clientId;
        return getadminDetails(adminId).then((adminData) => {
          let adminDetails = adminData[0];
          return email.sendEmailToAdmin(adminDetails, taskDetails, cb).then(()=>{
            cb(null,'errormessage');
          });
        })

      } else {
        cb(null, 'errormessage');
        //process.exit(0);
      }
    }).catch((err) => {
      console.log(err);
      //process.exit(0)
      cb(null, 'errormessage');
    })
  }
}


function assignNearestDriverForcefully(taskId, driverInfo) {
  console.log('taskId'+ taskId);
  console.log('driverInfo'+ driverInfo);
  return taskModel.update({_id:  mongoose.Types.ObjectId(taskId)}, {$set: {taskStatus: 2, driver: driverInfo}});

}


function getadminDetails(adminId) {
  return userModel.find({cognitoSub: adminId})
}

function taskDetails(taskId) {
  return taskModel.find({_id: mongoose.Types.ObjectId(taskId)})
}
