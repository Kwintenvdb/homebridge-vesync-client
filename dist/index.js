"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const config = require('./config');
const fanController_1 = require("./fan/fanController");
const client_1 = require("./api/client");
const client = new client_1.VesyncClient();
function createHeaders(client) {
    return {
        'accept-language': 'en',
        'accountid': client.accountId,
        'appversion': '2.5.1',
        'content-type': 'application/json',
        'tk': client.token,
        'tz': 'America/New_York',
        'user-agent': 'HomeBridge-Vesync'
    };
}
function createBaseBody() {
    return {
        'acceptLanguage': 'en',
        'timeZone': 'America/Chicago'
    };
}
function createAuthBody(client) {
    return {
        'accountID': client.accountId,
        'token': client.token
    };
}
function createDetailsBody() {
    return {
        'appVersion': 'V2.9.35 build3',
        'phoneBrand': 'HomeBridge-Vesync',
        'phoneOS': 'HomeBridge-Vesync',
        'traceId': Date.now()
    };
}
// power = 'on' or 'off'
// function setFanPower(fan, power) {
//     return put('131airPurifier/v1/device/deviceStatus', {
//         headers: createHeaders(client),
//         json: {
//             ...createBaseBody(),
//             ...createAuthBody(client),
//             'uuid': fan.uuid,
//             'status': power
//         }
//     });
// }
// speed = 1, 2, 3
// function setFanSpeed(fan, speed) {
//     return put('cloud/v1/deviceManaged/airPurifierSpeedCtl', {
//         headers: createHeaders(client),
//         json: {
//             ...createBaseBody(),
//             ...createAuthBody(client),
//             ...createDetailsBody(),
//             'method': 'airPurifierSpeedCtl',
//             'uuid': fan.uuid,
//             'level': speed
//         }
//     });
// }
// mode = manual, auto, sleep
// function setFanMode(fan, mode) {
//     const body = {
//         ...createBaseBody(),
//         ...createAuthBody(client),
//         'uuid': fan.uuid,
//         'mode': mode
//     };
//     if (mode === 'manual') {
//         body['level'] = 1;
//     }
//     return put('131airPurifier/v1/device/updateMode', {
//         headers: createHeaders(client),
//         json: body
//     });
// }
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.login(config.username, config.password);
        const { fans } = yield client.getDevices();
        fans.forEach((fan) => __awaiter(this, void 0, void 0, function* () {
            try {
                const controller = new fanController_1.FanController(fan, client);
                controller.setPower('off');
                // const details = await fan.getDetails();
                // await setFanPower(fan, 'on');
                // const result = await setFanSpeed(fan, 3).json();
                // console.log(result);
                // await setFanMode(fan, 'sleep');
            }
            catch (e) {
                console.log(e);
            }
        }));
    });
}
init();
//# sourceMappingURL=index.js.map