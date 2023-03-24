FROM alpine:3.17.2

ARG version=20230214
ARG arch=amd64

RUN apk add --no-cache iptables
ADD https://github.com/xtaci/kcptun/releases/download/v${version}/kcptun-linux-${arch}-${version}.tar.gz /tmp
RUN cd /tmp && tar xf kcptun-linux-${arch}-${version}.tar.gz && mv client_linux_${arch} /bin/client && mv server_linux_${arch} /bin/server

EXPOSE 12948
