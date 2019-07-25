#!/bin/sh
for p in $(ps aux | grep snapserver | grep -v grep | awk '{print $1}'); do
  echo "killing pid $p"
  kill -9 $p
done
