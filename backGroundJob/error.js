module.exports = {
  //common
  CODES: {
    SERVER_ERROR: 500,
    AUTH: 403,
    BAD_REQUEST: 400,  // no body or query string if it is mandatory

    //fields
    EMAIL_INVALID: 406,
    PHONE_INVALID: 407,
    PASSWORD_INVALID: 408,
    NAME_INVALID: 409,
    INVALID_INPUT: 405,  // maximum dont use it
    BUSINESS_TYPE_REQUIRED: 412,
    SUCCESS: 200,

    //TRANSACTION
    TRANSACTION_FAILURE: 501 // backend loggig
  },

  //task
  TASK_CODES: {
    //fields
    ADDRESS_INVALID: 410,
    DATE_REQUIRED: 411,
    END_DATE_LESSER_START: 413,
    START_LESSER_THAN_CURRENT: 414,

  },

  //driver
  DRIVER_CODES: {
    TEAM_MANDATORY: 415
  },


  //manager
  MANAGER_CODES: {
    TEAM_MANDATORY: 416
  },

  //team
  TEAM_CODES: {
    DUPLICATE_TEAM_NAME: 417,
    INVALID_TEAMNAME: 418,
    //delete
    TEAM_HAS_DRIVER: 419
  },


  //settings
  SETTING_CODES: {}



  //customer


  //tasklog


  //preference


};
