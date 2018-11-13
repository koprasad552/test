const result = require('./result');
const teamModel = require('./model');
const helper = require('./util');
const constant = require('./constant')();
const isIt = constant.isIt;

module.exports = {
  checkDuplicate: (event, cb, principals) => {
    const clientId = (helper.isAdmin(principals)) ? principals['sub'] : principals['clientId'];
    console.log('------------------- valid credentials-------------------')
    const data = helper.getBodyData(event);
    if (!data) {
      result.invalidInput(cb);
    }
    console.log(data);
    var query = {};
    if (data._id) {
      query = {teamName: data.teamName, clientId: clientId, _id: {$ne: data._id}}
    }
    else {
      query = {clientId: clientId, teamName: data.teamName}
    }
    Object.assign(query, {isDeleted: isIt.NO});
    teamModel.find(query).exec((err, team) => {
      console.log('finding a team');
      if (err) {
        result.sendServerError(cb);
      } else if (team.length) {
        console.log(JSON.stringify(team));
        result.duplicateTeamName(cb);
      } else {
        upsertTeam(data, clientId, cb);
      }
    });
  }
};

function generateRandam() {
  return Math.floor(Math.random() * 9000) + 1000;
}

function upsertTeam(data, clientId, cb) {
  let promise;
  if (data._id) {
    const id = data._id;
    delete data._id;
    // delete data._v;
    promise = teamModel.update({clientId: clientId, _id: id}, {$set: data});
  } else {
    const newTeam = new teamModel(data);
    newTeam.clientId = clientId;
    newTeam.teamId = generateRandam();
    promise = newTeam.save();
  }
  promise.then((data) => {
    result.sendSuccess(cb, data);
  }).catch((error) => {
    console.log(error);
    handlerError(error, cb)
  });
}


function handlerError(err, cb) {
  if (err.teamName) {
    result.invalidTeamName(cb);
  } else {
    result.sendServerError(cb);
  }
}

