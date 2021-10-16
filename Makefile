REPO := ssudp
VERSION := develop

app:
	docker build -t aguegu/${REPO}:${VERSION} .

privoxy:
	#docker build -t aguegu/privoxy ./privoxy
	docker run -d --name privoxy --restart=unless-stopped aguegu/privoxy

kcptun:
	docker create --name kcptun -p 12948:12948/udp --restart=unless-stopped xtaci/kcptun:latest /bin/server -c /etc/kcptun.json
	docker cp server.json kcptun:/etc/kcptun.json
	docker start kcptun

.PHONY: app privoxy
