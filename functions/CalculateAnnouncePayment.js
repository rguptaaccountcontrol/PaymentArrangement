const axios = require('axios');
// This is your new function. To start, set the name and path on the left.

exports.handler = async function (context, event, callback) {
  console.log('CalculateAnnouncePayment');
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
    if (NP == 1) {
      FP = TotalPayment;
      NP = 0; // because there is only first payment .
    }
    else {
      InstallmentPayment = TotalPayment / NP;
      InstallmentPayment = InstallmentPayment.toFixed(2);
      console.log(InstallmentPayment);
      Remainder = (TotalPayment - (InstallmentPayment * NP));
      Remainder = Remainder.toFixed(2);
      console.log("Remainder: " + Remainder);
      console.log(InstallmentPayment * NP);
    }

    console.log(TotalPayment);
    if (Remainder != 0) {
      console.log(InstallmentPayment);
      FP = (Number(InstallmentPayment) + Number(Remainder)).toFixed(2);
      NP = NP - 1;
      switch (NP) {

        case '2':
          Say = "Your first payment will be $" + FP + ".  And the next payment will be $" + InstallmentPayment + ".";
          break;
        default:
          Say = "Your first payment will be $" + FP + ".  And the other " + (NP) + " payment will be $" + InstallmentPayment + ".";
          break;
      }
    }
    else {
      console.log("NPSwitch: " + NP);
      switch (NP) {

        case 0:
          Say = "Your payment will be of $" + FP + ".";
          console.log(Say);
          break;

        default:
          Say = "Your " + NP + " payments will be of $" + InstallmentPayment + " each.";
          console.log(Say);
          break;
      }

    }

    Remember.NP = NP;
    Remember.FP = FP;
    Remember.InstallmentPayment = InstallmentPayment;

    //let RedirectURL="";
    // if(NP==1)
    // {
    //   RedirectURL="https://paymentarrangement-5311.twil.io/GetStartDate";
    // }
    // else
    // {
    //   RedirectURL="https://paymentarrangement-5311.twil.io/PaymentFrequency";
    // }
    Collect = {
      "name": "collect_Payment_Arrangement",
      "questions": [

        {
          "question": ", , ,If this payment plan is affordable then say YES , if you want to change the number of payments, say change",
          "name": "IsAffordable",
          "validate": {
            "allowed_values": {
              "list": ["change", "ok", "yes", "okay", "Okay.", "Yes."]
            },
            "on_failure": {
              "messages": [
                {
                  "say": "Sorry, that's not a valid answers."
                },
                {
                  "say": "Hmm, I'm not understanding."
                }
              ],
              "repeat_question": true
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
          "uri": "https://paymentarrangement-5311.twil.io/PaymentFrequency"
        }
      }
    };



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