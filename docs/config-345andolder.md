## OS3.4.5 かそれ以前の専用設定ファイル

[Wi-Fi設定例](./example_config_until_350.json)

[(パートナー専用)Wi-Fi MESH設定例](./example_config_mesh_until_350.json)
[(パートナー専用)Cellular設定について](./config-apn-ja.md)

### 

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
|dhcp| no | true | Use DHCP or not. If `false`, specify static ip settings |
|static_ip| no | automatic | Static IP |
|default_gateway| no | automatic | Gateway IP |
|subnetmask| no | automatic | Subnetmask |
|dns| no |  | DNS Server IP |
|proxy| no | false | Use Proxy or not. |
|proxy_address| no |  | Proxy Address |
|proxy_port| no |  | Proxy Port |

### Settings for Wi-Fi MESH

| Key | Required | Default | Description |
|---|---|---|---|
|ssid| yes |  | SSID for Wi-Fi |
|password| yes |  | Password for Wi-Fi |
|meshid| yes |  | MESH ID like 111111111111 |
|dhcp| no | true | Use DHCP or not. If `false`, specify static ip settings |
|static_ip| no | automatic | Static IP |
|default_gateway| no | automatic | Gateway IP |
|subnetmask| no | automatic | Subnetmask |
|dns| no |  | DNS Server IP |
|proxy| no | false | Use Proxy or not. |
|proxy_address| no |  | Proxy Address |
|proxy_port| no |  | Proxy Port |

`os:flash` and `os:flash-create` will perform that.
