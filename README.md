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


Client (IPv6)
---
If the client `remoteaddr` in `client.json` is a IPv6 address, the format would be like `[2001:4860:4860::8888]:19900-19999`. Remember the square brackets around the ip address.

But to access this remote IPv6 address, the docker container has to have IPv6 address too, even though the host should have real IPv6 address at the first place.

Edit `/etc/docker/daemon.json` with

```json
{
  "experimental": true,
  "ip6tables": true
}
```

And then `sudo systemctl restart docker` and follow same steps of regular client setup.

Reference: https://docs.docker.com/config/daemon/ipv6/
