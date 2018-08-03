from inotify_simple import INotify, flags
import subprocess

inotify = INotify()
watch_flags = flags.CREATE | flags.DELETE | flags.MODIFY | flags.DELETE_SELF
wd = inotify.add_watch('/opt/music', watch_flags)
while True:
    for event in inotify.read():
        print(event)
        subprocess.Popen(["python2", "/usr/bin/mopidy", "local", "scan"])
