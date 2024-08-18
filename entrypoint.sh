#!/bin/bash

cd /backend
nohup python3 -m uvicorn main:app --host 0.0.0.0 --reload --port 8000 &

cd /frontend/build
nohup python3 -m http.server 3000 &

exec tail -f /dev/null