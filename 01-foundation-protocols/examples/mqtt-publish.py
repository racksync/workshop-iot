#!/usr/bin/env python3
"""
ตัวอย่างการใช้งาน MQTT Client แบบ Publisher ด้วย Python
สำหรับประกอบการเรียนการสอนในบทที่ 1: โปรโตคอลพื้นฐาน
"""

import paho.mqtt.client as mqtt
import time
import json
import random
from datetime import datetime

# กำหนดค่าการเชื่อมต่อ
MQTT_BROKER = "localhost"  # ที่อยู่ MQTT Broker
MQTT_PORT = 1883  # พอร์ตมาตรฐาน
MQTT_TOPIC = "sensor/temperature"  # หัวข้อที่จะส่งข้อมูล
CLIENT_ID = f"python-mqtt-publisher-{random.randint(0, 1000)}"  # ID ของ client

# ฟังก์ชันเมื่อเชื่อมต่อสำเร็จ
def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print(f"เชื่อมต่อกับ MQTT Broker สำเร็จ!")
    else:
        print(f"เชื่อมต่อล้มเหลว (รหัส {rc})")

# ฟังก์ชันเมื่อส่งข้อความสำเร็จ
def on_publish(client, userdata, mid):
    print(f"ข้อความถูกส่งสำเร็จ (ID: {mid})")

# สร้าง MQTT client
client = mqtt.Client(CLIENT_ID)
client.on_connect = on_connect
client.on_publish = on_publish

# เชื่อมต่อกับ broker
print(f"กำลังเชื่อมต่อกับ {MQTT_BROKER}:{MQTT_PORT}")
client.connect(MQTT_BROKER, MQTT_PORT, 60)

# เริ่มการทำงานของ client ในเธรดแยก
client.loop_start()

try:
    # ส่งข้อความทุก 5 วินาที
    while True:
        # สร้างข้อมูลจำลองของเซ็นเซอร์อุณหภูมิ
        temperature = round(20.0 + random.random() * 10.0, 1)
        humidity = round(30.0 + random.random() * 40.0, 1)
        
        # สร้างข้อมูลแบบ JSON
        payload = {
            "temperature": temperature,
            "humidity": humidity, 
            "unit": "celsius",
            "timestamp": datetime.now().isoformat()
        }
        
        # แปลงเป็น JSON string
        payload_json = json.dumps(payload)
        
        # ส่งข้อความ
        print(f"กำลังส่งข้อมูล: {payload_json}")
        client.publish(MQTT_TOPIC, payload_json, qos=1)
        
        # รอ 5 วินาที
        time.sleep(5)
        
except KeyboardInterrupt:
    print("ยกเลิกโดยผู้ใช้")
    
finally:
    # หยุดการทำงานและยกเลิกการเชื่อมต่อ
    client.loop_stop()
    client.disconnect()
    print("ยกเลิกการเชื่อมต่อ")
