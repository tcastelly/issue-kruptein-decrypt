#!/bin/bash

docker run --rm --name my-memcached \
  -p 11211:11211 \
  memcached:alpine
