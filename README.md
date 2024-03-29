# homebridge-vesync-client

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/Kwintenvdb/homebridge-vesync-client/Build)

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

You can also do this directly via the homebridge config by adding your credentials to the config file under `platforms`. Replace the values of `username` and `password` by your credentials.

```json
"platforms": [
    {
        "platform": "VesyncPlatform",
        "username": "email@example.com",
        "password": "enter_your_password"
    }
]
```

## Features

This plugin currently supports the following features.

### Levoit Air Purifier

* Turning the Air Purifier on and off

On the roadmap:

* Changing fan speed
* Displaying filter life level
* Toggling night and auto mode
* Extract TypeScript Vesync API client into separate library (port of [pyvesync](https://github.com/webdjoe/pyvesync))

## Local Development

If you want to develop and run the plugin locally, you can do the following:

1. Clone the repository.
1. Run the following scripts on the command line:

```
cd homebridge-vesync-client
npm install
npm run watch
npm link
```

Afterwards, restart Homebridge. Restart Homebridge whenever you have made changes to the code.
