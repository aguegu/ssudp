FROM alpine:3.17.1

ARG version=20221015
ARG arch=amd64

RUN apk add --no-cache iptables
ADD https://github.com/xtaci/kcptun/releases/download/v${version}/kcptun-linux-${arch}-${version}.tar.gz /tmp
RUN cd /tmp && tar xf kcptun-linux-${arch}-${version}.tar.gz && mv client_linux_${arch} /bin/client && mv server_linux_${arch} /bin/server

EXPOSE 29900-29999/udp
EXPOSE 12948
#
# https://github.com/xtaci/kcptun/releases/download/v20210922/kcptun-linux-arm64-20210922.tar.gz
