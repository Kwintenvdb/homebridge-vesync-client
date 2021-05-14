import {
    API,
    Logging,
    Service,
    PlatformConfig,
    DynamicPlatformPlugin,
    PlatformAccessory,
    UnknownContext,
    Categories,
    WithUUID,
    CharacteristicValue
} from 'homebridge';

import { FanController } from './fan/fanController';
import { VesyncClient } from './api/client';
import { VesyncFan } from './fan/vesyncFan';

const client = new VesyncClient();

interface Config extends PlatformConfig {
    username: string;
    password: string;
}

class LevoitAirPurifier {
    private readonly airPurifierService: Service;
    private readonly airQualityService: Service;

    constructor(
        private readonly fan: VesyncFan,
        private readonly log: Logging,
        private readonly accessory: PlatformAccessory,
        private readonly api: API
    ) {
        const fanController = new FanController(fan, client);

        const hap = api.hap;
        this.airPurifierService = this.getOrAddService(hap.Service.AirPurifier);

        // this.airPurifierService.getCharacteristic(hap.Characteristic.FilterLifeLevel)
        //     .on(CharacteristicEventTypes.GET, (callback: CharacteristicGetCallback) => {
        //         log.info('getting filter life level...');
        //         callback(null, 50);
        //     });

        this.airPurifierService.getCharacteristic(hap.Characteristic.Active)
            .onGet(() => {
                const isOn = fanController.isOn();
                return isOn ? hap.Characteristic.Active.ACTIVE : hap.Characteristic.Active.INACTIVE;
            })
            .onSet((value: CharacteristicValue) => {
                const power = value === hap.Characteristic.Active.ACTIVE;
                fanController.setPower(power);
                return value;
            });

        this.airPurifierService.getCharacteristic(hap.Characteristic.CurrentAirPurifierState)
            .onGet(() => {
                return hap.Characteristic.CurrentAirPurifierState.PURIFYING_AIR;
            });
        
        this.airPurifierService.getCharacteristic(hap.Characteristic.TargetAirPurifierState)
            .onGet(() => {
                return hap.Characteristic.TargetAirPurifierState.AUTO;
            });

        this.airPurifierService.getCharacteristic(hap.Characteristic.RotationSpeed)
            .setProps({ minStep: 33, maxValue: 99 })
            .onGet(() => {
                const level = fanController.getFanSpeed();
                return level * 33;
            });

        this.airQualityService = this.getOrAddService(hap.Service.AirQualitySensor);
        this.airQualityService.getCharacteristic(hap.Characteristic.AirQuality)
            .onGet(() => {
                return hap.Characteristic.AirQuality.POOR;
            });
    }

    private getOrAddService<T extends WithUUID<typeof Service>>(service: T): Service {
        return this.accessory.getService(service) ?? this.accessory.addService(service);
    }
}

class VesyncPlatform implements DynamicPlatformPlugin {
    private readonly cachedAccessories: PlatformAccessory[] = [];

    constructor(
        private readonly log: Logging,
        config: Config,
        private readonly api: API
    ) {
        this.api.on('didFinishLaunching', async () => {
            await client.login(config.username, config.password);
            await this.findDevices();
          });
    }

    private async findDevices() {
        const fans = await client.getDevices();
        fans.forEach(fan => {
            const cached = this.cachedAccessories.find(a => a.UUID === fan.uuid);
            if (cached) {
                this.log.debug('Restoring cached accessory: ' + cached.displayName);
                new LevoitAirPurifier(fan, this.log, cached, this.api);
            } else {
                this.log.debug('Creating new fan accessory...')
                const platformAccessory = new this.api.platformAccessory(fan.name, fan.uuid, Categories.AIR_PURIFIER);
                new LevoitAirPurifier(fan, this.log, platformAccessory, this.api);
                this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [platformAccessory]);
            }
        });
    }

    /**
   * REQUIRED - Homebridge will call the "configureAccessory" method once for every cached
   * accessory restored
   */
    configureAccessory(accessory: PlatformAccessory<UnknownContext>): void {
        this.cachedAccessories.push(accessory);
    }

}

const PLUGIN_NAME = 'homebridge-vesync-client';
const PLATFORM_NAME = 'VesyncPlatform';

export = (homebridge: API) => {
    homebridge.registerPlatform(PLATFORM_NAME, VesyncPlatform);
};
