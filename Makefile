ARCHITECTURE := amd64

ARCH != uname -m
ifeq ($(ARCH), armv7l)
        ARCHITECTURE := arm32
else ifeq ($(ARCH), aarch64)
        ARCHITECTURE := arm64
endif


app-privoxy:
	docker build -t aguegu/privoxy ./privoxy

app-kcptun:
	# docker build -t aguegu/kcptun ./kcptun
	# docker push aguegu/kcptun
	docker buildx build --push --platform linux/amd64 --tag aguegu/kcptun ./kcptun


privoxy:
	docker run -d --name privoxy --restart=unless-stopped aguegu/privoxy

kcptun-server:
	docker create --name kcptun -p 29900:29900/udp --restart=unless-stopped aguegu/kcptun:latest /bin/server -c /etc/kcptun.json
	docker cp server.json kcptun:/etc/kcptun.json
	docker start kcptun

kcptun-client:
	docker create --name kcptun -p 12948:12948 --restart=unless-stopped aguegu/kcptun:latest /bin/client -c /etc/kcptun.json
	docker cp client.json kcptun:/etc/kcptun.json
	docker start kcptun

clean:
	docker stop kcptun | true
	docker rm kcptun | true

.PHONY: app-privoxy app-kcptun privoxy kcptun-server kcptun-client clean
