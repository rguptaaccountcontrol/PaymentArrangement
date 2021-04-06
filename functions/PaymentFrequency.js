const axios = require('axios');
// This is your new function. To start, set the name and path on the left.

exports.handler = async function (context, event, callback) {
  console.log('PaymentFrequency');
  try {
    let Listen = false;
    let Remember = {};
    let Collect = true;
    let Tasks = false;
    let Redirect = false;
    let Handoff = false;
    let Say = "";

    const Memory = JSON.parse(event.Memory);

    // Add your code here.  
    let TotalPayment = Number(Memory.PaymentAmt).toFixed(2);
    console.log('TotalPayment ' + TotalPayment);
    let NP = Memory.twilio.collected_data.collect_Payment_Arrangement.answers.NumberOfPayments.answer;
    console.log(NP);
    let InstallmentPayment = 0.0;
    let Remainder = 0.0;
    let FP = 0.0;
    let IsAffordable = Memory.twilio.collected_data.collect_Payment_Arrangement.answers.IsAffordable.answer;
    Remember.IsAffordable;
    if (NP == 1) {
      Redirect = {
        //"redirect": {
        "method": "POST",
        "uri": "https://paymentarrangement-5311.twil.io/GetStartDate"
      }
      //}
      Collect = false;
    }
    else {

      Collect = {
        "name": "collect_Payment_Arrangement",
        "questions": [
          {
            "question": "Do you want to pay weekly, bi-weekly or monthly. Say weekly or press 1. Say bi-weekly or press 2. Say monthly or press 3.",
            "name": "Frequency",
            "voice_digits": {
              "mapping": {
                "1": "weekly",
                "2": "bi-weekly",
                "3": "monthly"
              },
              "finish_on_key": "#",
              "num_digits": 1
            },
            "validate": {
              "allowed_values": {
                "list": ["weekly", "biweekly", "bi-weekly", "monthly"]
              },
              "on_failure": {
                "messages": [
                  {
                    "say": "Sorry, that's not a valid Payment Frequency."
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
          "redirect": {
            "method": "POST",
            "uri": "https://paymentarrangement-5311.twil.io/GetStartDate"
          }
        }
      };
    }


    if (IsAffordable == "change") // change Number of payments if user wants to change the NP,
    {
      Redirect = "task://PaymentArrangement";
      Collect = false;
    }

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
    console.log(JSON.stringify(responseObj.data));
    console.log(responseObj);
    callback(null, responseObj.data);
  } catch (error) {
    console.log("error found");
    console.error(error.message);
    callback(error);
  }
};