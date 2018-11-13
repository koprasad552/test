const userModel = require('./model').User;
const taskModel = require('./model').Task;
const notification = require('./notify');
const mongoose = require('mongoose');
const email = require('./sendEmail');
const _ = require('lodash');
module.exports = {
  doBackGroundJob: (event, cb) => {
    console.log('event', JSON.stringify(event));
    let driverArry = event.driverData;
    let expiry = Number(event.autoAllocation.oneByOne.expiry);
    let arrySplitLength = Math.round(240 / expiry);
    console.log('arrySplitLangth', arrySplitLength);
    let remaingArry = [];
    if (driverArry.length >= arrySplitLength) {
      console.log('task is taking more than 5 mints');
      remaingArry = event.driverData.slice(arrySplitLength, driverArry.length);
      driverArry = event.driverData.slice(0, arrySplitLength - 1);
    }

    console.log('driverArry', JSON.stringify(driverArry));

    console.log('remaingArry', JSON.stringify(remaingArry));
    //let taskId= mongoose.Types.ObjectId(event.taskId)
    let taskId = mongoose.Types.ObjectId(event.taskId);
    fetchTaskDetails(taskId).then((taskDetails) => {
      console.log(JSON.stringify(taskDetails));
      if (!_.isEmpty(taskDetails)) {
        return sendPushNotifications(driverArry, remaingArry, taskId, taskDetails.toObject(), expiry, cb);
      } else {
        cb(null, 'errormessage');
        //process.exit(0);
      }

    }).catch((err) => {
      console.log(err);
      cb(null, 'errormessage');
    });

  }
};


function fetchTaskDetails(taskId) {
  return taskModel.findOne({_id: taskId});
}

function sendPushNotifications(driverArry, remaingArry, taskId, taskDetails, timeout, cb) {
  let expireTime = Number(timeout) * 1000;

  function AsyncFunction(driverDetails) {
    console.log('async', JSON.stringify(driverDetails));

    return notification.sendPushNotification(taskDetails, driverDetails.endArn, 4, timeout);

  }


  function sequential(arr, index = 0) {
    if (index >= arr.length) return Promise.resolve();
    console.log('index values', index);
    console.log('expireTime', expireTime);
    return AsyncFunction(arr[index])
      .then(r => {
        console.log('result0', r);
        setTimeout(() => {

          return taskModel.findOne({_id: taskId}).then((data) => {
            console.log(JSON.stringify(data));
            if (!_.isEmpty(data)) {
              data = data.toObject();
              console.log(data.name);
              console.log(data.taskStatus);
              if (data.taskStatus !== 1 && data.taskStatus !== 8 && data.taskStatus !== 7 && data.taskStatus !== 9) {
                console.log('taskStatus is changed');
                cb(null, 'errormessage');
              } else if (arr.length - 1 === index) {
                console.log('chack Remaing ArryExistorNot');
                checkRemaingArryExistorNot(remaingArry, taskId, taskDetails, cb)
              }
              else {
                console.log('taskStatus is not changed');
                return sequential(arr, index + 1);
              }
            }


          });
        }, expireTime);

      }).catch((error) => {
        console.log(error);
        cb(null, 'errormessage');
      });

  }


  sequential(driverArry).then(() => console.log("done")).catch((error) => {
    console.log(error);
    cb(null, 'errormessage');
  });
}


function checkRemaingArryExistorNot(reamingArry, taskId, taskDetails, cb) {

  if (reamingArry.length) {
    var aws = require('aws-sdk');
    var lambda = new aws.Lambda({
      region: 'ap-south-1' //change to your region
    });

    var params = {
      FunctionName: 'backGroundJob', // the lambda function we are going to invoke
      InvokeArgs: JSON.stringify({
        driverData: reamingArry,
        taskId: taskId,
        autoAllocation: taskDetails.settings.autoAllocation
      }),

    };

    new Promise((reslove, reject) => {
      lambda.invokeAsync(params, function (err, data) {
        if (err) {
          console.log(err, err.stack);
          reslove();
        } // an error occurred
        else {
          console.log(data);
          reslove();
        }       // successful response
      });
    })

  } else {
    //sending email to admin regarding auto allocation field......

    gettaskDetails(taskId).then((res) => {
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
      cb(null, 'errormessage');
      //process.exit(0)
    });
  }

}


function getadminDetails(adminId) {
  return userModel.find({cognitoSub: adminId})
}

function gettaskDetails(taskId) {
  return taskModel.find({_id: mongoose.Types.ObjectId(taskId)})
}
