import { VesyncFan } from './vesyncFan';
import { VesyncClient } from '../api/client';

export class FanController {
    constructor(private fan: VesyncFan, private client: VesyncClient) {
    }

    setPower(power) {
        return this.client.put('131airPurifier/v1/device/deviceStatus', {
            'uuid': this.fan.uuid,
            'status': power
        });
    }
}
