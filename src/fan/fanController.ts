import { VesyncFan } from './vesyncFan';
import { VesyncClient } from '../api/client';

export class FanController {
    private on: boolean;

    constructor(
        private readonly fan: VesyncFan,
        private readonly client: VesyncClient
    ) {
    }

    setPower(on: boolean) {
        this.on = on;
        const power = on ? 'on' : 'off';
        this.client.put('131airPurifier/v1/device/deviceStatus', {
            'uuid': this.fan.uuid,
            'status': power
        });
    }

    isOn(): boolean {
        return this.on;
    }
}
