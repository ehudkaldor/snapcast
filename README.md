# Mopidy
Mopidy is an extensible music server that plays music from local disk, Spotify, SoundCloud, Google Play Music, and more. You edit the playlist from any phone, tablet, or computer using a range of MPD and web clients.
https://www.mopidy.com

This is a Docker image running Mopidy. It is based on [Alpine Linux](https://alpinelinux.org/) 3.7 using the edge-testing repository, and using [s6 overlay for containers](https://github.com/just-containers/s6-overlay) (more details on S6 [here](http://skarnet.org/software/s6/overview.html))

you can pull it directly from docker hub:
`docker pull ehudkaldor/mopidy`

or build it yourself, by cloning this repo and running:
`docker build -t whatever .`

when running, you can provide a few volumes to be used for specific purposes:
`docker run
  -d
  --name mopidy
  -v <a dir for database>:/opt/data              # optional, might be useful if the container restarts  
  -v <a dir for playlists>:/opt/playlists        # optional
  -v <a dir with your local music>:/opt/music    # optional, yes, but not providing it will leave you with no music
  -p 6680:6680
  ehudkaldor/mopidy:latest`
