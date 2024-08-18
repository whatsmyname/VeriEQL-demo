#!/bin/bash

CONTAINER_NAME=verieql


if [ ! "$(docker ps -a | grep $CONTAINER_NAME)" ]; then
    docker build -t verieql .
    docker run -d -p 3000:3000 -p 8000:8000 --name $CONTAINER_NAME verieql
else
    docker start $CONTAINER_NAME
fi
