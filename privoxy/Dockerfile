FROM alpine:3.17.1

LABEL maintainer="Weihong Guan <weihong.guan@cpnet.io>"

RUN apk --no-cache add privoxy

WORKDIR /etc/privoxy
RUN mv config.new config && mv default.action.new default.action && mv default.filter.new default.filter && mv match-all.action.new match-all.action && mv regression-tests.action.new regression-tests.action && mv trust.new trust && mv user.action.new user.action && mv user.filter.new user.filter
RUN sed -i 's/^listen-address  127.0.0.1:8118/listen-address  0.0.0.0:8118/' /etc/privoxy/config

USER privoxy
EXPOSE 8118
ENTRYPOINT ["privoxy", "--no-daemon"]
