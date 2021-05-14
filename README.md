# homebridge-vesync-client
A [Homebridge](https://github.com/homebridge/homebridge) plugin to control Levoit Air Purifiers with via the Vesync Platform.

**NOTE: This plugin is still heavily work in progress. Therefore it has limited functionality and may introduce breaking changes at any time.**

## Installation

See the [Homebridge](https://github.com/homebridge/homebridge) documentation for how to install and run Homebridge.

To install the plugin, run the following on the command line on the machine where Homebridge is installed:

```
npm install -g homebridge-vesync-client
```

## Configuration

* Via the Homebridge UI, enter the **Homebridge Vesync Client** plugin settings.
* Enter your [Vesync app](https://www.vesync.com/app) credentials.
* Save and restart Homebridge.

This plugin requires your Vesync credentials as it communicates with the Vesync devices via Vesync's own API. Your credentials are only stored in the Homebridge config and not sent to any server except Vesync's.

## Features

This plugin currently supports the following features.

### Levoit Air Purifier

* Turning the Air Purifier on and off

On the roadmap:

* Changing fan speed
* Displaying filter life level
* Toggling night and auto mode
* Extract TypeScript Vesync API client into separate library (port of [pyvesync](https://github.com/webdjoe/pyvesync))