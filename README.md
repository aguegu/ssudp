Server
---

1. Install docker
2. clone this repo
3. `$ cp server.json.example server.json`
4. modify the `key` field in `server.json` to some strong password, other options refers to [kcptun](https://github.com/xtaci/kcptun)
5. `$ make privoxy`
6. `$ make kcptun-server`

Client
---
1. Install docker
2. clone this repo
3. `$ cp client.json.example client.json`
4. modify the `remoteaddr` field in `client.json` to the server ip with port number, `key` field to the same password as the `server.json`, other options same as the `server.json`
5. `$ make kcptun-client`

Then you got a http proxy ([privoxy](https://www.privoxy.org/)) on client listening on port 12948.

For more information, just check [Makefile](Makefile).
