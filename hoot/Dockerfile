FROM node:16-alpine
ARG is_released=false

RUN mkdir -p /root/app/config /root/usr

COPY api/config/production.js /root/app/config/
COPY api/package.json api/package-lock.json /root/app/
COPY api/templates /root/app/templates
COPY api/src /root/app/dist

WORKDIR /root/app
RUN npm install -g json; if [ $is_released = true ]; then npm run go-release; else npm run go-develop; fi; npm run refresh-build; npm uninstall -g json; npm install --production; npm cache clean --force

EXPOSE 4000
ENV NODE_ENV production

CMD node --experimental-json-modules ./dist/index.mjs
