# IoT Workshop - Hands-on Guide

คู่มือนี้จะแนะนำวิธีการใช้งาน Docker Compose เพื่อรัน IoT services สำหรับการทำ workshop

## สิ่งที่ต้องเตรียม

* Docker และ Docker Compose
* พื้นที่ว่างในเครื่องประมาณ 2GB
* การเชื่อมต่ออินเทอร์เน็ต (สำหรับดึง Docker images)

## วิธีใช้งาน

### 1. การเริ่มต้นใช้งาน

เริ่มต้น services ทั้งหมดด้วยคำสั่ง:
```bash
# เริ่มต้น services ทั้งหมด (จะทำงานในโหมด background)
docker-compose up -d

# ดูบันทึกการทำงานแบบต่อเนื่อง
docker-compose logs -f
```

### 2. การเข้าใช้งาน Services

**Node-RED**
* URL: http://localhost:1880
* การใช้งาน: สำหรับสร้าง flows การประมวลผลข้อมูล และสร้าง dashboard

**Mosquitto MQTT Broker**
* MQTT Port: 1883
* WebSocket Port: 9001
* การใช้งาน: สำหรับทดสอบการสื่อสารแบบ MQTT แบบเบาและมีประสิทธิภาพ

**EMQX MQTT Broker**
* MQTT Port: 1884
* WebSocket Port: 8083/8084
* Dashboard URL: http://localhost:18083
* Default Credentials: admin / public

### 3. การติดตั้ง MQTT Client สำหรับทดสอบ

#### MQTTX (Recommended)
1. ดาวน์โหลด: https://mqttx.app/
2. ติดตั้งและเปิดโปรแกรม
3. เชื่อมต่อกับ broker:
   - Host: localhost
   - Port: 1883 (Mosquitto) หรือ 1884 (EMQX)

### 4. Node-RED สำหรับ IoT

การติดตั้ง modules เพิ่มเติมที่ใช้ในเวิร์คช็อป:
1. เปิด Node-RED ที่ http://localhost:1880
2. ไปที่เมนู (≡) > Manage palette
3. เลือกแท็บ "Install" และติดตั้ง modules ต่อไปนี้:
   - node-red-dashboard
   - node-red-contrib-mqtt-broker
   - node-red-contrib-modbus
   - node-red-contrib-influxdb

### 5. การหยุดการทำงาน

เมื่อเสร็จสิ้นการใช้งาน หยุด services ด้วยคำสั่ง:
```bash
docker-compose down
```

## โครงสร้างไดเรกทอรี

```
hands-on/
├── docker-compose.yml   # ไฟล์หลักสำหรับ Docker Compose
├── .env                 # ตัวแปรสิ่งแวดล้อม
├── mosquitto/           # ไดเรกทอรีสำหรับ Mosquitto
│   ├── config/          # การตั้งค่า Mosquitto
│   ├── data/            # ข้อมูล persistence
│   └── log/             # บันทึกการทำงาน
├── node-red/            # ไดเรกทอรีสำหรับ Node-RED
│   └── data/            # ข้อมูล flows และการตั้งค่า
└── emqx/                # ไดเรกทอรีสำหรับ EMQX
    ├── data/            # ข้อมูล persistence
    └── log/             # บันทึกการทำงาน
```

## ตัวอย่างการใช้งาน MQTT ด้วย Command Line

### การรับข้อมูล (Subscribe)
```bash
# สำหรับ Mosquitto
mosquitto_sub -h localhost -p 1883 -t "test/topic"

# สำหรับ EMQX
mosquitto_sub -h localhost -p 1884 -t "test/topic"
```

### การส่งข้อมูล (Publish)
```bash
# สำหรับ Mosquitto
mosquitto_pub -h localhost -p 1883 -t "test/topic" -m "Hello MQTT"

# สำหรับ EMQX
mosquitto_pub -h localhost -p 1884 -t "test/topic" -m "Hello MQTT"
```

## การใช้งานร่วมกับเนื้อหาบทเรียน

* **บทที่ 2: MQTT** - ใช้ Mosquitto/EMQX เพื่อเรียนรู้โปรโตคอล MQTT
* **บทที่ 3: WebSocket** - ใช้ Node-RED เพื่อเรียนรู้การสื่อสารแบบ WebSocket
* **บทที่ 4: Modbus** - ใช้ Node-RED และ module Modbus
* **บทที่ 5: การจัดการ IoT ด้วย Node-RED** - ใช้ Node-RED ในการสร้าง dashboard และระบบควบคุม
* **บทที่ 7: การติดตั้งบนระบบคลาวด์** - เริ่มจากการใช้งาน Docker ก่อนอัปเกรดสู่คลาวด์
* **บทที่ 9: ความปลอดภัยและ IoT ขั้นสูง** - เรียนรู้การตั้งค่าความปลอดภัยใน MQTT

หากพบปัญหาหรือมีข้อสงสัย สามารถซักถามได้ในห้องเรียนหรือตาม GitHub: https://github.com/racksync
