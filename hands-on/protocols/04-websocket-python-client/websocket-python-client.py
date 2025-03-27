#!/usr/bin/env python3
"""
Exercise : WebSocket Client ด้วย Python

แบบฝึกหัดนี้จะเรียนรู้การพัฒนา WebSocket Client ด้วย Python
เพื่อเชื่อมต่อกับ WebSocket Server ส่งและรับข้อความแบบ real-time
และจัดการกับการเชื่อมต่อที่ขาดหายได้อย่างเหมาะสม

การติดตั้ง websocket-client library:
pip install websocket-client
"""

import websocket
import json
import threading
import time
import sys
import signal
import random
from datetime import datetime

# ---------- กำหนดค่าการเชื่อมต่อ ----------
WS_SERVER_URL = "ws://localhost:8080"  # URL ของ WebSocket Server
RECONNECT_DELAY = 5  # ระยะเวลารอก่อนลองเชื่อมต่อใหม่ (วินาที)
CLIENT_NAME = f"python-client-{random.randint(1000, 9999)}"  # ชื่อ client แบบสุ่ม

# ---------- ตัวแปรส่วนกลาง ----------
ws_app = None  # ตัวแปรสำหรับเก็บ WebSocket connection
is_connected = False  # สถานะการเชื่อมต่อ
client_id = None  # ID ที่ได้รับจาก server
should_reconnect = True  # ควรพยายามเชื่อมต่อใหม่หรือไม่
lock = threading.Lock()  # ใช้ในการป้องกันปัญหาการเข้าถึงตัวแปรพร้อมกันจากหลาย thread

# ---------- ฟังก์ชันสำหรับการจัดการเหตุการณ์ WebSocket ----------

def on_message(ws, message):
    """
    เรียกเมื่อได้รับข้อความจาก WebSocket Server
    
    Args:
        ws: WebSocket connection
        message: ข้อความที่ได้รับ
    """
    try:
        # แปลงข้อความ JSON เป็น dictionary
        data = json.loads(message)
        
        # จัดการกับข้อความตามประเภท
        if data.get("type") == "welcome":
            global client_id
            client_id = data.get("clientId")
            print(f"[SUCCESS] เชื่อมต่อสำเร็จ! คุณได้รับหมายเลข Client #{client_id}")
            
        elif data.get("type") == "message":
            sender = data.get("sender")
            text = data.get("text")
            
            # ถ้าเป็นข้อความที่ส่งจากตัวเอง
            if sender == client_id:
                print(f"[MESSAGE] คุณ: {text}")
            else:
                print(f"[MESSAGE] Client #{sender}: {text}")
                
        elif data.get("type") == "info":
            print(f"[INFO] {data.get('text')}")
            
        else:
            print(f"[RECEIVED] ได้รับข้อความ: {message}")
            
    except json.JSONDecodeError:
        # กรณีที่ข้อความไม่ใช่รูปแบบ JSON
        print(f"[RECEIVED] ได้รับข้อความ (ไม่ใช่ JSON): {message}")
    except Exception as e:
        print(f"[ERROR] เกิดข้อผิดพลาดในการประมวลผลข้อความ: {e}")

def on_error(ws, error):
    """
    เรียกเมื่อเกิดข้อผิดพลาดในการเชื่อมต่อ
    
    Args:
        ws: WebSocket connection
        error: ข้อผิดพลาดที่เกิดขึ้น
    """
    print(f"[ERROR] เกิดข้อผิดพลาดในการเชื่อมต่อ: {error}")

def on_close(ws, close_status_code, close_msg):
    """
    เรียกเมื่อการเชื่อมต่อถูกปิด
    
    Args:
        ws: WebSocket connection
        close_status_code: รหัสสถานะการปิด
        close_msg: ข้อความแสดงสถานะการปิด
    """
    global is_connected
    
    with lock:
        is_connected = False
    
    if close_status_code:
        print(f"[CLOSE] การเชื่อมต่อถูกปิด: Code={close_status_code}, Message={close_msg}")
    else:
        print("[CLOSE] การเชื่อมต่อถูกปิด")
    
    # พยายามเชื่อมต่อใหม่ถ้ากำหนดให้ทำ
    if should_reconnect:
        print(f"[INFO] กำลังพยายามเชื่อมต่อใหม่ในอีก {RECONNECT_DELAY} วินาที...")
        threading.Timer(RECONNECT_DELAY, connect).start()

def on_open(ws):
    """
    เรียกเมื่อการเชื่อมต่อเปิดสำเร็จ
    
    Args:
        ws: WebSocket connection
    """
    global is_connected
    
    with lock:
        is_connected = True
    
    print("[OPEN] เชื่อมต่อกับ WebSocket Server สำเร็จ")
    print("[INFO] พิมพ์ข้อความแล้วกด Enter เพื่อส่ง หรือพิมพ์ /help เพื่อดูคำสั่งที่ใช้ได้")
    
    # ส่งข้อความแนะนำตัวเมื่อเชื่อมต่อสำเร็จ
    introduction = {
        "type": "message",
        "text": f"สวัสดี! ฉันคือ {CLIENT_NAME} ที่เขียนด้วย Python"
    }
    ws.send(json.dumps(introduction))

# ---------- ฟังก์ชันสำหรับการเชื่อมต่อ WebSocket ----------

def connect():
    """เชื่อมต่อกับ WebSocket Server"""
    global ws_app
    
    # สร้าง WebSocket application
    ws_app = websocket.WebSocketApp(
        WS_SERVER_URL,
        on_open=on_open,
        on_message=on_message,
        on_error=on_error,
        on_close=on_close
    )
    
    # สร้าง thread สำหรับการทำงานของ WebSocket
    wst = threading.Thread(target=ws_app.run_forever)
    wst.daemon = True  # กำหนดให้เป็น daemon thread เพื่อให้ปิดพร้อมกับโปรแกรมหลัก
    wst.start()

# ---------- ฟังก์ชันสำหรับการส่งข้อความ ----------

def send_message(text):
    """
    ส่งข้อความไปยัง WebSocket Server
    
    Args:
        text: ข้อความที่จะส่ง
    
    Returns:
        bool: สถานะการส่งข้อความ (True = สำเร็จ, False = ล้มเหลว)
    """
    global ws_app, is_connected
    
    if not is_connected or not ws_app:
        print("[ERROR] ไม่สามารถส่งข้อความได้: ไม่ได้เชื่อมต่อกับ WebSocket Server")
        return False
    
    try:
        # สร้าง JSON object สำหรับข้อความ
        message = {
            "type": "message",
            "text": text,
            "timestamp": datetime.now().isoformat()
        }
        
        # ส่งข้อความในรูปแบบ JSON
        ws_app.send(json.dumps(message))
        return True
        
    except Exception as e:
        print(f"[ERROR] เกิดข้อผิดพลาดในการส่งข้อความ: {e}")
        return False

# ---------- ฟังก์ชันสำหรับการประมวลผลคำสั่ง ----------

def process_command(command):
    """
    ประมวลผลคำสั่งที่ผู้ใช้ป้อนในโหมด interactive
    
    Args:
        command: คำสั่งที่ผู้ใช้ป้อน
    
    Returns:
        bool: True หากโปรแกรมควรทำงานต่อ, False หากควรปิดโปรแกรม
    """
    cmd_lower = command.lower().strip()
    
    # คำสั่งพิเศษขึ้นต้นด้วย /
    if cmd_lower.startswith("/"):
        parts = cmd_lower.split(" ", 1)
        main_cmd = parts[0]
        
        if main_cmd == "/help":
            print("""
คำสั่งที่ใช้ได้:
  /help                - แสดงข้อความช่วยเหลือนี้
  /exit หรือ /quit     - ออกจากโปรแกรม
  /status              - แสดงสถานะการเชื่อมต่อ
  /reconnect           - เชื่อมต่อใหม่กับ WebSocket Server
  /id                  - แสดงหมายเลข Client ID
            """)
            return True
            
        elif main_cmd in ["/exit", "/quit"]:
            return False
            
        elif main_cmd == "/status":
            status = "เชื่อมต่อแล้ว" if is_connected else "ไม่ได้เชื่อมต่อ"
            print(f"[STATUS] สถานะการเชื่อมต่อ: {status}")
            return True
            
        elif main_cmd == "/reconnect":
            print("[INFO] กำลังพยายามเชื่อมต่อใหม่...")
            
            # ถ้ามีการเชื่อมต่ออยู่แล้ว ให้ปิดก่อน
            if is_connected and ws_app:
                ws_app.close()
            
            # เริ่มการเชื่อมต่อใหม่
            connect()
            return True
            
        elif main_cmd == "/id":
            if client_id:
                print(f"[INFO] Client ID ของคุณคือ #{client_id}")
            else:
                print("[INFO] ยังไม่ได้รับ Client ID (อาจยังไม่ได้เชื่อมต่อ)")
            return True
            
        else:
            print(f"[ERROR] ไม่รู้จักคำสั่ง: {main_cmd}")
            print("พิมพ์ /help เพื่อดูคำสั่งที่ใช้ได้")
            return True
    
    # ถ้าไม่ใช่คำสั่งพิเศษ ให้ส่งเป็นข้อความปกติ
    if is_connected:
        send_message(command)
    else:
        print("[ERROR] ไม่สามารถส่งข้อความได้: ไม่ได้เชื่อมต่อกับ WebSocket Server")
    
    return True

# ---------- ฟังก์ชันสำหรับการจัดการสัญญาณปิดโปรแกรม ----------

def signal_handler(sig, frame):
    """
    จัดการเมื่อได้รับสัญญาณให้ปิดโปรแกรม (เช่น Ctrl+C)
    
    Args:
        sig: สัญญาณที่ได้รับ
        frame: frame ของโปรแกรม
    """
    print("\n[INFO] กำลังปิดการเชื่อมต่อ WebSocket...")
    
    global should_reconnect
    should_reconnect = False
    
    if ws_app:
        ws_app.close()
    
    print("[INFO] ปิดการเชื่อมต่อเรียบร้อย")
    sys.exit(0)

# ---------- ฟังก์ชัน interactive mode สำหรับพิมพ์ข้อความ ----------

def interactive_mode():
    """
    โหมดโต้ตอบสำหรับการพิมพ์ข้อความและคำสั่งจากผู้ใช้
    """
    try:
        while True:
            try:
                # รับข้อความจากผู้ใช้
                user_input = input("> ")
                
                # ประมวลผลข้อความ/คำสั่ง
                should_continue = process_command(user_input)
                
                if not should_continue:
                    break
                    
            except EOFError:
                # กรณีกด Ctrl+D
                break
                
    finally:
        print("\n[INFO] กำลังปิดโปรแกรม...")
        
        # ปิดการเชื่อมต่อ
        global should_reconnect
        should_reconnect = False
        
        if ws_app:
            ws_app.close()

# ---------- ฟังก์ชันหลัก ----------

def main():
    """ฟังก์ชันหลักของโปรแกรม"""
    # จัดการสัญญาณ SIGINT (Ctrl+C)
    signal.signal(signal.SIGINT, signal_handler)
    
    print(f"[INFO] WebSocket Client ด้วย Python")
    print(f"[INFO] กำลังเชื่อมต่อกับ WebSocket Server: {WS_SERVER_URL}")
    print(f"[INFO] ชื่อ Client: {CLIENT_NAME}")
    
    # เริ่มการเชื่อมต่อ
    connect()
    
    # รอให้การเชื่อมต่อเริ่มต้น
    time.sleep(1)
    
    # เริ่มโหมดโต้ตอบ
    interactive_mode()

if __name__ == "__main__":
    main()

"""
คำแนะนำในการทดสอบ WebSocket Client นี้:

1. รัน WebSocket Server ก่อน:
   node 03-websocket-server.js

2. รันโปรแกรม WebSocket Client นี้:
   python 04-websocket-python-client.py

3. คำสั่งที่ใช้ได้:
   - พิมพ์ข้อความปกติเพื่อส่ง
   - /help       - แสดงรายการคำสั่งที่ใช้ได้
   - /exit       - ปิดโปรแกรม
   - /status     - แสดงสถานะการเชื่อมต่อ
   - /reconnect  - เชื่อมต่อใหม่กับ server
   - /id         - แสดงหมายเลข client

4. ทดลองทดสอบการทำงานร่วมกับ WebSocket Server:
   - เปิด browser และเข้าถึง http://localhost:8080 เพื่อเปิด web client
   - ทดสอบส่งข้อความระหว่าง Python client และ web client
   - ทดสอบปิด server และรันใหม่เพื่อทดสอบการเชื่อมต่อใหม่อัตโนมัติ

5. ทดลองปรับแต่งโปรแกรม:
   - เพิ่มคุณสมบัติการเข้ารหัสข้อความ
   - เพิ่มการยืนยันตัวตน
   - เพิ่มคำสั่งพิเศษสำหรับ client
   - บันทึกประวัติการสนทนา
"""
