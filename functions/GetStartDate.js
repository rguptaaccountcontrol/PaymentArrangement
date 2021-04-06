const axios = require('axios');
// This is your new function. To start, set the name and path on the left.

exports.handler =async function(context, event, callback) {
 console.log('GetStartDate');
  try {
	let Listen = false;
  let Remember = {};
  let Collect = true;
  let Tasks = false;
  let Redirect = false;
  let Handoff = false;
  let Say = "";
  
  const Memory = JSON.parse(event.Memory); 
  let NP=Memory.NP;
  let Freq="";
  if(NP==0)
  {
    Remember.Frequency="single-payment";
    Freq="single-payment";
  }
  else
  {
    Remember.Frequency=Memory.twilio.collected_data.collect_Payment_Arrangement.answers.Frequency.answer;
     Freq = Memory.twilio.collected_data.collect_Payment_Arrangement.answers.Frequency.answer;
  }
  
  //////////////////////
  // set the frequency code for what is used on FACS
  switch (Freq){
        case 'single-payment': 
        Remember.FACSFreq="POI";        
        break;
        case 'weekly':
        Remember.FACSFreq="WEK";       
        break;
        case 'bi-weekly':
        Remember.FACSFreq="BWK";          
        break;
        
        case 'biweekly': 
        Remember.FACSFreq="BWK";      
        break;
        
        case 'monthly': 
        Remember.FACSFreq="DOM";        
        break;
        
      }
  
  if(NP==1) // we go singal payment if the number of payment (NP) is 1
    Remember.FACSFreq="POI";
  
  //////////////////////
  let TotalPayment=Number(Memory.PaymentAmt).toFixed(2);
   NP=Memory.NP;
  console.log(NP);
  let FP=Memory.FP;
  let InstallmentPayment=Memory.InstallmentPayment;
  console.log(InstallmentPayment);
  let ques="";
  let IsAffordable="";
  if (NP==1)
  {
    ques="if you can make the payment today say today otherwise say the date when you want to make the payment";
  }
  else
  {  
    ques="if you can make the first payment today say today otherwise say the date when you want to make the first payment";  
   
  }
  IsAffordable=Memory.twilio.collected_data.collect_Payment_Arrangement.answers.IsAffordable.answer;
  console.log("IsAffordable"+IsAffordable);
  Collect= {
								"name": "collect_Payment_Arrangement",
								"questions": [
												{
                        "question": ques,
                        "name": "start_date",
                        "type": "Twilio.DATE",
                        "validate": {
                          "on_failure": {
                            "messages": [
                              {
                                "say": "Sorry, that's not a valid date. It should be within 30 days of today's date."
                              },
                              {
                                "say": "Hmm, I'm not understanding. It should be within 30 days of today's date."
                              }
                            ],
                            "repeat_question": true
                          },
                          "webhook": {
                                "url":"https://paymentarrangement-1122-dev.twil.io/validate_start_date",
                                "method":"POST"
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
								"redirect": 	 "task://PaymentPlanAnnounce"
												}
							};  

  
 
  
    let requestObj= {
      Say: Say,
      Listen:Listen,
      Remember:Remember,
      Collect:Collect,
      Tasks:Tasks,
      Redirect:Redirect,
      Handoff:Handoff,
      callback:callback
    };
  
  let API_responseBuilder = context.fnURL + 'responseBuilder';
  console.log(API_responseBuilder);
 let responseObj = await axios.post(API_responseBuilder, requestObj, {headers: { 'Content-Type': 'application/json'}});
 //console.log(JSON.stringify(responseObj));
  callback(null, responseObj.data);
  } catch (error) {
    console.log("error found") ;
  console.error(error.message);    
  callback( error);
}
};
