#!/usr/bin/env python3
"""
Exercise : MQTT Client พื้นฐานด้วย Python

แบบฝึกหัดนี้จะเรียนรู้การพัฒนา MQTT Client ด้วย Python เพื่อเชื่อมต่อกับ MQTT Broker
โดยใช้ paho-mqtt library และการจัดการกับ callbacks ต่างๆ

การติดตั้ง paho-mqtt:
pip install paho-mqtt
"""

import paho.mqtt.client as mqtt
import json
import time
import random
import signal
import sys
from datetime import datetime
import uuid

# ---------- กำหนดค่าการเชื่อมต่อ ----------
MQTT_BROKER = "localhost"  # ที่อยู่ MQTT Broker
MQTT_PORT = 1883           # พอร์ต MQTT มาตรฐาน
CLIENT_ID = f"mqtt_python_client_{uuid.uuid4().hex[:8]}"  # สร้าง ID แบบสุ่มให้แต่ละ client
PUBLISH_TOPIC = "workshop/exercise2/data"    # หัวข้อที่จะส่งข้อมูล
SUBSCRIBE_TOPIC = "workshop/exercise2/command"  # หัวข้อที่จะรับข้อมูล

# เริ่มเวลาทำงานของโปรแกรม
START_TIME = time.time()

# สถานะการเชื่อมต่อ
is_connected = False

# ---------- Callback Functions ----------

def on_connect(client, userdata, flags, rc):
    """เรียกเมื่อ client เชื่อมต่อกับ broker สำเร็จ"""
    global is_connected
    
    connection_codes = {
        0: "เชื่อมต่อสำเร็จ",
        1: "การเชื่อมต่อถูกปฏิเสธ - เวอร์ชัน protocol ไม่ถูกต้อง",
        2: "การเชื่อมต่อถูกปฏิเสธ - Client ID ไม่ถูกต้อง",
        3: "การเชื่อมต่อถูกปฏิเสธ - server ไม่พร้อมใช้งาน",
        4: "การเชื่อมต่อถูกปฏิเสธ - ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
        5: "การเชื่อมต่อถูกปฏิเสธ - ไม่ได้รับอนุญาต"
    }
    
    if rc == 0:
        is_connected = True
        print(f"[SUCCESS] {connection_codes.get(rc, 'รหัสไม่รู้จัก')}")
        
        # สมัครสมาชิกเพื่อรับข้อความ
        print(f"[INFO] กำลังสมัครสมาชิกหัวข้อ: {SUBSCRIBE_TOPIC}")
        client.subscribe(SUBSCRIBE_TOPIC)
        
        # เริ่มส่งข้อความเป็นระยะ
        start_periodic_publish(client)
    else:
        print(f"[ERROR] {connection_codes.get(rc, f'เกิดข้อผิดพลาดที่ไม่รู้จัก (รหัส {rc})')}")

def on_disconnect(client, userdata, rc):
    """เรียกเมื่อ client ถูกตัดการเชื่อมต่อจาก broker"""
    global is_connected
    is_connected = False
    if rc == 0:
        print("[INFO] ตัดการเชื่อมต่อโดยผู้ใช้")
    else:
        print(f"[WARN] การเชื่อมต่อถูกตัดโดยไม่คาดคิด รหัส = {rc} กำลังเริ่มเชื่อมต่อใหม่อัตโนมัติ...")

def on_subscribe(client, userdata, mid, granted_qos):
    """เรียกเมื่อการสมัครสมาชิก MQTT สำเร็จ"""
    print(f"[INFO] สมัครสมาชิกหัวข้อ {SUBSCRIBE_TOPIC} สำเร็จ ด้วย QoS: {granted_qos}")

def on_message(client, userdata, msg):
    """เรียกเมื่อได้รับข้อความใหม่"""
    print(f"[INFO] ได้รับข้อความจากหัวข้อ {msg.topic}: {msg.payload.decode()}")
    
    try:
        # แปลงข้อความเป็น JSON object
        data = json.loads(msg.payload.decode())
        print(f"[INFO] ข้อมูล JSON: {data}")
        
        # ตัวอย่างการตอบสนองต่อคำสั่งที่ได้รับ
        if 'command' in data:
            process_command(client, data['command'], data)
    except json.JSONDecodeError as e:
        print(f"[WARN] ข้อความไม่ใช่รูปแบบ JSON: {e}")

def on_publish(client, userdata, mid):
    """เรียกเมื่อข้อความถูกส่งสำเร็จ"""
    # เราสามารถใส่โค้ดเพื่อจัดการหลังจากข้อความถูกส่งได้ที่นี่
    pass

# ---------- ฟังก์ชันสำหรับส่งข้อความเป็นระยะ ----------
def publish_sensor_data(client):
    """สร้างและส่งข้อมูลเซ็นเซอร์จำลองไปยัง MQTT broker"""
    # สร้างข้อมูลจำลอง
    message = {
        "device": CLIENT_ID,
        "timestamp": datetime.now().isoformat(),
        "values": {
            "temperature": round(20 + random.random() * 10, 1),  # สุ่มอุณหภูมิ 20-30°C
            "humidity": round(40 + random.random() * 20, 1),     # สุ่มความชื้น 40-60%
            "pressure": round(1000 + random.random() * 30, 1)    # สุ่มความกดอากาศ 1000-1030 hPa
        }
    }
    
    # แปลงเป็น JSON string และส่ง
    payload = json.dumps(message)
    
    # ส่งข้อความ (QoS 0: ส่งครั้งเดียวไม่สนใจว่าถึงหรือไม่)
    client.publish(PUBLISH_TOPIC, payload, qos=0)
    print(f"[INFO] ส่งข้อความไปยัง {PUBLISH_TOPIC}: {payload}")

def start_periodic_publish(client):
    """เริ่มส่งข้อมูลเป็นระยะทุก 5 วินาที"""
    print("[INFO] เริ่มส่งข้อมูลไปยัง MQTT Broker ทุก 5 วินาที")
    
    # ให้ทดสอบส่งข้อมูลครั้งแรกทันที
    publish_sensor_data(client)
    
    # เราใช้ client loop_start() แทนการใช้ interval timer
    # ต้องใช้ตัวแปร global เพื่อให้ loop_forever สามารถเข้าถึงได้
    global last_publish_time
    last_publish_time = time.time()
    
def check_and_publish(client):
    """ตรวจสอบและส่งข้อมูลถ้าถึงเวลา"""
    global last_publish_time
    current_time = time.time()
    
    # ส่งข้อความทุก 5 วินาที
    if current_time - last_publish_time >= 5:
        publish_sensor_data(client)
        last_publish_time = current_time

# ---------- ฟังก์ชันประมวลผลคำสั่ง ----------
def process_command(client, command, data):
    """ประมวลผลคำสั่งที่ได้รับผ่าน MQTT"""
    print(f"[INFO] ประมวลผลคำสั่ง: {command}")
    
    if command.lower() == "ping":
        # ตอบกลับคำสั่ง ping ด้วย pong
        response = {
            "type": "response",
            "to": data.get("from", "unknown"),
            "from": CLIENT_ID,
            "command": "pong",
            "timestamp": datetime.now().isoformat()
        }
        client.publish(f"{SUBSCRIBE_TOPIC}/response", json.dumps(response))
        print("[INFO] ตอบกลับคำสั่ง ping ด้วย pong")
    
    elif command.lower() == "status":
        # ส่งข้อมูลสถานะของ client
        status = {
            "type": "status",
            "device": CLIENT_ID,
            "timestamp": datetime.now().isoformat(),
            "uptime": round(time.time() - START_TIME),
            "connected": is_connected
        }
        client.publish(f"{SUBSCRIBE_TOPIC}/response", json.dumps(status))
        print("[INFO] ส่งข้อมูลสถานะแล้ว")
    
    else:
        print(f"[WARN] ไม่รู้จักคำสั่ง: {command}")

# ---------- ฟังก์ชันจัดการสัญญาณปิดโปรแกรม ----------
def signal_handler(sig, frame):
    """จัดการเมื่อได้รับสัญญาณ SIGINT (Ctrl+C)"""
    print("\n[INFO] กำลังปิดการเชื่อมต่อ MQTT...")
    client.disconnect()
    print("[INFO] ปิดการเชื่อมต่อเรียบร้อย")
    sys.exit(0)

# ---------- ฟังก์ชันหลัก ----------
if __name__ == "__main__":
    # จัดการสัญญาณ SIGINT (Ctrl+C)
    signal.signal(signal.SIGINT, signal_handler)
    
    # สร้าง MQTT client instance
    client = mqtt.Client(client_id=CLIENT_ID)
    
    # กำหนด callback functions
    client.on_connect = on_connect
    client.on_disconnect = on_disconnect
    client.on_subscribe = on_subscribe
    client.on_message = on_message
    client.on_publish = on_publish
    
    # ถ้าต้องการใช้ username และ password ให้เปิดใช้งานบรรทัดด้านล่าง
    client.username_pw_set("mqtt", "mqtt1234")
    
    # กำหนดค่า will message (ข้อความที่จะส่งเมื่อ client หลุดการเชื่อมต่อโดยไม่ได้ตั้งใจ)
    will_message = {
        "device": CLIENT_ID,
        "status": "disconnected",
        "timestamp": datetime.now().isoformat()
    }
    client.will_set("workshop/clients/status", json.dumps(will_message), qos=1, retain=False)
    
    # เริ่มการเชื่อมต่อ
    print(f"[INFO] กำลังเชื่อมต่อกับ MQTT broker: {MQTT_BROKER}:{MQTT_PORT}")
    print(f"[INFO] Client ID: {CLIENT_ID}")
    
    try:
        client.connect(MQTT_BROKER, MQTT_PORT, keepalive=60)
        
        # เริ่ม network loop ในอีก thread (ไม่บล็อกโปรแกรมหลัก)
        client.loop_start()
        
        # วน loop เพื่อส่งข้อมูลเป็นระยะและทำงานอื่นๆ
        while True:
            if is_connected:
                check_and_publish(client)
            time.sleep(1)  # หน่วงเวลาเพื่อลดการใช้ CPU
        
    except KeyboardInterrupt:
        print("\n[INFO] กำลังปิดโปรแกรม...")
    except Exception as e:
        print(f"[ERROR] เกิดข้อผิดพลาด: {e}")
    finally:
        # ตัดการเชื่อมต่อและหยุด loop
        client.loop_stop()
        client.disconnect()

"""
คำแนะนำในการทดสอบ MQTT Client นี้:

1. ตรวจสอบให้แน่ใจว่ามี MQTT Broker ทำงานอยู่ที่ localhost:1883
   ถ้า Broker อยู่ที่อื่น ให้แก้ไขค่า MQTT_BROKER และ MQTT_PORT

2. รันโปรแกรมด้วยคำสั่ง: python 02-mqtt-python-client.py

3. ใช้ MQTT Client ตัวอื่น (เช่น MQTT Explorer, Mosquitto Client) เพื่อ:
   - Subscribe หัวข้อ: workshop/exercise2/data เพื่อดูข้อมูลที่ส่งจาก Client นี้
   - Publish ข้อความไปที่หัวข้อ: workshop/exercise2/command เพื่อส่งคำสั่ง
     ตัวอย่างคำสั่ง ping: {"command": "ping", "from": "user"}
     ตัวอย่างคำสั่ง status: {"command": "status"}

4. ทดลองปรับแต่งโปรแกรม:
   - เปลี่ยน topics
   - เพิ่มคำสั่งใหม่
   - ปรับแต่งรูปแบบข้อมูลที่ส่ง
   - เพิ่ม QoS ระดับต่างๆ (0, 1, 2)
"""
