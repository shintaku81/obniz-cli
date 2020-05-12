"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const host = "https://obniz.io";
// const host = "http://localhost:3000";
function registrate(device, pubkey) {
    return new Promise((resolve, reject) => {
        const options = {
            url: host + "/obniz/registrate",
            headers: {
                "simplekey": "456F2F9C973C847BD4B33FDACC1E1921572884663CDABFC906EA5D4AE53711",
                "obniz-device-identity": device,
            },
            form: {
                pubkey,
            },
        };
        request.post(options, (error, response, body) => {
            if (error) {
                reject(error);
                return;
            }
            if (body.indexOf("id=") === 0) {
                resolve(body.replace("id=", ""));
            }
            else {
                reject(new Error(`no id found from [${body}]`));
            }
            resolve();
        });
    });
}
exports.registrate = registrate;
