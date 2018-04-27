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
        	  gst-plugins-good \
            gst-plugins-bad \
            gst-plugins-ugly \
        	  alsa-utils \
        	  py-pip && \
		        rm -rf /var/cache/apk/*

# Server socket.
EXPOSE 	  	6680

# Install more Mopidy extensions from PyPI.
RUN 		    pip install --upgrade pip && && \
            pip install Mopidy-MusicBox-Webclient && \
 		        pip install Mopidy-Mobile && \
            pip install mopidy-beets && \
            pip install mopidy-moped && \
            pip install Mopidy-Local-SQLite && \
            pip install mopidy-gmusic && \
            pip install Mopidy-Local-Images && \
            pip install Mopidy-Spotify && \
            pip install Mopidy-Iris

# Add the configuration file.
ADD 		    rootfs /
