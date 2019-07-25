# SnapCast
Snapcast is a multi-room client-server audio player, where all clients are time synchronized with the server to play perfectly synced audio.
https://github.com/badaix/snapcast

This is a Docker image running SnapCast. It is based on [Alpine Linux](https://alpinelinux.org/) 3.7 using the edge-testing repository, and using [s6 overlay for containers](https://github.com/just-containers/s6-overlay) (more details on S6 [here](http://skarnet.org/software/s6/overview.html)).

This container was built to work with my [Mopidy container](https://github.com/ehudkaldor/mopidy), which is wired to put the stream fifo files in /streams. You can, in Mopidy, use an external volume for /streams (where Mopidy puts the stream files) and then provide that to the Snapcast container to read from.

you can pull it directly from docker hub:
`docker pull ehudkaldor/snapcast`

or build it yourself, by cloning this repo and running:
`docker build -t whatever .`

This image contains both server and client. The decision between server and client is determined at container start, by setting the `SNAPSERVER_URL` environmental variable in the `run` command. Obviously, it should be set to the address of the container running the server (or any other). This causes confd to write an S6 run script that will run the client and connect to the given server. Check out the confd template under `/rootfs/etc/confd/templates/`

Running the client. Note the  `--device /dev/snd` which is the sound device on my Linux. it might be different in yours:
```
   docker run \
   -e SNAPSERVER_URL=172.17.0.4 \
   --device /dev/snd \
   ehudkaldor/snapcast:latest
```

when running as server, you can provide a few volumes to be used for specific purposes. Also note that port 1704 is the ports clients connect to, and port 1705 is the control port for SnapCast (change client groups, etc.):
```
  docker run \
  -d \
  --name snapcast \
  -p 1704:1704 \
  -p 1705:1705 \
  -v <a dir with your fifo stream files>:/streams \
  ehudkaldor/snapcast:latest
  ```
