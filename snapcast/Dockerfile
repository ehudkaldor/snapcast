################################################
#
#
#
#
#
################################################

FROM        ehudkaldor/alpine-s6:latest
MAINTAINER  Ehud Kaldor <ehud@UnfairFunction.org>

RUN         apk add --update \
            git python && \
            apk add snapcast \
              --update-cache \
              --repository http://dl-3.alpinelinux.org/alpine/edge/testing/ && \
            git clone https://github.com/ehudkaldor/snapcastHttpd.git && \
            mv snapcastHttpd/snapcastHttpd.py /usr/local/bin && \
            apk del git && \
            rm -rf /var/cache/apk/*

# Server socket.
EXPOSE      1704 1705 7777

# Add the configuration file.
COPY        rootfs /
