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
  
  operation:list      List of available operations.
  operation:info      Show operation info.

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
    --token     Token of api key which use instead of user signin.

[operation]
    --operation     operation name for setting.
    --indication    indication name for setting.

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

obnizCloudの機能を利用するにはサインイン、もしくは各コマンドへのTokenパラメータが必要です。
サインインをする場合は、以下でサインインできます。

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

## Tokenについて

API KeyのTokenを各コマンドのパラメータとして渡すことで、singinせずに使用することができます。
API Keyはobniz Cloudの開発者コンソール　→　開発　→ APIキー　にて発行が可能です。

```shel
obniz-cli os:flash-create --token=token_Bowk7ovyFXcOapGgcwxJTIx23P6WfdX1
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

obnizIDを１つ作成し、書き込み、デバイスキーの書き込みまで完了させることができます。
obnizIDを作成するアカウントは、サインインしているアカウント、もしくはTokenパラメータで指定したアカウントになります。

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
obniz-cli os:flash-create -p AUTO --hardware m5stickc --description "obniz for my home"
```

Wi-Fiなどネットワークの設定も行うことができる`--config`などありますので、
何が指定できるかは以下のようにhelpから確認してください。

```shel
obniz-cli os:flash-create --help
```

## オペレーションの実施（ビジネスプラン）

施設とオペレーションを作成すると、obniz-cliでオペレーションを実行することができるようになります。
tokenオプションでAPI Keyを渡すようにすればobnizCloudへのログインは必要ありませんので、セキュアに設定作業を依頼することができます。


operationオプションでオペレーション名を、indicationオプションで指示IDを指定します。

```shel
obniz-cli os:flash-create --operation obnizBuilding --indication ob-0 --token token_Bowk7ovyFXcOpGgcwxJTIasdf6WfdX1GOB
```

順次デバイスに書き込む場合は、indicationオプションにnextを使うことができます。
nextが指定されると、まだ完了していない指示IDを自動で選択します。

```shel
obniz-cli os:flash-create --operation obnizBuilding --indication next --token token_Bowk7ovyFXcOpGgcwxJTIasdf6WfdX1GOB
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
`os:flash` と `os:flash-create` にて引数で指定できます。

[Wi-Fi の設定例](./example_config.json)

フォーマットはOS3.5.0以降の設定JSONに従います。詳しくは[obnizOSのリファレンス](https://obniz.com/ja/doc/reference/obnizos-for-esp32/settings/)を参照ください。

OS3.4.5かそれ以前の設定については[こちら](./docs/config-345andolder.md)を参照してください


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

