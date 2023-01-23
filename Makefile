# user variables
PORT := 29900-29999
CLIENTPORT := 12948
CLIENTNAME := kcptun

# developer variables
REPO := aguegu/kcptun
ARCH := amd64
PLATFORM := amd64

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
	docker build -t ${REPO}:latest-${PLATFORM} --build-arg arch=${ARCH} ./kcptun
	docker push ${REPO}:latest-${PLATFORM}

manifest-kcptun:
	docker manifest rm ${REPO}:latest
	docker manifest create ${REPO}:latest \
		--amend ${REPO}:latest-amd64 \
		--amend ${REPO}:latest-arm32v7 \
		--amend ${REPO}:latest-arm64v8
	docker manifest push ${REPO}:latest

privoxy:
	docker network create ssudp | true
	docker run -d --name privoxy --network=ssudp --restart=unless-stopped aguegu/privoxy

kcptun-server:
	docker network create ssudp | true
	docker stop kcptun | true
	docker rm kcptun | true
	docker create --name kcptun -p ${PORT}:${PORT}/udp --network=ssudp --restart=unless-stopped --pull=always ${REPO}:latest /bin/server -c /etc/kcptun.json
	docker cp server.json kcptun:/etc/kcptun.json
	docker start kcptun

kcptun-client:
	docker stop ${CLIENTNAME} | true
	docker rm ${CLIENTNAME} | true
	docker create --name ${CLIENTNAME} -p ${CLIENTPORT}:12948 --restart=unless-stopped --pull=always ${REPO}:latest /bin/client -c /etc/kcptun.json
	docker cp client.json ${CLIENTNAME}:/etc/kcptun.json
	docker start ${CLIENTNAME}

clean:
	docker stop kcptun | true
	docker rm kcptun | true

.PHONY: app-hoot app-privoxy app-kcptun privoxy kcptun-server kcptun-client clean manifest-kcptun
