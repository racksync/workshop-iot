# Node-RED Flow Exercises for IoT

## Exercise 1: Basic MQTT Communication
**Objective:** เข้าใจการสื่อสารพื้นฐานของ MQTT ใน Node-RED
**Difficulty:** Beginner [⭑]
**Requirements:** Node-RED, MQTT Broker (Mosquitto/EMQX), MQTT Client (MQTTX)
**Components:** MQTT In, MQTT Out, Debug
**Description:** สร้าง flow เพื่อเผยแพร่และสมัครสมาชิกในหัวข้อ MQTT ตรวจสอบการสื่อสารโดยใช้ debug node

## Exercise 2: Real-time Dashboard with MQTT
**Objective:** สร้างแดชบอร์ดแบบเรียลไทม์โดยใช้ข้อมูล MQTT
**Difficulty:** Beginner [⭑]
**Requirements:** Node-RED, MQTT Broker, Node-RED Dashboard
**Components:** MQTT In, Dashboard (Gauge, Chart)
**Description:** แสดงข้อมูลเซ็นเซอร์แบบเรียลไทม์บนแดชบอร์ดโดยใช้ MQTT

## Exercise 3: WebSocket Communication
**Objective:** ใช้การสื่อสาร WebSocket ใน Node-RED
**Difficulty:** Beginner [⭑]
**Requirements:** Node-RED, WebSocket Client
**Components:** WebSocket In, WebSocket Out, Debug
**Description:** สร้าง flow เพื่อส่งและรับข้อความผ่าน WebSocket

## Exercise 4: MQTT to WebSocket Bridge
**Objective:** สะพานเชื่อมข้อความ MQTT ไปยัง WebSocket
**Difficulty:** Intermediate [⭑⭑]
**Requirements:** Node-RED, MQTT Broker, WebSocket Client
**Components:** MQTT In, WebSocket Out, Debug
**Description:** สร้าง flow เพื่อส่งต่อข้อความ MQTT ไปยัง WebSocket client

## Exercise 5: Temperature Monitoring System
**Objective:** ตรวจสอบข้อมูลอุณหภูมิและแจ้งเตือน
**Difficulty:** Intermediate [⭑⭑]
**Requirements:** Node-RED, MQTT Broker, Temperature Sensor
**Components:** MQTT In, Function, Dashboard (Gauge, Notification)
**Description:** ตรวจสอบข้อมูลอุณหภูมิและแจ้งเตือนหากอุณหภูมิเกินค่าที่กำหนด

## Exercise 6: Data Logging to InfluxDB
**Objective:** บันทึกข้อมูลเซ็นเซอร์ลงใน InfluxDB
**Difficulty:** Intermediate [⭑⭑]
**Requirements:** Node-RED, MQTT Broker, InfluxDB
**Components:** MQTT In, InfluxDB Out
**Description:** บันทึกข้อมูลเซ็นเซอร์ที่ได้รับผ่าน MQTT ลงในฐานข้อมูล InfluxDB

## Exercise 7: Controlling Devices via MQTT
**Objective:** ควบคุมอุปกรณ์โดยใช้ข้อความ MQTT
**Difficulty:** Intermediate [⭑⭑]
**Requirements:** Node-RED, MQTT Broker, Actuator (e.g., LED)
**Components:** MQTT In, Function, GPIO Out
**Description:** ควบคุม actuator (เช่น LED) ตามข้อความ MQTT

## Exercise 8: Secure MQTT Communication with TLS
**Objective:** ใช้การสื่อสาร MQTT ที่ปลอดภัยโดยใช้ TLS
**Difficulty:** Advanced [⭑⭑⭑]
**Requirements:** Node-RED, MQTT Broker with TLS support, TLS Certificates
**Components:** MQTT In, MQTT Out, TLS Configuration
**Description:** กำหนดค่า Node-RED เพื่อสื่อสารกับ MQTT broker โดยใช้ TLS

## Exercise 9: JWT Authentication for HTTP Requests
**Objective:** ใช้ JWT สำหรับการยืนยันตัวตนของ HTTP requests
**Difficulty:** Advanced [⭑⭑⭑]
**Requirements:** Node-RED, JWT Token, HTTP API
**Components:** Function, HTTP Request
**Description:** ใช้ JWT ยืนยันตัวตนสำหรับการทำ HTTP requests ที่ปลอดภัย

## Exercise 10: Rate Limiting in Node-RED
**Objective:** จำกัดอัตราการรับข้อความที่เข้ามา
**Difficulty:** Advanced [⭑⭑⭑]
**Requirements:** Node-RED
**Components:** Delay, Function
**Description:** สร้าง flow เพื่อจำกัดอัตราการรับข้อความที่เข้ามาเพื่อป้องกันการโอเวอร์โหลด

## Exercise 11: Real-time Data Transformation
**Objective:** แปลงข้อมูลแบบเรียลไทม์โดยใช้ Node-RED
**Difficulty:** Intermediate [⭑⭑]
**Requirements:** Node-RED, MQTT Broker
**Components:** MQTT In, Function, MQTT Out
**Description:** แปลงข้อมูล MQTT ที่เข้ามาและเผยแพร่ข้อมูลที่แปลงแล้วไปยังหัวข้ออื่น

## Exercise 12: Integrating with Cloud Services
**Objective:** รวม Node-RED กับบริการคลาวด์ (เช่น AWS, Azure)
**Difficulty:** Advanced [⭑⭑⭑]
**Requirements:** Node-RED, Cloud Service Account
**Components:** HTTP Request, Function
**Description:** ส่งข้อมูลจาก Node-RED ไปยังบริการคลาวด์เพื่อการประมวลผลเพิ่มเติม

## Exercise 13: Creating a REST API with Node-RED
**Objective:** สร้าง REST API โดยใช้ Node-RED
**Difficulty:** Intermediate [⭑⭑]
**Requirements:** Node-RED
**Components:** HTTP In, HTTP Response, Function
**Description:** สร้าง REST API เพื่อจัดการ HTTP requests และตอบกลับด้วยข้อมูล

## Exercise 14: Implementing OAuth2 Authentication
**Objective:** ใช้ OAuth2 สำหรับการยืนยันตัวตนของ API requests
**Difficulty:** Advanced [⭑⭑⭑]
**Requirements:** Node-RED, OAuth2 Provider
**Components:** HTTP Request, Function
**Description:** ใช้ OAuth2 ยืนยันตัวตนสำหรับการทำ API requests ที่ปลอดภัย

## Exercise 15: Real-time Notifications with WebSocket
**Objective:** ส่งการแจ้งเตือนแบบเรียลไทม์โดยใช้ WebSocket
**Difficulty:** Intermediate [⭑⭑]
**Requirements:** Node-RED, WebSocket Client
**Components:** WebSocket Out, Function
**Description:** ส่งการแจ้งเตือนแบบเรียลไทม์ไปยัง WebSocket client ตามเหตุการณ์ที่กำหนด

## Exercise 16: Data Aggregation and Analysis
**Objective:** รวมและวิเคราะห์ข้อมูลใน Node-RED
**Difficulty:** Advanced [⭑⭑⭑]
**Requirements:** Node-RED, MQTT Broker, Database (e.g., InfluxDB)
**Components:** MQTT In, Function, Database Out
**Description:** รวมข้อมูลที่เข้ามาและทำการวิเคราะห์ก่อนที่จะบันทึกลงในฐานข้อมูล

## Exercise 17: Implementing a Digital Twin
**Objective:** สร้าง digital twin ของอุปกรณ์จริง
**Difficulty:** Advanced [⭑⭑⭑]
**Requirements:** Node-RED, MQTT Broker, Digital Twin Model
**Components:** MQTT In, Function, Dashboard
**Description:** สร้าง digital twin เพื่อจำลองและตรวจสอบสถานะของอุปกรณ์จริง

## Exercise 18: Automated Device Management
**Objective:** จัดการอุปกรณ์อัตโนมัติ
**Difficulty:** Intermediate [⭑⭑]
**Requirements:** Node-RED, MQTT Broker, Devices
**Components:** MQTT In, Function, MQTT Out
**Description:** จัดการงานต่างๆ เช่น การอัปเดตเฟิร์มแวร์และการเปลี่ยนแปลงการกำหนดค่าสำหรับอุปกรณ์ที่เชื่อมต่อ

## Exercise 19: Implementing Geofencing
**Objective:** ใช้ geofencing สำหรับการกระทำตามตำแหน่งที่ตั้ง
**Difficulty:** Advanced [⭑⭑⭑]
**Requirements:** Node-RED, GPS Data Source
**Components:** MQTT In, Function, Notification
**Description:** สร้าง flow เพื่อกระตุ้นการกระทำตามตำแหน่งที่ตั้งของอุปกรณ์

## Exercise 20: Predictive Maintenance with Machine Learning
**Objective:** ใช้ machine learning สำหรับการบำรุงรักษาเชิงพยากรณ์
**Difficulty:** Advanced [⭑⭑⭑]
**Requirements:** Node-RED, Machine Learning Model, MQTT Broker
**Components:** MQTT In, Function, Database Out
**Description:** ใช้ machine learning เพื่อวิเคราะห์ข้อมูลเซ็นเซอร์และพยากรณ์การเสียหาย
