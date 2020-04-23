class FanController {
    constructor(fan, client) {
        this.fan = fan;
        this.client = client;
    }

    setPower(power) {
        return this.client.put('131airPurifier/v1/device/deviceStatus', {
            'uuid': this.fan.uuid,
            'status': power
        });
    }
}

module.exports = FanController;
