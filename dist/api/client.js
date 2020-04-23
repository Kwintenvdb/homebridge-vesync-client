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
const got_1 = require("got");
const crypto = require("crypto");
const vesyncFan_1 = require("../fan/vesyncFan");
const request = got_1.default.extend({
    prefixUrl: 'https://smartapi.vesync.com',
    responseType: 'json'
});
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
class VesyncClient {
    constructor() {
        this.accountId = null;
        this.token = null;
    }
    post(url, options) {
        return request.post(url, options);
    }
    put(url, body) {
        const headers = this.createHeaders();
        const options = {
            headers,
            json: Object.assign(Object.assign(Object.assign({}, createBaseBody()), createAuthBody(this)), body)
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
        };
    }
    login(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('login');
            const pwdHashed = crypto.createHash('md5').update(password).digest('hex');
            const response = yield this.post('vold/user/login', {
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
        });
    }
    getDevices() {
        return __awaiter(this, void 0, void 0, function* () {
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
            const response = yield req.json();
            // response.result.list
            const list = response.result.list;
            const fans = list.map(it => new vesyncFan_1.VesyncFan(it));
            return { fans };
        });
    }
}
exports.VesyncClient = VesyncClient;
//# sourceMappingURL=client.js.map