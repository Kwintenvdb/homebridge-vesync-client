export type OnOrOff = 'on' | 'off';
export type FanSpeed = 1 | 2 | 3;

export interface FanDetails {
    mode: 'auto' | 'manual' | 'sleep';
    deviceStatus: OnOrOff;
    screenStatus: OnOrOff;
    level: FanSpeed; // fan speed level
    airQuality: string; // TODO refine type
}
