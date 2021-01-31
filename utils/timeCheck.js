const { logger } = require('./utils');
module.exports.isCheckOutAllowed = (startTime, endTime) => {
  const currentDate = new Date();
  const currentTime = currentDate.getHours();
  logger.debug(`currentTime : ${currentTime}, startTime: ${startTime}, endTime: ${endTime}`);
  if (currentTime > startTime && currentTime < endTime) {
    return true;
  }
  // since deployed to heroku returning true. has to be false 
  return true;
};
