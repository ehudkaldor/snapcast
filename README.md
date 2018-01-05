# SnapCast
Snapcast is a multi-room client-server audio player, where all clients are time synchronized with the server to play perfectly synced audio.
https://github.com/badaix/snapcast

This is a Docker image running SnapCast. It is based on [Alpine Linux](https://alpinelinux.org/) 3.7 using the edge-testing repository, and using [s6 overlay for containers](https://github.com/just-containers/s6-overlay) (more details on S6 [here](http://skarnet.org/software/s6/overview.html))

you can pull it directly from docker hub:
`docker pull ehudkaldor/snapcast`

or build it yourself, by cloning this repo and running:
`docker build -t whatever .`

when running, you can provide a few volumes to be used for specific purposes:
```docker run
  -d
  --name snapcast
  -p 1704:1704        # server port
  -P 1705:1705        # remote control port
  ehudkaldor/snapcast:latest
  ```
