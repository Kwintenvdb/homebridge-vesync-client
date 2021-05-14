export class VesyncFan {
    name: string;
    mode: string;
    speed: number;
    uuid: string;
    status: string;

    constructor(deviceData) {
        this.name = deviceData.deviceName;
        this.mode = deviceData.mode;
        this.speed = deviceData.speed;
        this.uuid = deviceData.uuid;
        this.status = deviceData.deviceStatus;
    }
}
