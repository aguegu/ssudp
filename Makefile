REPO := ssudp
VERSION := develop

app:
	docker build -t aguegu/${REPO}:${VERSION} .

privoxy:
	docker build -t aguegu/privoxy ./privoxy

.PHONY: app privoxy
