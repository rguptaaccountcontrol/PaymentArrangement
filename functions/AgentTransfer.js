const axios = require('axios');
// This is your new function. To start, set the name and path on the left.

exports.handler = async function (context, event, callback) {
  try {
    let Listen = false;
    let Remember = {};
    let Collect = false;
    let Tasks = false;
    let Redirect = false;
    let Handoff = false;
    let Say = "";

    // Add your code here.  
    // Initialize Remember variables *********. 
    console.log("AgentTransfer");
    Remember.AgentTransfer = true;
    Say = "You will be transferred to an agent.";
    let requestObj = {
      Say: Say,
      Listen: Listen,
      Remember: Remember,
      Collect: Collect,
      Tasks: Tasks,
      Redirect: Redirect,
      Handoff: Handoff,
      callback: callback
    };
    let API_responseBuilder = context.fnURL + 'responseBuilder';
    console.log(API_responseBuilder);
    let responseObj = await axios.post(API_responseBuilder, requestObj, { headers: { 'Content-Type': 'application/json' } });
    //console.log(JSON.stringify(responseObj));
    callback(null, responseObj.data);
  } catch (error) {
    console.log("error found");
    console.error(error.message);
    callback(error);
  }
};
