const axios = require('axios');
// This is your new function. To start, set the name and path on the left.

exports.handler = async function (context, event, callback) {
  console.log("validate_startDate");

  try {


    var dateFormat = require('dateformat');
    let memory = JSON.parse(event.Memory);

    var currentDate = new Date();
    currentDate = dateFormat(currentDate, "yyyy-mm-dd");
    var datetime = new Date();
    var FutureDate = datetime.setDate(datetime.getDate() + 30);
    FutureDate = dateFormat(FutureDate, "yyyy-mm-dd");
    console.log(FutureDate);
    var StartDate = event.ValidateFieldAnswer;
    console.log("ValidateFieldAnswer: " + StartDate);


    let validAnswer = false;
    console.log(StartDate);
    console.log(currentDate);
    console.log(FutureDate);

    if (StartDate >= currentDate && StartDate <= FutureDate) {
      validAnswer = true;
    }

    let response = {
      valid: validAnswer
    };

    callback(null, response);
  } catch (error) {
    console.log("error found");
    console.error(error.message);
    callback(error);
  }
};