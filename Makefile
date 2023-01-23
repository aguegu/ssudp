ARCH := amd64
PLATFORM := amd64
PORT := 29900-29999

ARCHITECTURE != uname -m
ifeq ($(ARCHITECTURE), armv7l)
  ARCH := arm7
  PLATFORM := arm32v7
else ifeq ($(ARCHITECTURE), aarch64)
  ARCH := arm64
  PLATFORM := arm64v8
endif

app-hoot:
	docker build -t aguegu/hoot ./hoot

app-privoxy:
	docker build -t aguegu/privoxy ./privoxy

app-kcptun:
	docker build -t aguegu/kcptun:latest-${PLATFORM} --build-arg arch=${ARCH} ./kcptun
	docker push aguegu/kcptun:latest-${PLATFORM}

manifest-kcptun:
	docker manifest rm aguegu/kcptun:latest
	docker manifest create aguegu/kcptun:latest \
		--amend aguegu/kcptun:latest-amd64 \
		--amend aguegu/kcptun:latest-arm32v7 \
		--amend aguegu/kcptun:latest-arm64v8
	docker manifest push aguegu/kcptun:latest

privoxy:
	docker network create ssudp | true
	docker run -d --name privoxy --network=ssudp --restart=unless-stopped aguegu/privoxy

kcptun-server:
	docker network create ssudp | true
	docker stop kcptun | true
	docker rm kcptun | true
	docker create --name kcptun -p ${PORT}:${PORT}/udp --network=ssudp --restart=unless-stopped aguegu/kcptun:latest /bin/server -c /etc/kcptun.json
	docker cp server.json kcptun:/etc/kcptun.json
	docker start kcptun

kcptun-client:
	docker stop kcptun | true
	docker rm kcptun | true
	docker create --name kcptun -p 12948:12948 --restart=unless-stopped aguegu/kcptun:latest /bin/client -c /etc/kcptun.json
	docker cp client.json kcptun:/etc/kcptun.json
	docker start kcptun

clean:
	docker stop kcptun | true
	docker rm kcptun | true

.PHONY: app-hoot app-privoxy app-kcptun privoxy kcptun-server kcptun-client clean manifest-kcptun
