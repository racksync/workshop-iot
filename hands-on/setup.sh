#!/bin/bash
# Script สำหรับสร้างโครงสร้างไดเรกทอรี

# สร้างไดเรกทอรีและไฟล์ .gitkeep
mkdir -p mosquitto/config
mkdir -p mosquitto/data
mkdir -p mosquitto/log
mkdir -p node-red/data
mkdir -p emqx/data
mkdir -p emqx/log

touch mosquitto/data/.gitkeep
touch mosquitto/log/.gitkeep
touch node-red/data/.gitkeep
touch emqx/data/.gitkeep
touch emqx/log/.gitkeep

# ให้สิทธิ์การเข้าถึงไฟล์
chmod +x setup.sh

echo "สร้างโครงสร้างไดเรกทอรีเสร็จสมบูรณ์"
