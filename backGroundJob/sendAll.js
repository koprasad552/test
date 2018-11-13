const taskModel = require('./model').Task;
const userModel = require('./model').User;
const notification = require('./notify');
const mongoose = require('mongoose');
const email = require('./sendEmail');
const _ = require('lodash');
module.exports = {
  sendToAllDrivers: sendAll
};


function sendAll(event, cb) {
  let taskId = event.taskId;
  let driverArry = event.driverData;
  let expiry = event.autoAllocation.sendToAll.expiry;


  if (driverArry.length) {
    let promiseArry = [];
    taskModel.findOne({_id: mongoose.Types.ObjectId(taskId)}).then((taskData) => {
      for (let i = 0; i < driverArry.length; i++) {
        //driverArry[i]=driverArry[i].toObject();
        console.log(typeof driverArry[i]);
        console.log(JSON.stringify(driverArry[i].endArn));
        console.log(typeof taskData);
        console.log(JSON.stringify(taskData));
        promiseArry.push(sendNotifications(taskData, driverArry[i].endArn, 4, expiry,i,driverArry.length-1,cb));
      }
      return Promise.all(promiseArry).then(() => {
        console.log('sending notifcation to all drivers');
        cb(null, 'errormessage');
        //process.exit(0);
      }).catch((err) => {
        console.log('err', err);
        cb(null, 'errormessage');
      });
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
        // process.exit(0);
      }
    }).catch((err) => {
      console.log(err);
      cb(null, 'errormessage');
      //process.exit(0)
    })
  }
}


function assignNearestDriverForcefully(taskId, driverInfo) {
  taskModel.update({_id: taskId}, {$set: {taskStatus: 1, driver: driverInfo._id}});

}


function sendNotifications(taskDetails, endpointArn, flag, expiry,i,driverLength,cb) {
  //taskDetails=taskDetails.toObject();
  console.log('taskDetails'+JSON.stringify(taskDetails));
  console.log('endpointArn'+endpointArn);
  return notification.sendPushNotification(taskDetails, endpointArn, 4, expiry).then(()=>{
    console.log('push sent');

    if(i===driverLength){
      console.log('final driver');
      return taskModel.findOne({_id:mongoose.Types.ObjectId(taskDetails._id)}).then((taskIn)=>{
        taskIn = taskIn.toObject();
        if(taskIn.taskStatus===1){
          return getadminDetails(taskIn.clientId).then((adminInfo)=>{
            //adminInfo=adminInfo.toObject();
            console.log('admin deTails',JSON.stringify(adminInfo))
            return email.sendEmailToAdmin(adminInfo,taskDetails,cb)
          });
        }else{
          cb(null, 'errormessage');
        }
      }).catch((err)=>{
        console.log(err);
        cb(null, 'errormessage');
      });
    }
    else{
      return Promise.resolve();
    }
  })
}


function getadminDetails(adminId) {
  return userModel.findOne({cognitoSub: adminId})
}



function taskDetails(taskId) {
  return taskModel.find({_id: mongoose.Types.ObjectId(taskId)})
}






