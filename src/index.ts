const config = require('./config');

import { FanController } from './fan/fanController';
import { VesyncClient } from './api/client';

const client = new VesyncClient();

function createHeaders(client) {
    return {
        'accept-language': 'en',
        'accountid': client.accountId,
        'appversion': '2.5.1',
        'content-type': 'application/json',
        'tk': client.token,
        'tz': 'America/New_York',
        'user-agent': 'HomeBridge-Vesync'
    }
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

async function init() {
    await client.login(config.username, config.password);
    const { fans } = await client.getDevices();
    fans.forEach(async fan => {
        try {
            const controller = new FanController(fan, client);
            controller.setPower('off');
            // const details = await fan.getDetails();
            // await setFanPower(fan, 'on');
            // const result = await setFanSpeed(fan, 3).json();
            // console.log(result);
            // await setFanMode(fan, 'sleep');
        } catch (e) {
            console.log(e);
        }
    });
}

init();
