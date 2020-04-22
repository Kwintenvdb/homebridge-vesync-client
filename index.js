const got = require('got');
const crypto = require('crypto');
const config = require('./config');

const request = got.extend({
    prefixUrl: 'https://smartapi.vesync.com',
    responseType: 'json'
});

const API_BASE_URL = 'https://smartapi.vesync.com';

function get(url, options) {
    return request(url, options);
}

function post(url, options) {
    return request.post(url, options);
}

function put(url, options) {
    return request.put(url, options);
}

class VesyncClient {
    constructor() {
        this.accountId = null;
        this.token = null;
    }

    async login(username, password) {
        console.log('login');

        const pwdHashed = crypto.createHash('md5').update(password).digest('hex');

        const response = await post('vold/user/login', {
            json: {
                'acceptLanguage': 'en',
                'appVersion': '2.5.1',
                'phoneBrand': 'SM N9005',
                'phoneOS': 'Android',
                'account': username,
                'password': pwdHashed,
                'devToken': '',
                'userType': 1,
                'method': 'login',
                'timeZone': 'America/New_York',
                'token': '',
                'traceId': Date.now()
            },
            responseType: 'json'
        }).json();

        this.accountId = response.accountID;
        this.token = response.tk;
        console.log(response);
        console.log(this.token);
    }

    async getDevices() {
        const req = post('cloud/v2/deviceManaged/devices', {
            headers: createHeaders(this),
            json: {
                'acceptLanguage': 'en',
                'accountID': this.accountId,
                'appVersion': '1.1',
                'method': 'devices',
                'pageNo': 1,
                'pageSize': 1000,
                'phoneBrand': 'HomeBridge-Vesync',
                'phoneOS': 'HomeBridge-Vesync',
                'timeZone': 'America/Chicago',
                'token': this.token,
                'traceId': Date.now(),
            }
        });
        const response = await req.json();
        // response.result.list
        const list = response.result.list;
        const fans = list.map(it => new VesyncFan(it));
        return { fans };
    }
}

const client = new VesyncClient();

class VesyncFan {
    constructor(deviceData) {
        this.name = deviceData.deviceName;
        this.mode = deviceData.mode;
        this.speed = deviceData.speed;
        this.uuid = deviceData.uuid;
        this.status = deviceData.deviceStatus;
    }
}

function createHeaders(client) {
    return {
        'accept-language': 'en',
        'accountid': client.accountId,
        'appVersion': '2.5.1',
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

// power = 'on' or 'off'
function setFanPower(fan, power) {
    return put('131airPurifier/v1/device/deviceStatus', {
        headers: createHeaders(client),
        json: {
            ...createBaseBody(),
            ...createAuthBody(client),
            'uuid': fan.uuid,
            'status': power
        }
    });
}

// speed = 1, 2, 3
function setFanSpeed(fan, speed) {
    return put('131airPurifier/v1/device/updateSpeed', {
        headers: createHeaders(client),
        json: {
            ...createBaseBody(),
            ...createAuthBody(client),
            'uuid': fan.uuid,
            'level': speed
        }
    });
}

// mode = manual, auto, sleep
function setFanMode(fan, mode) {
    const body = {
        ...createBaseBody(),
        ...createAuthBody(client),
        'uuid': fan.uuid,
        'mode': mode
    };
    if (mode === 'manual') {
        body['level'] = 1;
    }
    return put('131airPurifier/v1/device/updateMode', {
        headers: createHeaders(client),
        json: body
    });
}

async function init() {
    await client.login(config.username, config.password);
    const { fans } = await client.getDevices();
    fans.forEach(async fan => {
        await setFanPower(fan, 'on');
        await setFanSpeed(fan, 3);
        await setFanMode(fan, 'sleep');
        // console.log(result);
    });
}

init();
