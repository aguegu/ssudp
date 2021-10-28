ARCH := amd64
PLATFORM := linux/amd64

ARCHITECTURE != uname -m
ifeq ($(ARCHITECTURE), armv7l)
  ARCH := arm32
	PLATFORM := linux/arm32v7
else ifeq ($(ARCHITECTURE), aarch64)
  ARCH := arm64
	PLATFORM := linux/arm64/v8
endif

app-privoxy:
	docker build -t aguegu/privoxy ./privoxy

app-kcptun:
	# docker build -t aguegu/kcptun ./kcptun
	# docker push aguegu/kcptun
	docker buildx build --push --platform ${PLATFORM} --tag aguegu/kcptun --build-arg arch=${ARCH} ./kcptun

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
