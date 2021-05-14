import { VesyncFan } from './vesyncFan';
import { createAuthBody, createBaseBody, VesyncClient } from '../api/client';
import { FanDetails, FanSpeed } from './fanDetails';

function createDetailsBody() {
    return {
        'appVersion': 'V2.9.35 build3',
        'phoneBrand': 'HomeBridge-Vesync',
        'phoneOS': 'HomeBridge-Vesync',
        'traceId': Date.now()
    };
}

export class FanController {
    private details: FanDetails | any = {};

    constructor(
        private readonly fan: VesyncFan,
        private readonly client: VesyncClient
    ) {
        this.initialize();
    }

    private async initialize() {
        this.details = await this.getDetails();
    }

    setPower(on: boolean) {
        // this.details = on;
        const power = on ? 'on' : 'off';
        this.details.deviceStatus = power;
        this.client.put('131airPurifier/v1/device/deviceStatus', {
            'uuid': this.fan.uuid,
            'status': power
        });
    }

    isOn(): boolean {
        return this.details.deviceStatus === 'on';
    }

    getDetails(): Promise<FanDetails> {
        return this.client.post('131airPurifier/v1/device/deviceDetail', {
            headers: {
                ...this.client.createHeaders()
            },
            json: {
                ...createBaseBody(),
                ...createAuthBody(this.client),
                ...createDetailsBody(),
                'uuid': this.fan.uuid
            }
        }).json();
    }

    setFanSpeed(speed: FanSpeed) {
        this.details.level = speed;
        return this.client.put('131airPurifier/v1/device/updateSpeed', {
            'uuid': this.fan.uuid,
            'level': speed
        });
    }

    getFanSpeed(): FanSpeed {
        return this.details.level;
    }
}
