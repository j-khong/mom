const MomError = require('./momError');
module.exports = class CliError extends MomError {
  constructor (message, action="") {
    super(message);
    this.action = action;
  }
};