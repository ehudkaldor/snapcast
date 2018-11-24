from inotify_simple import INotify, flags
import os
import subprocess

def recursively_watch(inotify, root_folder, flags):
    """Recursively watch all files and directories under the given root folder, not
    following links. Returns a dictionary that maps watch descriptors to filepaths."""
    watches = {}
    for folder, _, filenames in os.walk(root_folder):
        filepaths = [os.path.join(folder, filename) for filename in filenames]
        for path in [folder] + filepaths:
            try:
                wd = inotify.add_watch(path, flags)
                watches[wd] = path
                print(f"added watch to dir {wd}")
            except FileNotFoundError:
                # Broken link or deleted
                pass
    return watches


print("fs-watcher starting...")
inotify = INotify()
watch_flags = flags.CREATE | flags.DELETE | flags.MODIFY | flags.DELETE_SELF
# wd = inotify.add_watch('/opt/music', watch_flags)
watches = recursively_watch(inotify, '/opt/music', watch_flags)
while True:
    for event in inotify.read():
        print(event)
        subprocess.Popen(["python2", "/usr/bin/mopidy", "local", "scan"])
