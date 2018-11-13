const result = require('./result');
const teamModel = require('./model');
const helper = require('./util');
const constant = require('./constant')();
const isIt = constant.isIt;
const objectID = require('mongoose').Types.ObjectId;

module.exports = {

  getAllTeams: (event, cb, principals) => {
    const isAdmin = helper.isAdmin(principals);
    const clientId = (isAdmin) ? principals['sub'] : principals['clientId'];
    if (!clientId) {
      result.sendUnAuth(cb);
      return;
    }

    const query = formAuth();
    if(query) {
      teamModel.find(query, function (err, teams) {
        console.log(err, teams);
        if (err) {
          result.sendServerError(cb);
        } else {
          result.sendSuccess(cb, teams);
        }
      });
    }else{
      result.sendServerError(cb);
    }


    function formAuth() {
      const query = {clientId: clientId , isDeleted:isIt.NO};
      if (isAdmin) {
        return query;
      } else {
        const teams = principals.teams.map((t) => objectID(t));
        if(!teams.length){
          console.log('manager has no teams');
          return false;
        }
        return Object.assign({}, query, {_id: {$in: teams}});
      }
    }
  }
};




