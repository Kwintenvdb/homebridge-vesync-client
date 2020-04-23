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
class VesyncFan {
    constructor(deviceData) {
        this.name = deviceData.deviceName;
        this.mode = deviceData.mode;
        this.speed = deviceData.speed;
        this.uuid = deviceData.uuid;
        this.status = deviceData.deviceStatus;
    }
    getDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            // return post('131airPurifier/v1/device/deviceDetail', {
            //     json: {
            //         ...createBaseBody(),
            //         ...createAuthBody(client),
            //         ...createDetailsBody(),
            //         // 'method': 'configurations',
            //         'uuid': this.uuid
            //     }
            // }).json();
        });
    }
}
exports.VesyncFan = VesyncFan;
//# sourceMappingURL=vesyncFan.js.map