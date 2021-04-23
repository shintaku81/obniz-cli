# obniz-cli

obniz-cliはESP32へ obnizOSを書き込んだり、クラウド上にobnizIDを生成したり、Wi-Fiなどの設定を自動で行うためのコマンドラインツールです。
1台の生成から数千台のobnizOS搭載のデバイスを一気に生産するのに利用できます。

obnizについてはこちら [https://obniz.com/](https://obniz.com/)

以下はクラウド上にobnizIDを生成し、obnizOSも書き込んだ上で`wifi-config.json`にあるwifi設定まで書き込む例です。

```shell
obniz-cli os:flash-create -p AUTO --config ./wifi-config.json
```


以下の環境での動作を確認しています。

 - Nodejs12 (MacOS 10.15 / Windows 10)


## 利用方法

call with `--help`

```shell
$ obniz-cli --help

USAGE
  $ obniz-cli [COMMAND]

COMMANDS

  signin              Signin to obniz cloud.
  signout             Signout

  user:info           Show current Logged in user

  os:flash-create     Flashing and configure target device and registrate it on your account on obnizCloud.
  os:flash            Flashing and configure target device.
  os:config           Configure obnizOS flashed device.
  os:config-via-wifi  Configure ObnizOS network via Wi-Fi from devices.
  os:erase            Fully erase a flash on target device.
  os:list             List of available obnizOS for specified hardware
  os:ports            Getting serial ports on your machine.
```

Each command may respond to help

```shell
$obniz-cli os:flash --help

Usage for
$obniz-cli os:flash

Flash obnizOS and configure it

[serial setting]
 -p --port      serial port path to flash.If not specified, the port list will be displayed.
 -b --baud      flashing baud rate. default to 1500000

[flashing setting]
 -h --hardware  hardware to be flashed. default to esp32w
 -v --version   obnizOS version to be flashed. default to latest one.

[configrations]
 -d --devicekey devicekey to be configured after flash. please quote it like "00000000&abcdefghijklkm"
 -i --id        obnizID to be configured. You need to signin before use this.
 -c --config    configuration file path. If specified obniz-cli proceed settings following file like setting wifi SSID/Password.
 ```


## インストール

### 事前準備

obniz-cli は [esptool](https://github.com/espressif/esptool) を利用しますので [pip](https://pip.pypa.io/en/stable/installing/)　よりインストールしてください。

```
pip install esptool
```

また、Nodejsをマシンにインストールする必要があります。

Windowsをお使いでしたら以下がobniz-cliをインストールするよりも先に必要です。

```
npm install windows-build-tools -g
```

obniz-cliはnpmからインストール可能です。

```shell
npm i obniz-cli -g
```

## signin

obnizCloudの機能を利用するにはサインインが必要です。以下でサインインできます。

```shell
obniz-cli signin
```

ブラウザが立ち上がり、「obniz-cliを承認するか」と聞かれますので承認してください。
obnizCloudにサインインしていない場合は先にログインを行ってください。

承認完了後コマンドラインにはobnizCloudで利用しているメールアドレスが表示されればサインイン完了です。

どのユーザーでサインインしているかは以下のコマンドで確かめられます。

```shel
obniz-cli user:info
```

## Serial Portについて

マシンからobnizOSを書き込むのにシリアルポートを利用します。利用可能なものは以下で確認できます。

```shel
obniz-cli os:ports
```

obniz-cliの多くのコマンドで`-p`パラメーターが使えて、ここで指定します。

```shell
obniz-cli os:flash -p /dev/tty.USBSerial
```

指定しないとどれを使うか聞かれますので、選択してください。また、`AUTO`を指定しておくと、もっともマイコンだと思われるものが自動的に選択されて便利です。

```shel
obniz-cli os:flash -p AUTO
```

うまく書き込めない、うまく設定できない場合は `--debugserial` と指定することで通信の中身を表示させることができます。

```shell
obniz-cli os:flash-create -p AUTO --debugserial
```


## os:flash-create

サインインしているアカウントでobnizIDを１つ作成し、書き込み、デバイスキーの書き込みまで完了させることができます。

まず、どのobnizOSを利用するのか決めます。無指定ですと`obnizOS for esp32`が自動選択されます。以下のコマンドでどのハードウェアが選択できるのか確認できます。

```shell
$obniz-cli os:list

Available Hardwares on obnizCloud

  esp32w
  esp32p
  encored
  m5stack_basic
  m5stickc
  m5atom_lite

Versions for hardware=esp32w

  3.4.3
  3.4.2
  3.4.1
```


書き込み時にm5stickcを選択すると obnizOS for M5StickCの最新バージョンが書き込まれることになります。

クラウドでのobnizIDの生成とそのデバイスキーの書き込み含めたOS書き込みは以下のように行えます。ちなみにシリアルポートは自動選択にしているので、自分で選ぶには`-p AUTO`を削除してください。

```shel
obniz-cli os:flash-create -p AUTO --hardware m5stickc
```

成功すると以下のように生成されたobnizIDなどが確認できます。

![](./docs/images/flashcreate.png)

クラウド上でobnizIDを生成するときに説明(description)を追加することもできます。

```shel
obniz-cli os:flash-create -p AUTO --hardware m5stickc -- description "obniz for my home"
```

Wi-Fiなどネットワークの設定も行うことができる`--config`などありますので、
何が指定できるかは以下のようにhelpから確認してください。

```shel
obniz-cli os:flash-create --help
```

### Binding Token (パートナー専用)

obnizのパートナーでobnizIDとシリアルコードを紐付ける場合には`--bindtoken`を利用します

```shel
obniz-cli os:flash-create -p AUTO --hardware m5stickc --bindtoken
```

起動後、以下のようにシリアルトークンの文字列を受け付ける画面となります。

```
? Scan QR Code. Waiting...
```

バーコードリーダーなどでQRを読み取ることで生成されるobnizIDと読み取ったQR(シリアルコード)を紐付けることができます。


## os:flash

OSのみを書き込むには`os:flash`を利用します。

```shell
obniz-cli os:flash -p /dev/tty.USBSERIAL
```

### デバイスキーの設定

クラウド上のobnizIDやデバイスキーそのものを指定することで書き込み後に設定させることができます。

自分のアカウントが保有するobnizIDを指定するとデバイスキーを自動でダウンロードして書き込みます。

さらに、Wi-Fiの設定も済ませたい場合は以下のように`--config`を利用します。

```
obniz-cli os:flash --id 0000-0000  -p /dev/tty.USBSERIAL --config ./wifi-config.json
```

デバイスキーそのものを指定することも可能です。

```
obniz-cli os:flash --devicekey '00000000&4591c82b119e12bd3b55ca5cb6493bcc498b63fe5448e06a' --config ./wifi-config.json
```

## Network設定

jsonで保存されたWi-FiのSSID,パスワードを使って書き込み後に設定まで完了させることができます。

[example](./example_config.json)

```json
{
  "networks":[
    {
      "type": "wifi",
      "settings": {
        "ssid": "exampl_essid",
        "password": "example_password"
      }
    }
  ]
}
```

### Type

| Type | Description |
|---|---|
|wifi| Wi-Fi  |
|ethernet| Ethernet |
|cellular| Cellular |

### Settings for Wi-Fi

| Key | Required | Default | Description |
|---|---|---|---|
|ssid| yes |  | SSID for Wi-Fi |
|password| yes |  | Password for Wi-Fi |
|hidden| no | false | If `false`, then device connect only found SSID and will save Wi-Fi only when connection established. If `true`, then device will store Wi-Fi setting and treat SSID as hidden SSID. Device will connect without scanning on startup. |
|dhcp| no | true | Use DHCP or not. If `false`, specify static ip settings |
|static_ip| no | automatic | Static IP |
|default_gateway| no | automatic | Gateway IP |
|subnetmask| no | automatic | Subnetmask |
|dns| no |  | DNS Server IP |
|proxy| no | false | Use Proxy or not. |
|proxy_address| no |  | Proxy Address |
|proxy_port| no |  | Proxy Port |


`os:flash` and `os:flash-create` will perform that.

```shell
obniz-cli os:flash -p /dev/tty.USBSERIAL -i 0000-0000 --config ./wifi-config.json
```

## os:config-via-wifi

このソフトが動いているコンピューターのWi-Fiを利用して、Wi-Fi経由での設定が可能です。 [via W-Fi](https://obniz.com/doc/reference/obnizos-for-esp32/settings/setting-via-browser)。

大量のデバイスに同じ設定をするのに利用します。

行いたい設定は優先の場合と同じくjsonファイルで指定します。
以下のコマンドでjsonファイルを指定することでWi-Fiを使いデバイスを見つけては順次設定を行います。
流れは

1. 以下のコマンドで開始
2. 未設定デバイスを複数台とにかく電源に接続する。
3. LEDがオンラインになったものを電源から外していく。

デバイスが起動時設定モードの場合(起動後にボタンを長押しするなどで入れるモード)はネットワークのリセットを自動で行い、その後デバイスに再接続して設定を書き込みます。

```shell
obniz-cli os:config-via-wifi --config ./wifi-config.json
```

![](./docs/images/viawifi.png)

`--duplicate false`を指定すると一度設定を送ったobnizに送らないようにできますが、送信が完了したからといって設定が保存されたか、オンラインになったかは分からないので推奨できない使い方となります。

