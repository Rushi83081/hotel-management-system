#!/bin/bash
cd /hotel-management-system || exit 1

git pull origin main

docker compose down
docker compose up -d --build
docker image prune -f
