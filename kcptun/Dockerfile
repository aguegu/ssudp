FROM alpine:3.11
RUN apk add --no-cache iptables
# COPY --from=builder /go/bin /bin
ADD https://github.com/xtaci/kcptun/releases/download/v20210922/kcptun-linux-amd64-20210922.tar.gz /tmp
RUN tar xf /tmp/kcptun-linux-amd64-20210922.tar.gz && pwd && mv /tmp/kcptun-linux-amd64-20210922/bin/* /bin

EXPOSE 29900/udp
EXPOSE 12948

#
# https://github.com/xtaci/kcptun/releases/download/v20210922/kcptun-linux-arm64-20210922.tar.gz
