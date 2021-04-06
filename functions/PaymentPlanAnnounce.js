const axios = require('axios');
// This is your new function. To start, set the name and path on the left.

exports.handler = async function (context, event, callback) {
  console.log('PaymentPlanAnnounce');
  try {
    let Listen = false;
    let Remember = {};
    let Collect = false;
    let Tasks = false;
    let Redirect = false;
    let Handoff = false;
    let Say = "";

    const Memory = JSON.parse(event.Memory);
    var dateFormat = require('dateformat');
    let TotalPayment = Number(Memory.PaymentAmt).toFixed(2);
    let NP = Memory.NP;
    let FP = Memory.FP;
    let InstallmentPayment = Memory.InstallmentPayment;
    let start_date = Memory.twilio.collected_data.collect_Payment_Arrangement.answers.start_date.answer;
    let Frequency = "";
    let InstallmentStart_Date = "";
    let LegalSay = "";
    let iFreq = 0;

    if (NP == 0) {
      Frequency = "";
    }
    else {
      Frequency = Memory.twilio.collected_data.collect_Payment_Arrangement.answers.Frequency.answer;
    }
    Remember.Frequency = Frequency;
    Remember.start_date = start_date;

    console.log('start_date:' + start_date);
    console.log('InstallmentPayment: ' + InstallmentPayment);
    console.log(FP);

    /////////////////////// Calculate installment_date

    if (NP == 0)  // if NP is 0 or first payment is 0 then installment start date is the same start date 
    {
      Remember.InstallmentStart_Date = start_date;
    }
    else {
      // Remember.NP=NP-1;
      //start_date=dateFormat(start_date, "yyyy-mm-dd");
      InstallmentStart_Date = new Date(start_date);

      console.log("Frequency_case: " + Frequency);
      switch (Frequency) {
        case 'weekly':
          InstallmentStart_Date.setDate(InstallmentStart_Date.getDate() + 7);
          iFreq = 7;
          break;

        case 'bi-weekly':
          InstallmentStart_Date.setDate(InstallmentStart_Date.getDate() + 14);
          iFreq = 14;
          break;

        case 'biweekly':
          InstallmentStart_Date.setDate(InstallmentStart_Date.getDate() + 14);
          iFreq = 14;
          break;

        case 'monthly':
          console.log('monthly');
          InstallmentStart_Date.setMonth(InstallmentStart_Date.getMonth() + 1);
          iFreq = 30;
          break;

      }

      if (Number(FP) == 0)
        InstallmentStart_Date = new Date(start_date);

      InstallmentStart_Date = dateFormat(InstallmentStart_Date, "yyyy-mm-dd");
      Remember.InstallmentStart_Date = InstallmentStart_Date;
    }
    /////////////////// End of Calculate installment_date

    // new line
    //let LegalDates="";  
    let SetLegalDates = "";
    let LegalPC = "";
    let CNT = NP;
    let INC_iFreq = 0;
    let DT = new Date(start_date);

    if (Number(FP) == 0)
      CNT = CNT - 1; // if there is no first payment then we need to loop one less

    for (let i = 1; i <= CNT; i++) {

      INC_iFreq = iFreq;
      console.log("iFreq: " + iFreq);
      if (iFreq == 30) {
        DT.setMonth(DT.getMonth() + 1); // Change the logic to add a month instead of 30 days
        console.log("IFDT: " + DT);
      }
      else {
        DT.setDate(DT.getDate() + Number(INC_iFreq));
        console.log("ElseDT: " + DT);
      }

      SetLegalDates = dateFormat(DT, "mmmm-d");
      console.log(SetLegalDates);
      if (Number(FP) == 0)
        LegalPC = LegalPC + ", and, " + SetLegalDates;
      else {
        if (i == 1)
          LegalPC = LegalPC + " on " + SetLegalDates;
        else
          LegalPC = LegalPC + ", and, " + SetLegalDates;
      }

    }

    //end
    console.log(LegalPC);
    console.log("reaching fp");
    if (NP == 0) {
      console.log("NP = 0");
      LegalSay = "Your payment of $" + FP + " will be made on " + dateFormat(start_date, "yyyy-mmmm-d") + ", ";
      Say = LegalSay;
    }
    else if (NP == 1) {
      let Amt = 0.0;
      if (Number(FP) == 0)
        Amt = InstallmentPayment;
      else
        Amt = FP;
      console.log("NP = 1");
      LegalSay = "Your payment plan is to pay $" + Amt + " on " + dateFormat(start_date, "yyyy-mmmm-d") + ", and next payment of $" + InstallmentPayment + " on " + InstallmentStart_Date + ", ";
      Say = LegalSay;

    }
    else if (Number(NP >= 2)) {
      if (Number(FP) == 0) {
        LegalSay = "Your payment plan is to pay $" + InstallmentPayment + " on " + dateFormat(start_date, "yyyy-mmmm-d") + ", " + LegalPC;
        Say = "Your payment plan is to pay $" + InstallmentPayment + " starting " + dateFormat(start_date, "yyyy-mmmm-d") + " in " + NP + " " + Frequency + " payments. ";
        console.log(LegalSay);
      }
      else {
        LegalSay = "Your payment plan is to pay $" + FP + " starting " + dateFormat(start_date, "yyyy-mmmm-d") + ", and $" + InstallmentPayment + ", " + LegalPC;
        Say = "Your payment plan is to pay $" + FP + " starting " + dateFormat(start_date, "yyyy-mmmm-d") + " and Subsequent " + (NP) + " " + Frequency + " payments of $" + InstallmentPayment + ".";
        console.log(LegalSay);
      }
    }
    Remember.LegalAnnounce = LegalSay;

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