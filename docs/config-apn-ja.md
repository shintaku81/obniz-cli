
## APN設定

コネクトハブ セルラーのAPN設定を一気に行う

まず、jsonファイルにapn,id,passを以下のように記載して保存。

```json
{
  "networks":[
    {
      "type": "cellular",
      "settings": {
        "apn": "your SIM apn",
        "id": "your SIM id",
        "pass": "your SIM pass"
      }
    }
  ]
}
```

以下のコマンドでjsonファイルを指定することでWi-Fiを使いデバイスを見つけては順次設定を行う。
大量のデバイスを設定する場合は

1. 以下のコマンドで設定を開始
2. 未設定デバイスを複数台とにかく電源に接続する。
3. LEDがオンラインになったものを電源から外していく。

```
obniz-cli os:config-via-wifi --config ~/Desktop/wifi2g.json
```

![](./images/viawifi.png)
