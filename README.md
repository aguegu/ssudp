Server
---

1. Install docker
2. clone this repo
3. `$ cp server.json.example server.json`
4. User configuration `server.json`
  * modify the `key` field in `server.json` to some strong password,   
  * modify the `listen` field in `server.json`, [port range](https://github.com/xtaci/kcptun/releases/tag/v20221015) is supported, total number of 100 ports looks fine.
  * other options refers to [kcptun](https://github.com/xtaci/kcptun)  
5. Modify the `PORT` variable in `Makefile` to be the same port or port-range in `server.json`
6. `$ make privoxy`
7. `$ make kcptun-server`

Client
---
1. Install docker
2. clone this repo
3. `$ cp client.json.example client.json`
4. modify the `remoteaddr` field in `client.json` to the server ip with port number/range, `key` field to the same password as the `server.json`, other options same as the `server.json`

5. `$ make kcptun-client`

Then you got a http proxy ([privoxy](https://www.privoxy.org/)) on client listening on port 12948(CLIENTPORT in Makefile).

For more information, just check [Makefile](Makefile).
