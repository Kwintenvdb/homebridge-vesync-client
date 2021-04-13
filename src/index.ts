// const config = require('./config');

import {
    API,
    AccessoryPlugin,
    Logging,
    Service,
    CharacteristicEventTypes,
    CharacteristicGetCallback
} from 'homebridge';



import { FanController } from './fan/fanController';
import { VesyncClient } from './api/client';

const client = new VesyncClient();

// function createHeaders(client) {
//     return {
//         'accept-language': 'en',
//         'accountid': client.accountId,
//         'appversion': '2.5.1',
//         'content-type': 'application/json',
//         'tk': client.token,
//         'tz': 'America/New_York',
//         'user-agent': 'HomeBridge-Vesync'
//     }
// }

// function createBaseBody() {
//     return {
//         'acceptLanguage': 'en',
//         'timeZone': 'America/Chicago'
//     };
// }

// function createAuthBody(client) {
//     return {
//         'accountID': client.accountId,
//         'token': client.token
//     };
// }

// function createDetailsBody() {
//     return {
//         'appVersion': 'V2.9.35 build3',
//         'phoneBrand': 'HomeBridge-Vesync',
//         'phoneOS': 'HomeBridge-Vesync',
//         'traceId': Date.now()
//     };
// }

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

// async function init() {
//     await client.login(config.username, config.password);
//     const { fans } = await client.getDevices();
//     fans.forEach(async fan => {
//         try {
//             const controller = new FanController(fan, client);
//             controller.setPower('off');
//             // const details = await fan.getDetails();
//             // await setFanPower(fan, 'on');
//             // const result = await setFanSpeed(fan, 3).json();
//             // console.log(result);
//             // await setFanMode(fan, 'sleep');
//         } catch (e) {
//             console.log(e);
//         }
//     });
// }

// init();

class VesyncPlatform implements AccessoryPlugin {
    private readonly airPurifierService: Service;
    private readonly airQualityService: Service;
    // private readonly filterMaintenanceService: Service;

    constructor(private readonly log: Logging, config: any, private readonly api: API) {
        this.log.error(config);
        const hap = this.api.hap;
        this.airPurifierService = new hap.Service.AirPurifier('my purifier');
        // this.airPurifierService.addCharacteristic(Characteristic.FilterLifeLevel);
        this.airPurifierService.getCharacteristic(hap.Characteristic.FilterLifeLevel)
            .on(CharacteristicEventTypes.GET, (callback: CharacteristicGetCallback) => {
                log.info('getting filter life level...');
                callback(null, 50);
            });

        // this.airPurifierService.getCharacteristic(hap.Characteristic.On)
        // .onGet(() => hap.Characteristic.On.)
        this.airPurifierService.getCharacteristic(hap.Characteristic.Active)
            .onGet(() => {
                log.info('getting active state...');
                return hap.Characteristic.Active.ACTIVE;
                // @ts-ignore
                // callback(null, Characteristic.Active.ACTIVE);
            })
        // this.airPurifierService.getCharacteristic(hap.Characteristic.CurrentAirPurifierState)
        //     .on(CharacteristicEventTypes.GET, (callback: CharacteristicGetCallback) => {
        //         log.info('getting current state...');
        //         // @ts-ignore
        //         callback(null, Characteristic.CurrentAirPurifierState.IDLE);
        //     });

        this.airPurifierService.getCharacteristic(hap.Characteristic.RotationSpeed)
            .setProps({ minStep: 30 })
            .on(CharacteristicEventTypes.GET, (callback: CharacteristicGetCallback) => {
                log.info('getting rotation speed...');
                callback(null, 20);
            });

        this.airQualityService = new hap.Service.AirQualitySensor();
        this.airQualityService.getCharacteristic(hap.Characteristic.AirQuality)
            .on(CharacteristicEventTypes.GET, (callback: CharacteristicGetCallback) => {
                log.info('getting air quality...');
                callback(null, hap.Characteristic.AirQuality.POOR);
            });

        log.error('init class xxxxxxxxxx');
    }

    identify() {
        console.log('identify');
        this.log.error('identify');
    }

    getServices(): Service[] {
        this.log.error('get service');
        return [
            this.airPurifierService,
            this.airQualityService//,
            // this.filterMaintenanceService
        ];
    }
}

const PLUGIN_NAME = 'homebridge-vesync-client';
const PLATFORM_NAME = 'VeSync';

export = (homebridge: API) => {
    homebridge.registerAccessory(PLUGIN_NAME, PLATFORM_NAME, VesyncPlatform);
    // homebridge.registerPlatform(PLUGIN_NAME, PLATFORM_NAME, VesyncPlatform);
    // homebridge.registerPlatform('homebridge-vesync-client', 'VeSync', VesyncPlatform, true);
    // console.log(Service);
}
