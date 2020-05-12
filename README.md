# obniz-cli

The obniz CLI is used to flashing and configuring obnizOS for processors.

For more about Heroku see https://obniz.io/


## Install

Install from npm

```shell
npm i obniz-cli -g
```

### Dependency

obniz-cli use esptool internally. Install it from [pip](https://pip.pypa.io/en/stable/installing/)
```
pip install esptool
```

## Overview

```shell
USAGE
  $ obniz-cli [COMMAND]

COMMANDS

  login       Login to obniz cloud.

  gui         Launch GUI mode of obniz-cli

  os:create   Flashing and configure target device and registrate it on your account on obnizCloud.
               ARGS: -h XXX -v X.X.X -p XXX -b XXX -config XXXX -continue yes
  os:flash    Flashing and configure target device.
               ARGS: -h XXX -v X.X.X -p XXX -b XXX -k XXXX -config XXXX -continue yes
  os:erase    Fully erase a flash on target device.
               ARGS: -p XXX
  os:terminal Simply Launch terminal
               ARGS: -p XXX
  os:ports    Getting serial ports on your machine.
```

## Serial Port Setting

obniz-cli will auto detect FTDI cables.
Specify portpath when you could't find cable.

```
obniz-cli os:erase -p /dev/tty.USBSERIAL
```

## Flashing

Flashing the latest obnizOS for default hardware type.

```
obniz-cli os:flash
```

You can specify configrations as arguments.
obniz-cli will start configuraing after flashing.

```
obniz-cli os:flash --devicekey '00000000&4591c82b119e12bd3b55ca5cb6493bcc498b63fe5448e06a'
```