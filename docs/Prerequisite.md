# สิ่งที่ต้องเตรียมสำหรับ Workshop IoT

รายการสิ่งที่จำเป็นต้องเตรียมสำหรับการเข้าร่วม Workshop IoT แบ่งตามหมวดหมู่

## ฮาร์ดแวร์

| รายการ | วัตถุประสงค์ | ความจำเป็น |
|-------|-------------|-----------|
| **ESP8266/ESP32** | สำหรับทดลองเชื่อมต่อและส่งข้อมูล | จำเป็น (บทที่ 6) |
| **เซ็นเซอร์พื้นฐาน** (อุณหภูมิ, ความชื้น, แสง) | สำหรับอ่านค่าสภาพแวดล้อม | จำเป็น (บทที่ 6) |
| **บอร์ดทดลอง (Breadboard) และสายไฟ** | สำหรับต่อวงจรทดลอง | จำเป็น (บทที่ 6) |
| **สายเชื่อมต่อ USB** | เชื่อมต่ออุปกรณ์กับคอมพิวเตอร์ | จำเป็น (บทที่ 6) |
| **PLC** | สำหรับเรียนรู้การเชื่อมต่อ Modbus | แนะนำ (บทที่ 4) |
| **อุปกรณ์ Modbus RTU/TCP** | สำหรับทดลองโปรโตคอล Modbus | แนะนำ (บทที่ 4) |

## ซอฟต์แวร์และเครื่องมือพัฒนา

| รายการ | วัตถุประสงค์ | ความจำเป็น | ลิงก์ดาวน์โหลด |
|-------|-------------|-----------|---------------|
| **[Visual Studio Code](https://code.visualstudio.com/download)** | เครื่องมือพัฒนาโค้ด | จำเป็น | [ดาวน์โหลด](https://code.visualstudio.com/download) |
| **[Arduino IDE](https://www.arduino.cc/en/software)** | พัฒนาโค้ดสำหรับ ESP8266/ESP32 | จำเป็น (บทที่ 6) | [ดาวน์โหลด](https://www.arduino.cc/en/software) |
| **[Node-RED](https://nodered.org/)** | พัฒนาระบบ IoT แบบ Flow-based | จำเป็น (บทที่ 5-9) | [ดาวน์โหลด](https://nodered.org/docs/getting-started/local) |
| **[MQTT Broker](https://mqtt.org/)** (Mosquitto, EMQX) | เป็นตัวกลางในการรับส่งข้อมูล MQTT | จำเป็น (บทที่ 2, 5-9) | [Mosquitto](https://mosquitto.org/download/), [EMQX](https://www.emqx.io/downloads) |
| **[MQTTX](https://mqttx.app/)** | MQTT Client สำหรับทดสอบ | จำเป็น (บทที่ 2) | [ดาวน์โหลด](https://mqttx.app/) |
| **[MQTT Explorer](http://mqtt-explorer.com/)** | MQTT Client แบบมีหน้าจอสำรวจ Topics | แนะนำ (บทที่ 2) | [ดาวน์โหลด](http://mqtt-explorer.com/) |
| **[Postman](https://www.postman.com/downloads/)** | ทดสอบ API | จำเป็น (บทที่ 8-9) | [ดาวน์โหลด](https://www.postman.com/downloads/) |
| **[Docker](https://docs.docker.com/get-docker/)** | สร้างและจัดการคอนเทนเนอร์ | จำเป็น (บทที่ 7) | [ดาวน์โหลด](https://docs.docker.com/get-docker/) |
| **[Docker Compose](https://docs.docker.com/compose/install/)** | จัดการหลายคอนเทนเนอร์พร้อมกัน | จำเป็น (บทที่ 7) | [ดาวน์โหลด](https://docs.docker.com/compose/install/) |
| **Modbus Simulator** | จำลองอุปกรณ์ Modbus | แนะนำ (บทที่ 4) | หลายตัวเลือก |
| **[OpenSSL](https://www.openssl.org/)** | สร้าง SSL/TLS Certificates | จำเป็น (บทที่ 9) | [ดาวน์โหลด](https://www.openssl.org/) |

## บริการคลาวด์

| รายการ | วัตถุประสงค์ | แผนฟรี | ลิงก์สมัคร |
|-------|-------------|--------|-----------|
| **[EMQX Cloud](https://www.emqx.com/en/cloud)** | MQTT Broker แบบ Cloud | มี (มีข้อจำกัด) | [สมัคร](https://www.emqx.com/en/cloud) |
| **[HiveMQ Cloud](https://www.hivemq.com/mqtt-cloud-broker/)** | MQTT Broker แบบ Cloud | มี (จำกัดการเชื่อมต่อ) | [สมัคร](https://www.hivemq.com/mqtt-cloud-broker/) |
| **[Telegram](https://telegram.org)** | บริการแจ้งเตือน | ฟรี | [ดาวน์โหลด](https://telegram.org) |
| **บัญชีคลาวด์** (AWS, Azure, GCP) | สำหรับ Deploy ระบบ IoT | มี (Free Tier) | [AWS](https://aws.amazon.com/), [Azure](https://azure.microsoft.com/), [GCP](https://cloud.google.com/) |

## ความรู้พื้นฐาน

| ความรู้ | ระดับที่ต้องการ | บทที่เกี่ยวข้อง | แหล่งเรียนรู้ |
|--------|----------------|----------------|--------------|
| **เครือข่ายคอมพิวเตอร์** | พื้นฐาน | ทุกบท | [อ่านเพิ่มเติม](https://www.ibm.com/topics/networking) |
| **TCP/IP** | พื้นฐาน | บทที่ 1, 2, 3, 4 | [อ่านเพิ่มเติม](https://www.cloudflare.com/learning/ddos/glossary/tcp-ip/) |
| **IoT พื้นฐาน** | เริ่มต้น | บทที่ 0 | [อ่านเพิ่มเติม](https://www.iotforall.com/what-is-iot-simple-explanation) |
| **การเขียนโปรแกรม** | พื้นฐาน | ทุกบท | [อ่านเพิ่มเติม](https://www.w3schools.com/) |
| **JavaScript** | พื้นฐาน | บทที่ 5, 7, 8, 9 | [อ่านเพิ่มเติม](https://www.javascript.com/learn) |
| **MQTT** | พื้นฐาน | บทที่ 2, 5, 6, 7 | [อ่านเพิ่มเติม](https://mqtt.org/) |
| **Cloud Computing** | พื้นฐาน | บทที่ 7 | [อ่านเพิ่มเติม](https://azure.microsoft.com/en-us/overview/what-is-cloud-computing/) |
| **Network Security** | พื้นฐาน | บทที่ 9 | [อ่านเพิ่มเติม](https://www.cisco.com/c/en/us/products/security/what-is-network-security.html) |
| **HTTP** | พื้นฐาน | บทที่ 1, 8 | [อ่านเพิ่มเติม](https://developer.mozilla.org/en-US/docs/Web/HTTP) |
| **WebSocket** | พื้นฐาน | บทที่ 3 | [อ่านเพิ่มเติม](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) |

## เตรียมความพร้อมก่อนเริ่มเวิร์คช็อป

1. **ติดตั้งซอฟต์แวร์จำเป็น**
   - Visual Studio Code และ Arduino IDE
   - Node-RED และ MQTT Broker (Mosquitto หรือ EMQX)
   - MQTT Client (MQTTX หรือ MQTT Explorer)
   - Postman สำหรับการทดสอบ API

2. **เตรียมฮาร์ดแวร์**
   - ESP8266 หรือ ESP32 ที่พร้อมใช้งาน
   - เซ็นเซอร์พื้นฐาน (อุณหภูมิ, ความชื้น, แสง)
   - บอร์ดทดลองและสายไฟจำเป็น

3. **สมัครบริการคลาวด์**
   - บัญชี MQTT Broker แบบคลาวด์ (EMQX Cloud หรือ HiveMQ Cloud)
   - Telegram สำหรับระบบแจ้งเตือน
   - บัญชีทดลองของ AWS, Azure หรือ GCP (สำหรับบทเรียนขั้นสูง)

4. **ทบทวนความรู้พื้นฐาน**
   - หลักการทำงานของ IoT
   - พื้นฐานโปรโตคอล MQTT
   - การเขียนโปรแกรมพื้นฐาน

สำหรับคำถามเพิ่มเติมเกี่ยวกับการเตรียมความพร้อม สามารถติดต่อทีมงานได้ที่ [contact@racksync.com](mailto:contact@racksync.com)



