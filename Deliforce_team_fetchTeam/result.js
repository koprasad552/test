const common = require('./error').CODES;
const task = require('./error').TASK_CODES;


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

  invalidEmail: (cb) => {
    cb(null, formResponse(common.EMAIL_INVALID, {message: 'invalid email'}));
  },

  invalidAddress: (cb) => {
    cb(null, formResponse(task.ADDRESS_INVALID, {message: 'invalid address'}));
  },

  invalidDate: (cb) => {
    cb(null, formResponse(task.DATE_REQUIRED, {message: 'invalid date'}));
  },

  lesserThanCurrentDate: (cb) => {
    cb(null, formResponse(task.START_LESSER_THAN_CURRENT, {message: ''}));
  },

  //not applicable for pickup & delivery
  endLesserThanStart: (cb) => {
    cb(null, formResponse(task.END_DATE_LESSER_START, {message: ''}));
  },
};

function formResponse(code, body) {
  const response = {headers: {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'}};
  const result = (typeof body === 'object') ? JSON.stringify(body) : body;
  return Object.assign(response, {statusCode: code, body: result});
}
