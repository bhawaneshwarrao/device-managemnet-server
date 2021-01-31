module.exports.isCheckOutAllowed = (startTime, endTime) => {
  const currentDate = new Date();
  const currentTime = currentDate.getHours();
  if (currentTime > startTime && currentTime < endTime) {
    return true;
  }
  return false;
};
