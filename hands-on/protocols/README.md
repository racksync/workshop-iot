# แบบฝึกหัดการพัฒนาโปรแกรมสำหรับ MQTT, WebSocket และ REST API

## Exercise 1: MQTT Client พื้นฐานด้วย JavaScript
**Objective:** เรียนรู้การพัฒนา MQTT Client ด้วย JavaScript เพื่อเชื่อมต่อกับ MQTT Broker
**Difficulty:** Beginner [⭑]
**Requirements:** Node.js, MQTT Broker (Mosquitto/EMQX), mqtt.js library
**Components:** MQTT Connection, Subscribe, Publish
**Description:** พัฒนา JavaScript Client ที่เชื่อมต่อกับ MQTT Broker สามารถรับและส่งข้อความผ่าน topics ต่างๆ และจัดการกับการตัดการเชื่อมต่อได้อย่างเหมาะสม

## Exercise 2: MQTT Client พื้นฐานด้วย Python
**Objective:** พัฒนา MQTT Client ด้วย Python เพื่อรับส่งข้อมูลกับ MQTT Broker
**Difficulty:** Beginner [⭑]
**Requirements:** Python, paho-mqtt library, MQTT Broker
**Components:** MQTT Connection, Subscribe, Publish, Callbacks
**Description:** สร้างแอปพลิเคชัน Python ที่เชื่อมต่อกับ MQTT Broker โดยมีการจัดการกับ callbacks เมื่อมีการเชื่อมต่อ, รับข้อความ และสามารถทำงานต่อเมื่อสถานะการเชื่อมต่อเปลี่ยนแปลง

## Exercise 3: WebSocket Server ด้วย JavaScript
**Objective:** เรียนรู้การสร้าง WebSocket Server ด้วย Node.js เพื่อการสื่อสารแบบ real-time
**Difficulty:** Intermediate [⭑⭑]
**Requirements:** Node.js, ws library, Web browser
**Components:** WebSocket Server, Client Connection Management
**Description:** พัฒนา WebSocket Server โดยใช้ Node.js สามารถรับการเชื่อมต่อจาก clients หลายตัว จัดการกับการเชื่อมต่อ/ยกเลิกการเชื่อมต่อ และกระจายข้อความไปยัง clients ทั้งหมด

## Exercise 4: WebSocket Client ด้วย Python
**Objective:** พัฒนา WebSocket Client ด้วย Python เพื่อเชื่อมต่อกับ WebSocket Server
**Difficulty:** Intermediate [⭑⭑]
**Requirements:** Python, websocket-client library
**Components:** WebSocket Connection, Message Handling
**Description:** สร้างแอปพลิเคชัน Python ที่สามารถเชื่อมต่อกับ WebSocket Server ส่งและรับข้อความแบบ real-time และจัดการกับการเชื่อมต่อที่ขาดหายได้อย่างเหมาะสม

## Exercise 5: MQTT-WebSocket Bridge
**Objective:** สร้างตัวกลางเชื่อมต่อระหว่าง MQTT และ WebSocket เพื่อการสื่อสารระหว่างระบบ
**Difficulty:** Advanced [⭑⭑⭑]
**Requirements:** Node.js, mqtt.js, ws library, MQTT Broker
**Components:** MQTT Client, WebSocket Server, Message Transformation
**Description:** พัฒนาแอปพลิเคชันตัวกลางที่เชื่อมต่อกับ MQTT Broker และเปิด WebSocket Server เพื่อส่งต่อข้อมูลระหว่างสองโปรโตคอล ช่วยให้เว็บแอปพลิเคชันสามารถรับข้อมูลจาก IoT devices ผ่าน WebSocket

## Exercise 6: Dashboard แบบ Real-time ด้วย MQTT และ WebSocket
**Objective:** สร้าง Web Dashboard ที่แสดงข้อมูลจาก MQTT แบบ real-time ผ่าน WebSocket
**Difficulty:** Intermediate [⭑⭑]
**Requirements:** HTML, JavaScript, CSS, MQTT-WebSocket Bridge
**Components:** Web Frontend, WebSocket Client, Chart.js
**Description:** พัฒนา Web Dashboard ที่เชื่อมต่อกับ MQTT-WebSocket Bridge เพื่อแสดงข้อมูลจากเซ็นเซอร์แบบ real-time โดยใช้กราฟและเกจวัด รวมถึงการแจ้งเตือนเมื่อข้อมูลเกินค่าที่กำหนด

## Exercise 7: REST API ที่ทำงานร่วมกับ MQTT
**Objective:** สร้าง REST API ที่สามารถส่งและรับข้อมูลผ่าน MQTT
**Difficulty:** Intermediate [⭑⭑]
**Requirements:** Node.js, Express.js, mqtt.js, MQTT Broker
**Components:** REST API, MQTT Client, Request Handling
**Description:** พัฒนา REST API ด้วย Express.js ที่เชื่อมต่อกับ MQTT Broker สามารถรับคำสั่งผ่าน HTTP และส่งต่อไปยัง MQTT topics รวมถึงสามารถดึงข้อมูลล่าสุดจาก MQTT และส่งกลับเป็น HTTP Response

## Exercise 8: Authentication สำหรับ MQTT และ WebSocket
**Objective:** เพิ่มระบบยืนยันตัวตนให้กับการเชื่อมต่อ MQTT และ WebSocket
**Difficulty:** Advanced [⭑⭑⭑]
**Requirements:** Node.js, MQTT Broker with Auth, JWT
**Components:** Authentication Service, Token Validation, Security
**Description:** พัฒนาระบบยืนยันตัวตนสำหรับ MQTT และ WebSocket โดยใช้ JWT (JSON Web Tokens) ตรวจสอบสิทธิ์ก่อนอนุญาตให้เชื่อมต่อกับ broker หรือ server และกำหนดสิทธิ์ในการเข้าถึง topics ต่างๆ

## Exercise 9: ระบบแจ้งเตือนแบบ Real-time ด้วย WebSocket
**Objective:** สร้างระบบแจ้งเตือนแบบ real-time โดยใช้ WebSocket
**Difficulty:** Intermediate [⭑⭑]
**Requirements:** Node.js, ws library, Web Frontend
**Components:** Notification Service, WebSocket Server, Frontend Integration
**Description:** พัฒนาระบบแจ้งเตือนที่ส่งการแจ้งเตือนแบบ real-time ไปยังหน้าเว็บผ่าน WebSocket โดยสามารถจัดลำดับความสำคัญของการแจ้งเตือน และแสดงผลที่เหมาะสมบนหน้าเว็บไซต์

## Exercise 10: การแปลงและวิเคราะห์ข้อมูล IoT แบบ Real-time
**Objective:** พัฒนาระบบแปลงและวิเคราะห์ข้อมูลจาก IoT devices แบบ real-time
**Difficulty:** Advanced [⭑⭑⭑]
**Requirements:** Python, paho-mqtt, numpy, pandas
**Components:** Data Processing, Statistical Analysis, Alerts
**Description:** สร้างแอปพลิเคชัน Python ที่รับข้อมูลจาก MQTT topics แปลงข้อมูลดิบให้เป็นรูปแบบที่นำไปใช้งานได้ วิเคราะห์แนวโน้มและความผิดปกติ และส่งผลลัพธ์กลับไปยัง MQTT topics อื่นๆ

## Exercise 11: การรักษาความปลอดภัยของโปรโตคอล MQTT
**Objective:** เรียนรู้และนำไปใช้กับการรักษาความปลอดภัยสำหรับ MQTT
**Difficulty:** Advanced [⭑⭑⭑]
**Requirements:** OpenSSL, MQTT Broker with TLS, JavaScript/Python
**Components:** TLS/SSL, Certificate Management, Secure Communication
**Description:** พัฒนา Client ที่เชื่อมต่อกับ MQTT Broker ผ่านการเข้ารหัสด้วย TLS/SSL สร้างและจัดการ certificates สำหรับการยืนยันตัวตน และทดสอบการสื่อสารที่ปลอดภัย

## Exercise 12: การพัฒนาแอปพลิเคชัน IoT แบบครบวงจร
**Objective:** สร้างระบบ IoT ครบวงจรที่ใช้ MQTT, WebSocket และ REST API ร่วมกัน
**Difficulty:** Expert [⭑⭑⭑⭑]
**Requirements:** Node.js, Python, MQTT Broker, Database
**Components:** IoT Device Simulation, Backend, Frontend, Data Storage
**Description:** พัฒนาระบบ IoT ครบวงจรที่ประกอบด้วย (1) การจำลองอุปกรณ์ IoT ด้วย Python ที่ส่งข้อมูลผ่าน MQTT (2) Backend ที่รวม MQTT, WebSocket และ REST API (3) Web Dashboard สำหรับแสดงผลและควบคุมอุปกรณ์ (4) ระบบจัดเก็บข้อมูลลงฐานข้อมูล

## Exercise 13: การกำหนดสิทธิ์การเข้าถึง (Access Control) สำหรับ MQTT
**Objective:** เรียนรู้และพัฒนาระบบควบคุมสิทธิ์การเข้าถึงหัวข้อใน MQTT
**Difficulty:** Intermediate [⭑⭑]
**Requirements:** MQTT Broker (EMQX/Mosquitto), Node.js/Python
**Components:** ACL (Access Control List), Authentication, Authorization
**Description:** พัฒนาระบบที่กำหนดสิทธิ์ให้ clients ต่างๆ สามารถเข้าถึง topics เฉพาะที่ได้รับอนุญาตเท่านั้น เช่น client A สามารถ publish ไปยัง topic A แต่สามารถ subscribe ได้เฉพาะ topic B และ C เพื่อป้องกันการเข้าถึงข้อมูลที่ไม่ได้รับอนุญาต

## Exercise 14: ความปลอดภัยพื้นฐานสำหรับ REST API
**Objective:** เรียนรู้และนำหลักการความปลอดภัยพื้นฐานมาใช้กับ REST API
**Difficulty:** Beginner [⭑]
**Requirements:** Node.js, Express.js, HTTP Client
**Components:** Input Validation, Rate Limiting, HTTPS
**Description:** พัฒนา REST API ที่มีการป้องกันความปลอดภัยพื้นฐาน โดยมีการตรวจสอบความถูกต้องของข้อมูลที่รับเข้ามา (Input Validation), จำกัดจำนวนคำขอ (Rate Limiting), และการใช้การเข้ารหัสผ่าน HTTPS เพื่อป้องกันข้อมูลระหว่างการส่ง
