# BLE devices => Conect+

コネクト+にデータを投げるアプリ


## スタート方法


```
npm i
npm run local
```

## 構成

- index.ts : HTTPサーバー(Heroku用)。appをconfigに基づいて生成。
- config.ts : どのobnizが何のセンサーを担当するかなどの情報
- app/index.ts : メインのアプリ。configに基づきobnizにつなぎbleのad拾ったりつないだりする。