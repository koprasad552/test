const common = require('./error').CODES;
const task = require('./error').TASK_CODES;
const team = require('./error').TEAM_CODES;


module.exports = {

  sendServerError: (cb) => {
    cb(null, formResponse(common.SERVER_ERROR, {}));
  },

  sendSuccess: (cb, body) => {
    cb(null, formResponse(common.SUCCESS, body));
  },

  businessMissing: (cb) => {
    cb(null, formResponse(common.BUSINESS_TYPE_REQUIRED, {}));
  },

  sendResult: (statusCode, body, cb) => {
    cb(null, statusCode, body);
  },

  sendUnAuth: (cb) => {
    cb(null, formResponse(common.AUTH, {message: 'Unauthorized'}));
  },

  fromTrigger: (cb) => {
    console.log('fromTrigger');
    cb(null, formResponse(400, ''));
  },

  invalidInput: (cb) => {
    cb(null, formResponse(common.BAD_REQUEST, ''));
  },

  //app
  duplicateTeamName: (cb) => {
    cb(null, formResponse(team.DUPLICATE_TEAM_NAME, {message: 'Team already exists'}));
  },

  invalidTeamName: (cb) => {
    cb(null, formResponse(team.INVALID_TEAMNAME, ''));
  },
};

function formResponse(code, body) {
  const response = {headers: {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'}};
  const result = (typeof body === 'object') ? JSON.stringify(body) : body;
  return Object.assign(response, {statusCode: code, body: result});
}
