# SnapCast
Snapcast is a multi-room client-server audio player, where all clients are time synchronized with the server to play perfectly synced audio.
https://github.com/badaix/snapcast

This is a Docker image running SnapCast. It is based on [Alpine Linux](https://alpinelinux.org/) 3.7 using the edge-testing repository, and using [s6 overlay for containers](https://github.com/just-containers/s6-overlay) (more details on S6 [here](http://skarnet.org/software/s6/overview.html)).

This container was built to work with my [Mopidy container](https://github.com/ehudkaldor/mopidy), which is wired to put the stream fifo files in /tmp. You can, in Mopidy, use an external volume for /tmp (where Mopidy puts the stream files) and then provide that to the Snapcast container to read from.

you can pull it directly from docker hub:
`docker pull ehudkaldor/snapcast`

or build it yourself, by cloning this repo and running:
`docker build -t whatever .`

when running, you can provide a few volumes to be used for specific purposes:
```docker run
  -d
  --name snapcast
  -p 1704:1704                                  # server port
  -p 1705:1705                                  # remote control port
  -v <a dir with your fifo stream files>:/tmp   # this is where your fifo stream are
  ehudkaldor/snapcast:latest
  ```
