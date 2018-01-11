################################################
#
#
#
#
#
################################################

FROM		    ehudkaldor/alpine-s6:latest
MAINTAINER	Ehud Kaldor <ehud@UnfairFunction.org>

RUN 		    echo "http://dl-3.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories && \
            apk add --update \
        	  mopidy \
        	  py-six \
        	  gst-plugins-good0.10 \
            gst-plugins-bad0.10 \
            gst-plugins-ugly0.10 \
        	  alsa-utils \
        	  py-pip && \
		        rm -rf /var/cache/apk/*

# Server socket.
EXPOSE 	  	6680

# Install more Mopidy extensions from PyPI.
RUN 		    pip install Mopidy-MusicBox-Webclient && \
 		        pip install Mopidy-Mobile && \
            pip install mopidy-beets && \
            pip install mopidy-moped && \
            pip install Mopidy-Local-SQLite

# Add the configuration file.
ADD 		    rootfs /
