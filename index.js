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
            headers: {
                // 'accept-language': 'en',
                'accountid': this.accountId,
                'appVersion': '2.5.1',
                'content-type': 'application/json',
                'tk': this.token,
                'tz': 'America/New_York',
                'user-agent': 'HomeBridge-Vesync'
            },
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
        console.log(response);
    }
}

async function init() {
    const client = new VesyncClient();
    await client.login(config.username, config.password);
    await client.getDevices();
}

init();
