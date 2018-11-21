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
<<<<<<< HEAD
            git python && \
            apk add snapcast \
              --update-cache \
              --repository http://dl-3.alpinelinux.org/alpine/edge/testing/ && \
=======
            # git python snapcast && \
            git python py-pip && \
            pip install -U pip && \
            pip install snapcast && \
>>>>>>> 2db5750ae54590058c67fc639693d0ba1ffe1c35
            git clone https://github.com/ehudkaldor/snapcastHttpd.git && \
            mv snapcastHttpd/snapcastHttpd.py /usr/local/bin && \
            apk del git && \
            rm -rf /var/cache/apk/*

# Server socket.
EXPOSE      1704 1705 7777

# Add the configuration file.
COPY        rootfs /
