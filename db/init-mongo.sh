#!/bin/bash

export $(grep -v '^#' .env | xargs)

mkdir -p tmp
rm -rf tmp/*

envsubst < init-mongo.js.template > tmp/init-mongo.js

docker compose up --build
