import got from 'got';
import * as crypto from 'crypto';
import { VesyncFan } from '../fan/vesyncFan';

const request = got.extend({
    prefixUrl: 'https://smartapi.vesync.com',
    responseType: 'json'
});

export function createBaseBody() {
    return {
        'acceptLanguage': 'en',
        'timeZone': 'America/Chicago'
    };
}

export function createAuthBody(client) {
    return {
        'accountID': client.accountId,
        'token': client.token
    };
}

export class VesyncClient {
    private accountId: string = null;
    private token: string = null;

    post(url, options) {
        return request.post(url, options);
    }

    put(url, body) {
        const headers = this.createHeaders();
        const options = {
            headers,
            json: {
                ...createBaseBody(),
                ...createAuthBody(this),
                ...body
            }
        };
        return request.put(url, options);
    }

    createHeaders() {
        return {
            'accept-language': 'en',
            'accountid': this.accountId,
            'appversion': '2.5.1',
            'content-type': 'application/json',
            'tk': this.token,
            'tz': 'America/New_York',
            'user-agent': 'HomeBridge-Vesync'
        }
    }

    async login(username, password) {
        const pwdHashed = crypto.createHash('md5').update(password).digest('hex');
        const response: any = await this.post('cloud/v1/user/login', {
            json: {
                'acceptLanguage': 'en',
                'appVersion': '2.5.1',
                'phoneBrand': 'SM N9005',
                'phoneOS': 'Android',
                'email': username,
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

        if (!response || !response.result) {
            throw new Error('Invalid login response from Vesync API.');
        }

        const result = response.result;
        this.accountId = result.accountID;
        this.token = result.token;
    }

    async getDevices(): Promise<VesyncFan[]> {
        const req = this.post('cloud/v2/deviceManaged/devices', {
            headers: this.createHeaders(),
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
        const response: any = await req.json();
        const list = response.result.list;
        const fans = list.map(it => new VesyncFan(it));
        return fans;
    }
}
