# Telegram console client

## First steps
- `npm install`
- `make env.json file in root folder`

```json
  {
    "APP_ID": "{APP_ID}",
    "API_HASH": "{API_HASH}",
    "USER_PHONE": "+7...",
    "EMOJI": true,
    "proxies": [
      {
        "type": "proxyTypeMtproto",
        "server": "{proxy_server}",
        "port": {proxy_port},
        "data": {
          "secret": "{proxy_secret}"
        }
      }
    ]
  }
```
- `npm start`

## env.json schema

**APP_ID**: stirng
**API_HASH**: string

Get your app credentials here:
https://core.telegram.org/api/obtaining_api_id

**USER_PHONE**: string

Your phone number to login in Telegram

**EMOJI**: boolean

Turn off emoji support in case of rendering problems in your terminal (mostly on Windows)

**proxies**: array

*In case of you already have proxy on your system — skip it and leave array empty.*

List of proxies you can get one of them here: https://mssg.me/proxy
Application can works without proxy, but in some cases it can spent ~30 mins to found workable IP. Use proxy to reduce problems of it.

## First launch

At first launch application asks you verification code which sends to your Telegram account. After that your session will store locally on your mashine. In case of your first launch takes so much time without drawing of UI try proxy.
