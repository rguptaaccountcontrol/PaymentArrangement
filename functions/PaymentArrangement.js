const axios = require('axios');
// This is your new function. To start, set the name and path on the left.

exports.handler = async function (context, event, callback) {
  try {
    let Listen = false;
    let Remember = {};
    let Collect = true;
    let Tasks = false;
    let Redirect = false;
    let Handoff = false;
    let Say = "";

    // Add your code here.  
    const Memory = JSON.parse(event.Memory);
    let AmountPay = 800.00;//755.55;//800.00; // Default Amount for testing
    if (Memory.AmountPay != undefined)
      AmountPay = Number(Memory.AmountPay).toFixed(2);
    //console.log("Memory.AmountPay "+Memory.AmountPay);
    console.log("AmountPay " + AmountPay);
    // Initialize Remember variables *********. 
    Remember.PaymentAmt = AmountPay;
    Remember.AgentTransfer = false;
    Remember.InstallmentPayment = 0.0;
    Remember.NP = 0;
    Remember.FP = 0.0;
    Remember.start_date = "";
    Remember.InstallmentStart_Date = "";
    Remember.Frequency = "";
    Remember.FACSFreq = "";
    Remember.LegalAnnounce = "";

    // **************************************** 
    Collect = {
      "name": "collect_Payment_Arrangement",
      "questions": [
        {
          "question": "How many payments are needed to make this affordable for you. We can set up an arrangement for a maximum of 6 payments to be payable weekly, bi-weekly or monthly. Say or type How many payments do you want to make.",
          "prefill": "NumberOfPayments",
          "name": "NumberOfPayments",
          "type": "Twilio.NUMBER",
          "voice_digits": {
            "num_digits": 1
          },
          "validate": {
            "allowed_values": {
              "list": ["1", "2", "3", "4", "5", "6"]
            },
            "on_failure": {
              "messages": [
                {
                  "say": "Sorry, that's not a valid number of Payments."
                },
                {
                  "say": "Hmm, I'm not understanding."
                }
              ],
              "repeat_question": true
            },
            "on_success": {
              "say": ""
            },
            "max_attempts": {
              "redirect": "task://AgentTransfer",
              "num_attempts": 3
            }
          }
        }

      ],
      "on_complete": {
        "redirect": "task://CalculateAnnouncePayment"
      }
    };


    //End of your code.

    // This callback is what is returned in response to this function being invoked.

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
    console.error(error);
    callback(error);
  }
};