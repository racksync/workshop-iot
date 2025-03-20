#!/usr/bin/env python3
"""
Exercise 10: การแปลงและวิเคราะห์ข้อมูล IoT แบบ Real-time

แบบฝึกหัดนี้จะพัฒนาระบบที่รับข้อมูลจาก MQTT topics แปลงข้อมูลดิบให้เป็นรูปแบบที่นำไปใช้งานได้
วิเคราะห์แนวโน้มและความผิดปกติ และส่งผลลัพธ์กลับไปยัง MQTT topics อื่นๆ

การติดตั้งไลบรารี:
pip install paho-mqtt numpy pandas
"""

import paho.mqtt.client as mqtt
import json
import time
import numpy as np
import pandas as pd
from datetime import datetime

# ---------- กำหนดค่าการเชื่อมต่อ ----------
MQTT_BROKER = "localhost"  # ที่อยู่ MQTT Broker
MQTT_PORT = 1883           # พอร์ต MQTT มาตรฐาน
CLIENT_ID = f"mqtt_data_analysis_{int(time.time())}"  # สร้าง ID แบบสุ่ม
INPUT_TOPIC = "sensor/data"       # หัวข้อ MQTT ที่รับข้อมูลดิบ
OUTPUT_TOPIC = "sensor/analysis"    # หัวข้อ MQTT ที่ส่งผลการวิเคราะห์

# ---------- ฟังก์ชันสำหรับการประมวลผลข้อมูล ----------

def preprocess_data(payload):
    """
    แปลงข้อมูลดิบให้อยู่ในรูปแบบที่พร้อมสำหรับการวิเคราะห์
    
    Args:
        payload (dict): ข้อมูลดิบจาก MQTT
    
    Returns:
        pandas.Series: ข้อมูลที่ผ่านการประมวลผลแล้ว
    """
    try:
        # ดึงค่าที่สนใจจาก payload
        temperature = payload.get("temperature")
        humidity = payload.get("humidity")
        pressure = payload.get("pressure")
        timestamp = payload.get("timestamp")
        
        # สร้าง pandas Series
        data = pd.Series({
            "temperature": temperature,
            "humidity": humidity,
            "pressure": pressure,
            "timestamp": timestamp
        })
        
        return data
    except Exception as e:
        print(f"[ERROR] เกิดข้อผิดพลาดในการประมวลผลข้อมูล: {e}")
        return None

def analyze_data(data):
    """
    วิเคราะห์ข้อมูลและตรวจหาความผิดปกติ
    
    Args:
        data (pandas.Series): ข้อมูลที่ผ่านการประมวลผลแล้ว
    
    Returns:
        dict: ผลการวิเคราะห์
    """
    try:
        # คำนวณค่าสถิติพื้นฐาน
        mean_temp = data["temperature"].mean()
        max_temp = data["temperature"].max()
        min_temp = data["temperature"].min()
        
        # ตรวจสอบความผิดปกติ (ตัวอย่างง่ายๆ)
        is_anomaly = data["temperature"].iloc[-1] > 35  # ถ้าอุณหภูมิล่าสุดสูงกว่า 35°C ถือว่าผิดปกติ
        
        # สร้างผลลัพธ์
        analysis_result = {
            "mean_temperature": mean_temp,
            "max_temperature": max_temp,
            "min_temperature": min_temp,
            "is_anomaly": is_anomaly
        }
        
        return analysis_result
    except Exception as e:
        print(f"[ERROR] เกิดข้อผิดพลาดในการวิเคราะห์ข้อมูล: {e}")
        return None

# ---------- MQTT Callback Functions ----------

def on_connect(client, userdata, flags, rc):
    """เรียกเมื่อ client เชื่อมต่อกับ broker สำเร็จ"""
    if rc == 0:
        print("[SUCCESS] เชื่อมต่อกับ MQTT Broker สำเร็จ!")
        client.subscribe(INPUT_TOPIC)
        print(f"[INFO] กำลังสมัครสมาชิกหัวข้อ: {INPUT_TOPIC}")
    else:
        print(f"[ERROR] เกิดข้อผิดพลาดในการเชื่อมต่อ: {rc}")

def on_message(client, userdata, msg):
    """เรียกเมื่อได้รับข้อความใหม่"""
    try:
        # แปลงข้อความเป็น JSON
        payload = json.loads(msg.payload.decode())
        print(f"[INFO] ได้รับข้อมูลจาก {msg.topic}: {payload}")
        
        # ประมวลผลข้อมูล
        processed_data = preprocess_data(payload)
        
        if processed_data is not None:
            # วิเคราะห์ข้อมูล
            analysis_result = analyze_data(processed_data)
            
            if analysis_result is not None:
                # สร้าง payload สำหรับส่งออก
                output_payload = {
                    "timestamp": datetime.now().isoformat(),
                    "analysis": analysis_result
                }
                
                # ส่งผลการวิเคราะห์ไปยัง MQTT topic
                client.publish(OUTPUT_TOPIC, json.dumps(output_payload))
                print(f"[INFO] ส่งผลการวิเคราะห์ไปยัง {OUTPUT_TOPIC}: {output_payload}")
            
    except json.JSONDecodeError as e:
        print(f"[WARN] ข้อความไม่ใช่รูปแบบ JSON: {e}")

# ---------- สร้าง MQTT Client ----------
client = mqtt.Client(client_id=CLIENT_ID)
client.on_connect = on_connect
client.on_message = on_message

# ---------- เริ่มการเชื่อมต่อ ----------
print(f"[INFO] กำลังเชื่อมต่อกับ MQTT broker: {MQTT_BROKER}:{MQTT_PORT}")
client.connect(MQTT_BROKER, MQTT_PORT, keepalive=60)

# ---------- Network Loop ----------
try:
    client.loop_forever()
except KeyboardInterrupt:
    print("\n[INFO] ปิดโปรแกรม...")
finally:
    client.disconnect()

"""
คำแนะนำในการทดสอบ:

1. ติดตั้ง MQTT Broker (เช่น Mosquitto)
2. ติดตั้งไลบรารีที่จำเป็น: pip install paho-mqtt numpy pandas
3. รันสคริปต์: python 10-realtime-data-analysis.py
4. ใช้ MQTT client (เช่น MQTT Explorer) เพื่อ publish ข้อมูลไปยัง topic "sensor/data"
   ตัวอย่าง payload:
   {
       "timestamp": "2023-10-27T10:00:00Z",
       "temperature": 28.5,
       "humidity": 60.2,
       "pressure": 1012.5
   }
5. Subscribe topic "sensor/analysis" เพื่อดูผลการวิเคราะห์
"""
