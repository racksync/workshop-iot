#!/usr/bin/env python3
"""
ตัวอย่างการใช้งาน MQTT Client แบบ Subscriber ด้วย Python
สำหรับประกอบการเรียนการสอนในบทที่ 1: โปรโตคอลพื้นฐาน
"""

import paho.mqtt.client as mqtt
import json
import random
import time

# กำหนดค่าการเชื่อมต่อ
MQTT_BROKER = "localhost"  # ที่อยู่ MQTT Broker
MQTT_PORT = 1883  # พอร์ตมาตรฐาน
MQTT_TOPIC = "sensor/#"  # หัวข้อที่จะรับข้อมูล (# คือรับทุกหัวข้อย่อยของ sensor)
CLIENT_ID = f"python-mqtt-subscriber-{random.randint(0, 1000)}"  # ID ของ client

# ฟังก์ชันเมื่อเชื่อมต่อสำเร็จ
def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print(f"เชื่อมต่อกับ MQTT Broker สำเร็จ!")
        
        # สมัครรับข้อความจากหัวข้อที่ต้องการ
        client.subscribe(MQTT_TOPIC)
        print(f"สมัครรับข้อมูลจากหัวข้อ: {MQTT_TOPIC}")
    else:
        print(f"เชื่อมต่อล้มเหลว (รหัส {rc})")

# ฟังก์ชันเมื่อได้รับข้อความ
def on_message(client, userdata, msg):
    # แสดงหัวข้อและข้อความที่ได้รับ
    print(f"ได้รับข้อความจากหัวข้อ: {msg.topic}")
    
    try:
        # พยายามแปลงข้อความเป็น JSON
        payload = json.loads(msg.payload.decode("utf-8"))
        print(f"ข้อมูลที่ได้รับ (JSON): {json.dumps(payload, indent=2, ensure_ascii=False)}")
        
        # ตัวอย่างการดึงค่าจาก JSON
        if "temperature" in payload:
            print(f"อุณหภูมิ: {payload['temperature']} {payload.get('unit', 'หน่วยไม่ระบุ')}")
        
    except json.JSONDecodeError:
        # หากแปลงเป็น JSON ไม่ได้ ให้แสดงเป็นข้อความธรรมดา
        print(f"ข้อมูลที่ได้รับ (ไม่ใช่ JSON): {msg.payload.decode('utf-8')}")
    
    print("-" * 50)

# สร้าง MQTT client
client = mqtt.Client(CLIENT_ID)
client.on_connect = on_connect
client.on_message = on_message

# เชื่อมต่อกับ broker
print(f"กำลังเชื่อมต่อกับ {MQTT_BROKER}:{MQTT_PORT}")
client.connect(MQTT_BROKER, MQTT_PORT, 60)

# รอรับข้อความตลอดเวลา (บล็อกการทำงาน)
try:
    client.loop_forever()
except KeyboardInterrupt:
    print("\nยกเลิกโดยผู้ใช้")
finally:
    # ยกเลิกการเชื่อมต่อ
    client.disconnect()
    print("ยกเลิกการเชื่อมต่อ")
