
exports.handler = async function (context, event, callback) {
    let Say = event.Say;
    let Listen = event.Listen;
    let Remember = event.Remember;
    let Collect = event.Collect;
    let Tasks = event.Task;
    let Redirect = event.Redirect;
    let Handoff = event.Handoff;

    let responseObject = {
        "actions": [

        ]
    };

    if (Say) {
        responseObject.actions.push(
            {
                "say": {
                    "speech": Say
                }
            }
        );
    }

    if (Listen) {
        if (Tasks) {
            responseObject.actions.push(
                {
                    "listen": {
                        "tasks": Tasks
                    }
                }
            );
        }
        else {
            responseObject.actions.push(
                {
                    "listen": true
                }
            );
        }
    }

    if (Remember) {
        responseObject.actions.push(
            {
                "remember": Remember
            }
        );
    }

    if (Collect) {
        responseObject.actions.push(
            {
                "collect": Collect
            }
        );
    }

    if (Redirect) {
        responseObject.actions.push(
            {
                "redirect": Redirect
            }
        );
    }

    if (Handoff) {
        if (Handoff.type === 1) {
            responseObject.actions.push(
                {
                    "handoff": {
                        "channel": "voice",
                        "uri": Handoff.twiml_url,
                        "method": "POST"
                    }
                }
            );
        } else if (Handoff.type === 2) {
            responseObject.actions.push(
                {
                    "handoff": {
                        "channel": "voice",
                        "uri": Handoff.task_router_url,
                        "wait_url": Handoff.wait_url,
                        "wait_url_method": Handoff.wait_url_method
                    }
                }
            );
        }
    }

    console.log(JSON.stringify(responseObject));
    // return twilio function response
    callback(null, responseObject);
}